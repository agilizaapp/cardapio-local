import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

async function resetAndSeed() {
  const storeId = '93a3bd6f-0a38-4d90-b9d1-ef0e808eb311'
  
  console.log('🧹 Limpando dados antigos...')
  await supabase.from('products').delete().eq('store_id', storeId)
  await supabase.from('categories').delete().eq('store_id', storeId)

  console.log('🏗️  Construindo Cardápio Oficial (30 produtos)...')

  const { data: categories } = await supabase.from('categories').insert([
    { store_id: storeId, name: '🔥 Destaques', sort_order: 0 },
    { store_id: storeId, name: '🍔 Burgers Artesanais', sort_order: 1 },
    { store_id: storeId, name: '🍕 Pizzas Forno a Lenha', sort_order: 2 },
    { store_id: storeId, name: '🍧 Açaí e Shakes', sort_order: 3 },
    { store_id: storeId, name: '🥤 Bebidas', sort_order: 4 },
    { store_id: storeId, name: '🍰 Sobremesas', sort_order: 5 }
  ]).select()

  const getCatId = (name) => categories.find(c => c.name === name)?.id
  const products = []

  // --- BURGERS ---
  const burgerPics = [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
    'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5',
    'https://images.unsplash.com/photo-1550547660-d9450f859349',
    'https://images.unsplash.com/photo-1586190812112-3b3b21697833',
    'https://images.unsplash.com/photo-1571091718767-18b5b1457add',
    'https://images.unsplash.com/photo-1553979459-d2229ba7433b',
    'https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6',
    'https://images.unsplash.com/photo-1547584370-2cc98b8b8dc8'
  ]
  const burgerNames = ['Classic Smash', 'Bacon Monster', 'Cheese Lover', 'BBQ King', 'Chicken Crispy', 'Veggie Delight', 'Double Trouble', 'Picanha Premium']
  
  burgerNames.forEach((name, i) => {
    products.push({
      store_id: storeId,
      category_id: (i < 2) ? getCatId('🔥 Destaques') : getCatId('🍔 Burgers Artesanais'),
      name: name,
      description: 'Blend de 160g preparado na brasa, servido no pão brioche artesanal com molho especial.',
      price: 28.90 + (i * 2),
      promo_price: (i === 0) ? 24.90 : null,
      image_urls: [`${burgerPics[i]}?q=80&w=800`],
      active: true,
      stock: 50,
      highlighted: i < 2,
      variation_options: [
        { name: 'Ponto da Carne', options: ['Mal passado', 'Ao ponto', 'Bem passado'], required: true },
        { name: 'Adicionais', options: ['Bacon (+R$4,00)', 'Ovo (+R$2,00)', 'Queijo Extra (+R$3,00)'], multi: true }
      ]
    })
  })

  // --- PIZZAS ---
  const pizzaPics = [
    'https://images.unsplash.com/photo-1513104890138-7c749659a591',
    'https://images.unsplash.com/photo-1574129624952-3670246a8419',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
    'https://images.unsplash.com/photo-1593560708920-61dd723b5bb4',
    'https://images.unsplash.com/photo-1571066811402-9d8d77954b8a',
    'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47',
    'https://images.unsplash.com/photo-1590947132387-155cc02f3212',
    'https://images.unsplash.com/photo-1511688858354-29723234323e'
  ]
  const pizzaNames = ['Marguerita', 'Pepperoni Classica', 'Quatro Queijos', 'Frango com Catupiry', 'Calabresa Speciale', 'Portuguesa Recheada', 'Lombo com Cheddar', 'Rúcula com Tomate Seco']

  pizzaNames.forEach((name, i) => {
    products.push({
      store_id: storeId,
      category_id: getCatId('🍕 Pizzas Forno a Lenha'),
      name: `Pizza ${name}`,
      description: 'Massa italiana de longa fermentação, molho de tomate pelati e ingredientes frescos.',
      price: 49.90 + (i * 3),
      image_urls: [`${pizzaPics[i]}?q=80&w=800`],
      active: true,
      stock: 30,
      variation_options: [
        { name: 'Borda Recheada', options: ['Sem Borda', 'Catupiry (+R$8,00)', 'Cheddar (+R$8,00)'], required: true },
        { name: 'Remover Ingredientes', options: ['Sem Cebola', 'Sem Orégano'], multi: true }
      ]
    })
  })

  // --- AÇAÍ ---
  const acaiNames = ['Açaí Tradicional 300ml', 'Açaí Tradicional 500ml', 'Copo Trufado Ninho', 'Copo Trufado Nutella', 'Barca Mix Família', 'Açaí Power Shake']
  acaiNames.forEach((name, i) => {
    products.push({
      store_id: storeId,
      category_id: getCatId('🍧 Açaí e Shakes'),
      name: name,
      description: 'Açaí puro e cremoso batido na hora com os melhores acompanhamentos.',
      price: 18.00 + (i * 6),
      image_urls: [`https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=800`],
      active: true,
      stock: 100,
      variation_options: [
        { name: 'Complementos (Escolha até 3)', options: ['Leite em Pó', 'Granola', 'Banana', 'Morango', 'Leite Condensado', 'Paçoca'], multi: true, limit: 3 },
        { name: 'Caldas Gourmet (+R$4,00)', options: ['Nutella Original', 'Creme de Ninho', 'Ovomaltine'], multi: true }
      ]
    })
  })

  // --- BEBIDAS ---
  const drinkNames = ['Coca-Cola Lata', 'Guaraná Antarctica', 'Suco de Laranja 500ml', 'H2OH! Limão', 'Água Mineral']
  drinkNames.forEach((name, i) => {
    products.push({
      store_id: storeId,
      category_id: getCatId('🥤 Bebidas'),
      name: name,
      description: 'Bebida geladinha pronta para consumo.',
      price: 6.00 + (i * 2),
      image_urls: [`https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800`],
      active: true,
      stock: 200
    })
  })

  // --- SOBREMESAS ---
  const sweetNames = ['Brownie com Sorvete', 'Petit Gateau Chocolate', 'Pudim Artesanal']
  sweetNames.forEach((name, i) => {
    products.push({
      store_id: storeId,
      category_id: getCatId('🍰 Sobremesas'),
      name: name,
      description: 'A doçura que faltava no seu dia.',
      price: 15.90 + (i * 4),
      image_urls: [`https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=800`],
      active: true,
      stock: 40
    })
  })

  const { error } = await supabase.from('products').insert(products)
  if (error) console.error('❌ Erro no seed:', error.message)
  else console.log('✅ Catálogo limpo e reiniciado com sucesso!')
}

resetAndSeed()
