# Claude Code 멀티 에이전트 워크플로우: 혼자보다 함께가 강하다

> 하나의 Claude로 부족할 때 — 여러 에이전트가 협력하는 AI 팀을 구성하는 법.

---

## 멀티 에이전트란?

지금까지는 Claude Code 하나와 대화하며 작업을 처리했습니다. 그런데 프로젝트가 커지면 단일 에이전트 방식의 한계가 드러납니다.

- 컨텍스트 윈도우가 넘칠 만큼 작업 범위가 넓다
- 서로 독립적인 작업을 순서대로 처리하느라 시간이 오래 걸린다
- 한 에이전트가 작성한 코드를 다른 시각으로 검토할 수 없다

**멀티 에이전트 워크플로우**는 이 문제를 해결합니다. 여러 Claude 인스턴스를 역할에 따라 분리하고, 서로 협력하게 만드는 방식입니다.

```
단일 에이전트:
  Claude ──────────────────────────── 모든 작업 순차 처리

멀티 에이전트:
  오케스트레이터 Claude
    ├── 서브에이전트 A (프론트엔드 담당)
    ├── 서브에이전트 B (백엔드 담당)
    └── 서브에이전트 C (테스트 담당)
                ↓
        결과 취합 → 오케스트레이터가 통합
```

---

## 핵심 개념: 오케스트레이터와 서브에이전트

### 오케스트레이터 (Orchestrator)

전체 작업을 계획하고 서브에이전트에게 작업을 분배하는 **관리자 역할**입니다.

- 큰 작업을 잘게 쪼개 각 에이전트에게 할당
- 각 에이전트의 결과물을 수집하고 통합
- 작업 간 의존성과 순서를 조율

### 서브에이전트 (Subagent)

오케스트레이터로부터 명확한 지시를 받아 **전문 작업을 수행하는 역할**입니다.

- 주어진 범위 안에서만 집중해 작업
- 결과를 오케스트레이터에게 반환
- 독립적으로 MCP 서버에 접근 가능

---

## Claude Code에서 멀티 에이전트 구현하기

### 방법 1: `--print` 플래그와 서브프로세스 활용

가장 간단한 방법은 쉘 스크립트에서 여러 `claude` 프로세스를 병렬로 실행하는 것입니다.

```bash
#!/bin/bash
# multi_agent.sh

echo "=== 병렬 작업 시작 ==="

# 세 에이전트를 동시에 실행
claude --print "src/components 디렉터리의 모든 컴포넌트에 JSDoc 주석 추가해줘" &
PID_A=$!

claude --print "src/api 디렉터리의 모든 엔드포인트에 에러 핸들링 추가해줘" &
PID_B=$!

claude --print "tests 디렉터리의 커버리지가 낮은 파일 목록 분석해줘" &
PID_C=$!

# 모든 작업 완료 대기
wait $PID_A $PID_B $PID_C

echo "=== 모든 에이전트 작업 완료 ==="
```

```bash
chmod +x multi_agent.sh
./multi_agent.sh
```

### 방법 2: `claude -p` 로 오케스트레이터 구성

오케스트레이터 역할의 Claude가 서브에이전트를 직접 호출하도록 지시할 수 있습니다.

```bash
claude -p "
너는 오케스트레이터야. 다음 작업을 서브에이전트들에게 분배해서 처리해줘.

작업: 이 프로젝트를 전면 리팩터링
  1. 첫 번째 에이전트: TypeScript 타입 오류 전부 수정
  2. 두 번째 에이전트: ESLint 규칙 위반 전부 수정
  3. 세 번째 에이전트: 중복 코드 제거 및 공통 유틸 함수 추출

각 작업은 독립적이므로 병렬로 처리해도 좋아.
완료 후 각 에이전트가 수정한 파일 목록을 요약해줘.
"
```

### 방법 3: CLAUDE.md로 에이전트 역할 고정

프로젝트 내에 역할별 `CLAUDE.md`를 두고 서브디렉터리 단위로 에이전트를 분리합니다.

```
my-project/
├── CLAUDE.md              ← 오케스트레이터용 전체 지침
├── frontend/
│   └── CLAUDE.md          ← 프론트엔드 에이전트 전용 규칙
├── backend/
│   └── CLAUDE.md          ← 백엔드 에이전트 전용 규칙
└── infra/
    └── CLAUDE.md          ← 인프라 에이전트 전용 규칙
```

