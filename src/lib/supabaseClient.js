// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  fetch: (url, options) => {
    if (typeof window === 'undefined') {
      options.headers['Authorization'] = `Bearer ${options.headers.get('authorization')}`
    }
    return fetch(url, options)
  }
})
