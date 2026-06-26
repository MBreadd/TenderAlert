# Plan de desarrollo — 👤 Persona C · IA/Prompts (`feat/ai-prompts`)

> Marca cada `[ ]` → `[x]` conforme avanzas. Si algo te bloquea +30 min, dilo en el grupo.
> **Dominio:** `lib/ai/`, rutas API `onboarding-chat`, `match`, `ficha`.
> **Consumes:** `Empresa` + `Licitacion` (de B). **Produces:** `MatchResult`, `FichaRecomendacion`, chat.

**Leyenda:** ⬜ pendiente · 🟦 en progreso · ✅ hecho · ⛔ bloqueado
**Hitos:** Hito 1 → 11:30 · Freeze → 17:30 (correr `ponytail-review`) · Hito 2 → 18:00

---

## Fase 0 · Setup (con todo el equipo, ~20 min)
- [ ] `npm install` ok y `npm run dev` levanta
- [ ] `ANTHROPIC_API_KEY` cargada en `.env.local`
- [ ] Creé mi rama: `git checkout -b feat/ai-prompts`
- [ ] Revisé `lib/types` y los mocks de salida esperada (`mockMatches`, `mockFichas`)
- [ ] Llamada de humo: `askClaudeJson` responde un JSON válido (probar en una ruta temporal o test)

## Fase 1 · Match + chat → meta Hito 1 (11:30)
> Objetivo: el dashboard recibe oportunidades con score, y el chat de onboarding responde.

### Scoring de compatibilidad (`lib/ai/matching.ts`)
- [ ] Validar el heurístico base (rubro + ubicación + RNP) con `mockEmpresa`/`mockLicitaciones`
- [ ] `POST /api/match` devuelve `OportunidadCompatible[]` ordenado por compatibilidad
- [ ] Comparar salida contra `mockMatches` (Miraflores ~alto, Loayza ~bajo)

### Chat de onboarding (`lib/ai/prompts/onboarding.ts`)
- [ ] System prompt afina rubro en máx. 3 preguntas, una a la vez
- [ ] `POST /api/onboarding-chat` devuelve `OnboardingChatResponse` (reply, done, perfilParcial)
- [ ] Cuando `done: true`, devuelve `rubros` normalizados (minúscula, singular)

**✅ Definición de Hito 1:** A puede chatear el onboarding y ver oportunidades con %.

---

## Fase 2 · Motor RAG (ficha) → meta Hito 2 (18:00)
> Objetivo: generar la ficha accionable de calidad. Es el corazón del producto.

### RAG (`lib/ai/rag.ts` + `lib/ai/prompts/ficha.ts`)
- [ ] `generarFicha()` produce `FichaRecomendacion` válida vía structured output
- [ ] `POST /api/ficha/[id]` responde con resumen ejecutivo (≤3 líneas) + checklist
- [ ] El resumen incluye Entidad, Monto y fecha límite, sin inventar datos
- [ ] El checklist marca `cumplido: true` solo si el perfil ya satisface el requisito

### Calidad / casos de prueba
- [ ] Probar caso "limpieza Municipalidad de Miraflores S/ 80,000"
- [ ] Probar caso "seguridad Hospital Loayza S/ 120,000" (rubro NO del perfil)
- [ ] Mitigar falsos positivos de rubro (ej: "limpieza" vs "limpieza de piscinas")
- [ ] Tono claro y accionable; sin jerga legal innecesaria

**✅ Definición de Hito 2:** ficha generada por IA, fiel a los datos y útil para postular.

---

## Fase 3 · Tuning y freeze (hasta 17:30)
- [ ] Afinar prompts con 2-3 ejemplos reales (no romper lo que ya funciona)
- [ ] Manejar `stop_reason: "refusal"` y errores de la API sin tumbar la ruta
- [ ] Revisar costo/latencia: si la demo va lenta, evaluar `claude-sonnet-4-6` (decisión de equipo)
- [ ] Confirmar que la API key NUNCA llega al cliente
- [ ] Correr `skills/ponytail/ponytail-review` sobre `lib/ai`
- [ ] PR `feat/ai-prompts → main`; pedir review

---

## Si te bloqueas
- ¿B aún no tiene datos reales? Usa `mockEmpresa`/`mockLicitaciones` — mismo contrato.
- ¿Quieres meter vector DB/embeddings? **Aplica `skills/ponytail` primero.** Para el MVP el RAG es inyectar el JSON OCDS al contexto. No lo compliques hoy.
- ¿Necesitas un campo nuevo en los tipos? **No edites `lib/types` solo** (zona compartida 🔒): coordínalo con A y B.
- Consulta `skills/claude-api` para SDK, modelos y structured outputs.
