# `lib/data/` — Integraciones externas y persistencia · 👤 Persona B (`feat/backend`)

Todo lo que sale a un sistema externo (Latinfo/SUNAT/OSCE) o a la base de datos
(Supabase) vive acá. **Solo server-side** (claves en el entorno).

## Qué hace cada archivo
| Archivo | Responsabilidad |
|---|---|
| `latinfo.ts` | `lookupEmpresaByRuc(ruc)` → datos oficiales SUNAT/OSCE. |
| `seace.ts` | `fetchLicitaciones(rubro?)` / `fetchLicitacion(id)` → OCDS parseado. |
| `supabase.ts` | Cliente Supabase (singleton). |
| `empresaRepo.ts` | Guardar/leer el perfil de empresa (Supabase o memoria). |

## Tu contrato (lo que produces)
Devuelves `Empresa` y `Licitacion` de `@/lib/types`. **Esa es la frontera**: la
Persona A (frontend) y la C (IA) consumen esos tipos sin saber de dónde salieron.

## Patrón clave: fallback a mock
`latinfo.ts` y `seace.ts` caen a `lib/mocks` si faltan credenciales o la API real
falla. Así la demo nunca se cae por un tercero y el resto del equipo no se bloquea.
Cuando integres las credenciales reales (las tenemos), el fallback queda como red
de seguridad para el día del pitch.

## Dónde te conectas
Tus funciones se llaman desde las rutas que tú posees:
`app/api/empresa`, `app/api/licitaciones`. El scoring (Persona C) consume tus tipos.

## Pendientes / setup
- [ ] `npm i @supabase/supabase-js` (Persona B lo agrega en su rama).
- [ ] Crear tablas con `supabase/schema.sql`.
- [ ] Confirmar la forma real de la respuesta de Latinfo y ajustar `mapToEmpresa` /
      `mapRelease` (hoy son una aproximación al estándar OCDS).
- Antes de añadir tablas o índices nuevos: aplica `skills/ponytail`.
