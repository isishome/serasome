---
title: Claude Code 시작하기
titleTemplate: 설치부터 첫 번째 대화까지
description: AI 코딩 에이전트 Claude Code를 설치하고, API 키를 발급받아 인증을 설정한 뒤 첫 대화를 시작하기까지의 과정을 정리합니다.
---

# Claude Code 시작하기

::: info 들어가며
요즘 개발자 커뮤니티에서 Claude Code 얘기가 자주 들려서, 직접 설치하고 사용해 보면서 과정을 정리해 보았습니다. 설치부터 인증, 첫 실행, `CLAUDE.md` 작성, 권한 설정, 자주 만나는 오류까지 한 번에 따라할 수 있도록 구성했습니다.
:::

## Claude Code란?

**Claude Code**는 Anthropic이 만든 CLI(Command-Line Interface) 기반 AI 코딩 에이전트입니다. 단순히 코드 한 줄을 제안하는 수준을 넘어서, 프로젝트 전체 구조를 파악하고 파일을 읽고 수정하며 터미널 명령까지 직접 실행합니다.

기존에 써봤던 AI 코딩 도구들과 가장 다르게 느껴졌던 부분은 **에이전틱(Agentic)** 방식으로 동작한다는 점이었습니다. 작업을 한 줄로 요청하면, Claude가 스스로 계획을 세우고 여러 단계를 순차적으로 진행합니다.

```
개발자: "이 프로젝트에 로그인 기능 추가해줘"

Claude Code:
  1. 프로젝트 구조 파악
  2. 기존 인증 관련 코드 탐색
  3. 필요한 파일 생성 및 수정
  4. 의존성 설치
  5. 결과 보고
```

## 시작 전 체크리스트

설치하기 전에 아래 항목을 먼저 확인해 봅시다.

| 항목    | 최소 버전                   | 확인 명령어    |
| ------- | ---------------------------- | --------------- |
| Node.js | 18 이상                      | `node --version` |
| npm     | 8 이상                        | `npm --version`  |
| OS      | macOS, Linux, Windows        | -                |

### Node.js 설치 (아직 없다면)

```bash
# macOS — Homebrew 사용
brew install node

# Ubuntu / Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 버전 확인
node --version  # v20.x.x 이상이면 OK
```

