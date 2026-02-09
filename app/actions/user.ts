"use server";

import { auth } from "@/auth";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(15, "Username must be at most 15 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed");

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { db: { schema: "next_auth" } }
  );
}

export async function checkUsernameAvailability(username: string) {
  const result = usernameSchema.safeParse(username);
  if (!result.success) {
    return { available: false, error: result.error.issues[0].message };
  }

  const session = await auth();
  const supabase = getSupabaseAdmin();

  const { data: existingUser, error } = await supabase
    .from("users")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (error) {
    console.error("Check availability error:", error);
    return { available: false, error: "Failed to check availability" };
  }

  // If existingUser found, check if it's the current user
  if (existingUser) {
    if (session?.user?.id && existingUser.id === session.user.id) {
      return { available: true }; // User's own current username
    }
    return { available: false, error: "Username is already taken" };
  }

  return { available: true };
}

export async function updateUsername(newUsername: string) {
  console.log("=== updateUsername called ===");
  console.log("New username:", newUsername);

  const session = await auth();
  console.log("Session user ID:", session?.user?.id);

  if (!session?.user?.id) {
    console.log("ERROR: Unauthorized - no session");
    return { error: "Unauthorized" };
  }

  const result = usernameSchema.safeParse(newUsername);
  if (!result.success) {
    console.log("ERROR: Validation failed:", result.error.issues[0].message);
    return { error: result.error.issues[0].message };
  }

  const supabaseAdmin = getSupabaseAdmin();

  // Check unique
  console.log("Checking if username is taken...");
  const { data: existingUser, error: checkError } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("username", newUsername)
    .neq("id", session.user.id)
    .maybeSingle();

  if (checkError) {
    console.error("Check error:", checkError);
    return { error: "Failed to check username availability" };
  }

  if (existingUser) {
    console.log("ERROR: Username taken by:", existingUser.id);
    return { error: "Username is already taken" };
  }

  // Update
  console.log("Updating user:", session.user.id, "to username:", newUsername);
  const { data, error } = await supabaseAdmin
    .from("users")
    .update({ username: newUsername })
    .eq("id", session.user.id)
    .select();

  console.log("Update result - data:", data, "error:", error);

  if (error) {
    console.error("Update username error:", error);
    return { error: "Failed to update username: " + error.message };
  }

  if (!data || data.length === 0) {
    console.error("No rows updated - user may not exist in DB");
    return { error: "User not found in database" };
  }

  console.log("SUCCESS! Username updated to:", newUsername);
  revalidatePath("/dashboard");
  return { success: true };
}
