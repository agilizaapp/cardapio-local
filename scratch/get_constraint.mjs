import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

async function check() {
  const { data, error } = await supabase.rpc('get_constraint_definition', { constraint_name: 'orders_status_check' })
  if (error) {
    // Se o rpc não existir, vamos tentar listar os status de pedidos antigos da Maria Silva (04/05)
    // que vi no log anterior, pois eles podem ter status diferentes
    const { data: oldOrders } = await supabase.from('orders').select('status').neq('status', 'pending').neq('status', 'confirmed').limit(20)
    console.log('Status de pedidos antigos encontrados:', [...new Set(oldOrders?.map(o => o.status))])
  } else {
    console.log('Definição da Constraint:', data)
  }
}
check()
