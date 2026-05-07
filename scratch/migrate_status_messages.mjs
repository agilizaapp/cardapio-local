import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

async function migrate() {
  const sql = `
    -- Mensagens de status por loja
    CREATE TABLE IF NOT EXISTS store_status_messages (
      store_id        uuid PRIMARY KEY REFERENCES stores(id) ON DELETE CASCADE,
      pending         text NOT NULL DEFAULT 'Olá {nome}! Recebemos seu pedido #{id} e estamos verificando a disponibilidade. Em breve retornamos!',
      confirmed       text NOT NULL DEFAULT 'Olá {nome}! Pedido #{id} aceito! Para prosseguir: {infos_pagamento}',
      awaiting_payment text NOT NULL DEFAULT 'Olá {nome}! Aguardando confirmação do pagamento do pedido #{id}.',
      completed       text NOT NULL DEFAULT 'Olá {nome}! Seu pedido #{id} está pronto!',
      cancelled       text NOT NULL DEFAULT 'Olá {nome}! O pedido #{id} foi cancelado. Entre em contato para mais informações.',
      updated_at      timestamptz DEFAULT now()
    );

    -- RLS
    ALTER TABLE store_status_messages ENABLE ROW LEVEL SECURITY;
    
    -- Drop if exists to avoid error on rerun
    DROP POLICY IF EXISTS "members only" ON store_status_messages;
    
    CREATE POLICY "members only" ON store_status_messages
      FOR ALL
      USING (store_id IN (SELECT store_id FROM store_members WHERE user_id = auth.uid()));
  `;

  // Usando rpc para rodar sql se disponível, ou informando que precisa rodar no painel
  console.log('SQL a ser executado no painel do Supabase:')
  console.log(sql)
}
migrate()
