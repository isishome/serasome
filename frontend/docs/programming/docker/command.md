---
title: Docker 명령어
decscription: Docker에서 사용하는 기본적인 명령어 몇가지를 배워봅시다.
---
# Docker 명령어
## 컨테이너 리스트
Docker 컨테이너 목록을 보여주는 명령어로 PowerShell 또는 Windows 명령 프롬프트에서 `docker ps` 명령을 입력합니다.
```Shell
$ docker ps
```
현재 구동 중인 컨테이너들의 ID, IMAGE, COMMAND, CREATED, STATUS, PORTS, NAMES가 순서대로 표시됩니다.
```Shell
$ docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```
::: tip 컨테이너 리스트 명령어 별칭
보통 `docker ps` 명령이 주로 사용되지만 현재 공식 사이트에서는 `docker container ls` 가 주 명령어로 표시되며 `docker container list`, `docker container ps`, `docker ps`가 별칭으로 표시되어 있습니다.
::: 

<br />

#### 모든 컨테이너 리스트
`-a` 옵션을 추가하면 이전에 만들어졌지만 현재 동작하고 있지 않은 컨테이너들도 모두 표시됩니다.
```Shell
$ docker ps -a
```

## 컨테이너 삭제
Docker 컨테이너를 삭제하는 명령어로 PowerShell 또는 Windows 명령 프롬프트에서 `docker rm [컨테이너 ID]` 명령을 입력합니다.
```Shell
$ docker rm [컨테이너 ID]
```

::: tip 컨테이너 삭제 명령어 별칭
보통 `docker rm` 명령이 주로 사용되지만 현재 공식 사이트에서는 `docker container rm` 가 주 명령어로 표시되며 `docker container remove`, `docker rm`가 별칭으로 표시되어 있습니다.
::: 

## 이미지 리스트
Docker 이미지 목록을 보여주는 명령어로 PowerShell 또는 Windows 명령 프롬프트에서 `docker images` 명령을 입력합니다.
```Shell
$ docker images
```
현재 이미지들의 REPOSITORY, TAG, IMAGE ID, CREATE, SIZE가 순서대로 표시됩니다.
```Shell
$ docker images
REPOSITORY   TAG                   IMAGE ID       CREATED         SIZE
```
::: tip 이미지 리스트 명령어 별칭
보통 `docker images` 명령이 주로 사용되지만 현재 공식 사이트에서는 `docker image ls` 가 주 명령어로 표시되며 `docker image list`, `docker images`가 별칭으로 표시되어 있습니다.
::: 

## 이미지 삭제
Docker 이미지를 삭제하는 명령어로 PowerShell 또는 Windows 명령 프롬프트에서 `docker rmi [이미지 ID]` 명령을 입력합니다.
```Shell
$ docker rmi [이미지 ID]
```

::: tip 이미지 삭제 명령어 별칭
보통 `docker rmi` 명령이 주로 사용되지만 현재 공식 사이트에서는 `docker image rm` 가 주 명령어로 표시되며 `docker image remove`, `docker rmi`가 별칭으로 표시되어 있습니다.
::: 