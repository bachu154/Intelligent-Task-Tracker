
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('Check your .env.local or Vercel Project Settings.')
  throw new Error('supabaseUrl or supabaseAnonKey is missing.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
