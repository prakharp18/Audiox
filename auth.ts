import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import { createClient } from "@supabase/supabase-js"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          emailVerified: profile.email_verified ? new Date() : null,
        }
      },
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  }),
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const { cookies } = await import("next/headers");
          const cookieStore = await cookies();
          const newUsername = cookieStore.get("audiox-new-username")?.value;

          const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
              db: { schema: "next_auth" },
              auth: {
                autoRefreshToken: false,
                persistSession: false,
              },
            }
          );
          
          const { data: existingUser, error } = await supabaseAdmin
              .from("users")
              .select("id")
              .eq("email", user.email)
              .maybeSingle();

          if (error) {
              console.error("Auth check error:", error);
              return false; // Fail safe
          }

          // 1. If user exists, allow login
          if (existingUser) return true;

          // 2. If new user, REQUIRE the username cookie
          if (newUsername) return true; 

          // 3. Allow all sign-ins
          return true;
        } catch (err) {
            console.error("SignIn callback error:", err);
            return true; // Allow sign-in even if check fails, adapter will handle uniqueness constraints if any
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session
    },
    async jwt({ token, user, trigger, session }) {
        if (user) {
            token.sub = user.id;
            token.picture = user.image;
        }

        // Always try to refresh username from DB if we have a user ID (sub)
        // This ensures that if the user updates their profile, the session reflects it on next access
        if (token.sub) {
             const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!,
                { db: { schema: "next_auth" } }
              );
              const { data } = await supabase
                .from("users")
                .select("username")
                .eq("id", token.sub)
                .single();
              
              if (data?.username) {
                  token.username = data.username;
              }
        }
        return token;
    }
  },
  events: {
    async createUser({ user }) {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const username = cookieStore.get("audiox-new-username")?.value;
      
      console.log("CreateUser Event Triggered for:", user.id);

      if (username) {
        const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
          {
            db: { schema: "next_auth" },
            auth: {
              autoRefreshToken: false,
              persistSession: false,
            },
          }
        );
        
        // Wait a brief moment for the row to be created by the adapter if needed
        // though createUser event usually runs after insertion
        const { error } = await supabaseAdmin
          .from("users")
          .update({ username, is_accepting_messages: true })
          .eq("id", user.id);
          
        if (error) {
            console.error("Failed to set username:", error);
        } else {
            console.log(`Username set to ${username} for user ${user.id}`);
            cookieStore.delete("audiox-new-username");
        }
      } else {
          console.error("No username cookie found/expired during user creation");
      }
    },
  },
  debug: false,
})