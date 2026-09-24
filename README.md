# AX Ground — AI 기반 AX 컨설팅 간이상담 웹 서비스

AI 교육, 업무 자동화, AX 전환을 고민하는 기업이 현재 상황을 입력하면 AI가 우선순위와 다음 액션을 정리해주는 반응형 웹 서비스입니다.

## 핵심 기능
- 기업용 AX 컨설팅 랜딩 페이지
- AI 교육 / 업무 자동화 / AX 전략·PoC 서비스 소개
- 스크롤 기반 Reveal / Parallax / Progress 모션
- 모바일·태블릿·데스크톱 반응형 UI
- `/api/consult` Python Vercel Function을 통한 AI 간이진단
- 빈 입력, API 오류, 응답 지연/타임아웃 사용자 안내
- 키보드 포커스, reduced-motion 대응

## 기술 스택
- Frontend: HTML5, CSS3, Vanilla JavaScript
- Backend: Python, Vercel Functions
- AI: OpenAI Responses API
- Deployment: GitHub + Vercel

## 프로젝트 구조
```text
.
├─ index.html
├─ css/styles.css
├─ js/app.js
├─ api/consult.py
├─ docs/SERVICE_PLAN.md
├─ docs/SUBMISSION_CHECKLIST.md
├─ requirements.txt
├─ vercel.json
└─ README.md
```

## 로컬 실행
정적 화면:
```bash
python -m http.server 8000
```
브라우저에서 `http://localhost:8000` 접속.

Vercel Function 포함:
```bash
npm i -g vercel
vercel dev
```

## 환경 변수
Vercel Project Settings → Environment Variables에 등록:
```text
OPENAI_API_KEY=발급받은_API_KEY
OPENAI_MODEL=gpt-5-mini
```
- `OPENAI_API_KEY`는 필수
- `OPENAI_MODEL`은 선택
- 실제 키는 코드/README/스크린샷/커밋에 넣지 않음

## 배포
1. GitHub 저장소를 Vercel에 Import
2. Framework Preset: Other
3. `OPENAI_API_KEY` 등록
4. Deploy
5. 실제 URL에서 메뉴/반응형/AI 기능 확인

**배포 URL:** `TODO: Vercel 배포 후 입력`

## AI 기능 입출력
### 입력
회사 규모 / 담당 역할 / AX 목표 / AI 활용 수준 / 현재 업무 고민

### 출력
현재 상태 / 최우선 과제 / 2주 액션 / 추천 상담 영역

### 실패 처리
- 필수 입력 누락
- API 4xx/5xx
- API 키 미설정
- 20초 이상 응답 지연

## 제출 자료
- 상세 기획: `docs/SERVICE_PLAN.md`
- 제출 확인: `docs/SUBMISSION_CHECKLIST.md`
