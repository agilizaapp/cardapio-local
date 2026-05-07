import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

async function checkSchema() {
    const { data, error } = await supabase
        .from('stores')
        .select('*')
        .limit(1)

    if (error) {
        console.error('Erro ao buscar loja:', error)
    } else {
        console.log('Colunas encontradas na tabela stores:', Object.keys(data[0] || {}))
    }
}

checkSchema()
