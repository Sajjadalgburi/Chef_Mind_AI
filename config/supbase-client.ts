import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/chef_mind_types";
import { auth } from "@/app/auth";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY must be set");
}

const session = await auth();

if (!session) {
  throw new Error("Session not found");
}

const { supabaseAccessToken } = session;

const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
  {
    global: {
      headers: {
        Authorization: `Bearer ${supabaseAccessToken}`,
      },
    },
  }
);

export default supabase;
