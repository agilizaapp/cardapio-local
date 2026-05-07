import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

async function bruteForce() {
  const statuses = ['awaiting_payment', 'ready', 'finished', 'delivered', 'shipped', 'cancelled', 'concluido', 'finalizado']
  const orderId = 'c360a9dc-bce6-459b-b5d1-99ec6ead2148' // ID do log
  
  console.log('Testando status permitidos...')
  for (const s of statuses) {
    const { error } = await supabase.from('orders').update({ status: s }).eq('id', orderId).select()
    if (!error) {
      console.log(`✅ Status ACEITO: ${s}`)
    } else if (error.code === '23514') {
      console.log(`❌ Status REJEITADO: ${s}`)
    } else {
      console.log(`❓ Outro erro com ${s}:`, error.message)
    }
  }
}
bruteForce()
