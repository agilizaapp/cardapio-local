import { useState, useSupabaseClient, useSupabaseUser, navigateTo } from '#imports'

export const useAdminAuth = () => {
  const storeId = useState<string | null>('admin-store-id', () => null)
  const userStores = useState<any[]>('admin-user-stores', () => [])
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()
  
  const loadSession = async () => {
    if (storeId.value) return true

    // Garante que pegamos o usuário atualizado direto da sessão do Supabase
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
    
    if (!authUser || !authUser.id) {
      console.warn('loadSession: Nenhum usuário autenticado encontrado via getUser()')
      return false
    }

    // Fetch all stores owned by the authenticated user
    const { data, error } = await supabase
      .from('stores')
      .select('id, name')
      .eq('owner_id', authUser.id)

    if (data && data.length > 0) {
        userStores.value = data
        // Se já não tiver uma selecionada, seleciona a primeira
        if (!storeId.value) {
            storeId.value = data[0].id
        }
        return true
    }
    
    console.warn('Usuário autenticado, mas não possui nenhuma loja na tabela stores.')
    return false
  }

  const logout = async () => {
    await supabase.auth.signOut()
    storeId.value = null
    navigateTo('/dashboard/login')
  }

  const switchStore = (id: string) => {
      storeId.value = id
  }

  return {
    storeId,
    userStores,
    user,
    loadSession,
    logout,
    switchStore
  }
}
