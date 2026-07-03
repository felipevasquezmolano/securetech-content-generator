export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const body = JSON.parse(req.body);
    const { service, contentType, clientType, social } = body;

    // Verificamos si la variable de entorno está cargada
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Configuración faltante: GEMINI_API_KEY no definida." });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        contents: [{ parts: [{ text: `Crea un post para ${social} sobre ${service}. Objetivo: ${contentType}. Cliente: ${clientType}.` }] }] 
      })
    });
    
    const data = await response.json();

    // Verificamos si la respuesta de Google tiene el contenido esperado
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error("Respuesta inesperada de Gemini:", data);
      return res.status(500).json({ error: "Error de Gemini: " + JSON.stringify(data.error || data) });
    }

    const text = data.candidates[0].content.parts[0].text;
    res.status(200).json({ 
      text, 
      imageUrl: `https://image.pollinations.ai/prompt/Professional_tech_service_${service}?nologo=true` 
    });

  } catch (error) {
    console.error("Error en servidor:", error);
    res.status(500).json({ error: "Error interno: " + error.message });
  }
}
