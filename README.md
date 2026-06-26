# TenderAlert

> El copiloto comercial con IA que conecta a las PYMEs peruanas con las compras del Estado en tiempo real.

---

## Descripción del Proyecto

TenderAlert es una plataforma web SaaS B2B que democratiza el acceso a las contrataciones del Estado peruano. Centrada en el proveedor, automatiza el descubrimiento de oportunidades en el portal del SEACE/OSCE y traduce extensos pliegos de bases en resúmenes ejecutivos y planes de acción accionables generados por IA (mecanismo RAG).

Se enfoca 100% en la PYME operativa (limpieza, seguridad, TI, construcción), ofreciendo una herramienta comercial ágil con ROI inmediato.

## Problema que Resuelve

Las PYMEs peruanas pierden millones de soles en contratos con el Estado por la ineficiencia de monitorear manualmente el SEACE todos los días. El empresario promedio no tiene tiempo ni equipo legal para revisar e interpretar pliegos de 80+ páginas. No pierden contratos por falta de capacidad, sino por falta de tiempo.

## Propuesta de Valor

1. **Onboarding mágico (cero fricción):** el usuario ingresa su RUC y el sistema autocompleta sus datos oficiales de SUNAT/OSCE (vía Latinfo). Un chat corto con IA afina su especialidad.
2. **De datos a la acción:** el motor RAG analiza cada licitación y genera una tarjeta de recomendación con % de compatibilidad y un checklist exacto de postulación.
3. **Wow moment:** RUC → datos reales en segundos → dashboard con licitaciones vigentes alineadas a su negocio, cada una con su plan de acción.

---

## 🧱 Stack Tecnológico

Decisión registrada en [`docs/adr/001-stack-elegido.md`](docs/adr/001-stack-elegido.md). **Un solo repo, un solo deploy.**

| Capa | Tecnología |
|---|---|
| **Framework** | Next.js 16 (App Router) — frontend + backend juntos |
| **UI** | React 19 + Tailwind CSS 4 + TypeScript |
| **IA** | Claude API (`@anthropic-ai/sdk`, modelo `claude-opus-4-8`) — **solo server-side** |
| **Base de datos** | Supabase (Postgres) — persiste el perfil de empresa |
| **Datos del Estado** | API Latinfo → SUNAT + OSCE/SEACE en estándar **OCDS** |
| **Deploy** | Vercel |

> El motor RAG no usa vector DB: inyecta el JSON OCDS directo al contexto de Claude
> (suficiente para el MVP y más seguro en una hackathon de 12h).

---

## 🚀 Cómo correr el proyecto

Requisitos: **Node.js 20+** y npm.

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local
#   y rellena ANTHROPIC_API_KEY, LATINFO_* y SUPABASE_* (ver .env.example)

# 3. (Opcional) crear las tablas en Supabase
#   ejecuta el contenido de supabase/schema.sql en el SQL editor de Supabase

# 4. Levantar en desarrollo
npm run dev          # http://localhost:3000

