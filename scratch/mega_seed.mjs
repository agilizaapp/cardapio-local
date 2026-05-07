import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

async function megaSeed() {
  const storeId = '93a3bd6f-0a38-4d90-b9d1-ef0e808eb311'
  
  console.log('🏗️  Construindo Cardápio Gigante (30 produtos)...')

  // 1. Limpar e Criar Categorias
  const { data: categories } = await supabase.from('categories').upsert([
    { store_id: storeId, name: '🍔 Burgers', sort_order: 1 },
    { store_id: storeId, name: '🍕 Pizzas', sort_order: 2 },
    { store_id: storeId, name: '🍧 Açaí', sort_order: 3 },
    { store_id: storeId, name: '🥤 Bebidas', sort_order: 4 },
    { store_id: storeId, name: '🍰 Sobremesas', sort_order: 5 }
  ]).select()

  const getCatId = (name) => categories.find(c => c.name === name)?.id

  const products = []

  // --- BURGERS (8) ---
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
      category_id: getCatId('🍔 Burgers'),
      name: name,
      description: 'Ingredientes selecionados e carne 100% bovina preparada na brasa.',
      price: 25 + (i * 2),
      image_urls: [`${burgerPics[i]}?q=80&w=800`],
      active: true,
      stock: 50,
      highlighted: i < 2,
      variation_options: [
        { name: 'Ponto da Carne', options: ['Mal passado', 'Ao ponto', 'Bem passado'], required: true },
        { name: 'Adicionais', options: ['Bacon (+R$4,00)', 'Ovo (+R$2,00)', 'Cebola Caramelizada'], multi: true }
      ]
    })
  })

  // --- PIZZAS (8) ---
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
      category_id: getCatId('🍕 Pizzas'),
      name: `Pizza ${name}`,
      description: 'Massa artesanal de longa fermentação aberta na mão.',
      price: 45 + (i * 3),
      image_urls: [`${pizzaPics[i]}?q=80&w=800`],
      active: true,
      stock: 30,
      variation_options: [
        { name: 'Borda', options: ['Sem Borda', 'Borda de Catupiry (+R$6,00)', 'Borda de Cheddar (+R$6,00)'], required: true },
        { name: 'Observações', options: ['Sem Cebola', 'Sem Orégano', 'Bem Assada'], multi: true }
      ]
    })
  })

  // --- AÇAÍ (6) ---
  const acaiPics = [
    'https://images.unsplash.com/photo-1590301157890-4810ed352733',
    'https://images.unsplash.com/photo-1628559283183-146313437f14',
    'https://images.unsplash.com/photo-1623938923480-1a74d7df6433',
    'https://images.unsplash.com/photo-1590301157890-4810ed352733',
    'https://images.unsplash.com/photo-1628559283183-146313437f14',
    'https://images.unsplash.com/photo-1623938923480-1a74d7df6433'
  ]
  const acaiNames = ['Açaí 300ml', 'Açaí 500ml', 'Açaí 700ml', 'Copo da Felicidade', 'Barca Família', 'Açaí Shake']

  acaiNames.forEach((name, i) => {
    products.push({
      store_id: storeId,
      category_id: getCatId('🍧 Açaí'),
      name: name,
      description: 'O melhor açaí da região, cremoso e super refrescante.',
      price: 15 + (i * 5),
      image_urls: [`${acaiPics[i]}?q=80&w=800`],
      active: true,
      stock: 100,
      variation_options: [
        { name: 'Acompanhamentos (Grátis até 3)', options: ['Leite em pó', 'Granola', 'Banana', 'Morango', 'Leite Condensado', 'Paçoca'], multi: true, limit: 3 },
        { name: 'Caldas Extras (+R$3,00)', options: ['Nutella', 'Creme de Ninho', 'Morango'], multi: true }
      ]
    })
  })

  // --- BEBIDAS (5) ---
  const drinkNames = ['Coca-Cola 350ml', 'Suco de Laranja Natural', 'Água Mineral 500ml', 'Cerveja Artesanal IPA', 'Soda Italiana Limão']
  drinkNames.forEach((name, i) => {
    products.push({
      store_id: storeId,
      category_id: getCatId('🥤 Bebidas'),
      name: name,
      description: 'Geladinha e pronta para acompanhar sua refeição.',
      price: 5 + (i * 4),
      image_urls: [`https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800`],
      active: true,
      stock: 200
    })
  })

  // --- SOBREMESAS (3) ---
  const sweetNames = ['Brownie com Sorvete', 'Petit Gateau', 'Pudim de Leite Moça']
  sweetNames.forEach((name, i) => {
    products.push({
      store_id: storeId,
      category_id: getCatId('🍰 Sobremesas'),
      name: name,
      description: 'O fechamento perfeito para sua experiência.',
      price: 12 + (i * 3),
      image_urls: [`https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=800`],
      active: true,
      stock: 40
    })
  })

  const { error } = await supabase.from('products').upsert(products)
  
  if (error) console.error('❌ Erro no mega seed:', error.message)
  else console.log(`✅ Missão cumprida! ${products.length} produtos cadastrados com sucesso.`)
}

megaSeed()
