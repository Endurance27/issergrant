import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pavkifpdanbpnzlxoyqi.supabase.co'
const supabaseKey = 'sb_publishable_J7wZ7SymWJIHtAE56IDEdg_xFqtw8sa'

// IMPORTANT: Enable Row Level Security (RLS) on all tables in production.
// Go to Supabase Dashboard → Authentication → Policies and enable RLS
// for grant_calls, proposals, awards, milestones, transactions, users tables.
export const supabase = createClient(supabaseUrl, supabaseKey)
