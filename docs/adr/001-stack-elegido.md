# ADR-001: Stack tecnológico
**Estado:** Aceptado | **Fecha:** 2026-06-26

## Contexto
Equipo de 3 desarrolladores junior, 1 día de hackathon, ninguno domina frontend a fondo.
Se necesita un stack que minimice configuración y permita un solo deploy.

## Decisión
Next.js App Router (frontend + backend en un repo) + Tailwind + Claude API
(server-side) + Vercel para deploy. DB se decide en Sprint 0 según el reto
(Supabase si hay persistencia real, memoria si no).

## Alternativas consideradas
- Frontend HTML plano + backend Express separado: descartado, duplica el
  trabajo de deploy y no aprovecha que ya se hizo create-next-app.
- React sin framework: descartado, Next.js ya resuelve routing y API routes.

## Consecuencias
Se gana: un solo deploy a Vercel, API routes integradas, menos piezas que
configurar bajo presión de tiempo.
Se sacrifica: menos control fino sobre el backend si el reto requiere algo
muy específico de servidor (poco probable en un MVP de 1 día).