export default async function handler(req, res) {
  // 1. Validar que la solicitud sea POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const body = JSON.parse(req.body);
    const { service, contentType, clientType, social } = body;

    // 2. Llamada a la API de Gemini
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        contents: [{ 
          parts: [{ 
            text: `Crea un post para ${social} sobre ${service}. Objetivo: ${contentType}. Cliente: ${clientType}. Incluye datos de contacto: Felipe Vásquez 3017878213 | Johan Juzga 3003270624 | securetechps@outlook.com. Usa tono profesional y hashtags relacionados.` 
          }] 
        }] 
      })
    });
    
    const data = await response.json();

    // 3. Validar que la respuesta contenga los datos necesarios
    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content) {
      console.error("Respuesta inesperada de Gemini:", JSON.stringify(data));
      return res.status(500).json({ error: "Error en la API de Gemini: No se generó contenido." });
    }

    const text = data.candidates[0].content.parts[0].text;
    
    // 4. Generar URL de imagen
    const imageUrl = `https://image.pollinations.ai/prompt/Professional_technology_service_${service}_${clientType}?nologo=true`;

    // 5. Enviar respuesta al frontend
    res.status(200).json({ text, imageUrl });

  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ error: "Error interno del servidor al generar contenido." });
  }
}
