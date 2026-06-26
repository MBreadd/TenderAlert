// Si usas un proyecto Node tradicional sin Next.js, descomenta la siguiente línea instalando 'dotenv' (npm i dotenv)
// require('dotenv').config();

async function probarEndpointLicitaciones() {
    const API_KEY = process.env.LATINFO_API_KEY || "lat_f96fd21c0d27a01ec83d651829cd5ae14ada7fd2f6197fdd42474cb73e4c0dc6"; // Clave de respaldo
    const BASE_URL = "https://api.latinfo.dev/licitaciones";

    // Parámetros de búsqueda (puedes filtrar por RUC de la entidad o palabras clave)
    const queryParams = new URLSearchParams({
        ruc: "20131312955", // Ejemplo: RUC de una entidad del estado o empresa
        estado: "vigente",   // Para tu sección de Recomendaciones Prioritarias
        limite: "3"
    });

    const urlCompleta = `${BASE_URL}?${queryParams.toString()}`;

    console.log(`Enviando petición a: ${urlCompleta}\n`);

    try {
        const respuesta = await fetch(urlCompleta, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        if (!respuesta.ok) {
            throw new Error(`Error en la API: ${respuesta.status} ${respuesta.statusText}`);
        }

        const datos = await respuesta.json();

        console.log("==================================================");
        console.log("¡RESPUESTA RECIBIDA CON ÉXITO!");
        console.log("==================================================");
        // Imprime todo el JSON formateado para inspeccionar sus propiedades
        console.log(JSON.stringify(datos, null, 2));

    } catch (error) {
        console.error("Hubo un error al conectar con Latinfo:", error.message);
    }
}

// Ejecutar la función de prueba
probarEndpointLicitaciones();