# Otros scripts
npm run build        # build de producción
npm run start        # servir el build
npm run lint         # linter
```

**Sin credenciales también funciona:** si faltan las claves de Latinfo o Supabase,
la capa de datos cae a mocks realistas (`lib/mocks`) para que la demo nunca se caiga
por un servicio externo. Solo `ANTHROPIC_API_KEY` es necesaria para que la IA responda.

> ⚠️ Esta versión de Next.js puede traer cambios respecto a lo que conoces.
> Antes de escribir código nuevo, revisa las guías en `node_modules/next/dist/docs/`
> (ver [`AGENTS.md`](AGENTS.md)).

---

## 🗂️ Estructura del proyecto

```
TenderAlert/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing                          👤 A
│   ├── onboarding/page.tsx       # Pantalla 1: RUC + chat IA        👤 A
│   ├── dashboard/
│   │   ├── page.tsx              # Pantalla 2: oportunidades        👤 A
│   │   └── oportunidad/[id]/     # Pantalla 3: ficha + checklist    👤 A
│   │       └── page.tsx
│   └── api/                      # Route handlers (la costura B↔C)
│       ├── empresa/route.ts          # POST  RUC → datos oficiales  👤 B
│       ├── licitaciones/route.ts     # GET   licitaciones OCDS      👤 B
│       ├── onboarding-chat/route.ts  # POST  chat 3 preguntas (IA)  👤 C
│       ├── match/route.ts            # POST  oportunidades + score  👤 C
│       └── ficha/[id]/route.ts       # POST  ficha RAG              👤 C
├── components/                   # UI (PascalCase)                  👤 A
│   └── dashboard/OportunidadCard.tsx
├── lib/
│   ├── types/index.ts            # 🔒 CONTRATOS compartidos (los 3)
│   ├── mocks/index.ts            # 🔒 Datos falsos para trabajar en paralelo
│   ├── data/                     # Integraciones externas + DB       👤 B
│   │   ├── latinfo.ts            #   RUC → SUNAT/OSCE
│   │   ├── seace.ts             #   licitaciones OCDS
│   │   ├── supabase.ts          #   cliente Supabase
│   │   └── empresaRepo.ts        #   persistencia del perfil
│   └── ai/                       # Motor de IA                       👤 C
│       ├── client.ts            #   cliente Claude + helper JSON
│       ├── matching.ts          #   scoring de compatibilidad
│       ├── rag.ts               #   genera la ficha accionable
│       └── prompts/             #   onboarding.ts · ficha.ts
├── supabase/schema.sql           # Esquema Postgres                  👤 B
├── docs/
│   ├── architecture.md          # Diagrama + flujo + endpoints
│   ├── division-trabajo.md      # Cómo avanzan A, B y C en paralelo
│   ├── planes/                  # 📋 Plan con checkboxes por persona
│   │   ├── README.md            #   Tablero + cronograma del equipo
│   │   ├── persona-a-frontend.md
│   │   ├── persona-b-backend.md
│   │   └── persona-c-ia.md
│   ├── mvp-scope.md             # Alcance del MVP
│   └── adr/001-stack-elegido.md # Decisión de stack
└── .env.example                  # Plantilla de variables de entorno
```

Cada carpeta de cada persona tiene su propio `README.md` con responsabilidades,
contrato y pendientes: [`components/`](components/README.md),
[`lib/data/`](lib/data/README.md), [`lib/ai/`](lib/ai/README.md),
[`app/api/`](app/api/README.md).

---

## 👥 Trabajo en equipo (3 personas, 12h)

Desarrollo **contract-first**: los tipos (`lib/types`) y mocks (`lib/mocks`) son la
frontera entre las 3 personas; se definen juntos al inicio y luego cada quien
avanza en su rama sin bloquear a los demás.

| Persona | Rama | Dominio |
|---|---|---|
| A — Frontend | `feat/frontend` | `app/` (páginas) + `components/` |
| B — Backend/Datos | `feat/backend` | `lib/data/`, `supabase/`, rutas API de datos |
| C — IA/Prompts | `feat/ai-prompts` | `lib/ai/`, rutas API de IA |

Cada persona tiene un **plan de desarrollo con checkboxes** para trackear su avance
contra los hitos (tablero en [`docs/planes/`](docs/planes/README.md)):
[A](docs/planes/persona-a-frontend.md) ·
[B](docs/planes/persona-b-backend.md) ·
[C](docs/planes/persona-c-ia.md).

👉 Detalle completo, orden del día y reglas de Git en
[`docs/division-trabajo.md`](docs/division-trabajo.md).

---

## 🎯 Alcance del MVP

Lo que el MVP **sí** hace y lo que queda **fuera** está en
[`docs/mvp-scope.md`](docs/mvp-scope.md). En una línea: onboarding por RUC →
dashboard de oportunidades compatibles → ficha de recomendación accionable.
Fuera: notificaciones por WhatsApp/Telegram, postulación automática y consorcios.

---

## 🔐 Seguridad

- Las API keys (`ANTHROPIC_API_KEY`, `LATINFO_API_KEY`, service role de Supabase)
  viven **solo en el servidor**; nunca se importan desde componentes cliente.
- Tratamiento de datos personales bajo la Ley N° 29733 (Protección de Datos, Perú).
