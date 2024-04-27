---
title: Docker 명령어
decscription: Docker에서 사용하는 기본적인 명령어 몇가지를 배워봅시다.
---
# Docker 명령어
## 컨테이너 리스트
Docker 컨테이너 목록을 보여주는 명령어로 PowerShell을 <b>관리자 권한(시작 메뉴 > PowerShell >에서 관리자 권한으로 실행 >을 마우스 오른쪽 단추로 클릭)</b>으로 열고 `docker ps` 명령을 입력합니다.
```Shell
$ docker ps
```
현재 구동 중인 컨테이너들의 ID, IMAGE, COMMAND, CREATED, STATUS, PORTS, NAMES가 순서대로 표시됩니다.
```Shell
$ docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```
::: tip 컨테이너 리스트 명령어 별칭
보통 `docker ps` 명령이 주로 사용되지만 현재 공식 사이트에서는 `docker container ls`이(가) 주 명령어로 표시되며 `docker container list`, `docker container ps`, `docker ps`이(가) 별칭으로 표시되어 있습니다.
::: 

<br />

#### 모든 컨테이너 리스트
`-a` 옵션을 추가하면 이전에 만들어졌지만 현재 동작하고 있지 않은 컨테이너들도 모두 표시됩니다.
```Shell
$ docker ps -a
```

## 컨테이너 삭제
Docker 컨테이너를 삭제하는 명령어로 PowerShell을 관리자 권한으로 열어 `docker rm [컨테이너 ID]` 명령을 입력합니다.
```Shell
$ docker rm [컨테이너 ID]
```

::: tip 컨테이너 삭제 명령어 별칭
보통 `docker rm` 명령이 주로 사용되지만 현재 공식 사이트에서는 `docker container rm`이(가) 주 명령어로 표시되며 `docker container remove`, `docker rm`이(가) 별칭으로 표시되어 있습니다.
::: 

## 이미지 리스트
Docker 이미지 목록을 보여주는 명령어로 PowerShell을 관리자 권한으로 열어 `docker images` 명령을 입력합니다.
```Shell
$ docker images
```
현재 이미지들의 REPOSITORY, TAG, IMAGE ID, CREATE, SIZE가 순서대로 표시됩니다.
```Shell
$ docker images
REPOSITORY   TAG                   IMAGE ID       CREATED         SIZE
```
::: tip 이미지 리스트 명령어 별칭
보통 `docker images` 명령이 주로 사용되지만 현재 공식 사이트에서는 `docker image ls`이(가) 주 명령어로 표시되며 `docker image list`, `docker images`이(가) 별칭으로 표시되어 있습니다.
::: 

## 이미지 삭제
Docker 이미지를 삭제하는 명령어로 PowerShell을 관리자 권한으로 열어 `docker rmi [이미지 ID]` 명령을 입력합니다.
```Shell
$ docker rmi [이미지 ID]
```

::: tip 이미지 삭제 명령어 별칭
보통 `docker rmi` 명령이 주로 사용되지만 현재 공식 사이트에서는 `docker image rm`이(가) 주 명령어로 표시되며 `docker image remove`, `docker rmi`이(가) 별칭으로 표시되어 있습니다.
::: 

## 컨테이너 실행
Docker 이미지로부터 컨테이너를 실행(생성)하는 명령어로 PowerShell을 관리자 권한으로 열어 `docker run -it --name [컨테이너 명] [이미지 명:태그] [명령어]` 명령을 입력합니다.
```Shell
$ docker run -it --name [컨테이너 명] [이미지 명:태그] [명령어]
```
|옵션|설명|
|:-|:-|
|`-i, --interactive`|컨테이너와 연결(attach)되어 있지 않더라도 표준 입력을 유지|
|`-t, --tty`|가상으로 터미널과 유사한 환경을 제공|
|`--name`|컨테이너에 이름 지정|
|`-d, --detach`|백그라운드에서 컨테이너를 실행하고 컨테이너 ID를 출력|

::: tip 컨테이너 실행 명령어 별칭
보통 `docker run` 명령이 주로 사용되지만 현재 공식 사이트에서는 `docker container run`이(가) 주 명령어로 표시되며 `docker run`이(가) 별칭으로 표시되어 있습니다.
::: 