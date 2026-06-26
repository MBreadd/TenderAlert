# Plan de desarrollo — 👤 Persona A · Frontend (`feat/frontend`)

> Marca cada `[ ]` → `[x]` conforme avanzas. Si algo te bloquea +30 min, dilo en el grupo.
> **Dominio:** `app/` (páginas) + `components/`. **Consumes:** rutas `/api/*` y `@/lib/mocks`.

**Leyenda:** ⬜ pendiente · 🟦 en progreso · ✅ hecho · ⛔ bloqueado
**Hitos:** Hito 1 → 11:30 · Freeze → 17:30 (correr `ponytail-review`) · Hito 2 → 18:00

---

## Fase 0 · Setup (con todo el equipo, ~20 min)
- [ ] `npm install` corre sin errores y `npm run dev` levanta en `localhost:3000`
- [ ] Revisé `lib/types/index.ts` y entiendo `Empresa`, `OportunidadCompatible`, `FichaRecomendacion`
- [ ] Creé mi rama: `git checkout -b feat/frontend`
- [ ] Probé que las pantallas stub renderizan con `@/lib/mocks`

## Fase 1 · Pantallas con mocks → meta Hito 1 (11:30)
> Objetivo: las 3 pantallas se ven y navegan, **usando solo mocks**. Aún sin fetch real.

### Sistema de diseño base
- [ ] Definir tokens (color, tipografía, espaciado) con `skills/stitch/stitch-utilities`
- [ ] Primitivos en `components/ui/`: `Button`, `Input`, `Card`, `Badge`
- [ ] Layout global revisado (`app/layout.tsx`: título, metadata, fuentes)

### Pantalla 1 — Onboarding (`app/onboarding/`)
- [ ] Campo único de RUC con validación visual (11 dígitos)
- [ ] `components/onboarding/OnboardingChat.tsx` (burbujas usuario/asistente)
- [ ] Estado de "cargando datos oficiales…" tras ingresar el RUC
- [ ] Diseño limpio y de cero fricción (es el inicio del wow moment)

### Pantalla 2 — Dashboard (`app/dashboard/`)
- [ ] `PerfilHeader` (razón social + rubro activo)
- [ ] Lista de `OportunidadCard` (ya hay ejemplo) renderizando `mockOportunidades`
- [ ] `components/dashboard/FiltroRubro.tsx` (selector para el Simulador de Match)
- [ ] Estado vacío ("sin oportunidades para este rubro")

### Pantalla 3 — Ficha (`app/dashboard/oportunidad/[id]/`)
- [ ] `ResumenIA` (bloque del resumen ejecutivo)
- [ ] `MedidorCompatibilidad` (% visual)
- [ ] `ChecklistItem` interactivo (toggle de cumplido)
- [ ] Botón "Descargar bases" (link a `urlBases`)

**✅ Definición de Hito 1:** las 3 pantallas navegables con mocks y diseño presentable.

---

## Fase 2 · Conectar a las APIs reales → meta Hito 2 (18:00)
> Objetivo: reemplazar mocks por `fetch` a las rutas de B y C. **El contrato no cambia.**

- [ ] Helper de fetch tipado que maneje el envelope `ApiResponse<T>` (ok/error)
- [ ] Onboarding: `POST /api/empresa` al ingresar RUC → autocompleta perfil
- [ ] Onboarding: `POST /api/onboarding-chat` por cada respuesta del chat
- [ ] Al terminar el chat (`done: true`) → redirigir a `/dashboard`
- [ ] Dashboard: `POST /api/match` con el perfil → pinta oportunidades reales
- [ ] **Simulador de Match:** cambiar rubro → re-consulta `/api/match` y refresca
- [ ] Ficha: `POST /api/ficha/[id]` → resumen + checklist reales
- [ ] Estados de carga (skeletons/spinners) en cada fetch
- [ ] Manejo de error visible (toast/banner) cuando `ok: false`

**✅ Definición de Hito 2:** flujo end-to-end real RUC → dashboard → ficha.

---

## Fase 3 · Pulido y freeze (hasta 17:30)
- [ ] Responsive (móvil + desktop)
- [ ] Accesibilidad básica (labels, focus, contraste) — `skills/web-design-guidelines`
- [ ] Microinteracciones/animaciones donde sumen (no de relleno)
- [ ] Correr `skills/ponytail/ponytail-review` sobre mis componentes
- [ ] PR `feat/frontend → main` con descripción y screenshots; pedir review

---

## Si te bloqueas
- ¿La ruta de B/C aún no existe? Sigue contra `@/lib/mocks` — mismo contrato.
- ¿Falta un campo en el tipo? **No lo edites solo:** avisa al grupo (`lib/types` es zona compartida 🔒).
