# AX Ground

AX Ground는 AI 교육, 업무 자동화, AX 전략·PoC를 통해 기업의 업무 전환을 돕는 컨설팅 서비스 웹사이트입니다. 핵심 기능인 **3분 AX 간이진단**에서 조직 상황과 업무 고민을 입력하면 AI가 우선순위와 첫 실행안을 제안합니다.

## 주요 기능

- AI 교육, 업무 자동화, AX 전략·PoC를 소개하는 컨설팅 랜딩 페이지
- 회사 규모, 담당 역할, AX 목표, AI 활용 수준, 업무 고민을 받는 AI 간이진단
- 결과의 현재 상태, 최우선 과제, 2주 액션, 추천 상담 영역 표시
- Home, Services, Process, AI Diagnosis, FAQ 섹션으로 이동하는 메뉴
- 데스크톱·태블릿·모바일 반응형 UI
- 스크롤 진행률, IntersectionObserver reveal, parallax, 오비트·floating card, counter, hover 모션
- 필수 입력·짧은 입력 안내, API 오류 안내, 브라우저 요청 시간 제한
- `prefers-reduced-motion` 및 키보드 포커스 대응

## AI 기능 흐름

```text
사용자 입력
  → JavaScript fetch('/api/consult')
  → Vercel Python Serverless Function
  → OpenAI Responses API (Structured Outputs / JSON Schema)
  → summary, priority, action, recommendation JSON 응답
  → JavaScript가 결과 화면에 렌더링
```

GET `/api/consult`는 `{"status":"ok","service":"ax-diagnosis"}` 상태 확인 응답을 반환합니다.

## 기술 스택

- Frontend: HTML5, CSS3, Vanilla JavaScript
- Backend: Python, Vercel Functions
- AI: OpenAI Responses API
- Deployment: GitHub, Vercel

## 프로젝트 구조

```text
.
├── index.html
├── css/styles.css
├── js/app.js
├── api/consult.py
├── docs/
│   ├── SERVICE_PLAN.md
│   ├── SUBMISSION_CHECKLIST.md
│   ├── TEST_REPORT.md
│   ├── WIREFRAME.md
│   ├── EVIDENCE.md
│   └── evidence/README.md
├── .env.example
├── .gitignore
├── requirements.txt
└── vercel.json
```

## 실행 방법

### 정적 화면만 확인

저장소 루트에서 아래 명령을 실행하고 `http://localhost:8000`을 엽니다. 이 방법은 정적 화면만 제공하며 Python API를 실행하지 않습니다.

```bash
python -m http.server 8000
```

### API를 포함해 로컬 실행

Node.js/npm과 Vercel CLI가 필요합니다. Vercel 프로젝트 연결과 환경 변수 설정 후 실행합니다.

```bash
npm install --global vercel
vercel dev
```

`vercel dev`에 사용할 실제 비밀 값은 로컬의 무시 대상 `.env.local` 또는 Vercel 환경 변수에 설정합니다. `.env.local`은 커밋하지 마세요.

## 환경 변수

Vercel 프로젝트의 **Settings → Environment Variables**에 다음 변수를 설정합니다.

```text
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-5-mini
```

- `OPENAI_API_KEY`: 필수. 실제 키 값은 코드, README, 스크린샷, 로그, 커밋에 넣지 않습니다.
- `OPENAI_MODEL`: 선택. 지정하지 않거나 빈 값이면 `gpt-5-mini`를 사용합니다.
- `.env`, `.env.*` 파일은 Git에서 제외되며 `.env.example`만 예외로 추적합니다.

## 배포

1. GitHub 저장소 `project99hong-ai/cody_test`를 Vercel에 연결합니다.
2. Framework Preset을 `Other`로 설정합니다.
3. Production 환경에 필요한 환경 변수를 등록합니다.
4. `main` 브랜치 배포가 완료되면 서비스와 `/api/consult`를 확인합니다.

**배포 URL:** [https://cody-test-mu.vercel.app/](https://cody-test-mu.vercel.app/)

## 입력 검증과 오류 처리

- 필수 입력 누락 또는 형식 오류: 안내와 함께 요청을 보내지 않거나 서버에서 `400`으로 응답합니다.
- 업무 고민 10자 미만: 입력 안내를 표시합니다.
- `OPENAI_API_KEY` 미설정: 서버가 `503` 설정 오류를 반환합니다.
- OpenAI 호출/응답 오류: Vercel 로그에 비밀 값을 정화한 원인을 남기고 사용자에게 `AI 진단 중 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.`를 표시합니다.
- OpenAI 클라이언트 제한 시간: 15초. 브라우저 요청 제한 시간: 20초.

## 제출 자료

- 서비스 기획서: [docs/SERVICE_PLAN.md](docs/SERVICE_PLAN.md)
- 제출 체크리스트: [docs/SUBMISSION_CHECKLIST.md](docs/SUBMISSION_CHECKLIST.md)
- 실제 운영 테스트: [docs/TEST_REPORT.md](docs/TEST_REPORT.md)
- 정보 구조: [docs/WIREFRAME.md](docs/WIREFRAME.md)
- 증빙 색인과 캡처 안내: [docs/EVIDENCE.md](docs/EVIDENCE.md), [docs/evidence/README.md](docs/evidence/README.md)

운영 AI 진단의 마지막 정상 응답 검증은 유효한 Vercel `OPENAI_API_KEY` 설정 후 진행해야 합니다. 현재 확인된 테스트 결과는 테스트 보고서에 구분해 기록했습니다.
