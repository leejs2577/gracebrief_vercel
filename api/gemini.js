/* ═══════════════════════════════════════════════════════
   gemini — Gemini API 프록시 (Vercel Serverless Function)
   ═══════════════════════════════════════════════════════ */

export default async function handler(req, res) {
  // CORS 헤더
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY 환경변수가 설정되지 않았습니다.' });
  }

  try {
    const { prompt, youtubeUrl } = req.body;
    const model = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite-preview';

    const parts = [];
    if (youtubeUrl) {
      parts.push({ fileData: { mimeType: 'video/*', fileUri: youtubeUrl } });
    }
    parts.push({ text: prompt });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const apiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { maxOutputTokens: 16384, temperature: 0.35, topP: 0.9 },
      }),
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      return res.status(apiRes.status).json({ error: data.error?.message || 'Gemini API 오류' });
    }

    return res.status(200).json({ text: data.candidates?.[0]?.content?.parts?.[0]?.text || '' });

  } catch (e) {
    return res.status(500).json({ error: e.message || '요청 처리 중 오류가 발생했습니다.' });
  }
}
