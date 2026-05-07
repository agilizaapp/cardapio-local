import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

async function seed() {
  const storeId = '93a3bd6f-0a38-4d90-b9d1-ef0e808eb311' // Sua loja
  
  console.log('🚀 Iniciando Seed de Produtos...')

  // 1. Criar Categorias
  const { data: categories } = await supabase.from('categories').upsert([
    { store_id: storeId, name: '🔥 Mais Vendidos', sort_order: 0 },
    { store_id: storeId, name: '🍧 Açaís Gourmet', sort_order: 1 },
    { store_id: storeId, name: '🍔 Burgers Artesanais', sort_order: 2 },
    { store_id: storeId, name: '🥤 Bebidas Geladas', sort_order: 3 }
  ]).select()

  const getCatId = (name) => categories.find(c => c.name === name)?.id

  // 2. Criar Produtos
  const products = [
    {
      store_id: storeId,
      category_id: getCatId('🔥 Mais Vendidos'),
      name: 'Combo Smash Classic',
      description: 'Pão brioche, 2 blends smash de 80g, queijo cheddar, cebola caramelizada e maionese da casa. Acompanha batata frita.',
      price: 34.90,
      promo_price: 29.90,
      image_urls: ['https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=800'],
      active: true,
      highlighted: true,
      stock: 100,
      variation_options: [
        { name: 'Ponto da Carne', options: ['Mal passado', 'Ao ponto', 'Bem passado'], required: true },
        { name: 'Adicionais', options: ['Bacon (+R$4,00)', 'Ovo (+R$2,00)', 'Queijo extra (+R$3,00)'], multi: true }
      ]
    },
    {
      store_id: storeId,
      category_id: getCatId('🍧 Açaís Gourmet'),
      name: 'Super Açaí 500ml',
      description: 'Açaí puro cremoso. Escolha até 4 acompanhamentos gratuitos.',
      price: 22.00,
      image_urls: ['https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=800'],
      active: true,
      highlighted: true,
      stock: 500,
      variation_options: [
        { name: 'Acompanhamentos Grátis', options: ['Leite em pó', 'Granola', 'Banana', 'Morango', 'Leite condensado'], required: true, multi: true, limit: 4 }
      ]
    },
    {
      store_id: storeId,
      category_id: getCatId('🍔 Burgers Artesanais'),
      name: 'Double Bacon Burger',
      description: 'Blend de 160g, muito bacon crocante, queijo prato e molho BBQ.',
      price: 38.00,
      image_urls: ['https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800'],
      active: true,
      stock: 50
    },
    {
      store_id: storeId,
      category_id: getCatId('🥤 Bebidas Geladas'),
      name: 'Soda Italiana Maçã Verde',
      description: 'Refrescante e borbulhante com xarope premium de maçã verde.',
      price: 14.50,
      image_urls: ['https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800'],
      active: true,
      stock: 100
    }
  ]

  const { error } = await supabase.from('products').upsert(products)
  
  if (error) console.error('❌ Erro no seed:', error.message)
  else console.log('✅ Tudo pronto! Sua vitrine está linda e recheada.')
}

seed()
