export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { service, contentType, clientType, social } = JSON.parse(req.body);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        contents: [{ parts: [{ text: `Crea un post para ${social} sobre ${service}. Objetivo: ${contentType}. Cliente: ${clientType}.` }] }] 
      })
    });
    
    const data = await response.json();

    // Verificación robusta: Si no hay candidatos, devolver el error tal cual llega de Google
    if (!data.candidates || data.candidates.length === 0) {
      console.error("Respuesta de error de Gemini:", JSON.stringify(data));
      return res.status(500).json({ error: "Gemini devolvió error: " + JSON.stringify(data) });
    }

    const text = data.candidates[0].content.parts[0].text;
    res.status(200).json({ 
      text, 
      imageUrl: `https://image.pollinations.ai/prompt/Professional_tech_service_${service}?nologo=true` 
    });

  } catch (error) {
    console.error("Error crítico:", error);
    res.status(500).json({ error: "Error en el servidor: " + error.message });
  }
}
