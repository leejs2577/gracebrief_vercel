# 📖 설교 분석기 — Sermon Analyzer

YouTube 설교 영상을 Gemini AI가 직접 시청·분석하여 **요약, 내용 정리, 결론 및 묵상 포인트**를 자동 생성하는 웹 앱입니다.

---

## ✅ 구현 완료 기능

### 핵심 기능
- **YouTube URL 입력** → 영상 정보 자동 추출 (oEmbed API)
- **Gemini AI 영상 직접 분석** — 자막 추출 없이 Gemini가 YouTube 영상을 직접 시청·음성 분석
- **Google Search 도구 연동** — 교회명·설교자명을 웹서칭으로 정확히 판단
- **3단 구조 분석 결과**:
  1. 📌 설교 전체 요약 (3~5문장, 권면체)
  2. 📋 내용 정리 (3~6개 섹션, 소제목·부제·핵심 포인트·성경 인용)
  3. 🙏 결론 및 묵상 (핵심 포인트, 묵상 질문 4개, 마무리 말씀)

### 문체 특징
- **부연 설명 없는 직접 권면체** — "본 설교는~" 같은 3인칭 서술 금지
- **Bold + 하이라이트** — 중요 문장은 **bold**, 핵심 선언은 ==하이라이트== 처리
- 읽는 사람이 설교를 직접 들은 것처럼 느끼는 정리노트 스타일

### 메타 정보 추출
- 설교 제목, 설교자, 교회명 (영상 + 웹서칭으로 정확 판단)
- 성경 본문, 예배 종류, 날짜, 핵심 태그 5~8개

### 내보내기 (3가지)
- **Markdown** — Obsidian 호환 frontmatter 포함
- **PDF** — A4 포맷
- **이미지** — PNG 고해상도 캡처
- **클립보드 복사** — Markdown 형식

### UI/UX
- 🎨 Glass-morphism 디자인 + Ambient 배경 오브
- 🌙 다크/라이트 모드 (Tailwind CSS class 기반)
- 📱 완전 반응형 (모바일~데스크탑)
- ✨ AOS 스크롤 애니메이션

---

## 🛠 기술 스택

| 분류 | 라이브러리 | 용도 |
|------|-----------|------|
| CSS | **Tailwind CSS** (CDN) | 유틸리티 퍼스트 스타일링 |
| 아이콘 | **Lucide Icons** | 모던 SVG 아이콘 |
| 애니메이션 | **AOS** | 스크롤 진입 애니메이션 |
| 폰트 | **Pretendard** + **Noto Serif KR** | 한글 타이포그래피 |
| PDF | **html2pdf.js** | PDF 내보내기 |
| 이미지 | **html2canvas** | PNG 내보내기 |
| AI | **Google Gemini API** (google_search 포함) | 영상 분석 + 웹서칭 |

---

## 📂 파일 구조

```
index.html              ← 메인 SPA
css/style.css           ← 커스텀 CSS (glass-morphism, 하이라이트)
js/
  ├── api-config.js     ← Gemini API 키 관리
  ├── youtube.js        ← URL 파싱 + oEmbed
  ├── llm-provider.js   ← Gemini API 호출 (google_search 도구)
  ├── analyzer.js       ← 설교 분석 프롬프트 엔진
  ├── renderer.js       ← 결과 렌더링 + 내보내기
  └── app.js            ← 메인 컨트롤러
reference/              ← 분석 결과 MD 참고 파일
```

---

## 🚀 사용 방법

1. 상단 **⚙️ API 설정** 클릭 → Gemini API 키 입력 → 모델 선택 → 저장
2. YouTube 설교 영상 URL 붙여넣기
3. **분석 시작** 클릭 (1~3분 소요)
4. 결과 확인 → MD / PDF / 이미지로 내보내기

---

## ⚠️ 제한사항

- **Gemini API 전용** (OpenAI 미지원)
- 매우 긴 설교(2시간+)는 일부 내용 누락 가능
- API 키는 사용자가 직접 발급 필요

---

*© 2026 설교 분석기 — Gemini AI 기반 설교 요약·분석 도구*
