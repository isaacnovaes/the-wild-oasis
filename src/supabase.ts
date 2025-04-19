import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://fueaojhfinmpuuknuuvr.supabase.co';

const SUPABASE_ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1ZWFvamhmaW5tcHV1a251dXZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4Nzg3MDAsImV4cCI6MjA2MDQ1NDcwMH0.iE8MnjlwRHD3dd1OAgtwC1dmzHbq0kQrnHpOUniqUyg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
