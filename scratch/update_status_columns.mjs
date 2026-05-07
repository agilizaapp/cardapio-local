import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

async function migrate() {
  const sql = `
    -- Adicionar novas colunas para mensagens específicas de entrega/retirada
    ALTER TABLE store_status_messages 
    ADD COLUMN IF NOT EXISTS completed_delivery text NOT NULL DEFAULT 'Seu pedido saiu, {nome}! 🚀 O pedido #{id} está a caminho e logo chegará até você.',
    ADD COLUMN IF NOT EXISTS completed_pickup text NOT NULL DEFAULT 'Tudo pronto, {nome}! 🎁 Seu pedido #{id} já está disponível para retirada.';
    
    -- Garantir que as colunas existentes estão corretas
    ALTER TABLE store_status_messages 
    RENAME COLUMN ready TO awaiting_payment_backup; -- temp
    ALTER TABLE store_status_messages 
    RENAME COLUMN delivered TO completed_backup; -- temp

    -- Criar colunas com os nomes que o banco gosta (ready, delivered) mas com os textos novos
    -- Na verdade, vamos manter os nomes que o código usa para facilitar
    -- Ajustando para bater com o brute force: pending, confirmed, ready, delivered, cancelled
  `;

  console.log('SQL para rodar no painel do Supabase:')
  console.log(`
    ALTER TABLE store_status_messages 
    ADD COLUMN IF NOT EXISTS completed_delivery text NOT NULL DEFAULT 'Seu pedido saiu, {nome}! 🚀 O pedido #{id} está a caminho e logo chegará até você.',
    ADD COLUMN IF NOT EXISTS completed_pickup text NOT NULL DEFAULT 'Tudo pronto, {nome}! 🎁 Seu pedido #{id} já está disponível para retirada.';
  `)
}
migrate()
