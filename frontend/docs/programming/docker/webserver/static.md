---
title: 정적 사이트
description: Docker가 설치된 호스트에 Node.js 이미지를 이용해 정적 사이트를 배포하는 방법을 소개합니다.
---
# 정적 사이트
::: info 정적 사이트 배포하기 앞서
정적 사이트 배포는 Github의 Webhooks 기능을 활용해 jenkins로 자동 배포하여 컨테이너화하여 빌드 후 결과물만 볼륨 경로에 복사하고 컨테이너를 삭제 할 예정입니다. 이 포스트에서는 정적 사이트 Dockerfile 작성 그리고 jenkin Shell 명령어 활용법을 다룹니다.
- **Github의 Webhooks과 Jenkins를 연동하는 방법**은 [Github Webhooks과 jenkin 연동하기](./github-jenkins.md)를 참고하시기 바랍니다.
:::

지난 포스트인 [Jenkins 컨테이너](/programming/docker/webserver/jenkins), [Nginx 컨테이너](/programming/docker/webserver/nginx)와 달리 정적 사이트는 배포 때 Docker 이미지 빌드, 컨테이너를 구동하여 **프로젝트 빌드 후 결과물만 작업 볼륨에 복사하고 중지 및 삭제**할 예정입니다.

>[!TIP] 정적 사이트를 컨테이너화 하여 사용하지 않는 이유
> 사실 모든 정적 사이트들을 독립적으로 컨테이너화 하여 사용할 수 있습니다. **인스턴스 사양이 좋다면 컨테이너화 하여 사용해도 좋습니다.**
>- 저는 인스턴스(호스트) 리소스를 조금이라도 아껴보고자 볼륨 복사 후 빌드에 사용된 이미지와 컨테이너를 삭제하였습니다.

## 정적 사이트 Dockerfile 작성
정적 사이트 Docker 빌드에 사용될 **Dockerfile**을 작성합니다.
> [!TIP] Dockerfile?
>- **Dockerfile**에 대한 설명은 [Dockerfile 작성하기](./../file.md)를 참고하시기 바랍니다.

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY . .

RUN npm install \
    && npm run build
```
|구문|설명|
|:-|:-|
|`FROM node:16-alpine`|node:16-alpine 이미지를 바탕으로 Docker 이미지를 생성합니다.|
|`WORKDIR /app`|정적 사이트 컨테이너 내부 작업 경로를 지정합니다.|
|`COPY . .`|정적 사이트 파일들을 작업 경로로 복사합니다.|
|`RUN npm install`|의존성 모듈들을 설치합니다.|
|`RUN npm run build`|프로젝트를 빌드합니다.|
> [!WARNING] 레이어 줄이기
> `RUN` 명령어를 멀티 라인으로 작성하는 경우 위와 같이 <strong>\\</strong>와 <strong>\&\&</strong>로 구분 지어 한 줄의 `RUN`으로 작성하면 Docker 빌드 시 하나의 레이어만 사용하므로써 Docker 이미지 용량을 줄이는데 도움이 됩니다.
> - `RUN` 명령어를 하나의 레이어로 작성하는 것보다 [멀티 스테이지 빌드](./../file#멀티-스테이지-빌드)를 사용하는 것이 Docker 이미지 용량을 줄이는데 더 탁월하다는 점 잊지 마세요.

## Jenkins 정적 사이트 Shell 설정
Jenkins의 정적 사이트 프로젝트 설정으로 이동해 Shell 명령어를 작성합니다.
```shell
cd /var/jenkins_home/workspace/tradurs-front
docker build --no-cache --tag tradurs:front .
docker stop "tradurs-front" || true
docker rm -f "tradurs-front" || true
docker container run --detach -tty --name "tradurs-front" tradurs:front
docker cp tradurs-front:/app/dist/. /var/jenkins_home/workspace/tradurs-front/www
docker stop "tradurs-front" || true
docker rm -f "tradurs-front" || true
docker system prune -f
docker buildx prune -f
```
|구문|설명|
|:-|:-|
|`cd /var/jenkins_home/workspace/tradurs-front`|호스트 볼륨의 정적 사이트 작업 경로로 이동합니다.|
|`docker build ...`|Dockerfile에 작성된 스크립트대로 Docker 이미지를 만듭니다. |
|`docker stop ...`|기존에 구동 중인 정적 사이트 컨테이너가 있다면 중지합니다.(없는 경우 true로 통과)|
|`docker rm ...`|기존에 정적 사이트 컨테이너가 있다면 삭제합니다.(없는 경우 true로 통과)|
|`docker container run ...`|새 정적 사이트 이미지를 이용해 컨테이너를 구동합니다.<br /><br />--detach: 비 연결 구동<br />--tty : 가상으로 터미널과 유사한 환경을 제공<br />--name : 컨테이너 이름|
|`docker cp ...`|정적 사이트 컨테이너에서 빌드한 결과물을 호스트 젠킨스 볼륨 경로로 복사합니다.|
|`docker stop ...`|구동 중인 정적 사이트 컨테이너를 중지합니다.(없는 경우 true로 통과)|
|`docker rm ...`|정적 사이트 컨테이너를 삭제합니다.(없는 경우 true로 통과)|
|`docker system prune -f`|Docker 이미지 및 컨테이너를 정리합니다.|
|`docker buildx prune -f`|Docker 빌드 캐시를 정리합니다.|

마지막으로 정적 사이트 프로젝트 소스를 push 하여 Jenkins를 통해 정상적으로 자동 배포되는지 확인하면 됩니다.