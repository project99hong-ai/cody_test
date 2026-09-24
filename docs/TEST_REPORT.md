# AX Ground Test Report

## 테스트 환경

- Production URL: https://cody-test-mu.vercel.app/
- Browser: Google Chrome 153 on Windows 10 (production request User-Agent)
- Test date: 2026-09-24 (Asia/Seoul)
- Test target: Vercel production deployment and local Python syntax/security checks

## 기능 테스트

| 항목 | 테스트 내용 | 결과 |
|---|---|---|
| Home 로딩 | 배포 사이트 첫 화면과 주요 섹션이 표시되는지 확인 | PASS |
| 메뉴 이동 | Services, Process, AI Diagnosis, FAQ 메뉴 클릭 후 각 섹션 hash 이동 확인 | PASS |
| Health check | `GET /api/consult`가 `{"status":"ok","service":"ax-diagnosis"}` 반환 | PASS |
| AI 정상 입력 | 필수 항목과 10자 이상 고민을 입력해 실제 진단 결과 확인 | FAIL — UI에 오류가 표시됨 |
| 빈 입력 | 입력 없이 제출해 필수 항목 안내 확인 | PASS |
| 짧은 입력 | 10자 미만 고민에 길이 안내가 표시되는지 확인 | PASS |
| OpenAI API 오류 | 유효 형식 입력 후 인증 오류에서 일반 사용자 안내가 표시되는지 확인 | PASS — 오류 안내 처리만 확인 |
| Timeout | 실제 지연을 유도해 브라우저 제한 시간 메시지 확인 | NOT RUN |

## AI 진단 실패 분석

유효한 형식의 입력으로 Production 진단을 실행했을 때 OpenAI API가 `401 invalid_api_key`를 반환했고 서비스는 `502`로 응답했습니다. 사용 화면에는 `AI 진단 중 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.`가 표시됐습니다. 이 결과는 입력 검증이나 JSON Schema 성공 결과가 아니라 OpenAI 자격 증명 인증 실패입니다.

Vercel 프로젝트에 키 변수는 설정되어 실제 OpenAI 요청까지 전달된 것으로 확인되지만, 현재 값은 공급자 인증을 통과하지 못했습니다. 유효한 키로 교체한 뒤 성공 결과와 4개 출력 필드를 다시 테스트해야 합니다. 키 값은 보고서에 기록하지 않습니다.

## 반응형 테스트

| 대상 | 테스트 내용 | 결과 |
|---|---|---|
| Desktop 1440px | 지정 너비에서 화면 배치와 메뉴를 실제 확인 | NOT RUN |
| Mobile 390px | 지정 너비에서 화면과 모바일 메뉴를 실제 확인 | NOT RUN |

브라우저 화면은 육안으로 확인했으나 지정된 1440px/390px 뷰포트 검증과 저장 가능한 캡처 파일은 준비되지 않았습니다. CSS의 미디어 쿼리 존재만으로 반응형 동작을 PASS 처리하지 않았습니다.

## 로컬 코드 점검

| 점검 | 결과 |
|---|---|
| `api/consult.py` Python 문법 (`py_compile`) | PASS |
| 오류 메시지의 원문·부분 마스킹 API 키 패턴 정화 테스트 | PASS — 예시 문자열을 사용한 로컬 검사 |

## 미해결 항목

- Vercel `OPENAI_API_KEY`를 유효한 값으로 교체한 뒤 Production AI 진단 정상 결과 확인
- 1440px 데스크톱과 390px 모바일 실제 화면 검증 및 캡처
- 성공 결과 화면과 AI 코딩 도구 과정 캡처 추가
- Timeout 동작을 실제 지연 조건에서 확인