**`frontend/CLAUDE.md` 예시:**
```markdown
## 역할
너는 프론트엔드 전문 에이전트야.
React, TypeScript, Tailwind CSS만 사용해.
백엔드 코드나 인프라 파일은 절대 수정하지 마.

## 담당 범위
- src/components/**
- src/pages/**
- src/hooks/**
```

각 디렉터리 안에서 `claude`를 실행하면 해당 `CLAUDE.md`가 자동으로 적용됩니다.

```bash
# 프론트엔드 에이전트 실행
cd frontend && claude "로그인 폼 컴포넌트 만들어줘" &

# 백엔드 에이전트 실행
cd ../backend && claude "로그인 API 엔드포인트 만들어줘" &
```

---

## 실전 시나리오

### 시나리오 1: 대규모 코드 리뷰

1,000개 이상의 파일을 가진 프로젝트를 혼자 검토하면 컨텍스트 한계에 걸립니다. 파일을 구역별로 나눠 동시에 리뷰합니다.

```bash
#!/bin/bash
# parallel_review.sh

# 모듈별 병렬 리뷰
claude --print "src/auth 모듈 보안 취약점 검토해줘. 발견된 문제를 목록으로 정리해줘." \
  > review_auth.md &

claude --print "src/payment 모듈 보안 취약점 검토해줘. 발견된 문제를 목록으로 정리해줘." \
  > review_payment.md &

claude --print "src/user 모듈 보안 취약점 검토해줘. 발견된 문제를 목록으로 정리해줘." \
  > review_user.md &

wait

# 오케스트레이터가 결과 통합
claude --print "
review_auth.md, review_payment.md, review_user.md 파일을 읽고
전체 보안 리뷰 최종 보고서를 작성해줘.
심각도 순으로 정렬하고, 공통으로 발견된 패턴도 분석해줘.
" > final_security_report.md

echo "보안 리뷰 완료: final_security_report.md"
```

### 시나리오 2: 기능 브랜치 병렬 개발

프론트엔드와 백엔드를 동시에 개발하고, 완료 후 통합 테스트를 실행합니다.

```bash
#!/bin/bash
# parallel_dev.sh

FEATURE="사용자 프로필 편집 기능"

echo "[$FEATURE] 개발 시작"

# 프론트엔드 에이전트
(cd frontend && claude --print "
$FEATURE 구현해줘.
- ProfileEditForm 컴포넌트 생성
- useProfileEdit 커스텀 훅 작성
- /api/profile PUT 엔드포인트와 연동
") > fe_result.txt &

# 백엔드 에이전트
(cd backend && claude --print "
$FEATURE의 API 구현해줘.
- PUT /api/profile 엔드포인트 추가
- 입력값 유효성 검증 포함
- 변경 이력 DB에 저장
") > be_result.txt &

wait
echo "FE/BE 개발 완료"

# 통합 에이전트
claude --print "
fe_result.txt와 be_result.txt를 읽어서
프론트엔드와 백엔드가 올바르게 연동되는지 확인해줘.
API 요청/응답 형식이 일치하는지 특히 꼼꼼히 봐줘.
불일치가 있으면 수정 방안을 제시해줘.
" > integration_check.txt

cat integration_check.txt
```

### 시나리오 3: 검토자 에이전트 패턴

작성자 에이전트와 검토자 에이전트를 분리해 코드 품질을 높입니다.

```bash
#!/bin/bash
# writer_reviewer.sh

# 1단계: 작성자 에이전트가 코드 작성
echo "작성자 에이전트 실행 중..."
claude --print "
결제 모듈의 환불 처리 함수를 작성해줘.
다음 케이스를 모두 처리해야 해:
- 전액 환불
- 부분 환불
- 이미 환불된 건 재환불 방지
결과 코드만 출력해줘.
" > refund_draft.py

# 2단계: 검토자 에이전트가 독립적으로 검토
echo "검토자 에이전트 실행 중..."
claude --print "
refund_draft.py 파일을 읽고 다음 관점에서 검토해줘:
1. 엣지 케이스 누락 여부
2. 보안 취약점
3. 성능 문제
4. 코딩 컨벤션 위반

각 항목별로 심각도(높음/중간/낮음)를 표시하고
수정이 필요한 부분은 수정 코드도 제시해줘.
" > refund_review.md

echo "검토 완료. refund_review.md 확인하세요."
```

