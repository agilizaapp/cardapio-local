import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

async function checkTriggers() {
  const { data, error } = await supabase.rpc('run_sql', {
    sql: `
      SELECT 
        event_object_table as table_name,
        trigger_name,
        action_statement as action
      FROM information_schema.triggers
      WHERE event_object_table = 'store_status_messages' 
         OR event_object_table = 'stores';
    `
  })

  if (error) {
    console.error('Erro ao buscar triggers (talvez o RPC run_sql não exista):', error)
    // Fallback: tentar buscar via query direta se o rpc falhar
    const { data: data2, error: error2 } = await supabase
        .from('pg_trigger')
        .select('*')
        .limit(1)
    if (error2) console.error('Erro no fallback:', error2)
  } else {
    console.log('Triggers encontrados:', data)
  }
}

checkTriggers()
