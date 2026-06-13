---
title: Claude Code MCP 연동하기
titleTemplate: GitHub, Slack, DB를 AI와 연결하는 법
description: Model Context Protocol(MCP)을 이용해 Claude Code를 GitHub, Slack, PostgreSQL, 로컬 파일 시스템과 연결하는 방법을 정리합니다.
---

# Claude Code MCP 연동하기

::: info 들어가며
Claude Code를 쓰다 보면 매번 이슈 내용을 복사해서 붙여넣거나, DB 조회 결과를 캡처해서 보여주는 식의 반복 작업이 생깁니다. 이런 번거로움을 없애준 게 바로 MCP(Model Context Protocol)였습니다. 이 글에서는 MCP가 무엇인지, 그리고 GitHub·Slack·PostgreSQL·파일 시스템을 Claude Code에 연결하는 방법을 정리합니다.
:::

## MCP란 무엇인가?

**MCP(Model Context Protocol)**는 Anthropic이 설계한 개방형 표준 프로토콜로, AI 모델이 외부 도구·서비스·데이터 소스와 표준화된 방식으로 통신할 수 있게 해줍니다.

처음 개념을 들었을 때는 막연했는데, **AI를 위한 USB 포트** 같은 것이라고 생각하니 이해가 쉬웠습니다. 어떤 장치든 USB 규격만 맞으면 연결되듯, MCP 규격을 따르는 서비스라면 Claude Code에 바로 연결할 수 있습니다.

```
기존 방식:
  개발자 → Claude에게 코드 복사·붙여넣기 → Claude가 답변 → 개발자가 직접 적용

MCP 연동 후:
  개발자 → "GitHub 이슈 #42 해결해줘"
  Claude → GitHub에서 이슈 직접 조회 → 코드 수정 → PR 생성까지 자동
```

### MCP 서버 vs MCP 클라이언트

| 역할             | 설명                                          | 예시                          |
| ---------------- | --------------------------------------------- | ----------------------------- |
| **MCP 서버**     | 외부 서비스 기능을 Claude에게 노출하는 프로그램 | GitHub MCP 서버, Slack MCP 서버 |
| **MCP 클라이언트** | MCP 서버에 연결해 기능을 사용하는 주체         | Claude Code                   |

## 연동 방식 개요

Claude Code에 MCP 서버를 등록하는 방법은 크게 두 가지입니다.

```bash
# 1. CLI로 직접 추가
claude mcp add <서버이름> <실행명령> [인수...]

# 2. 설정 파일 직접 편집
# 위치: ~/.claude/claude_desktop_config.json (전역)
# 또는: 프로젝트 루트/.claude/config.json (프로젝트 한정)
```

등록된 서버 목록은 다음 명령으로 확인합니다.

```bash
# 전체 목록 확인
claude mcp list

# 특정 서버 상세 확인
claude mcp get <서버이름>

# 서버 제거
claude mcp remove <서버이름>
```

## GitHub 연동

### 사전 준비

GitHub Personal Access Token(PAT)이 필요합니다.

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. **Generate new token** 클릭
3. 필요한 권한 선택
   - `repo` — 저장소 읽기/쓰기
   - `issues` — 이슈 관리
   - `pull_requests` — PR 관리
4. 토큰 복사 (`ghp_...` 형태)

### 설치 및 등록

```bash{2,3}
# npx로 바로 실행되므로 별도 설치는 필요 없습니다
claude mcp add github \
  -e GITHUB_PERSONAL_ACCESS_TOKEN=ghp_여기에_토큰_입력 \
  -- npx -y @modelcontextprotocol/server-github
```

Windows PowerShell에서는 줄바꿈 없이 한 줄로 입력해야 합니다.

```powershell
claude mcp add github -e GITHUB_PERSONAL_ACCESS_TOKEN=ghp_여기에_토큰_입력 -- npx -y @modelcontextprotocol/server-github
```

### 사용 예시

등록을 마치면 대화형 세션에서 바로 GitHub 관련 작업을 요청할 수 있습니다.

```
> 내 저장소 목록 보여줘

> anthropic/claude-code 저장소에서 열린 이슈 10개 가져와줘

> 현재 브랜치의 변경사항으로 PR 초안 만들어줘, 제목은 "feat: 로그인 기능 추가"

> issue #23의 내용을 읽고 해결책을 코드로 작성해줘
```

## Slack 연동

### 사전 준비

Slack Bot Token이 필요합니다.