---

## 에이전트 간 통신 패턴

에이전트들이 서로 결과를 주고받는 방식은 크게 세 가지입니다.

### 파일 기반 통신 (권장)

가장 단순하고 안정적입니다. 한 에이전트의 출력을 파일로 저장하고, 다음 에이전트가 그 파일을 읽습니다.

```bash
# 에이전트 A의 출력
claude --print "분석 결과 작성해줘" > analysis.md

# 에이전트 B가 에이전트 A의 결과를 읽어 처리
claude --print "analysis.md를 바탕으로 개선 계획 세워줘" > plan.md
```

### 파이프 기반 통신

출력을 즉시 다음 에이전트의 입력으로 전달합니다. 중간 파일이 필요 없어 빠릅니다.

```bash
claude --print "이 코드의 문제점을 한 줄씩 나열해줘" \
  | claude --print "다음 문제 목록을 심각도 순으로 정렬하고 각 해결책을 붙여줘"
```

### 공유 컨텍스트 파일 기반 통신

여러 에이전트가 하나의 공유 상태 파일을 읽고 업데이트하며 협력합니다.

```bash
# shared_state.json 초기화
echo '{"status": "started", "completed_tasks": [], "issues": []}' > shared_state.json

# 각 에이전트가 완료 시 상태 업데이트
claude --print "
작업 완료 후 shared_state.json의 completed_tasks 배열에
'frontend_components' 항목 추가해줘.
"
```

---

## 주의사항과 모범 사례

### 충돌 방지: 작업 범위를 명확히 분리

여러 에이전트가 같은 파일을 동시에 수정하면 충돌이 발생합니다.

```bash
# ❌ 위험: 두 에이전트가 같은 파일 수정 가능
claude --print "utils.ts 리팩터링해줘" &
claude --print "utils.ts 타입 추가해줘" &

# ✅ 안전: 담당 파일 범위를 명확히 분리
claude --print "utils/string.ts만 리팩터링해줘" &
claude --print "utils/date.ts만 타입 추가해줘" &
```

### 컨텍스트는 명시적으로 전달

각 에이전트는 독립적인 인스턴스라 이전 에이전트의 대화 내용을 모릅니다. 필요한 정보는 반드시 명시적으로 넘겨주세요.

```bash
# ❌ 나쁜 예: 컨텍스트 없이 지시
claude --print "아까 말한 방식으로 수정해줘"

# ✅ 좋은 예: 필요한 컨텍스트를 파일 또는 인수로 명시
claude --print "
다음 코딩 규칙을 따라서 src/auth.ts를 수정해줘:
- 함수형 스타일 사용
- 에러는 Result 타입으로 반환
- 로그는 winston 라이브러리 사용
"
```

### 비용 관리

에이전트를 병렬로 많이 띄울수록 API 사용량이 선형으로 증가합니다. 계정 인증(claude.ai 구독) 방식은 플랜별 사용 한도 내에서 운용되므로 작업 규모에 맞게 에이전트 수를 조절하세요.

---

## 다음 단계

멀티 에이전트에 익숙해졌다면 다음 주제로 이어가 보세요.

- **CI/CD 파이프라인 통합** — GitHub Actions에서 멀티 에이전트 워크플로우 자동 실행
- **커스텀 오케스트레이션 프레임워크** — Python이나 Node.js로 에이전트 조율 로직을 코드로 관리
- **에이전트별 MCP 서버 분리** — 각 에이전트에게 필요한 도구만 선택적으로 제공

---

## 마치며

멀티 에이전트 워크플로우는 Claude Code를 **개인 도구**에서 **팀 규모의 자동화 시스템**으로 격상시킵니다. 처음에는 작성자–검토자 패턴처럼 단순한 2에이전트 구조부터 시작해보세요. 작업이 빨라지고 품질이 올라가는 경험을 한 번 맛보면, 자연스럽게 더 정교한 워크플로우로 발전시키게 될 것입니다.

---

*참고: 멀티 에이전트 기능은 Claude Code의 발전 속도에 맞춰 계속 개선되고 있습니다. 최신 패턴과 예제는 [공식 문서](https://docs.anthropic.com/ko/docs/claude-code)를 함께 참고하세요.*
