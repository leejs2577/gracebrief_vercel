# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

YouTube 설교 영상을 Gemini AI가 직접 시청·분석하여 요약, 내용 정리, 결론 및 묵상 포인트를 자동 생성하는 **정적 SPA 웹 앱**. 빌드 도구 없이 CDN 기반으로 동작하며, `index.html`을 브라우저에서 직접 열어 실행한다.

## 개발 환경

- **빌드/번들러 없음** — 순수 HTML + Vanilla JS + CDN (Tailwind, Lucide, html2canvas)
- 로컬 개발: `npx serve .` → `http://localhost:3000`
- 패키지 매니저(npm/yarn) 미사용, `package.json` 없음
- 테스트 프레임워크 없음

## 아키텍처

모든 JS 모듈은 IIFE 패턴(`const Module = (() => { ... })()`)으로 전역 객체를 노출하며, `index.html`에서 순서대로 로드된다:

1. **`youtube.js`** (`YouTube`) — URL에서 videoId 추출 + oEmbed API로 메타정보 조회
2. **`llm-provider.js`** (`LLMProvider`) — Gemini API 호출. YouTube URL을 `fileData`로 전달하여 영상 직접 분석
3. **`analyzer.js`** (`Analyzer`) — 설교 분석 프롬프트 생성 + JSON 응답 파싱. 교회-설교자 매핑(`CHURCH_PREACHER_MAP`)
4. **`renderer.js`** (`Renderer`) — 분석 결과 DOM 렌더링 + 내보내기(MD / HTML)
5. **`app.js`** — 메인 컨트롤러. 테마, 모달, URL 입력, 분석 워크플로우, 내보내기 버튼 바인딩

**의존 관계**: `app.js` → `Analyzer` → `LLMProvider`, `app.js` → `YouTube`, `app.js` → `Renderer`

## 주요 규칙

- Gemini API 전용 (OpenAI 미지원). `LLMProvider`는 Gemini만 호출
- 분석 결과는 정해진 JSON 스키마(`meta`, `summary`, `sections`, `conclusion`)를 따름
- 텍스트 강조: `**bold**` → `<strong class="text-emphasis">`, `==하이라이트==` → `<mark class="highlight-mark">` (bold + 빨간 글자색 `#DC2626`, 다크모드 `#F87171`)
- 문체: 설명체 존댓말(~합니다/~입니다), 3인칭 서술 금지 — analyzer.js 프롬프트에 정의
- 다크모드: Tailwind `class` 전략 (`document.documentElement`에 `dark` 클래스 토글)
- Lucide 아이콘: DOM 변경 후 반드시 `lucide.createIcons()` 재호출 필요
- `reference/` 디렉토리에 분석 결과 MD 샘플 파일 존재 (새 프롬프트 작성 시 참조)
- 이미지 내보내기(`exportImage`)는 html2canvas 사용. 캡처 대상: `#resultContent`
