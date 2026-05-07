import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

async function check() {
  const { data, error } = await supabase.from('orders').select('status').limit(10)
  if (error) console.error(error)
  else console.log('Status encontrados:', [...new Set(data.map(o => o.status))])
}
check()
