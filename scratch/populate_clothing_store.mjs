import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

const STORE_ID = '8cc10a30-bd83-4477-adcd-b7d13060e273'

async function run() {
  console.log('--- Iniciando Configuração da Loja de Roupas ---')

  // 1. Atualizar dados da Loja
  const { error: storeError } = await supabase
    .from('stores')
    .update({
      name: 'Urban Style Boutique',
      slug: 'urban-style',
      theme_settings: {
        primary_color: '#B8860B', // Dark Goldenrod
        secondary_color: '#FFFFFF',
        primary_bg_color: '#121212',
        secondary_bg_color: '#1E1E1E',
        font: 'outfit'
      }
    })
    .eq('id', STORE_ID)

  if (storeError) {
    console.error('Erro ao atualizar loja:', storeError)
    return
  }
  console.log('Loja atualizada com sucesso!')

  // 2. Limpar categorias e produtos antigos (opcional, mas bom para consistência)
  await supabase.from('products').delete().eq('store_id', STORE_ID)
  await supabase.from('categories').delete().eq('store_id', STORE_ID)

  // 3. Criar Categorias
  const categories = [
    { name: 'Camisetas & Tops', sort_order: 1 },
    { name: 'Calças & Jeans', sort_order: 2 },
    { name: 'Vestidos & Saias', sort_order: 3 },
    { name: 'Calçados', sort_order: 4 },
    { name: 'Acessórios', sort_order: 5 }
  ]

  const { data: catData, error: catError } = await supabase
    .from('categories')
    .insert(categories.map(c => ({ ...c, store_id: STORE_ID })))
    .select()

  if (catError) {
    console.error('Erro ao criar categorias:', catError)
    return
  }
  console.log('Categorias criadas:', catData.length)

  const cats = {}
  catData.forEach(c => { cats[c.name] = c.id })

  // 4. Preparar Produtos (30 itens)
  const productPool = [
    {
      cat: 'Camisetas & Tops',
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      cat: 'Calças & Jeans',
      images: [
        'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      cat: 'Vestidos & Saias',
      images: [
        'https://images.unsplash.com/photo-1539008835154-0688f1f21237?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      cat: 'Calçados',
      images: [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      cat: 'Acessórios',
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1509941943102-10c2bb8ce9f3?auto=format&fit=crop&w=800&q=80'
      ]
    }
  ]

  const products = []

  productPool.forEach(group => {
    for (let i = 1; i <= 6; i++) {
      const img = group.images[i % group.images.length]
      
      let variations = {}
      if (group.cat === 'Camisetas & Tops') {
        variations = { 'Tamanho': ['P', 'M', 'G', 'GG'], 'Cor': ['Preto', 'Branco (+R$ 5,00)', 'Cinza Mescla'] }
      } else if (group.cat === 'Calças & Jeans') {
        variations = { 'Tamanho': ['38', '40', '42', '44', '46'], 'Lavagem': ['Clara', 'Escura (+R$ 15,00)', 'Black Dye'] }
      } else if (group.cat === 'Vestidos & Saias') {
        variations = { 'Tamanho': ['PP', 'P', 'M', 'G'], 'Tecido': ['Algodão', 'Seda (+R$ 50,00)', 'Linho (+R$ 30,00)'] }
      } else if (group.cat === 'Calçados') {
        variations = { 'Tamanho': ['37', '38', '39', '40', '41', '42'], 'Material': ['Sintético', 'Couro Legítimo (+R$ 80,00)'] }
      } else {
        variations = { 'Tipo': ['Prata', 'Banhado a Ouro (+R$ 40,00)'] }
      }

      products.push({
        store_id: STORE_ID,
        category_id: cats[group.cat],
        name: `${group.cat.split(' ')[0]} Premium Style v${i}`,
        description: `O melhor de ${group.cat} para o seu lifestyle. Qualidade superior e design exclusivo Urban Style.`,
        price: 99.90 + (i * 20),
        promo_price: i % 3 === 0 ? 79.90 + (i * 10) : null,
        stock: 50,
        image_urls: [img],
        variation_options: variations
      })
    }
  })

  const { error: prodError } = await supabase
    .from('products')
    .insert(products)

  if (prodError) {
    console.error('Erro ao criar produtos:', prodError)
    return
  }

  console.log('--- 30 Produtos criados com sucesso! ---')
}

run()
