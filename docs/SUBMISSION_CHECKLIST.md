# 과제 제출 체크리스트

실제 확인된 항목만 완료 표시합니다. 최신 운영 점검일: **2026-09-24**. 상세 실행 결과는 [TEST_REPORT.md](TEST_REPORT.md)에 기록했습니다.

## 1. 배포된 웹 서비스

- [x] Vercel 프로젝트에서 GitHub 저장소와 `main` 배포 연결 확인
- [x] Production 배포와 URL 확인: https://cody-test-mu.vercel.app/
- [x] `GET /api/consult` health check에서 `{"status":"ok","service":"ax-diagnosis"}` 응답 확인
- [x] Services / Process / AI Diagnosis / FAQ 메뉴 이동 확인
- [x] 빈 입력과 10자 미만 입력 안내 확인
- [x] OpenAI 오류 때 사용자용 일반 오류 문구 확인
- [ ] 유효한 OpenAI API 키로 AI 진단 성공 확인 — 현재 운영 호출은 `401 invalid_api_key`로 실패
- [ ] 데스크톱 1440px에서 실제 화면 확인
- [ ] 모바일 390px에서 실제 화면과 메뉴 확인
- [ ] 타임아웃 안내를 실제 지연 조건에서 확인

## 2. GitHub 저장소와 코드

- [x] GitHub 저장소 생성 및 `main` 브랜치에 코드 업로드
- [x] 프론트엔드 파일 분리: `index.html`, `css/styles.css`, `js/app.js`
- [x] 백엔드 파일 분리: `api/consult.py`
- [x] `requirements.txt` 포함
- [x] `.env.example` 포함
- [x] 커밋 이력 존재
- [x] `.gitignore`에서 `.env`, `.env.*`, `.vercel`, `__pycache__`, `*.py[cod]` 제외 확인
- [x] API key가 서버 환경 변수로 전달되는 흐름 확인
- [ ] Vercel에 등록된 현재 API key의 유효성 확인 — 요청이 인증 거부됨. 새 값을 저장한 후 다시 검증

## 3. README와 서비스 기획서

- [x] 서비스 소개와 주요 기능
- [x] AI 요청·응답 흐름
- [x] 기술 스택과 실제 프로젝트 구조
- [x] 정적 화면 실행과 Vercel 로컬 실행 안내
- [x] 배포 URL 및 환경 변수 설정법
- [x] 서비스 목적, 타겟, 섹션·메뉴, AI 입력·출력·실패 처리, 범위

## 4. 테스트와 제출 증빙

- [x] 운영 테스트 결과를 `docs/TEST_REPORT.md`에 기록
- [x] 정보 구조와 AI 요청 흐름을 `docs/WIREFRAME.md`에 기록
- [ ] 데스크톱 스크린샷 저장 (`docs/evidence/desktop.png`)
- [ ] 모바일 스크린샷 저장 (`docs/evidence/mobile.png`)
- [ ] AI 입력 스크린샷 저장 (`docs/evidence/ai-input.png`)
- [ ] AI 결과 스크린샷 저장 (`docs/evidence/ai-result.png`) — 유효한 키로 성공 결과 확인 후 캡처
- [ ] ChatGPT/Codex 개발 과정의 실제 대화 로그 또는 스크린샷 추가

스크린샷 파일을 만들지 못한 상태에서는 완료 표시하지 않으며, AI 결과 캡처는 실제 결과가 준비된 뒤에만 추가합니다.
