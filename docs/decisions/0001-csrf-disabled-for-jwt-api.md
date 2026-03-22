# ADR-0001: CSRF Protection Disabled for Stateless JWT API

## Status

Accepted

## Context

The backend exposes a REST API consumed by a Single Page Application (SPA). Spring Security
enables CSRF protection by default, which relies on the synchronizer token pattern. This pattern
requires a session-bound CSRF token that the server stores and the client echoes back on
state-changing requests.

nextuntis uses JWT Bearer tokens issued by Keycloak for authentication. Every request is
stateless: no HTTP session is created on the server side (`SessionCreationPolicy.STATELESS` is the
effective posture under an OAuth2 resource server). Because there is no session, CSRF tokens
cannot be stored or validated server-side, making the synchronizer token pattern both unworkable
and redundant.

Additionally, browser-based CSRF attacks cannot forge requests carrying a JWT that the victim's
browser does not possess. Cross-origin cookie theft is the typical CSRF vector; JWTs stored in
memory or `Authorization` headers are not automatically attached by the browser to cross-origin
requests.

Alternatives considered:

- **Double-submit cookie**: Would require additional infrastructure and adds little security when
  the `Authorization` header already carries a short-lived JWT.
- **Keep CSRF enabled**: Not compatible with a stateless JWT flow; Spring Security would reject
  every mutating request from the SPA.

## Decision

CSRF protection is explicitly disabled in `SecurityConfig` for all endpoints. Authentication is
enforced exclusively via JWT Bearer tokens validated against the Keycloak JWKS endpoint (Spring
Security OAuth2 Resource Server).

## Consequences

### Positive

- No additional round-trip to obtain a CSRF token before state-changing requests.
- Configuration remains minimal and easy to reason about.

### Negative

- Developers unfamiliar with stateless JWT APIs may perceive the disabled CSRF setting as a
  security gap and attempt to re-enable it.

### Neutral

- Keycloak remains the sole authority for token issuance and validation. Any change in
  authentication strategy (e.g., switching to session-based auth) requires revisiting this
  decision.
