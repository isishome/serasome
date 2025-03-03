---
title: Docker로 웹서버 구축하기
titleTemplate: Nginx 컨테이너
description: Docker가 설치된 호스트에 Nginx 이미지를 이용해 컨테이너화 하는 방법을 소개합니다.
---

# Nginx 컨테이너

::: info Nginx 컨테이너화하기 앞서
Nginx 컨테이너는 Github의 **Webhooks** 기능을 활용해 jenkins로 자동 배포하여 컨테이너화할 예정입니다.
이 포스트에서는 Nginx 프로젝트의 구조 및 Dockerfile과 jenkin Shell 스크립트 내용을 다룹니다.

- **Github의 Webhooks를 이용 Jenkins와 연동하는 방법**은 [Github와 jenkin 연동하기](./github-jenkins.md)를 참고하시기 바랍니다.
  :::

지난 포스트인 [Jenkins 컨테이너](/programming/docker/webserver/jenkins)와 달리 Nginx 컨테이너는 설정 파일(nginx.conf 등) 수정이 자주 이뤄지므로 배포 때마다 Docker 이미지 빌드, 새 컨테이너가 구동되도록 하였습니다.

> [!CAUTION] Nginx 컨테이너와 Jenkins 컨테이너 얽힘 문제
> Jenkins 서비스 역시 Nginx 컨테이너를 통해 외부로 제공되기 때문에 구동 중인 Nginx 컨테이너가 중지(배포 시)될 때 Jenkins가 외부와 연결이 잠깐 끊기는 현상(502)이 발생합니다.
>
> - 이는 단순히 Nginx 프락시 연결이 외부와 끊길 뿐, **구동되는 Jenkins 빌드에는 영향을 주지 않습니다**.

## Nginx 프로젝트 구조

Nginx 프로젝트는 원하는 사이트 구성

- 하나의 설정 파일로 사용
- 각 사이트의 파일을 만들어 `include` or `...`

등등 원하는 구조로 구성하면 됩니다.

> [!WARNING] 주의
> 잘못된 설정 파일 문제(오타 포함)로 Nginx 컨테이너를 시작하지 못하게 되면 **Jenkins 서비스 또한 외부와 연결이 끊겨 Github webhook을 사용할 수 없기 때문에** <u>항상 로컬 테스트를 거친 후 배포하시기 바랍니다</u>.

```
nginx
│  .dockerignore
│  Dockerfile
│  nginx.conf
│
├─conf.d
│      default.conf
│      jenkins.conf
│      tradurs.back.conf
│      tradurs.d4.conf
│      tradurs.front.conf
│
└─security
        general.conf
```

## Nginx Dockerfile 작성

Nginx Docker 빌드에 사용될 **Dockerfile**을 작성합니다.

> [!TIP] Dockerfile?
>
> - **Dockerfile**에 대한 설명은 [Dockerfile 작성하기](./../file.md)를 참고하시기 바랍니다.

```dockerfile
FROM nginx:1.26.0-alpine

WORKDIR /etc/nginx

COPY . .

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
```

| 구문                                        | 설명                                                                                                                                                                                           |
| :------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FROM nginx:1.26.0-alpine`                  | nginx:1.26.0-alpine 이미지를 바탕으로 Docker 이미지를 생성합니다.                                                                                                                              |
| `WORKDIR /etc/nginx`                        | Nginx 컨테이너 내부 작업 경로를 지정합니다.                                                                                                                                                    |
| `COPY . .`                                  | 미리 준비한 Nginx 설정 파일들을 작업 경로로 복사합니다.                                                                                                                                        |
| `EXPOSE 80`                                 | Nginx 컨테이너가 외부 호스트와 연결될 포트를 명시합니다.                                                                                                                                       |
| `ENTRYPOINT ["nginx", "-g", "daemon off;"]` | Nginx 서버를 구동합니다.<br /> `daemon off`는 nginx 서버가 foreground로 실행되도록 하는 명령어입니다. 이를 지정하지 않으면 해당 컨테이너에 `--detach` 옵션으로 접근하더라도 서버가 중지됩니다. |

## Jenkins Nginx Shell 설정

Jenkins의 nginx 프로젝트 설정으로 이동해 **Build Steps**의 **Execute Shell**을 작성합니다.

```sh
cd /var/jenkins_home/workspace/nginx
docker build --no-cache --tag nginx:host .
docker stop "nginx-host" || true
docker rm -f "nginx-host" || true
docker container run --detach --restart always --cpuset-cpus="0" --cpu-shares="1024" --memory="500m" --memory-swap="1g" --publish 80:80 --volume /var/jenkins_home:/var/jenkins_home --add-host=host.docker.internal:host-gateway --env TZ=Asiz/Seoul --name "nginx-host" nginx:host
docker system prune -f
docker buildx prune -f
```

| 구문                                   | 설명                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| :------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cd /var/jenkins_home/workspace/nginx` | 호스트 볼륨의 nginx 작업 경로로 이동합니다.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `docker build ...`                     | Dockerfile에 작성된 스크립트대로 Docker 이미지를 만듭니다.                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `docker stop ...`                      | 기존에 구동 중인 nginx 컨테이너를 중지합니다.(없는 경우 true로 통과)                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `docker rm ...`                        | 기존에 생성된 nginx 컨테이너를 삭제합니다.(없는 경우 true로 통과)                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `docker container run ...`             | 새 nginx 이미지를 이용해 컨테이너를 구동합니다.<br /><br />--detach : 비 연결 구동<br />--restart : 재시작 설정<br />--cpuset-cpus : 할당 CPU 번호<br />--cpu-shares : 할당 CPU 상대적 가중치<br />--memory : 메모리 한도<br />--memory-swap : 스왑 메모리 한도<br />--publish : 호스트에 게시되는 포트 정의(외부:내부)<br />--volume : 호스트와 공유 경로(호스트:컨테이너)<br />**--add-host : 컨테이너에서 호스트(인스턴스)로 접근할 때 사용할 host명 정의**<br />--env : 환경 변수(TimeZone)<br />--name : 컨테이너 이름 |
| `docker system prune -f`               | Docker 이미지 및 컨테이너를 정리합니다.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `docker buildx prune -f`               | Docker 빌드 캐시를 정리합니다.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

마지막으로 Nginx의 소스를 `git push` 하여 Jenkins를 통해 정상적으로 자동 배포되는지 확인하면 됩니다.
