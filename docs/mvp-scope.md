# TenderAlert

## Descripción (máximo 3 líneas)

Plataforma web SaaS B2B que centraliza e identifica oportunidades de contratación con el Estado para PYMEs operativas. A través de un mecanismo RAG, procesa las licitaciones del SEACE, genera tarjetas de recomendación con planes de acción directos y simplifica el onboarding automático usando solo el RUC.

## Problema que resuelve

Las PYMEs operativas pierden millones en contratos del Estado por la ineficiencia y complejidad de monitorear manualmente el portal del SEACE todos los días, sumado a la dificultad de interpretar los extensos pliegos de bases burocráticas.

## Usuario objetivo

Dueños y gerentes de PYMEs peruanas de sectores operativos y de servicios (como limpieza, seguridad y tecnología/TI).

## Visión (1-2 líneas)

Democratizar el acceso a las compras estatales para las PYMEs, convirtiendo datos públicos complejos en oportunidades de negocio accionables que generen un ROI inmediato.

## Funcionalidades dentro del scope (lo que el MVP SÍ hace)

* Registro e inicio de sesión en plataforma web mediante ingreso único de RUC.
* Onboarding automático que jala datos oficiales (SUNAT/OSCE) y realiza un ajuste fino mediante un chat interactivo de 3 preguntas con el usuario.
* Dashboard Web centralizado con un panel de "Oportunidades Compatibles".
* Motor RAG/LLM que procesa los JSONs de licitaciones y genera resúmenes ejecutivos de 3 líneas (Entidad, Monto, Requisitos clave).
* Fichas/Tarjetas de recomendación accionables con un checklist de plan de acción para postular.
* Simulador de Match que actualiza las ofertas en tiempo real al cambiar el rubro de la empresa.

## Funcionalidades fuera del scope (explícitamente descartadas para hoy)

* Integración, automatización o envío de notificaciones mediante WhatsApp o Telegram.
* Módulo de postulación automatizada (no sube archivos ni anexos directamente al SEACE).
* Módulo para la creación o emparejamiento automático de Consorcios entre empresas.
* Declaración y pago de impuestos de SUNAT o gestión tributaria (migrado del concepto ContadorIA).
* Monitoreo ambiental o mapas de calor de contaminación (migrado del concepto EcoRadar).

## El "wow moment" de la demo

El momento en el que el usuario ingresa un número de RUC en la web, la plataforma auto-completa instantáneamente todos sus datos oficiales de SUNAT/OSCE a través de la API y, tras una brevísima interacción por chat, el dashboard se actualiza mágicamente mostrando tarjetas con licitaciones reales vigentes de la semana y sus respectivos planes de acción generados por la IA.

## Flujo de usuario / pantallas principales

1. **Pantalla de Registro / Onboarding Instantáneo:** Vista limpia con un campo único de entrada para el RUC que gatilla el autocompletado y abre una ventana de chat interactivo de 3 preguntas para precisar la especialidad del negocio.
2. **Dashboard Principal (Panel de Control):** Pantalla donde el usuario visualiza su perfil corporativo activo y la lista de "Oportunidades Compatibles" detectadas en el día.
3. **Vista de Ficha de Recomendación (Acción):** Interfaz detallada de la licitación seleccionada que muestra el resumen de la IA, el porcentaje de compatibilidad, los botones de descarga de bases y el checklist interactivo con los requisitos necesarios para postular.

## Decisiones técnicas ya tomadas en esta conversación

* **Arquitectura general:** Aplicación web (SaaS B2B corporativo).
* **Consumo de datos gubernamentales:** Integración directa con la infraestructura de la plataforma Latinfo para consumir los datos de registros públicos (SUNAT, OSCE/SEACE).
* **Estándar de datos de compras estatales:** Uso exclusivo del estándar OCDS (Open Contracting Data Standard) provisto por el OSCE para procesar la información de las licitaciones en formato JSON estructurado.
* **Modelos de IA / Procesamiento:** Implementación de un mecanismo RAG (Retrieval-Augmented Generation) acoplado a un LLM para inyectar los datos estructurados en el contexto, realizar los resúmenes y estructurar los planes de acción sin alterar el estado legal de la información.

## Datos o casos de prueba mencionados

* **Input de prueba para la simulación de RAG:** Caso hipotético de un pliego de bases del SEACE correspondiente a una licitación de servicio de limpieza en la Municipalidad de Miraflores por un monto estimado de S/ 80,000 o un servicio de seguridad para el Hospital Loayza por S/ 120,000.
* **Output esperado de la IA en la tarjeta de acción:** Formato de texto simple que extrae: Entidad convocante, Objeto, Presupuesto estimado, Fecha límite y un Checklist personalizado (Ej: Anexo 4, Constancia RNP activa, validación de certificación ISO).
* **Input del Onboarding:** Ejemplos de rubros de texto libre del usuario como *"Hacemos limpieza de oficinas corporativas y lavado de alfombras a gran escala"*.

## Dudas o cosas que quedaron sin decidir

* Cómo se optimizará el filtro de la IA para mitigar falsos positivos en el emparejamiento de rubros específicos.
* Cómo se manejará la encriptación y privacidad de los datos bajo la Ley N° 29733 (Protección de Datos Personales en Perú) en el entorno del dashboard.
* Definición de las tecnologías específicas que usará el equipo para el desarrollo del frontend y el backend de la web app.