"use server"

import { signIn } from "@/auth"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import { profileSchema } from "@/schemas/authSchema"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  db: { schema: "next_auth" },
})

export async function checkUsername(username: string) {
  try {
    // Validate with Zod
    console.log(`[checkUsername] Checking username: ${username}`);
    const result = profileSchema.pick({ username: true }).safeParse({ username })
    
    if (!result.success) {
        console.log(`[checkUsername] Validation failed: ${result.error.issues[0].message}`);
        return { available: false, error: result.error.issues[0].message }
    }

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error("[checkUsername] Missing Supabase credentials");
        throw new Error("Missing Supabase credentials");
    }

    const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("username", username.toLowerCase())
        .single()

    if (error) {
        if (error.code === 'PGRST116') {
            // No user found, username is available
            console.log(`[checkUsername] Username available: ${username}`);
            return { available: true }
        }
        console.error(`[checkUsername] Supabase error: ${JSON.stringify(error)}`);
    }

    if (data) {
        console.log(`[checkUsername] Username taken: ${username}`);
        return { available: false, error: "Username is already taken" }
    }

    return { available: false, error: "Username is already taken" }
  } catch (err: any) {
    console.error("[checkUsername] Unexpected error:", err);
    return { available: false, error: "Server error checking username" };
  }
}

export async function continueWithGoogle(username?: string) {
  if (username) {
    const cookieStore = await cookies()
    cookieStore.set("audiox-new-username", username, { 
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 10, 
      sameSite: "lax"
    })
  }
  await signIn("google", { redirectTo: "/dashboard" })
}