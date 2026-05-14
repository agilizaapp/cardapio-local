import { ref } from 'vue'
import { z } from 'zod'

export interface CheckoutFormState {
  phone: string
  name: string
  deliveryMethod: 'home' | 'pickup'
  cep: string
  address: string
  addressNumber: string
  addressComplement: string
}

const phoneSchema = z
  .string()
  .min(1, 'Campo obrigatório')
  .refine(
    (v) => v.replace(/\D/g, '').length >= 10,
    'Digite um telefone válido com DDD',
  )

const detailsSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Campo obrigatório')
      .refine(
        (v) => v.trim().split(/\s+/).filter(Boolean).length >= 2,
        'Digite o nome completo (mínimo dois nomes)',
      ),
    deliveryMethod: z.enum(['home', 'pickup']),
    cep: z.string().optional(),
    address: z.string(),
    addressNumber: z.string(),
    addressComplement: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryMethod === 'home') {
      if (!data.address.trim()) {
        ctx.addIssue({ code: 'custom', path: ['address'], message: 'Campo obrigatório' })
      }
      if (!data.addressNumber.trim()) {
        ctx.addIssue({ code: 'custom', path: ['addressNumber'], message: 'Campo obrigatório' })
      }
    }
  })

const INITIAL_STATE: CheckoutFormState = {
  phone: '',
  name: '',
  deliveryMethod: 'home',
  cep: '',
  address: '',
  addressNumber: '',
  addressComplement: '',
}

export const useCheckoutForm = () => {
  const step = ref<'phone' | 'details'>('phone')
  const isVerifying = ref(false)
  const state = ref<CheckoutFormState>({ ...INITIAL_STATE })
  const errors = ref<Record<string, string>>({})

  const setField = <K extends keyof CheckoutFormState>(key: K, value: CheckoutFormState[K]) => {
    state.value[key] = value
    if (errors.value[key]) {
      const updated = { ...errors.value }
      delete updated[key]
      errors.value = updated
    }
  }

  const validatePhone = (): boolean => {
    const result = phoneSchema.safeParse(state.value.phone)
    if (!result.success) {
      errors.value = { ...errors.value, phone: result.error.issues[0]?.message ?? 'Telefone inválido' }
      return false
    }
    const updated = { ...errors.value }
    delete updated.phone
    errors.value = updated
    return true
  }

  const validateDetails = (): boolean => {
    const result = detailsSchema.safeParse({
      name: state.value.name,
      deliveryMethod: state.value.deliveryMethod,
      cep: state.value.cep,
      address: state.value.address,
      addressNumber: state.value.addressNumber,
      addressComplement: state.value.addressComplement,
    })
    if (!result.success) {
      const newErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string
        if (key && !newErrors[key]) newErrors[key] = issue.message
      }
      errors.value = { ...errors.value, ...newErrors }
      return false
    }
    const updated = { ...errors.value }
    for (const key of ['name', 'address', 'addressNumber']) delete updated[key]
    errors.value = updated
    return true
  }

  const proceedToDetails = async (): Promise<boolean> => {
    if (!validatePhone()) return false
    isVerifying.value = true
    // Placeholder: future endpoint to check if customer already exists
    await new Promise((resolve) => setTimeout(resolve, 600))
    isVerifying.value = false
    step.value = 'details'
    return true
  }

  const backToPhone = () => {
    setField('phone', '')
    step.value = 'phone'
  }

  return {
    step,
    isVerifying,
    state,
    errors,
    setField,
    validatePhone,
    validateDetails,
    proceedToDetails,
    backToPhone,
  }
}
