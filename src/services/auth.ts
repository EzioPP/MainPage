const DEV_LOGIN_URL = 'http://localhost:3000/auth/login'
const PROD_LOGIN_URL = 'https://api.guronaive.com/auth/login'

const getLoginUrl = () => (import.meta.env.DEV ? DEV_LOGIN_URL : PROD_LOGIN_URL)

export interface LoginResponse {
  token?: string
  message?: string
}

export interface LoginPayload {
  username: string
  password: string
}

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await fetch(getLoginUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as LoginResponse
    const fallbackMessage = typeof data.message === 'string'
      ? data.message
      : 'Falha ao autenticar. Tente novamente.'
    const message = response.status === 404
      ? 'Usuario nao encontrado.'
      : response.status === 401
        ? 'Credenciais incorretas.'
        : fallbackMessage
    throw new Error(message)
  }

  return (await response.json().catch(() => ({}))) as LoginResponse
}
