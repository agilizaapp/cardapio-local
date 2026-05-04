// utils/errors.ts
//
// Tratamento de erros centralizado e tipado.
//
// Por que isso existe?
// O Supabase retorna erros em formato { error: PostgrestError | null }.
// Sem esse utilitário, você fica repetindo `if (error) throw error` em
// todo repository, e as mensagens chegam cruas para o usuário.
//
// Com esse padrão:
//   - Um lugar só para tratar erros do Supabase
//   - Mensagens amigáveis em português
//   - Fácil de adicionar logging (ex: Sentry) futuramente

// Tipagem local para evitar dependência direta do pacote em tempo de compilação.
export type PostgrestError = {
 message: string
 code: string
 hint?: string | null
 details?: string | null
}

// Erro customizado da aplicação
export class AppError extends Error {
 constructor(
  message: string,
  public readonly code?: string,
  public readonly originalError?: unknown,
 ) {
  super(message)
  this.name = 'AppError'
 }
}

// Converte erros do Supabase em AppError com mensagem amigável
export function handleSupabaseError(error: PostgrestError): never {
 // Mapa de códigos PostgreSQL para mensagens amigáveis
 const messages: Record<string, string> = {
  '23505': 'Este registro já existe.',           // unique_violation
  '23503': 'Referência inválida entre registros.', // foreign_key_violation
  '42501': 'Você não tem permissão para esta ação.', // insufficient_privilege
  'PGRST116': 'Registro não encontrado.',
 }

 const friendlyMessage =
  messages[error.code] ??
  messages[error.hint ?? ''] ??
  'Ocorreu um erro inesperado. Tente novamente.'

 // Em produção você adicionaria: Sentry.captureException(error)
 console.error('[Supabase Error]', error)

 throw new AppError(friendlyMessage, error.code, error)
}

// Helper para usar nos repositories — lança erro se houver, retorna data se não
export function unwrap<T>(result: { data: T | null; error: PostgrestError | null }): T {
 if (result.error) handleSupabaseError(result.error)
 if (result.data === null) throw new AppError('Registro não encontrado.', 'PGRST116')
 return result.data
}