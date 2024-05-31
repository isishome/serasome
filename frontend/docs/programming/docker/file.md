---
title: Dockerfile 작성하기
decscription: Docker 빌드에 사용할 Dockerfile이 무엇인지 알아보고 간단하게 작성하는 방법까지 알아봅시다. 
---

# Dockerfile 작성하기
Dockerfile은 만들고자 하는 Docker 이미지를 빌드하는 데 필요한 모든 명령이 순차적으로 적힌 텍스트 파일입니다. **Dockerfile은 정해진 형식과 [명령어](https://docs.docker.com/reference/dockerfile/)들로 구성됩니다**.

Docker 이미지는 읽기 전용 레이어로 구성되며, 각 레이어는 Dockerfile 명령어를 나타냅니다.

```dockerfile
# syntax=docker/dockerfile:1

FROM ubuntu:22.04
COPY . /app
RUN make /app
CMD python /app/app.py
```
위에서 각 명령어는 하나의 레이어를 생성합니다.
- **FROM**은 ubuntu:22.04 Docker 이미지 레이어를 생성합니다.
- **COPY**는 Docker 클라이언트의 현재 디렉터리에서 파일을 복사합니다.
- **RUN**은 `make`를 사용하여 앱을 빌드합니다.
- **CMD**는 컨테이너 내에서 실행할 명령을 지정합니다.

## 멀티 스테이지 빌드
멀티 스테이지 빌드(Multi-stage builds)는 Dockerfile을 더 쉽게 유지 관리할 수 있도록 도와주며, Docker 이미지 최적화가 어려운 사용자에게 매우 유용합니다.

멀티 스테이지 빌드에서는 여러개의 `FROM`문을 사용합니다. 각 `FROM` 명령어는 서로 다른 기반의 이미지를 사용할 수 있으며, 각 명령어는 각각 새로운 스테이지로 시작됩니다.\
한 마디로 여러 스테이지의 빌드 과정이 있는 Dockerfile이 있다면 최종적으로 만들어지는 이미지에는 원하는 것들만 남겨 이미지 용량을 최적화 할 수 있습니다.

다음 Dockerfile에는 바이너리를 빌드하는 첫 번째 스테이지와 만들어진 바이너리를 복사하는 두 번째 스테이지로 구성되어 있습니다.

```dockerfile
# syntax=docker/dockerfile:1
FROM golang:1.21
WORKDIR /src
COPY <<EOF ./main.go
package main

import "fmt"

func main() {
  fmt.Println("hello, world")
}
EOF
RUN go build -o /bin/hello ./main.go

FROM scratch
COPY --from=0 /bin/hello /bin/hello
CMD ["/bin/hello"]
```
Dockerfile만 있으면 됩니다. 별도의 빌드 스크립트 없이 Docker 빌드를 실행하기만 하면 됩니다.
```shell
$ docker build -t hello .
```
최종 결과물은 내부에 바이너리만 있는 작은 Production 이미지 입니다. 앱을 빌드하는 데 필요한 빌드 도구는 결과 이미지에 포함되지 않습니다.

어떻게 작동할까요? 두 번째 `FROM` 명령어는 `scratch` 이미지를 바탕으로 새 빌드 스테이지를 시작합니다. `COPY --from=0`은 이전 스테이지에서 빌드된 결과물만 두 번째 스테이지로 복사합니다. `Go SDK`를 포함 모든 중간 결과물은 그대로 유지되며 최종 결과물에는 저장되지 않습니다.

## 빌드 스테이지 별칭 지정
기본적으로 스테이지마다 이름이 지정되지 않으며, 첫 번째 `FROM` 명령이 있는 스테이지를 0으로 시작하는 정수로 참조할 수 있습니다. 그러나 `FROM` 명령에 `AS <NAME>`을 추가하여 스테이지 별칭으로 지정할 수 있습니다. 다음 예에서는 스테이지 별칭을 지정하고 `COPY` 명령에 별칭을 사용하여 이전 예제를 개선해 보도록 하겠습니다. 즉, 나중에 Dockerfile의 명령어 순서가 바뀌더라도 `COPY`는 중단되지 않습니다.
```dockerfile
# syntax=docker/dockerfile:1
FROM golang:1.21 as build
WORKDIR /src
COPY <<EOF /src/main.go
package main

import "fmt"

func main() {
  fmt.Println("hello, world")
}
EOF
RUN go build -o /bin/hello ./main.go

FROM scratch
COPY --from=build /bin/hello /bin/hello
CMD ["/bin/hello"]
```

## 특정 빌드 스테이지에서 중지하기
이미지를 빌드할 때 반드시 모든 스테이지를 포함한 전체 Dockerfile을 빌드할 필요는 없습니다. 대상 빌드 스테이지를 지정할 수 있습니다. 다음 명령은 기존 Dockerfile을 사용하고 있지만 build라는 스테이지에서 중지한다고 가정합니다.
```shell
$ docker build --target build -t hello .
```
이 기능이 유용하게 쓰일 수 있는 다음과 같은 시나리오가 있습니다.
- 특정 빌드 스테이지 디버깅
- 모든 디버깅 기호 또는 도구가 활성화된 `debug` 스테이지와 간결한 `Production` 스테이지 사용
- 테스트 데이터로만 이루어진 `test` 스테이지를 사용하지만 실제 데이터를 사용하는 다른 스테이지를 사용하여 production용으로 빌드하는 경우

## 외부 이미지를 스테이지로 사용
멀티 스테이지 빌드를 사용하는 경우 Dockerfile에서 이전에 생성한 스테이지로부터 복사하는 것만 가능한 것이 아닙니다. 로컬 이미지 명, 로컬 또는 Docker 레지스트리에서 사용할 수 있는 태그 또는 태그 ID를 사용하여 별도의 이미지로부터 복사하는 `COPY --from` 명령어를 사용할 수 있습니다.

```dockerfile
COPY --from=nginx:latest /etc/nginx/nginx.conf /nginx.conf
```

## 이전 스테이지를 새 스테이지로 사용
`FROM` 지시문을 사용할 때 이전 스테이지를 참조하여 이전 스테이지에서 정의된 부분에 이어서 시작할 수 있습니다. 다음 예:
```dockerfile
# syntax=docker/dockerfile:1

FROM alpine:latest AS builder
RUN apk --no-cache add build-base

FROM builder AS build1
COPY source1.cpp source.cpp
RUN g++ -o /binary source.cpp

FROM builder AS build2
COPY source2.cpp source.cpp
RUN g++ -o /binary source.cpp
```
