@AGENTS.md

# Contexto del proyecto para asistentes de IA

## Hackathon
Torneo de Vibecoding — DSC PUCP, 26 junio 2026.
Rúbrica: Arquitectura 40% | Funcionalidad/Despliegue 30% | UX/UI 15% | Pitch 15%.
Hito 1: 11:30 AM. Hito 2: 18:00 PM.

## Stack fijo
Next.js App Router + Tailwind, Claude API server-side, DB por definir, deploy Vercel.

## Comportamiento del agente (siempre activo, no repetir en cada prompt)
- Antes de implementar, aplica skills/ponytail/ponytail: ¿esto necesita existir?
- No agregues dependencias ni abstracciones que el MVP de hoy no use.
- Si algo toma +30 min sin resultado, dilo en vez de seguir solo.

## Convenciones
- Componentes en PascalCase en /components
- Route handlers en /app/api/[recurso]/route.ts
- Nunca exponer API keys en el cliente

## Git — commits y ramas
- Ramas: feat/frontend, feat/backend, feat/ai-prompts. main protegido.
- [Nombre] es el único que mergea a main.
- Formato obligatorio: feat: / fix: / docs: / test: / refactor: + descripción corta
- Un commit = un cambio lógico, no mezclar features distintas
- El agente prepara el commit (mensaje sugerido), un humano confirma el push a main

## Reglas de uso de IA (bases del torneo)
- Pensar antes de codear, delegar boilerplate/tests, pedir explicaciones no soluciones

## Skills disponibles
- skills/frontend-design.md, ui-ux-pro-max.md, web-design-guidelines.md
- skills/stitch/stitch-design/ → generar pantallas
- skills/stitch/stitch-react-components/ → a Next.js + Tailwind
- skills/stitch/stitch-utilities/ → tokens de diseño
- skills/ponytail/ponytail/ → activo siempre
- skills/ponytail/ponytail-review/ → antes del freeze (17:30)