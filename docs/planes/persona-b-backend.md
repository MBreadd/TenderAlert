# Plan de desarrollo — 👤 Persona B · Backend/Datos (`feat/backend`)

> Marca cada `[ ]` → `[x]` conforme avanzas. Si algo te bloquea +30 min, dilo en el grupo.
> **Dominio:** `lib/data/`, `supabase/`, rutas API `empresa` y `licitaciones`.
> **Produces:** `Empresa` y `Licitacion` (de `@/lib/types`). Esa es tu frontera con A y C.

**Leyenda:** ⬜ pendiente · 🟦 en progreso · ✅ hecho · ⛔ bloqueado
**Hitos:** Hito 1 → 11:30 · Freeze → 17:30 (correr `ponytail-review`) · Hito 2 → 18:00

---

## Fase 0 · Setup (con todo el equipo, ~20 min)
- [ ] `npm install` ok y `npm run dev` levanta
- [ ] Revisé `lib/types` y entiendo qué forma deben tener `Empresa` y `Licitacion`
- [ ] Creé mi rama: `git checkout -b feat/backend`
- [ ] `npm i @supabase/supabase-js` confirmado en mi rama
- [ ] Tengo a la mano credenciales: `LATINFO_API_URL/KEY` y las de Supabase en `.env.local`

## Fase 1 · Datos reales mínimos → meta Hito 1 (11:30)
> Objetivo: las rutas de datos devuelven info real (o mock fallback) con el contrato correcto.

### Latinfo (SUNAT/OSCE)
- [ ] Confirmar la forma REAL de la respuesta de Latinfo (un RUC de prueba)
- [ ] Ajustar `mapToEmpresa()` en `lib/data/latinfo.ts` a esa forma real
- [ ] `lookupEmpresaByRuc()` devuelve un `Empresa` válido con datos reales
- [ ] Verificar fallback a mock si faltan credenciales (no debe romper)

### SEACE / OCDS
- [ ] Confirmar el endpoint OCDS real y un `release` de ejemplo
- [ ] Ajustar `mapRelease()` en `lib/data/seace.ts` al OCDS real (ocid, tender, value…)
- [ ] `fetchLicitaciones()` y `fetchLicitacion(id)` devuelven `Licitacion[]`/`Licitacion`

### Rutas API
- [ ] `POST /api/empresa` responde `{ ok, data: Empresa }` con RUC válido
- [ ] `GET /api/licitaciones` responde `{ ok, data: Licitacion[] }` (probar `?rubro=`)
- [ ] Probadas con `curl`/Thunder con al menos 1 caso de `lib/mocks`

**✅ Definición de Hito 1:** A puede pedir RUC → recibe perfil; y listar licitaciones reales.

---

## Fase 2 · Persistencia + robustez → meta Hito 2 (18:00)
### Supabase
- [ ] Crear proyecto Supabase y ejecutar `supabase/schema.sql`
- [ ] `getSupabase()` conecta con la service role key (solo server-side)
- [ ] Resolver mapeo snake_case (DB) ↔ camelCase (`Empresa`) en `empresaRepo.ts`
- [ ] `guardarEmpresa()` hace upsert real; `obtenerEmpresa()` lee real
- [ ] Verificar que sin Supabase configurado sigue cayendo a memoria (no bloquear a nadie)

### Calidad de datos y errores
- [ ] Validación de RUC y de parámetros en las rutas (400 claros)
- [ ] Manejo de timeouts/errores de Latinfo con `try/catch` → fallback + log
- [ ] `revalidate`/cache razonable (datos oficiales cambian poco)
- [ ] Normalizar `rubro`/`ubicacion` para que el scoring de C no falle por formato

**✅ Definición de Hito 2:** perfil persiste en Supabase y las rutas son resilientes.

---

## Fase 3 · Pulido y freeze (hasta 17:30)
- [ ] Logs útiles (sin filtrar secretos)
- [ ] Revisar que NINGUNA key se exponga al cliente
- [ ] Correr `skills/ponytail/ponytail-review` sobre `lib/data`
- [ ] PR `feat/backend → main` con notas de qué quedó real vs mock; pedir review

---

## Si te bloqueas
- ¿Latinfo cae o es lento en la demo? El fallback a mock ya te cubre — déjalo activo como red de seguridad.
- ¿Necesitas un campo nuevo en `Empresa`/`Licitacion`? **No edites `lib/types` solo** (zona compartida 🔒): coordínalo con A y C.
- Antes de añadir una tabla o índice nuevo: aplica `skills/ponytail` (¿lo usa el MVP de hoy?).
