import { createClient } from "@supabase/supabase-js";

let supabaseClient
let supabaseServiceClient
try {
    //supabaseClient = createClient(import.meta.env.SUPABASE_URL, import.meta.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } } );
    supabaseServiceClient = createClient(import.meta.env.SUPABASE_URL, import.meta.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } } );
} catch (error) {
    supabaseClient = supabaseClient || null
    supabaseServiceClient = supabaseServiceClient || null
}


export const supabase = supabaseClient;
export const supabaseService = supabaseServiceClient;