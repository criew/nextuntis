import { WebStorageStateStore } from 'oidc-client-ts'

export const oidcConfig = {
  authority: import.meta.env.VITE_OIDC_AUTHORITY ?? 'http://localhost:8180/realms/nextuntis',
  client_id: import.meta.env.VITE_OIDC_CLIENT_ID ?? 'nextuntis-frontend',
  redirect_uri: import.meta.env.VITE_OIDC_REDIRECT_URI ?? 'http://localhost:3000/callback',
  post_logout_redirect_uri:
    import.meta.env.VITE_OIDC_POST_LOGOUT_REDIRECT_URI ?? 'http://localhost:3000/login',
  response_type: 'code',
  scope: 'openid profile email',
  pkce_method: 'S256' as const,
  automaticSilentRenew: true,
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
}
