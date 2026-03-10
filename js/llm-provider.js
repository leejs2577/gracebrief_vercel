/* ═══════════════════════════════════════════════════════
   LLM Provider — Gemini Only
   YouTube URL을 fileData로 직접 전달하여 영상 분석
   ═══════════════════════════════════════════════════════ */

const LLMProvider = (() => {

  /**
   * 통합 인터페이스
   * @param {string} prompt - 분석 프롬프트
   * @param {object} options - { model, apiKey, maxTokens, youtubeUrl }
   */
  async function generate(prompt, options = {}) {
    const model = options.model || ApiConfig.getModel();
    const apiKey = options.apiKey || ApiConfig.getApiKey();
    const maxTokens = options.maxTokens || 16384;

    if (!apiKey) {
      throw new Error('Gemini API 키가 설정되지 않았습니다. 상단의 API 설정을 완료해주세요.');
    }

    return await callGemini(prompt, model, apiKey, maxTokens, options.youtubeUrl);
  }

  /**
   * Google Gemini API
   * - YouTube URL을 fileData로 직접 전달 (Gemini가 영상 시청)
   */
  async function callGemini(prompt, model, apiKey, maxTokens, youtubeUrl) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const parts = [];

    if (youtubeUrl) {
      parts.push({
        fileData: {
          mimeType: 'video/*',
          fileUri: youtubeUrl
        }
      });
    }

    parts.push({ text: prompt });

    const body = {
      contents: [{
        parts: parts
      }],
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature: 0.35,
        topP: 0.9,
      }
    };

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      const msg = err?.error?.message || `Gemini API 오류 (${resp.status})`;
      throw new Error(msg);
    }

    const data = await resp.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Gemini 응답에서 텍스트를 추출할 수 없습니다.');
    return text;
  }

  return { generate };
})();
