/* ═══════════════════════════════════════════════════════
   video-date — YouTube 영상 발행 날짜 조회 (Vercel Serverless Function)
   YouTube watch 페이지 HTML에서 datePublished 추출
   API 키 불필요
   ═══════════════════════════════════════════════════════ */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const videoId = req.query.videoId;
  if (!videoId) {
    return res.status(400).json({ error: 'videoId required' });
  }

  try {
    const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    });

    if (!pageRes.ok) throw new Error(`YouTube 페이지 요청 실패: ${pageRes.status}`);

    const html = await pageRes.text();

    // YYYY-MM-DD 직접 매칭 패턴 (우선순위 순)
    const directPatterns = [
      /"datePublished"\s*:\s*"(\d{4}-\d{2}-\d{2})/,
      /"publishDate"\s*:\s*"(\d{4}-\d{2}-\d{2})/,
      /"uploadDate"\s*:\s*"(\d{4}-\d{2}-\d{2})/,
      /itemprop="datePublished"\s+content="(\d{4}-\d{2}-\d{2})/,
      /itemprop="uploadDate"\s+content="(\d{4}-\d{2}-\d{2})/,
    ];

    for (const pattern of directPatterns) {
      const match = html.match(pattern);
      if (match) {
        return res.status(200).json({ publishedAt: match[1] });
      }
    }

    // 한국어 날짜 텍스트 ("2024. 3. 17." 등) → YYYY-MM-DD 변환
    const koMatch = html.match(/"publishDate":\{"simpleText":"([^"]+)"/);
    if (koMatch) {
      const parsed = parseKoreanDate(koMatch[1]);
      if (parsed) {
        return res.status(200).json({ publishedAt: parsed });
      }
    }

    // 날짜를 찾지 못한 경우
    return res.status(200).json({ publishedAt: null });

  } catch (e) {
    return res.status(200).json({ publishedAt: null });
  }
}

/**
 * 한국어 날짜 문자열을 YYYY-MM-DD로 변환
 * "2024. 3. 17.", "2024년 3월 17일" 등 지원
 */
function parseKoreanDate(text) {
  const m = text.match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/);
  if (m) {
    return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
  }
  return null;
}
