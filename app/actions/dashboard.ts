"use server";

import { auth } from "@/auth";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  db: { schema: "next_auth" },
});

export async function getUserStats() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  const { data: user, error } = await supabase
    .from("users")
    .select("username, is_accepting_messages, message_count, daily_messages_count, last_message_date")
    .eq("id", session.user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST100' || error.message?.includes("column")) {
      // Handle potential errors
    }
    return null;
  }
  
  if (user.last_message_date) {
    const lastDate = new Date(user.last_message_date).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    if (lastDate !== today) {
      user.daily_messages_count = 0;
    }
  }
  
  return user;
}

export async function toggleAcceptMessages(newState: boolean) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  const { error } = await supabase
    .from("users")
    .update({ is_accepting_messages: newState })
    .eq("id", session.user.id);

  if (error) throw new Error("Failed to update settings");
  
  revalidatePath("/dashboard");
  return newState;
}

export async function getMessages() {
  const session = await auth();
  if (!session?.user?.id) return [];
  
  const publicSupabase = createClient(supabaseUrl, supabaseServiceKey);
  
  const { data: messages, error } = await publicSupabase
    .from("messages")
    .select("*")
    .eq("recipient_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }
  
  return messages.map(msg => ({
    id: msg.id,
    url: msg.audio_url,
    duration: msg.duration,
    createdAt: msg.created_at,
    is_read: msg.is_read
  }));
}

export async function deleteAccount() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  const { error } = await supabase
    .from("users")
    .delete()
    .eq("id", session.user.id);

  if (error) throw new Error(error.message);
  return true;
}

export async function deleteMessage(messageId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  const publicSupabase = createClient(supabaseUrl, supabaseServiceKey);
  
  const { error } = await publicSupabase
    .from("messages")
    .delete()
    .eq("id", messageId)
    .eq("recipient_id", session.user.id);

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function deleteAllMessages() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  const publicSupabase = createClient(supabaseUrl, supabaseServiceKey);
  
  const { error } = await publicSupabase
    .from("messages")
    .delete()
    .eq("recipient_id", session.user.id);

  if (error) throw new Error(error.message);
  return { success: true };
}