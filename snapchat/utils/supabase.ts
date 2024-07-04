import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://geluqzffguwycrtliaeh.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlbHVxemZmZ3V3eWNydGxpYWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgwOTQ3OTksImV4cCI6MjAzMzY3MDc5OX0.705WZfHzPJhn600Um9UETOjcWofqi6vwBggIVXwX0Sk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
