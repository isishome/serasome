---
title: Node.js App 컨테이너
description: Docker가 설치된 호스트에 Node.js 이미지를 이용해 컨테이너화 하는 방법을 소개합니다.
---
# Node.js App 컨테이너
::: info Node.js App 컨테이너화하기 앞서
Node.js App 컨테이너는 Github의 **Webhooks** 기능을 활용해 jenkins로 자동 배포하여 컨테이너화할 예정입니다. 
이 포스트에서는 Node.js App 프로젝트의 구조 및 Dockerfile 작성 그리고 jenkin Shell 명령어 활용법을 다룹니다.
- **Github의 Webhooks과 Jenkins를 연동하는 방법**은 [Github Webhooks과 jenkin 연동하기](./github-jenkins.md)를 참고하시기 바랍니다.
:::

지난 포스트인 [Nginx 컨테이너](/programming/docker/webserver/nginx)와 동일한 방식으로 배포 때마다 Docker 이미지 빌드, 새 컨테이너가 구동되도록 하였습니다.

## Node.js App 프로젝트 구조
```
node.js
│  .dockerignore
│  Dockerfile
│  index.js
│
└─node_modules
```
## Node.js App Dockerfile 작성
Node.js App Docker 빌드에 사용될 **Dockerfile**을 작성합니다.
> [!TIP] Dockerfile?
>- **Dockerfile**에 대한 설명은 [Dockerfile 작성하기](./../file.md)를 참고하시기 바랍니다.

```dockerfile
FROM node:16-alpine

WORKDIR /api

COPY . .

RUN npm install

ENV NODE_ENV production

EXPOSE 6081

ENTRYPOINT ["node", "index.js"]
```
|구문|설명|
|:-|:-|
|`FROM node:16-alpine`|node:16-alpine 이미지를 바탕으로 Docker 이미지를 생성합니다.|
|`WORKDIR /api`|Node.js App 컨테이너 내부 작업 경로를 지정합니다.|
|`COPY . .`|Node.js App 파일들을 작업 경로로 복사합니다.|
|`RUN npm install`|의존성 모듈들을 설치합니다.|
|`ENV NODE_ENV production`|Node.js 환경 변수를 production 모드로 지정합니다.|
|`EXPOSE 6081`|Node.js App 컨테이너가 외부 호스트와 연결될 포트를 명시합니다.|
|`ENTRYPOINT ["node", "index.js"]`|Node.js App을 구동합니다.|

## Jenkins Node.js App Shell 설정
Jenkins의 Node.js App 프로젝트 설정으로 이동해 Shell 명령어를 작성합니다.
```shell
cd /var/jenkins_home/workspace/tradurs-back
docker build --no-cache --tag tradurs:back .
docker stop "tradurs-back" || true
docker rm -f "tradurs-back" || true
docker container run --detach --restart always --cpuset-cpus="1" --cpu-shares="2048" --memory="500m" --memory-swap="1g" --publish 6081:6081 --name "tradurs-back" tradurs:back
docker system prune -f
docker buildx prune -f
```
|구문|설명|
|:-|:-|
|`cd /var/jenkins_home/workspace/tradurs-back`|호스트 볼륨의 Node.js App 작업 경로로 이동합니다.|
|`docker build ...`|Dockerfile에 작성된 스크립트대로 Docker 이미지를 만듭니다. |
|`docker stop ...`|기존에 구동 중인 Node.js App 컨테이너를 중지합니다.(없는 경우 true로 통과)|
|`docker rm ...`|기존에 생성된 Node.js App 컨테이너를 삭제합니다.(없는 경우 true로 통과)|
|`docker container run ...`|새 Node.js App 이미지를 이용해 컨테이너를 구동합니다.<br /><br />--detach: 비 연결 구동<br />--restart : 재시작 설정<br />--cpuset-cpus : 할당 CPU 번호<br />--cpu-shares : 할당 CPU 상대적 가중치<br />--memory : 메모리 한도<br />--memory-swap : 스왑 메모리 한도<br />--publish : 호스트에 게시되는 포트 정의(외부:내부)<br />--name : 컨테이너 이름|
|`docker system prune -f`|Docker 이미지 및 컨테이너를 정리합니다.|
|`docker buildx prune -f`|Docker 빌드 캐시를 정리합니다.|

마지막으로 Node.js App 프로젝트 소스를 push 하여 Jenkins를 통해 정상적으로 자동 배포되는지 확인하면 됩니다.