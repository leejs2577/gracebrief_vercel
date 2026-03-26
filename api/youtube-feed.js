/* ═══════════════════════════════════════════════════════
   youtube-feed — YouTube Data API v3로 채널 최근 영상 조회 (Vercel Serverless Function)
   RSS 피드 대신 Data API 사용 (Vercel 서버에서 RSS가 차단되는 문제 해결)
   ═══════════════════════════════════════════════════════ */

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

// 라이브 영상 제외 키워드
const LIVE_KEYWORDS = ['라이브', 'LIVE', 'Live', '실시간', '🔴', '스트리밍', 'streaming', 'Streaming', '새벽기도회'];

export default async function handler(req, res) {
  const channelUrl = req.query.channelUrl;
  if (!channelUrl) {
    return res.status(400).json({ error: '채널 URL이 필요합니다.' });
  }

  const apiKey = process.env.YOUTUBE_DATA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'YouTube API 키가 설정되지 않았습니다.' });
  }

  try {
    let channelId;
    let channelName = '';

    // /channel/UCxxx 형식에서 직접 추출
    const directMatch = channelUrl.match(/youtube\.com\/channel\/(UC[a-zA-Z0-9_-]+)/);
    if (directMatch) {
      channelId = directMatch[1];
      // 채널명 조회
      const chRes = await fetch(
        `${YOUTUBE_API_BASE}/channels?part=snippet&id=${channelId}&key=${apiKey}`
      );
      const chData = await chRes.json();
      channelName = chData.items?.[0]?.snippet?.title || '';
    } else {
      // /@handle 형식 — channels.list API로 채널ID 조회
      const handleMatch = channelUrl.match(/youtube\.com\/@([^/?&]+)/);
      if (!handleMatch) {
        return res.status(400).json({ error: '지원하지 않는 채널 URL 형식입니다.' });
      }
      const handle = handleMatch[1];

      const chRes = await fetch(
        `${YOUTUBE_API_BASE}/channels?part=snippet&forHandle=${encodeURIComponent(handle)}&key=${apiKey}`
      );
      if (!chRes.ok) {
        return res.status(400).json({ error: `채널 정보를 가져올 수 없습니다. (HTTP ${chRes.status})` });
      }
      const chData = await chRes.json();

      if (!chData.items || chData.items.length === 0) {
        return res.status(400).json({ error: '채널을 찾을 수 없습니다. URL을 확인해주세요.' });
      }
      channelId = chData.items[0].id;
      channelName = chData.items[0].snippet?.title || '';
    }

    // 업로드 재생목록 ID: 채널ID의 UC → UU
    const uploadPlaylistId = 'UU' + channelId.slice(2);

    // playlistItems.list로 최근 업로드 영상 조회 (최대 15개, 필터 후 5개 반환)
    const plRes = await fetch(
      `${YOUTUBE_API_BASE}/playlistItems?part=snippet&playlistId=${uploadPlaylistId}&maxResults=15&key=${apiKey}`
    );
    if (!plRes.ok) {
      return res.status(400).json({ error: `영상 목록을 가져올 수 없습니다. (HTTP ${plRes.status})` });
    }
    const plData = await plRes.json();

    if (!plData.items) {
      return res.status(200).json({ channelId, channelName, videos: [] });
    }

    const videos = plData.items
      .map(item => {
        const snippet = item.snippet;
        const videoId = snippet.resourceId?.videoId || '';
        const title = snippet.title || '';
        const published = snippet.publishedAt || '';
        return {
          videoId,
          title,
          published,
          url: `https://www.youtube.com/watch?v=${videoId}`,
          thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
        };
      })
      .filter(v => v.videoId && !LIVE_KEYWORDS.some(kw => v.title.includes(kw)))
      .slice(0, 5);

    return res.status(200).json({ channelId, channelName, videos });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
