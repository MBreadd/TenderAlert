-- Esquema mínimo de TenderAlert (Supabase / Postgres). Persona B.
-- Ejecutar en el SQL editor de Supabase, o vía `supabase db push`.
-- MVP: solo persistimos el perfil de empresa. Las licitaciones se leen en vivo
-- del SEACE (no se replican). No añadas tablas que el MVP de hoy no use (ponytail).

create table if not exists empresas (
  ruc              text primary key,
  razon_social     text not null,
  estado_sunat     text not null default 'ACTIVO',
  domicilio_fiscal text,
  rnp_vigente      boolean not null default false,
  capitulo_rnp     text[] default '{}',
  rubros           text[] default '{}',
  especialidad     text,
  ubicacion        text,
  fuente           text not null default 'latinfo',
  creado_en        timestamptz not null default now(),
  actualizado_en   timestamptz not null default now()
);

-- Nota: el código TS usa camelCase (Empresa). Al integrar Supabase, mapea
-- snake_case ↔ camelCase en empresaRepo.ts, o crea una vista/columnas camelCase.
