# ADR-0002: JsonNullable for Optional Nullable Fields in API DTOs

## Status

Accepted

## Context

REST APIs that support partial updates (PUT/PATCH) face a three-state problem for optional fields:

1. **Not sent** – the client does not intend to change this field.
2. **Sent as `null`** – the client explicitly wants to clear the field.
3. **Sent with a value** – the client wants to set a new value.

Standard Java deserialization cannot distinguish case 1 from case 2: both arrive as `null` in the
DTO. Using `null` for both meanings forces the service layer to pick one semantic arbitrarily,
typically "null means do not touch" – which then makes it impossible to ever clear an optional
field via the API.

nextuntis uses full PUT semantics for student updates (the entire resource is replaced), but the
`email` field is optional and nullable, so the same three-state problem applies: omitting `email`
from the request body must not overwrite an existing value, while sending `"email": null` must
clear it.

Alternatives considered:

- **Separate PATCH endpoint**: Would solve the problem at the HTTP level but doubles the API
  surface for every resource that has nullable optional fields.
- **Null-means-clear convention**: Simple but lossy – impossible to distinguish "client forgot the
  field" from "client wants to delete the value". Leads to accidental data loss.
- **Custom deserializer per field**: Verbose and error-prone; needs to be repeated for every
  nullable optional field.

## Decision

Optional nullable fields in generated API DTOs use `JsonNullable<T>` from the
`jackson-databind-nullable` library (OpenAPI Generator integration). The `JsonNullableModule` is
registered globally via `JacksonConfig`. The OpenAPI spec marks these fields with
`nullable: true` and omits them from `required`, which causes the generator to emit
`JsonNullable<T>` automatically.

The service layer applies the following rule:

```java
if (field != null && field.isPresent()) {
    entity.setField(field.get()); // set new value, including null
} // else: field was absent in the request – leave entity unchanged
}
```

## Consequences

### Positive

- Clean three-state semantics without duplicating endpoints.
- Logic is consistent and enforced at the DTO level; service code only needs one pattern.
- Works identically for any future resource with optional nullable fields.

### Negative

- `JsonNullable<T>` is unfamiliar to developers who have not worked with `jackson-databind-nullable`.
  The wrapper type appears throughout generated code and service mappings.
- Generated DTOs must not be hand-edited; the `nullable`/`required` spec attributes are the
  single source of truth.

### Neutral

- The `JsonNullableModule` must be registered before any request deserialization occurs.
  `JacksonConfig` ensures this at application startup.
