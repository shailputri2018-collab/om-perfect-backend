module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    const { messages } = req.body || {};
    const SYSTEM = `You are Om, legal compliance advisor for LegalEase Compliance Delhi NCR. Help with MSME, GST, MCD Trade Licence, Fire NOC, FSSAI, Noida Authority. Reply in Hinglish, 2-3 sentences. For details: WhatsApp +91-9818624442`;
    const contents = [
      { role: 'user', parts: [{ text: SYSTEM }] },
      { role: 'model', parts: [{ text: 'Namaste! Main Om hoon. Kaise help karoon?' }] },
      ...(messages || []).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }))
    ];
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents, generationConfig: { maxOutputTokens: 250 } })
      }
    );
    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'WhatsApp karein: +91-9818624442';
    return res.status(200).json({ reply });
  } catch (e) {
    return res.status(200).json({ reply: 'Maaf kijiye. WhatsApp: +91-9818624442' });
  }
};
