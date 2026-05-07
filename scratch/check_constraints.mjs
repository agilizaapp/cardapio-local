import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

async function check() {
  const { data, error } = await supabase.rpc('get_table_info', { table_name: 'orders' })
  if (error) {
    // Se o rpc não existir, tentamos via query direta se possível (mas em nuxt é difícil)
    // Então vamos tentar inserir um valor bizarro e ver o erro da constraint
    const { error: insertError } = await supabase.from('orders').insert({ status: 'invalid_status_test' }).select()
    console.log('Erro de constraint:', insertError?.message)
  } else {
    console.log('Tabela info:', data)
  }
}
check()
