import { defineNuxtRouteMiddleware, navigateTo, useSupabaseUser } from '#imports'
import { useAdminAuth } from '../composables/useAdminAuth'

export default defineNuxtRouteMiddleware(async (to) => {
    const publicPaths = ['/dashboard/login', '/dashboard/recover', '/dashboard/update-password']
    
    // Só protegemos as rotas que começam com /dashboard e não são públicas
    if (to.path.startsWith('/dashboard') && !publicPaths.includes(to.path)) {
        const user = useSupabaseUser()
        
        // Se não tem usuário logado no Supabase, redireciona pro login
        if (!user.value) {
            return navigateTo('/dashboard/login')
        }

        // Garante que o storeId seja carregado
        const { loadSession } = useAdminAuth()
        const hasStore = await loadSession()
        
        if (!hasStore) {
            // Em tese, deveria redirecionar para uma página "Criar Loja" ou dar erro
            console.warn('Usuário sem loja tentando acessar dashboard')
            // Pode retornar um erro customizado ou deixar passar e os componentes lidam
        }
    }
})
