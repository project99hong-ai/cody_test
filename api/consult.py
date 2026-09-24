import json
import os
import re
from http.server import BaseHTTPRequestHandler

from openai import OpenAI


DIAGNOSIS_FIELDS = ("summary", "priority", "action", "recommendation")
DIAGNOSIS_SCHEMA = {
    "type": "object",
    "properties": {field: {"type": "string"} for field in DIAGNOSIS_FIELDS},
    "required": list(DIAGNOSIS_FIELDS),
    "additionalProperties": False,
}


def json_response(handler, status, payload):
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Cache-Control", "no-store")
    handler.end_headers()
    handler.wfile.write(body)


def clean(value, limit=700):
    if not isinstance(value, str):
        return ""
    return value.strip()[:limit]


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        return json_response(self, 200, {"status": "ok", "service": "ax-diagnosis"})

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Allow", "GET, POST, OPTIONS")
        self.end_headers()

    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length <= 0 or length > 12000:
                return json_response(self, 400, {"error": "올바른 입력을 보내주세요."})

            try:
                data = json.loads(self.rfile.read(length).decode("utf-8"))
            except (UnicodeDecodeError, json.JSONDecodeError):
                return json_response(self, 400, {"error": "입력 형식을 확인해주세요."})

            if not isinstance(data, dict):
                return json_response(self, 400, {"error": "입력 형식을 확인해주세요."})

            company_size = clean(data.get("companySize"), 60)
            role = clean(data.get("role"), 60)
            goal = clean(data.get("goal"), 100)
            ai_level = clean(data.get("aiLevel"), 100)
            challenge = clean(data.get("challenge"), 700)

            if not all([company_size, role, goal, ai_level, challenge]):
                return json_response(self, 400, {"error": "모든 필수 항목을 입력해주세요."})
            if len(challenge) < 10:
                return json_response(self, 400, {"error": "현재 고민을 10자 이상 입력해주세요."})

            api_key = os.environ.get("OPENAI_API_KEY")
            if not api_key:
                return json_response(self, 503, {"error": "서버에 AI API 키가 아직 설정되지 않았습니다."})

            model = (os.environ.get("OPENAI_MODEL") or "").strip() or "gpt-5-mini"
            prompt = f"""
당신은 기업의 AI/AX 전환을 돕는 실무형 컨설턴트입니다.
사용자가 입력한 정보만을 근거로, 과장 없이 실행 가능한 1차 진단을 작성하세요.
한국어로 답하고, 각 항목은 2~4문장 정도로 구체적이되 간결하게 작성하세요.
확실하지 않은 ROI 숫자나 성과 수치를 지어내지 마세요.

회사 규모: {company_size}
담당 역할: {role}
가장 중요한 목표: {goal}
현재 AI 활용 수준: {ai_level}
현재 고민: {challenge}

아래 JSON 형식만 출력하세요. 마크다운 코드블록은 사용하지 마세요.
{{
  "summary": "현재 상태 요약",
  "priority": "가장 먼저 볼 AX 우선순위",
  "action": "2주 안에 실행할 수 있는 첫 액션",
  "recommendation": "AI 교육 / 업무 자동화 / AX 전략·PoC 중 추천 영역과 이유"
}}
"""

            try:
                client = OpenAI(api_key=api_key, timeout=15.0)
                response = client.responses.create(
                    model=model,
                    input=prompt,
                    text={
                        "format": {
                            "type": "json_schema",
                            "name": "ax_diagnosis",
                            "strict": True,
                            "schema": DIAGNOSIS_SCHEMA,
                        }
                    },
                )
                result = json.loads(response.output_text or "")

                if not isinstance(result, dict) or set(result) != set(DIAGNOSIS_FIELDS):
                    raise ValueError("Unexpected OpenAI response shape")
                if not all(isinstance(result[field], str) and result[field].strip() for field in DIAGNOSIS_FIELDS):
                    raise ValueError("Unexpected OpenAI response shape")

                return json_response(self, 200, {field: result[field].strip() for field in DIAGNOSIS_FIELDS})

            except Exception as error:
                error_message = str(error)
                for sensitive_value in (api_key, model):
                    if sensitive_value:
                        error_message = error_message.replace(sensitive_value, "[REDACTED]")
                # Provider errors may return a partially masked key (for example,
                # ``sk-...****tail``), which won't match the original api_key.
                error_message = re.sub(r"\bsk-[A-Za-z0-9_.*=-]+", "[REDACTED]", error_message)
                print(f"[AX Ground API Error] {type(error).__name__}: {error_message}", flush=True)
                return json_response(self, 502, {"error": "AI 진단 중 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요."})

        except ValueError:
            return json_response(self, 400, {"error": "요청 형식을 확인해주세요."})
        except Exception:
            return json_response(self, 500, {"error": "요청을 처리하지 못했습니다."})
