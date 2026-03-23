# 말씀을삶으로 — 설교 요약 도우미

YouTube 설교 영상을 Gemini AI가 분석하여 **요약, 내용 정리, 결론 및 묵상 포인트**를 자동 생성하는 웹 앱입니다.

> **배포 URL**: https://gracebrief.vercel.app

---

## 주요 기능

- **YouTube URL 입력** → 영상 메타정보 자동 추출
- **자막 기반 분석** — 한국어 자막이 있으면 자막을 기반으로 빠르게 분석
- **영상 직접 분석** — 자막이 없으면 Gemini AI가 영상을 직접 시청·분석
- **3단 구조 결과**: 설교 요약 → 내용 정리 (섹션별) → 결론 및 묵상
- **내보내기**: Markdown / 이미지(PNG) / HTML
- **다크모드 지원**, 완전 반응형 (모바일~데스크탑)

---

## 기술 스택

| 분류 | 기술 | 용도 |
|------|------|------|
| 프론트엔드 | HTML + Vanilla JS | 빌드 도구 없는 정적 SPA |
| 스타일 | Tailwind CSS (CDN) | 유틸리티 퍼스트 스타일링 |
| 아이콘 | Lucide Icons | 모던 SVG 아이콘 |
| 폰트 | Pretendard + Noto Serif KR | 한글 타이포그래피 |
| 이미지 | html2canvas | PNG 내보내기 |
| AI | Google Gemini API | 설교 분석 |
| 배포 | Vercel | Serverless Functions + 정적 호스팅 |

---

## 파일 구조

```
index.html              ← 메인 SPA
guide.html              ← 사용 가이드
css/style.css           ← 커스텀 CSS
js/
  ├── youtube.js        ← URL 파싱 + oEmbed + 자막/날짜 조회
  ├── llm-provider.js   ← Gemini API 호출
  ├── analyzer.js       ← 설교 분석 프롬프트 + JSON 파싱
  ├── renderer.js       ← 결과 렌더링 + 내보내기
  └── app.js            ← 메인 컨트롤러
api/
  ├── gemini.js         ← Gemini API 프록시
  ├── captions.js       ← YouTube 자막 추출
  ├── video-date.js     ← 영상 발행 날짜 조회
  └── youtube-feed.js   ← 채널 RSS 피드 조회
images/
  └── og-image.png      ← OG 미리보기 이미지
reference/              ← 분석 결과 MD 참고 파일
```

---

## 로컬 개발

### 사전 요구사항

- Node.js 20+
- [Vercel CLI](https://vercel.com/docs/cli)
- [Gemini API 키](https://aistudio.google.com)

### 환경변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.1-flash-lite-preview
```

### 실행

```bash
npx vercel dev
```

`http://localhost:3000` 에서 확인 가능합니다.

---

## 배포

### Vercel 배포

1. GitHub 레포지토리 연결
2. Vercel 대시보드에서 환경변수 설정 (`GEMINI_API_KEY`, `GEMINI_MODEL`)
3. `git push` 시 자동 배포

### 환경변수 (Vercel)

| 변수 | 필수 | 설명 |
|------|------|------|
| `GEMINI_API_KEY` | O | Google Gemini API 키 |
| `GEMINI_MODEL` | X | 사용할 모델명 (기본값: `gemini-3.1-flash-lite-preview`) |

---

## 제한사항

- Gemini API 전용 (OpenAI 미지원)
- 매우 긴 설교(2시간+)는 일부 내용 누락 가능

---

*만든이 이종성 ｜ 문의 ljs_whiteman@naver.com*
