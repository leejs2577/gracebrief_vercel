/* ═══════════════════════════════════════════════════════
   YouTube Module v3
   - URL 파싱 (videoId 추출)
   - oEmbed API로 메타정보 (제목, 채널, 썸네일)
   - 자막 추출은 제거됨 → Gemini가 YouTube URL을 직접 분석
   ═══════════════════════════════════════════════════════ */

const YouTube = (() => {

  /**
   * YouTube URL에서 videoId 추출
   */
  function extractVideoId(url) {
    if (!url) return null;
    const patterns = [
      /(?:youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/,
      /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  }

  /**
   * oEmbed API로 영상 메타정보 가져오기
   */
  async function fetchVideoInfo(videoId) {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    
    try {
      const resp = await fetch(oembedUrl);
      if (!resp.ok) throw new Error('oEmbed 요청 실패');
      const data = await resp.json();
      
      return {
        title: data.title || '',
        channel: data.author_name || '',
        channelUrl: data.author_url || '',
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        thumbnailHq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        videoId: videoId,
        url: `https://www.youtube.com/watch?v=${videoId}`
      };
    } catch (e) {
      return {
        title: '영상 정보를 가져올 수 없습니다',
        channel: '',
        thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        thumbnailHq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        videoId: videoId,
        url: `https://www.youtube.com/watch?v=${videoId}`
      };
    }
  }

  return {
    extractVideoId,
    fetchVideoInfo
  };
})();
