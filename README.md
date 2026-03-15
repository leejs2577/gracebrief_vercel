# 📖 설교 분석기 — Sermon Analyzer

YouTube 설교 영상을 Gemini AI가 직접 시청·분석하여 **요약, 내용 정리, 결론 및 묵상 포인트**를 자동 생성하는 웹 앱입니다.

---

## ✅ 주요 기능

### 핵심 기능
- **YouTube URL 입력** → 영상 정보 자동 추출 (oEmbed API)
- **Gemini AI 영상 직접 분석** — 자막 추출 없이 Gemini가 YouTube 영상을 직접 시청·음성 분석
- **3단 구조 분석 결과**:
  1. 📌 설교 전체 요약 (3~5문장, 설명체)
  2. 📋 내용 정리 (영상 길이에 따라 3~8개 섹션, 소제목·부제·핵심 포인트·성경 인용)
  3. 🙏 결론 및 묵상 (핵심 포인트, 묵상 질문 4개, 마무리 말씀)

### 문체 특징
- **설명체 존댓말** — "~합니다/~입니다" 체계, "본 설교는~" 같은 3인칭 서술 금지
- **Bold + 강조색** — 중요 문장은 **bold**, 핵심 선언은 bold + 빨간 글자색 처리
- 읽는 사람이 설교를 직접 들은 것처럼 느끼는 정리노트 스타일

### 메타 정보 추출
- 설교 제목, 설교자, 교회명, 성경 본문, 예배 종류
- YouTube 영상 발행일 자동 추출, 핵심 태그 5~8개

### 내보내기 (3가지)
- **Markdown** — Obsidian 호환 frontmatter 포함
- **이미지** — PNG 고해상도 캡처 (html2canvas)
- **HTML** — 독립 실행 가능한 단일 HTML 파일

### UI/UX
- 🎨 Glass-morphism 디자인 + Ambient 배경 오브
- 🌙 다크/라이트 모드 (Tailwind CSS class 기반)
- 📱 완전 반응형 (모바일~데스크탑)

---

## 🛠 기술 스택

| 분류 | 라이브러리 | 용도 |
|------|-----------|------|
| CSS | **Tailwind CSS** (CDN) | 유틸리티 퍼스트 스타일링 |
| 아이콘 | **Lucide Icons** | 모던 SVG 아이콘 |
| 폰트 | **Pretendard** + **Noto Serif KR** | 한글 타이포그래피 |
| 이미지 | **html2canvas** | PNG 내보내기 |
| AI | **Google Gemini API** | 영상 직접 분석 |

---

## 📂 파일 구조

```
index.html              ← 메인 SPA
css/style.css           ← 커스텀 CSS (glass-morphism, 강조 스타일)
js/
  ├── api-config.js     ← Gemini API 키 관리
  ├── youtube.js        ← URL 파싱 + oEmbed
  ├── llm-provider.js   ← Gemini API 호출
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
4. 결과 확인 → MD / 이미지 / HTML로 내보내기

---

## ⚠️ 제한사항

- **Gemini API 전용** (OpenAI 미지원)
- API 키는 사용자가 직접 발급 필요 ([Google AI Studio](https://aistudio.google.com))
- 매우 긴 설교(2시간+)는 일부 내용 누락 가능

---

*만든이 이종성 ｜ 문의 ljs_whiteman@naver.com*
