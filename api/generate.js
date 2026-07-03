// api/generate.js
export default async function handler(req, res) {
  const { service, contentType, clientType, social } = JSON.parse(req.body);

  // Llamada a Gemini usando la variable de entorno
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      contents: [{ parts: [{ text: `Crea un post para ${social} sobre ${service}. Objetivo: ${contentType}. Cliente: ${clientType}. Incluye datos de contacto: Felipe 3017878213 | Johan 3003270624.` }] }] 
    })
  });
  
  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;
  const imageUrl = `https://image.pollinations.ai/prompt/Professional_tech_service_${service}_${clientType}?nologo=true`;

  res.status(200).json({ text, imageUrl });
}
