# Claude Code MCP 연동 가이드: GitHub, Slack, DB를 AI와 연결하기

> Claude Code가 내 도구들과 직접 대화하게 만드는 법 — Model Context Protocol 완전 입문.

---

## MCP란 무엇인가?

**MCP(Model Context Protocol)**는 Anthropic이 설계한 개방형 표준 프로토콜로, AI 모델이 외부 도구·서비스·데이터 소스와 표준화된 방식으로 통신할 수 있게 해줍니다.

쉽게 말하면 **AI를 위한 USB 포트** 같은 개념입니다. 어떤 장치든 USB 규격만 맞으면 연결되듯, MCP 규격을 따르는 서비스라면 Claude Code에 바로 연결할 수 있습니다.

```
기존 방식:
  개발자 → Claude에게 코드 복사·붙여넣기 → Claude가 답변 → 개발자가 직접 적용

MCP 연동 후:
  개발자 → "GitHub 이슈 #42 해결해줘"
  Claude → GitHub에서 이슈 직접 조회 → 코드 수정 → PR 생성까지 자동
```

### MCP 서버 vs MCP 클라이언트

| 역할 | 설명 | 예시 |
|------|------|------|
| **MCP 서버** | 외부 서비스 기능을 Claude에게 노출하는 프로그램 | GitHub MCP 서버, Slack MCP 서버 |
| **MCP 클라이언트** | MCP 서버에 연결해 기능을 사용하는 주체 | Claude Code |

---

## 연동 방식 개요

Claude Code에 MCP 서버를 등록하는 방법은 크게 두 가지입니다.

```bash
# 1. CLI로 직접 추가
claude mcp add <서버이름> <실행명령> [인수...]

# 2. 설정 파일 직접 편집
# 위치: ~/.claude/claude_desktop_config.json (전역)
# 또는: 프로젝트 루트/.claude/config.json (프로젝트 한정)
```

등록된 서버 목록 확인:
```bash
claude mcp list
```

특정 서버 상세 확인:
```bash
claude mcp get <서버이름>
```

서버 제거:
```bash
claude mcp remove <서버이름>
```

---

## GitHub 연동

### 사전 준비

GitHub Personal Access Token(PAT)이 필요합니다.

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. **Generate new token** 클릭
3. 필요한 권한 선택:
   - `repo` — 저장소 읽기/쓰기
   - `issues` — 이슈 관리
   - `pull_requests` — PR 관리
4. 토큰 복사 (`ghp_...` 형태)

### 설치 및 등록

```bash
# npx로 바로 실행 (별도 설치 불필요)
claude mcp add github \
  -e GITHUB_PERSONAL_ACCESS_TOKEN=ghp_여기에_토큰_입력 \
  -- npx -y @modelcontextprotocol/server-github
```

Windows PowerShell에서는 줄바꿈 없이 한 줄로 입력합니다:

```powershell
claude mcp add github -e GITHUB_PERSONAL_ACCESS_TOKEN=ghp_여기에_토큰_입력 -- npx -y @modelcontextprotocol/server-github
```

### 사용 예시

```
> 내 저장소 목록 보여줘

> anthropic/claude-code 저장소에서 열린 이슈 10개 가져와줘

> 현재 브랜치의 변경사항으로 PR 초안 만들어줘, 제목은 "feat: 로그인 기능 추가"

> issue #23의 내용을 읽고 해결책을 코드로 작성해줘
```

---

## Slack 연동

### 사전 준비

Slack Bot Token이 필요합니다.

