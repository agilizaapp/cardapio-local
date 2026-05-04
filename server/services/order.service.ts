// server/services/order.service.ts
import { createOrderRepository } from '../repositories/order.repository'
import type { SupabaseClient } from '@supabase/supabase-js'

async function createOrder(supabase: SupabaseClient, payload: any) {
  const repository = createOrderRepository(supabase)
  return await repository.create(payload)
}

export const orderService = {
  createOrder
}