1. [api.slack.com/apps](https://api.slack.com/apps) → **Create New App** → **From scratch**
2. 앱 이름 입력 후 워크스페이스 선택
3. **OAuth & Permissions** → **Bot Token Scopes**에 다음 권한 추가
   - `channels:read` — 채널 목록 조회
   - `chat:write` — 메시지 전송
   - `channels:history` — 채널 메시지 읽기
   - `users:read` — 사용자 정보 조회
4. **Install to Workspace** 후 Bot User OAuth Token 복사 (`xoxb-...` 형태)

### 설치 및 등록

```bash{2,3}
claude mcp add slack \
  -e SLACK_BOT_TOKEN=xoxb_여기에_토큰_입력 \
  -e SLACK_TEAM_ID=T여기에_팀ID_입력 \
  -- npx -y @modelcontextprotocol/server-slack
```

팀 ID는 Slack 워크스페이스 URL(`https://app.slack.com/client/T여기가팀ID/...`)에서 확인할 수 있습니다.

### 사용 예시

```
> #general 채널의 오늘 메시지 요약해줘

> 배포 완료됐다고 #dev-ops 채널에 알려줘

> @김개발 님이 오늘 언급한 버그 이슈 내용 찾아줘
```

## 데이터베이스 연동 (PostgreSQL)

### 사전 준비

PostgreSQL 접속 정보가 필요합니다. 로컬 개발 DB나 읽기 전용 복제본을 사용하는 것을 권장합니다.

### 설치 및 등록

```bash{2}
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

> [!warning]
> 프로덕션 DB에 직접 연결하면 Claude가 데이터를 수정할 수도 있습니다. 반드시 읽기 전용 계정을 사용하거나 테스트 DB를 연결합시다.

## 파일 시스템 연동

로컬 파일·디렉터리를 Claude가 직접 읽고 쓸 수 있도록 합니다. 특정 경로만 허용 범위로 지정할 수 있어 안전하게 사용할 수 있습니다.

```bash
claude mcp add filesystem \
  -- npx -y @modelcontextprotocol/server-filesystem \
  /Users/나의사용자명/Documents \
  /Users/나의사용자명/projects
```

여러 경로를 공백으로 구분해 나열하면 해당 경로들만 접근이 허용됩니다.

### 사용 예시

```
> ~/Documents/회의록 폴더에서 이번 달 파일들 요약해줘

> ~/projects/my-app 안에 TODO로 주석 달린 코드 전부 찾아줘
```

## 설정 파일로 한 번에 관리하기

서버를 하나씩 추가하다 보니 어느 순간 명령어를 일일이 외우기보다 설정 파일로 한꺼번에 관리하는 편이 훨씬 편하다는 걸 깨달았습니다. 전역 설정 파일을 직접 열어 편집하면 됩니다.

**파일 위치**
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- macOS / Linux: `~/.claude/claude_desktop_config.json`

```json{3,10,19,28}
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

설정 파일을 수정한 뒤에는 Claude Code를 재시작해야 변경 사항이 반영됩니다.

## 실전 활용 시나리오

MCP 서버들을 조합하면 단일 대화 흐름 안에서 꽤 복잡한 작업도 처리할 수 있습니다. 실제로 사용하면서 자주 활용했던 시나리오를 몇 가지 정리해 보았습니다.

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

## 보안 주의사항

MCP 연동은 강력한 만큼 신경 써야 할 부분도 많았습니다. 직접 설정해 보면서 챙겨야겠다고 느낀 점들을 정리해 봅니다.

**토큰·비밀번호 관리**
- 설정 파일에 토큰을 평문으로 저장한다면, 해당 파일이 git에 올라가지 않도록 `.gitignore`에 추가해야 합니다.
- 가능하면 환경 변수나 비밀 관리 도구(1Password, Vault 등)를 활용하는 것이 좋습니다.

**최소 권한 원칙**
- GitHub PAT는 꼭 필요한 스코프만 선택합니다.
- DB는 읽기 전용 계정으로 연결하는 것을 기본으로 삼습니다.

**프로덕션 환경 분리**
- 개발 단계에서는 항상 개발·스테이징 환경 기준으로 연결합니다.
- 프로덕션 서비스에 직접 연결된 MCP 서버에서 Claude에게 쓰기 작업을 허용할 때는 반드시 내용을 확인하고 허가해야 합니다.

## 다음 단계

MCP 연동에 익숙해졌다면 다음 주제로 이어가 볼 차례입니다.

- **멀티 에이전트 워크플로우** — 여러 Claude 인스턴스가 MCP 서버를 공유하며 병렬 작업하기
- **커스텀 MCP 서버 만들기** — 사내 시스템, 독자적인 API를 직접 MCP 서버로 래핑하기
- **CI/CD 통합** — GitHub Actions에서 MCP 서버를 활용한 자동화 파이프라인 구성

이 중 멀티 에이전트 워크플로우는 [Claude Code 멀티 에이전트 구성 및 실전 활용법](./multi-agent)에서 자세히 다룹니다.

## 마치며

MCP는 Claude Code를 단순한 코드 도우미에서 **실제 업무 환경에 통합된 AI 동료**로 바꿔주는 핵심 기능이었습니다. 처음부터 모든 서버를 연결하려고 하면 부담스러우니, 파일 시스템이나 GitHub 하나만 먼저 연결해 보고, 익숙해지면 Slack, DB 등으로 범위를 넓혀가는 방식을 추천합니다.

> [!note]
> MCP 생태계는 빠르게 성장하고 있습니다. 공식 서버 목록과 커뮤니티 서버는 [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)에서 확인하세요.
