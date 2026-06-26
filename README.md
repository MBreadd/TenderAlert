# TenderAlert

> El copiloto comercial con IA que conecta a las PYMEs peruanas con las compras del Estado en tiempo real.

---

## Descripción del Proyecto

TenderAlert es una plataforma web SaaS B2B diseñada para democratizar el acceso a las contrataciones del Estado peruano. A través de un enfoque centrado en el proveedor, el sistema automatiza el descubrimiento de oportunidades comerciales en el portal del SEACE/OSCE, traduciendo extensos pliegos de bases burocráticas en resúmenes ejecutivos y planes de acción interactivos generados por Inteligencia Artificial (mecanismo RAG).

A diferencia de los complejos e inviables sistemas tradicionales de auditoría gubernamental, TenderAlert se enfoca 100% en la PYME operativa (limpieza, seguridad, TI, construcción), ofreciendo una herramienta comercial ágil con un retorno de inversión (ROI) inmediato.

## Problema que Resuelve

Las PYMEs peruanas pierden millones de soles en contratos con el Estado por la ineficiencia y complejidad de monitorear manualmente el portal del SEACE todos los días. El empresario promedio no tiene el tiempo ni el equipo legal requerido para revisar, filtrar e interpretar pliegos de bases de más de 80 páginas. No pierden contratos por falta de capacidad; los pierden por falta de tiempo.

## Propuesta de Valor y Diferenciadores

1. **Onboarding Mágico (Cero Fricción):** El usuario no rellena formularios. Ingresa su RUC, el sistema consume la API corporativa de Latinfo y autocompleta sus datos oficiales de SUNAT y OSCE en un segundo. Un chat corto con IA realiza el ajuste fino de su especialidad de negocio.
2. **De Datos a la Acción:** No mostramos tablas estáticas de datos. El motor RAG analiza la licitación y genera una Tarjeta de Recomendación Accionables con un porcentaje de compatibilidad y un checklist exacto de postulación (ej: documentos pre-redactados o alertas de certificaciones faltantes).
3. **Viabilidad en Entorno Controlado:** Al ser una plataforma SaaS Web corporativa interna, elimina dependencias complejas, costos ocultos y riesgos de bloqueo por APIs de mensajería externas (como WhatsApp/Telegram).

---

## Stack Tecnológico y Arquitectura

La solución está diseñada bajo una arquitectura modular y escalable para entornos empresariales:

* **Frontend:** React, TypeScript, Tailwind CSS (Dashboard corporativo dinámico).
* **Backend:** Spring Boot (Java), Spring Security, Spring AI.
* **Base de Datos:** PostgreSQL / Vector Database (para el almacenamiento de embeddings).
* **APIs Integradas (Vía Latinfo):** OSCE (SEACE bajo el estándar internacional OCDS - Open Contracting Data Standard en formato JSON), SUNAT.

```
[ React Frontend ] 
       ↓ (HTTPS / JWT)
[ Spring Boot API Gateway ]
       ↓
[ Motor de Evaluación & RAG (Spring AI) ] → [ Vector DB / PostgreSQL ]
       ↓
[ API Corporativa Latinfo ] 
       ↓
[ Datos Oficiales Estado (OSCE OCDS / SUNAT) ]

```

---

## Alcance del MVP (Hackathon 48h)

### IN (Lo que SÍ hace el prototipo)

* **Registro Automatizado:** Simulación de consulta RUC mediante la API de Latinfo que autocompleta el perfil de la empresa (Razón Social, CIIU, estado RNP).
* **Onboarding Conversacional:** Chat interactivo de 3 preguntas con el LLM para refinar las palabras clave del negocio del usuario.
* **Dashboard de Oportunidades Compatibles:** Panel web dinámico que filtra las licitaciones vigentes según el perfil configurado.
* **Fichas de Acción RAG:** Renderizado de resúmenes ejecutivos de 3 líneas (Entidad, Monto, Requisitos) y generación del checklist guiado para postular.
* **Simulador de Match:** Actualización en tiempo real de las tarjetas del dashboard al cambiar o actualizar el rubro de la PYME.

### OUT (Explícitamente fuera del alcance de la demo)

* **Integración con Apps de Mensajería:** Excluido el envío de alertas por WhatsApp o Telegram para asegurar estabilidad y cumplimiento normativo corporativo.
* **Módulo de Postulación Automatizada:** La app no firma digitalmente ni sube anexos directamente al portal del SEACE.
* **Emparejamiento de Consorcios:** No incluye lógica de cruce B2B para crear consorcios entre múltiples empresas proveedoras.

---

## El "Wow Moment" de la Demo

El punto crítico de la presentación ocurre cuando el usuario ingresa un número de RUC en la interfaz web vacía. En menos de dos segundos, la pantalla se puebla con los datos reales del Estado de forma transparente. Tras un brevísimo chat en lenguaje natural, el sistema redirige al usuario a su Dashboard, actualizando la interfaz para mostrar licitaciones reales de la semana alineadas perfectamente con su negocio y listas para ser ejecutadas mediante un plan de acción automatizado.

---

## Consideraciones de Seguridad y Privacidad

* Autenticación de sesiones basada en JWT (JSON Web Tokens) con roles bien definidos mediante RBAC (Role-Based Access Control) a nivel empresarial.
* Tratamiento y enmascaramiento de datos sensibles de personas naturales bajo estricto cumplimiento de la Ley N° 29733 (Ley de Protección de Datos Personales en el Perú) vigentes en el consumo de las APIs de Latinfo.