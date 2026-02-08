"use server";

import { createClient } from "@supabase/supabase-js";
import { voiceMessageSchema } from "@/schemas/messageSchema";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  db: { schema: "next_auth" },
});

function isToday(dateString: string | null) {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.toISOString().split("T")[0] === today.toISOString().split("T")[0]
  );
}

export async function sendMessage(formData: FormData) {
  const recipientId = formData.get("recipientId") as string;
  const duration = Number(formData.get("duration"));
  const audioFile = formData.get("audio") as File;

  if (!recipientId || !audioFile) {
    throw new Error("Missing required fields");
  }

  // Validate with Zod before processing
  // Note: we don't have the final URL yet, but we can validate duration
  const validation = voiceMessageSchema.safeParse({
    audioUrl: "https://placeholder.com", // Temporary for validation
    duration,
  });

  if (!validation.success) {
    throw new Error(validation.error.issues[0].message);
  }

  const { data: user, error: fetchError } = await supabase
    .from("users")
    .select("daily_messages_count, last_message_date")
    .eq("id", recipientId)
    .single();

  if (fetchError || !user) {
    throw new Error("Recipient not found");
  }

  let currentCount = user.daily_messages_count || 0;
  const lastDate = user.last_message_date;

  if (!isToday(lastDate)) {
    // Reset if it's a new day
    currentCount = 0;
  }

  if (currentCount >= 3) {
    return { success: false, error: "LIMIT_REACHED" };
  }

  const publicSupabase = createClient(supabaseUrl, supabaseServiceKey);
  const fileName = `${recipientId}/${Date.now()}.webm`;
  const fileBuffer = await audioFile.arrayBuffer();

  const { error: uploadError } = await publicSupabase.storage
    .from("audio-messages")
    .upload(fileName, fileBuffer, {
      contentType: audioFile.type,
      upsert: false,
    });

  if (uploadError) {
    throw new Error("Failed to upload audio");
  }

  const {
    data: { publicUrl },
  } = publicSupabase.storage.from("audio-messages").getPublicUrl(fileName);

  // Final check with the actual URL
  const finalValidation = voiceMessageSchema.safeParse({
    audioUrl: publicUrl,
    duration,
  });

  if (!finalValidation.success) {
    throw new Error(finalValidation.error.issues[0].message);
  }

  const { error: insertError } = await publicSupabase.from("messages").insert({
    recipient_id: recipientId,
    audio_url: publicUrl,
    duration: duration,
    is_read: false,
  });

  if (insertError) {
    throw new Error(`Failed to save message: ${insertError.message}`);
  }

  await supabase
    .from("users")
    .update({
      daily_messages_count: currentCount + 1,
      last_message_date: new Date().toISOString(),
    })
    .eq("id", recipientId);

  return { success: true };
}

export async function checkSystemStatus() {
  try {
    const publicSupabase = createClient(supabaseUrl, supabaseServiceKey);
    const { error } = await publicSupabase.from("users").select("id").limit(1);
    
    if (error) throw error;
    return { status: "online", latency: "normal" };
  } catch (error) {
    console.error("System check failed:", error);
    return { status: "offline", latency: "high" };
  }
}