**Windows 사용자**라면 [nodejs.org](https://nodejs.org)에서 Windows 인스톨러(.msi)를 내려받아 설치하는 것이 가장 간단합니다. 설치 후 PowerShell 또는 명령 프롬프트(cmd)에서 `node --version`으로 확인합니다.

## 설치하기

Node.js 환경이 준비되었다면 npm으로 전역 설치를 진행합니다.

```bash
npm install -g @anthropic-ai/claude-code
```

설치가 끝나면 버전을 확인해 정상적으로 설치되었는지 검증합니다.

```bash
claude --version
```

## 인증 설정

처음 설치했을 때는 API 키를 발급받고 환경 변수까지 설정해야 하는 줄 알고 마음의 준비를 했었는데, 실제로는 그럴 필요가 없었습니다. Claude Code는 **API 키 없이도 Anthropic 계정으로 바로 로그인**해 사용할 수 있습니다.

### 계정 인증으로 로그인하기

터미널에서 `claude`를 처음 실행하면 인증 방식을 선택하는 화면이 나타납니다.

```bash
claude
```

```
? How would you like to authenticate?
  ❯ Sign in with Claude.ai account   ← 이것 선택
    Enter API key manually
```

**Sign in with Claude.ai account**를 선택하면 브라우저가 자동으로 열리며 claude.ai 로그인 페이지로 이동합니다. 기존 계정으로 로그인하고 권한을 허용하면 터미널로 돌아와 인증이 완료됩니다.

> [!tip] 이 방식의 장점
> API 키를 별도로 발급받거나 환경 변수를 설정할 필요가 없습니다. claude.ai 구독 플랜(Pro, Max 등)이 그대로 적용됩니다.

약관 동의와 간단한 초기 설정을 마치면 바로 대화형 세션이 시작됩니다.

## 첫 번째 실행

### 프로젝트 디렉터리에서 시작하기

Claude Code는 현재 디렉터리를 기준으로 프로젝트를 인식합니다. 그래서 항상 작업하려는 프로젝트 폴더 안에서 실행해야 합니다.

```bash
cd ~/my-project
claude
```

### 기본 명령어

| 명령어                 | 설명                                          |
| ---------------------- | --------------------------------------------- |
| `claude`                | 대화형 세션 시작                              |
| `claude "질문 내용"`    | 단일 쿼리 실행 후 종료                        |
| `claude --print "질문"` | 결과를 stdout으로 출력 (파이프 활용 시 유용) |
| `/help`                 | 세션 내 도움말                                |
| `/clear`                | 대화 컨텍스트 초기화                          |
| `/exit`                 | 세션 종료                                     |

### 빠른 테스트

```bash
# 단일 쿼리로 빠르게 테스트
claude "현재 디렉터리 구조를 설명해줘"
```

대화형 세션에서는 자연어로 바로 입력하면 됩니다.

```
> 이 프로젝트에서 사용하는 주요 라이브러리가 뭐야?
> package.json에 scripts 섹션 추가해줘
> README.md를 한국어로 번역해줘
```

## CLAUDE.md: 프로젝트 규칙 파일

프로젝트 루트에 `CLAUDE.md` 파일을 만들어두면, Claude Code가 세션을 시작할 때 이 파일을 자동으로 읽어 컨텍스트로 활용합니다. 팀 컨벤션, 기술 스택, 주의사항 등을 미리 정의해두면 매번 같은 설명을 반복할 필요가 없어집니다.

```markdown{2,4-7,9-12,14-16}
# CLAUDE.md

## 프로젝트 개요
Next.js 14 + TypeScript 기반 쇼핑몰 프로젝트

## 코딩 컨벤션
- 함수형 컴포넌트 사용 (클래스 컴포넌트 금지)
- CSS는 Tailwind CSS만 사용
- 커밋 메시지는 한국어로 작성

## 주요 명령어
- 개발 서버: npm run dev
- 테스트: npm run test
- 빌드: npm run build

## 주의사항
- .env 파일은 절대 수정하지 말 것
- /api/payment 경로는 변경 전 반드시 확인 요청
```

## 권한 설정 이해하기

Claude Code는 파일을 수정하거나 명령을 실행하기 전에 사용자에게 허가를 요청합니다. 의도치 않은 변경을 막기 위한 안전장치인데, 처음 사용할 때는 이 확인 과정이 다소 번거롭게 느껴질 수도 있습니다.

```
Claude가 다음 작업을 수행하려 합니다:
  - src/auth.ts 파일 수정
  - npm install jsonwebtoken 실행

허용하시겠습니까? (y/n)
```

자동 승인 모드(`--dangerously-skip-permissions`)도 있지만, 처음에는 기본 모드로 사용하면서 Claude가 어떤 작업을 어떻게 수행하는지 충분히 살펴보는 것을 권장합니다.

## 자주 발생하는 문제

### `claude: command not found` (Windows)

설치는 끝났는데 PowerShell을 재시작해도 명령어가 인식되지 않아 한참을 고민했던 적이 있습니다.

```powershell{2,3,5,6}
# npm 전역 설치 경로 확인
npm config get prefix
# 출력 예: C:\Users\사용자명\AppData\Roaming\npm

# 시스템 환경 변수 PATH에 해당 경로가 있는지 확인
# 없다면: 시스템 속성 → 환경 변수 → PATH에 위 경로 추가 후 터미널 재시작
```

### `claude: command not found` (macOS / Linux)

macOS나 Linux에서는 npm 전역 설치 경로가 PATH에 잡혀있지 않아서 같은 문제가 발생합니다.

```bash{2,3,6}
# npm 전역 설치 경로가 PATH에 없을 때 발생
npm config get prefix
# 출력 예: /usr/local

# ~/.zshrc 또는 ~/.bashrc에 추가
export PATH="$PATH:/usr/local/bin"
```

### 응답이 너무 느릴 때

프로젝트가 매우 크다면 `.claudeignore` 파일을 만들어 불필요한 디렉터리를 제외해 봅시다.

```text{1,2,3,4}
# .claudeignore 예시
node_modules/
.git/
dist/
*.log
```

## 다음 단계

기본 설치와 환경 설정을 마쳤다면, 다음 주제로 더 깊이 들어가 볼 차례입니다.

- **MCP(Model Context Protocol) 서버 연동** — GitHub, Slack, DB 등 외부 서비스 연결
- **멀티 에이전트 워크플로우** — 복잡한 작업을 여러 Claude 인스턴스로 병렬 처리
- **CI/CD 파이프라인 통합** — GitHub Actions에서 Claude Code 자동 실행

이 중 MCP 서버 연동은 [Claude Code MCP 연동하기](./mcp-integration)에서 자세히 다룹니다.

## 마치며

직접 설치하고 사용해 보니, Claude Code는 단순한 코드 자동완성 도구가 아니었습니다. 리뷰어, 리팩터링 파트너, 문서 작성자 역할까지 그럭저럭 소화해 내는 모습을 보면서, 작은 작업부터 맡겨보며 신뢰와 협업 감각을 쌓아가는 것이 가장 좋은 시작 방법이라는 생각이 들었습니다.

> [!note]
> Claude Code는 활발히 업데이트되는 제품입니다. 최신 정보는 [공식 문서](https://docs.anthropic.com/ko/docs/claude-code)를 확인하세요.
