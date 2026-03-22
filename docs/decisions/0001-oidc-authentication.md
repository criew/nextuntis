# ADR-0001: OIDC Authentication with oidc-client-ts and Keycloak

## Status

Accepted

## Context

nextuntis requires user authentication. The infrastructure uses Keycloak as the Identity Provider (IdP).
The frontend is a React 19 SPA that must integrate with Keycloak via OpenID Connect (OIDC).

Several integration approaches exist:

- **`keycloak-js`**: Keycloak's own JavaScript adapter. Tightly coupled to Keycloak; does not implement
  standard OIDC flows cleanly and requires manual React integration.
- **`oidc-client-ts` + `react-oidc-context`**: A standards-compliant OIDC client library with a
  React context wrapper providing hooks. IdP-agnostic.
- **In-memory token storage**: Tokens live only in JavaScript memory; lost on page reload.
- **`localStorage` token storage**: Tokens persist across tabs and browser restarts.
- **`sessionStorage` token storage**: Tokens persist within a single tab across page reloads, but not
  across tabs.

Since Keycloak v26, the Keycloak project recommends using certified, standards-based OIDC client
libraries instead of `keycloak-js` for SPA use cases.

Authorization (roles, scopes, permission checks) is explicitly out of scope for the current MVP.

## Decision

### 1. Library: `oidc-client-ts` + `react-oidc-context`

We use `oidc-client-ts` (v3.x) as the OIDC client and `react-oidc-context` (v3.x) as the React
integration layer.

Reasons:

- **IdP-agnostic**: Works with any standards-compliant OIDC provider. Switching away from Keycloak
  in the future requires no library change.
- **PKCE by default**: PKCE (Proof Key for Code Exchange) is the current best practice for SPAs and
  is natively supported without additional configuration.
- **React-native API**: `react-oidc-context` exposes a `useAuth()` hook and an `<AuthProvider>`
  component, fitting naturally into the React 19 component model.
- **Keycloak recommendation**: Aligns with Keycloak's official guidance as of v26.

`keycloak-js` was rejected because it is tightly coupled to Keycloak's proprietary flow extensions,
offers no React hooks, and makes future IdP migration harder.

### 2. Token Storage: `sessionStorage`

Tokens (access token, refresh token, ID token) are stored in `sessionStorage`.

Reasons:

- **No cross-tab sharing**: A token in `sessionStorage` is only accessible within the originating
  tab. An attacker exploiting XSS in one tab cannot silently harvest tokens from other tabs.
- **Page-reload resilience**: Unlike in-memory storage, the token survives a page reload. Combined
  with `automaticSilentRenew`, this prevents unnecessary re-authentication on refresh.
- **Acceptable risk**: The XSS attack surface is smaller than `localStorage` (no cross-tab exposure,
  no persistence after the tab closes) while the UX impact is negligible for the target use case.

`localStorage` was rejected because tokens would persist indefinitely across tabs and browser
restarts, increasing the blast radius of an XSS attack.

In-memory storage was rejected because `automaticSilentRenew` can fail (e.g., Keycloak session
expired, network error). If the silent renew fails after a page reload, the user would be logged
out immediately with no recoverable state, which is poor UX for a school administration tool used
throughout the day.

### 3. No separate auth state store (Zustand)

Authentication state is managed exclusively through `react-oidc-context` via the `useAuth()` hook.
No Zustand store is created for auth state.

Reason: `react-oidc-context` already provides a React context with reactive updates whenever the
auth state changes (login, logout, token renewal). Duplicating this into a Zustand store would
introduce a second source of truth and synchronization complexity.

Zustand stores in this project are reserved for application domain data.

### 4. Authentication only — no authorization

This ADR covers only the authentication flow (proving who the user is). Authorization (what the
user is allowed to do) — including role checks, scope-based access, and protected routes beyond
the login gate — is deferred to a future feature.

Reason: MVP scope. Authorization requires a defined role model, which has not yet been specified.

## Consequences

### Positive

- Standards-based OIDC integration that is not tied to Keycloak's proprietary extensions.
- PKCE is enforced by default, meeting current SPA security best practices.
- Single source of truth for auth state via `useAuth()` reduces complexity.
- Switching the IdP (e.g., from Keycloak to Auth0) requires only configuration changes, not a
  library migration.
- `sessionStorage` limits XSS token exposure compared to `localStorage`.

### Negative

- `sessionStorage` tokens are still accessible to JavaScript running in the same tab. An XSS
  vulnerability can steal tokens within the tab. In-memory storage would be safer but was rejected
  for UX reasons (see above).
- Users opening the application in a new tab must re-authenticate (the new tab starts with an empty
  `sessionStorage`). This is a deliberate trade-off, not an oversight.
- Authorization is not addressed in this ADR. Routes and UI elements are not protected by roles
  until a follow-up ADR and implementation are completed.

### Neutral

- `oidc-client-ts` and `react-oidc-context` become required frontend dependencies (already added
  to `package.json`).
- The `AuthProvider` must wrap the React component tree in `main.tsx`.
- Silent renew requires the Keycloak realm to have an appropriate session and refresh token
  lifetime configured.
