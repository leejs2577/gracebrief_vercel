/* ═══════════════════════════════════════════════════════
   gemini — Gemini API 프록시 (Edge Function)
   Netlify Edge Function (Deno 런타임, 50초 타임아웃)
   ═══════════════════════════════════════════════════════ */

export default async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) {
    return Response.json(
      { error: 'GEMINI_API_KEY 환경변수가 설정되지 않았습니다.' },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }

  try {
    const { prompt, youtubeUrl } = await request.json();
    const model = Deno.env.get('GEMINI_MODEL') || 'gemini-3.1-flash-lite-preview';

    const parts = [];
    if (youtubeUrl) {
      parts.push({ fileData: { mimeType: 'video/*', fileUri: youtubeUrl } });
    }
    parts.push({ text: prompt });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { maxOutputTokens: 16384, temperature: 0.35, topP: 0.9 },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return Response.json(
        { error: data.error?.message || 'Gemini API 오류' },
        { status: res.status, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    return Response.json(
      { text: data.candidates?.[0]?.content?.parts?.[0]?.text || '' },
      { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );

  } catch (e) {
    return Response.json(
      { error: e.message || '요청 처리 중 오류가 발생했습니다.' },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
};

export const config = { path: '/api/gemini' };
