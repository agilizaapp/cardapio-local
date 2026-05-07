import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

async function checkPolicies() {
    const { data, error } = await supabase
        .rpc('get_policies_info') // Se não existir, tentaremos via query direta se possível ou apenas deduziremos

    if (error) {
        console.log('RPC get_policies_info falhou, tentando via query direta...')
        const { data: policies, error: queryError } = await supabase
            .from('pg_policies')
            .select('*')
            .filter('schemaname', 'eq', 'public')

        if (queryError) {
            console.error('Erro ao buscar políticas:', queryError)
        } else {
            console.log('Políticas encontradas:', policies)
        }
    } else {
        console.log('Políticas (via RPC):', data)
    }
}

// Como 'pg_policies' não é uma tabela pública acessível via PostgREST normalmente, 
// a melhor forma é tentar deduzir ou rodar um script que aponte o erro.
// Vou tentar rodar a query que deu erro e ver se o erro persiste no script.

async function testQuery() {
    console.log('Testando query que deu erro...')
    const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('id', '93a3bd6f-0a38-4d90-b9d1-ef0e808eb311')
        .single()

    if (error) {
        console.error('ERRO DETECTADO:', error)
    } else {
        console.log('Sucesso na query:', data)
    }
}

testQuery()
