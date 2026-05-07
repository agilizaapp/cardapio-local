import type { SupabaseClient } from '@supabase/supabase-js'
import { createStoreStatusRepository } from '../repositories/storeStatus.repository'
import type { DbStoreStatusMessages } from '~/types/database'

export const storeStatusService = {
    async getMessages(supabase: SupabaseClient, storeId: string) {
        const repo = createStoreStatusRepository(supabase)
        let messages = await repo.getByStoreId(storeId)
        
        // Se não existir, retorna os defaults (embora o ideal seja ter um seed)
        if (!messages) {
            messages = {
                store_id: storeId,
                pending: 'Olá, {nome}! 👋\n\nRecebemos seu pedido *#{id}* e já estamos verificando a disponibilidade dos produtos pra você.\n\nAssim que confirmarmos, te avisamos por aqui. Pode deixar! 😊',
                confirmed: 'Boa notícia, {nome}! 🎉\n\nSeu pedido *#{id}* foi confirmado e está sendo preparado.\n\nPara finalizar, realize o pagamento:\n{infos_pagamento}\n\nApós a confirmação do pagamento, seu pedido segue para a próxima etapa. Qualquer dúvida é só chamar!',
                ready: 'Olá, {nome}!\n\nSeu pedido *#{id}* está reservado e aguardando a confirmação do pagamento.\n\nSe já pagou, pode ignorar essa mensagem — assim que identificarmos, te avisamos! Caso tenha alguma dúvida sobre o pagamento, é só falar. 🙏',
                completed_delivery: 'Seu pedido saiu, {nome}! 🚀\n\nO pedido *#{id}* está a caminho e logo chegará até você.\n\nObrigado pela preferência! Se precisar de qualquer coisa, estamos por aqui. 😊',
                completed_pickup: 'Tudo pronto, {nome}! 🎁\n\nSeu pedido *#{id}* já está disponível para retirada.\n\nPode vir buscar quando quiser! Qualquer dúvida é só chamar. 😊',
                cancelled: 'Olá, {nome}.\n\nInfelizmente não conseguimos dar continuidade ao pedido *#{id}* no momento.\n\nSe quiser entender o motivo ou fazer um novo pedido, é só nos chamar — ficaremos felizes em te ajudar! 🤝',
                updated_at: new Date().toISOString()
            }
        }
        
        return messages
    },

    async updateMessages(supabase: SupabaseClient, payload: DbStoreStatusMessages) {
        const repo = createStoreStatusRepository(supabase)
        return await repo.upsert(payload)
    }
}
