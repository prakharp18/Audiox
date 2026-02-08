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
  // Validate with Zod
  const result = profileSchema.pick({ username: true }).safeParse({ username })
  
  if (!result.success) {
    return { available: false, error: result.error.issues[0].message }
  }

  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("username", username.toLowerCase())
    .single()

  if (error && error.code === 'PGRST116') {
    // No user found, username is available
    return { available: true }
  }

  return { available: false, error: "Username is already taken" }
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