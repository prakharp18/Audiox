"use server";

import { auth } from "@/auth";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!;

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
    .select("username, is_accepting_messages, message_count, daily_messages_count")
    .eq("id", session.user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST100' || error.message?.includes("column")) {
      // Handle potential errors or keep empty as per original intent
    }
    return null;
  }
  return user;
}

export async function toggleAcceptMessages(currentState: boolean) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  const { error } = await supabase
    .from("users")
    .update({ is_accepting_messages: !currentState })
    .eq("id", session.user.id);

  if (error) throw new Error("Failed to update settings");
  return !currentState;
}

export async function getMessages() {
  const session = await auth();
  if (!session?.user?.id) return [];
  
  // Messages are in 'public' schema, so we need a client pointing there or specify schema in query
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
    timestamp: new Date(msg.created_at).toLocaleString(),
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