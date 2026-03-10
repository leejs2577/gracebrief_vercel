/* ═══════════════════════════════════════════════════════
   API Configuration Manager — Gemini Only
   - LocalStorage 기반 API 키 관리
   ═══════════════════════════════════════════════════════ */

const ApiConfig = (() => {
  const STORAGE_KEY = 'sermon_analyzer_config';

  const defaults = {
    provider: 'gemini',
    model: 'gemini-3.1-flash-lite-preview',
    keys: {
      gemini: ''
    }
  };

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        return {
          provider: 'gemini',
          model: saved.model || defaults.model,
          keys: { gemini: saved.keys?.gemini || '' }
        };
      }
    } catch (e) {
      console.warn('Failed to load config:', e);
    }
    return { ...defaults };
  }

  function save(config) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save config:', e);
    }
  }

  function get() { return load(); }

  function getApiKey() {
    return load().keys.gemini || '';
  }

  function getProvider() { return 'gemini'; }

  function getModel() { return load().model; }

  function isConfigured() {
    return getApiKey().trim().length > 0;
  }

  function update(config) {
    const current = load();
    const merged = {
      provider: 'gemini',
      model: config.model || current.model,
      keys: { gemini: config.keys?.gemini ?? current.keys.gemini }
    };
    save(merged);
    return merged;
  }

  return {
    get, getApiKey, getProvider, getModel, isConfigured, update,
    save: (config) => save(config),
    load
  };
})();
