import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

async function inspect() {
  const storeId = '93a3bd6f-0a38-4d90-b9d1-ef0e808eb311'
  const { data } = await supabase.from('store_status_messages').select('*').eq('store_id', storeId).maybeSingle()
  
  console.log('Dados no Banco para esta Loja:', JSON.stringify(data, null, 2))
}
inspect()
