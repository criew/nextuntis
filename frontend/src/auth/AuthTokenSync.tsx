import { useEffect } from 'react'
import { useAuth } from 'react-oidc-context'
import { setAuthToken } from '../api/httpClient'

export default function AuthTokenSync() {
  const auth = useAuth()

  useEffect(() => {
    setAuthToken(auth.user?.access_token ?? null)
  }, [auth.user?.access_token])

  return null
}