1. [api.slack.com/apps](https://api.slack.com/apps) → **Create New App** → **From scratch**
2. 앱 이름 입력, 워크스페이스 선택
3. **OAuth & Permissions** → **Bot Token Scopes** 추가:
   - `channels:read` — 채널 목록 조회
   - `chat:write` — 메시지 전송
   - `channels:history` — 채널 메시지 읽기
   - `users:read` — 사용자 정보 조회
4. **Install to Workspace** → Bot User OAuth Token 복사 (`xoxb-...` 형태)

### 설치 및 등록

```bash
claude mcp add slack \
  -e SLACK_BOT_TOKEN=xoxb_여기에_토큰_입력 \
  -e SLACK_TEAM_ID=T여기에_팀ID_입력 \
  -- npx -y @modelcontextprotocol/server-slack
```

팀 ID는 Slack 워크스페이스 URL에서 확인할 수 있습니다: `https://app.slack.com/client/T여기가팀ID/...`

### 사용 예시

```
> #general 채널의 오늘 메시지 요약해줘

> 배포 완료됐다고 #dev-ops 채널에 알려줘

> @김개발 님이 오늘 언급한 버그 이슈 내용 찾아줘
```

---

## 데이터베이스 연동 (PostgreSQL)

### 사전 준비

PostgreSQL 접속 정보가 필요합니다. 로컬 개발 DB 또는 읽기 전용 복제본 사용을 권장합니다.

### 설치 및 등록

```bash
claude mcp add postgres \
  -- npx -y @modelcontextprotocol/server-postgres \
  "postgresql://사용자명:비밀번호@호스트:5432/데이터베이스명"
```

### 사용 예시

```
> users 테이블 스키마 보여줘

> 지난 7일간 가입한 사용자 수 조회해줘

> 이 쿼리 성능 문제가 있는지 분석해줘:
  SELECT * FROM orders WHERE created_at > '2024-01-01'
```

> ⚠️ **주의:** 프로덕션 DB에 직접 연결할 경우 Claude가 데이터를 수정할 수 있습니다. 반드시 읽기 전용 계정을 사용하거나 테스트 DB를 연결하세요.

---

## 파일 시스템 연동

로컬 파일·디렉터리를 Claude가 직접 읽고 쓸 수 있도록 합니다. 특정 경로만 허용 범위로 지정할 수 있어 안전하게 사용할 수 있습니다.

```bash
claude mcp add filesystem \
  -- npx -y @modelcontextprotocol/server-filesystem \
  /Users/나의사용자명/Documents \
  /Users/나의사용자명/projects
```

여러 경로를 공백으로 구분해 나열하면 해당 경로들만 접근을 허용합니다.

### 사용 예시

```
> ~/Documents/회의록 폴더에서 이번 달 파일들 요약해줘

> ~/projects/my-app 안에 TODO로 주석 달린 코드 전부 찾아줘
```

---

## 설정 파일로 한 번에 관리하기

여러 MCP 서버를 쓴다면 설정 파일로 한꺼번에 관리하는 것이 편합니다. 전역 설정 파일을 직접 편집하세요.

**파일 위치:**
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- macOS / Linux: `~/.claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_여기에_토큰"
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb_여기에_토큰",
        "SLACK_TEAM_ID": "T여기에_팀ID"
      }
    },
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://사용자명:비밀번호@localhost:5432/mydb"
      ]
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:\\Users\\나의사용자명\\Documents"
      ]
    }
  }
}
```

설정 파일 수정 후에는 Claude Code를 재시작해야 변경사항이 반영됩니다.

---

## 실전 활용 시나리오

MCP 서버들을 조합하면 단일 대화 흐름 안에서 복잡한 작업을 처리할 수 있습니다.

### 시나리오 1: 이슈 → 코드 수정 → PR 자동화

```
> GitHub issue #55 내용 읽고 버그 수정한 다음 PR 올려줘
```

1. GitHub MCP → 이슈 #55 내용 조회
2. 파일 시스템 → 관련 코드 탐색 및 수정
3. GitHub MCP → 브랜치 생성 + 커밋 + PR 생성

### 시나리오 2: 배포 후 알림

```
> 빌드 성공하면 #deploy 채널에 배포 완료 메시지 보내줘. 
  변경된 파일 목록도 같이 포함해줘.
```

1. 파일 시스템 → 변경 파일 목록 수집
2. Slack MCP → 채널에 메시지 전송

### 시나리오 3: DB 데이터 기반 리포트

```
> 이번 달 신규 가입자 수와 주문 현황을 DB에서 조회해서 
  마크다운 리포트로 만들어줘
```

1. PostgreSQL MCP → 데이터 조회
2. 파일 시스템 → 리포트 파일 생성

---

## 보안 주의사항

MCP 연동은 강력한 만큼 주의가 필요합니다.

**토큰·비밀번호 관리**
- 설정 파일에 토큰을 평문으로 저장할 경우, 해당 파일이 git에 올라가지 않도록 `.gitignore`에 추가하세요.
- 가능하면 환경 변수나 비밀 관리 도구(1Password, Vault 등)를 활용하세요.

**최소 권한 원칙**
- GitHub PAT는 꼭 필요한 스코프만 선택하세요.
- DB는 읽기 전용 계정으로 연결하는 것을 기본으로 삼으세요.

**프로덕션 환경 분리**
- 개발 단계에서는 항상 개발·스테이징 환경 기준으로 연결하세요.
- 프로덕션 서비스에 직접 연결된 MCP 서버에서 Claude에게 쓰기 작업을 허용할 때는 반드시 내용을 확인하고 허가하세요.

---

## 다음 단계

MCP 연동에 익숙해졌다면 다음 주제로 이어가 보세요.

- **커스텀 MCP 서버 만들기** — 사내 시스템, 독자적인 API를 직접 MCP 서버로 래핑하기
- **멀티 에이전트 워크플로우** — 여러 Claude 인스턴스가 MCP 서버를 공유하며 병렬 작업하기
- **CI/CD 통합** — GitHub Actions에서 MCP 서버를 활용한 자동화 파이프라인 구성

---

## 마치며

MCP는 Claude Code를 단순한 코드 도우미에서 **실제 업무 환경에 통합된 AI 동료**로 바꿔주는 핵심 기능입니다. 처음에는 파일 시스템이나 GitHub 하나만 연결해보고, 점차 익숙해지면 Slack, DB 등으로 범위를 넓혀가는 방식을 권장합니다.

---

*참고: MCP 생태계는 빠르게 성장 중입니다. 공식 서버 목록과 커뮤니티 서버는 [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)에서 확인하세요.*
