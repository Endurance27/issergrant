import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pavkifpdanbpnzlxoyqi.supabase.co'
const supabaseKey = 'sb_publishable_J7wZ7SymWJIHtAE56IDEdg_xFqtw8sa'

export const supabase = createClient(supabaseUrl, supabaseKey)
