---
title: Docker 명령어
decscription: Docker에서 사용하는 기본적인 명령어 몇가지를 배워봅시다.
---

# Docker 명령어

## 이미지 리스트

Docker 이미지 목록을 보여주는 명령어로 PowerShell을 관리자 권한으로 열어 `docker images [옵션] [저장소[:태그]]` 명령을 입력합니다.

```sh
$ docker images [옵션] [저장소[:태그]]
```

현재 이미지들의 REPOSITORY, TAG, IMAGE ID, CREATE, SIZE가 순서대로 표시됩니다.

```sh
$ docker images
REPOSITORY   TAG                   IMAGE ID       CREATED         SIZE
```

::: tip 이미지 리스트 명령어 별칭
보통 `docker images` 명령이 주로 사용되지만 현재 공식 사이트에서는 `docker image ls`이(가) 주 명령어로 표시되며 `docker image list`, `docker images`이(가) 별칭으로 표시되어 있습니다.
:::

## 이미지 삭제

Docker 이미지를 삭제하는 명령어로 PowerShell을 관리자 권한으로 열어 `docker rmi [옵션] 이미지 [이미지...]` 명령을 입력합니다.

```sh
$ docker rmi [옵션] 이미지 [이미지...]
```

| 옵션          | 설명                                        |
| :------------ | :------------------------------------------ |
| `-f, --force` | 이미지 강제 삭제                            |
| `--no-prune`  | 태그가 지정되지 않은 이미지를 삭제하지 않음 |

::: tip 이미지 삭제 명령어 별칭
보통 `docker rmi` 명령이 주로 사용되지만 현재 공식 사이트에서는 `docker image rm`이(가) 주 명령어로 표시되며 `docker image remove`, `docker rmi`이(가) 별칭으로 표시되어 있습니다.
:::

## 컨테이너 리스트

Docker 컨테이너 목록을 보여주는 명령어로 PowerShell을 <b>관리자 권한(시작 메뉴 > PowerShell >에서 관리자 권한으로 실행 >을 마우스 오른쪽 단추로 클릭)</b>으로 열고 `docker ps [옵션]` 명령을 입력합니다.

```sh
$ docker ps [옵션]
```

현재 구동 중인 컨테이너들의 ID, IMAGE, COMMAND, CREATED, STATUS, PORTS, NAMES가 순서대로 표시됩니다.

```sh
$ docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

| 옵션        | 설명                                             |
| :---------- | :----------------------------------------------- |
| `-a, --all` | 모든 컨테이너 표시(기본은 실행 중인 것만 표시됨) |

::: tip 컨테이너 리스트 명령어 별칭
보통 `docker ps` 명령이 주로 사용되지만 현재 공식 사이트에서는 `docker container ls`이(가) 주 명령어로 표시되며 `docker container list`, `docker container ps`, `docker ps`이(가) 별칭으로 표시되어 있습니다.
:::

<br />

#### 모든 컨테이너 리스트

`-a` 옵션을 추가하면 이전에 만들어졌지만 현재 동작하고 있지 않은 컨테이너들도 모두 표시됩니다.

```sh
$ docker ps -a
```

## 컨테이너 삭제

Docker 컨테이너를 삭제하는 명령어로 PowerShell을 관리자 권한으로 열어 `docker rm [옵션] 컨테이너 [컨테이너...]` 명령을 입력합니다.

```sh
$ docker rm [옵션] 컨테이너 [컨테이너...]
```

::: tip 컨테이너 삭제 명령어 별칭
보통 `docker rm` 명령이 주로 사용되지만 현재 공식 사이트에서는 `docker container rm`이(가) 주 명령어로 표시되며 `docker container remove`, `docker rm`이(가) 별칭으로 표시되어 있습니다.
:::

## 컨테이너 실행

Docker 이미지로부터 컨테이너를 실행(생성)하는 명령어로 PowerShell을 관리자 권한으로 열어 `docker run [옵션] 이미지 [명령어] [인수...]` 명령을 입력합니다.

```sh
$ docker run [옵션] 이미지 [명령어] [인수...]
```

| 옵션                | 설명                                                            |
| :------------------ | :-------------------------------------------------------------- |
| `-i, --interactive` | 컨테이너와 연결(attach)되어 있지 않더라도 표준 입력을 유지      |
| `-t, --tty`         | 가상으로 터미널과 유사한 환경을 제공                            |
| `--name`            | 컨테이너에 이름 지정                                            |
| `-d, --detach`      | 백그라운드에서 컨테이너를 실행하고 컨테이너 ID를 출력           |
| `-p, --publish`     | 호스트에 컨테이너 포트 게시                                     |
| `-v, --volume`      | 볼륨 바인드 마운트                                              |
| `-e, --env`         | 환경 변수 설정                                                  |
| `--cpus`            | CPU 수                                                          |
| `--cpuset-cpus`     | 실행을 허용할 CPU(0-3, 0, 1)                                    |
| `-c, --cpu-shares`  | CPU 점유율(상대적 가중치)                                       |
| `-m, --memory`      | 메모리 한도                                                     |
| `--memory-swap`     | 스왑 한도는 메모리에 스왑을 더한 값과 같습니다.(-1 무제한 스왑) |
| `--restart`         | 컨테이너가 종료됐을 때 재시작 관련 정책                         |

::: tip 컨테이너 실행 명령어 별칭
보통 `docker run` 명령이 주로 사용되지만 현재 공식 사이트에서는 `docker container run`이(가) 주 명령어로 표시되며 `docker run`이(가) 별칭으로 표시되어 있습니다.
:::

## 컨테이너 중지

구동 중인 Docker 컨테이너를 중지하는 명령어로 PowerShell을 관리자 권한으로 열어 `docker stop [옵션] 컨테이너 [컨테이너...]` 명령을 입력합니다.

```sh
$ docker stop [옵션] 컨테이너 [컨테이너...]
```

| 옵션           | 설명                                          |
| :------------- | :-------------------------------------------- |
| `-s, --signal` | 컨테이너에 보내는 신호                        |
| `-t, --time`   | 컨테이너가 중지될 때까지 기다려야 할 시간(초) |

::: tip 컨테이너 중지 명령어 별칭
보통 `docker stop` 명령이 주로 사용되지만 현재 공식 사이트에서는 `docker container stop`이(가) 주 명령어로 표시되며 `docker stop`이(가) 별칭으로 표시되어 있습니다.
:::

## 컨테이너 시작

중지된 Docker 컨테이너를 시작하는 명령어로 PowerShell을 관리자 권한으로 열어 `docker start [옵션] 컨테이너 [컨테이너...]` 명령을 입력합니다.

```sh
$ docker start [옵션] 컨테이너 [컨테이너...]
```

| 옵션                | 설명                            |
| :------------------ | :------------------------------ |
| `-a, --attach`      | STDOUT/STDERR 연결 및 신호 전달 |
| `-i, --interactive` | 컨테이너의 표준 입력을 유지     |

::: tip 컨테이너 시작 명령어 별칭
보통 `docker start` 명령이 주로 사용되지만 현재 공식 사이트에서는 `docker container start`이(가) 주 명령어로 표시되며 `docker start`이(가) 별칭으로 표시되어 있습니다.
:::

## 컨테이너(구동 중) command 실행

구동 중인 Docker 컨테이너에 command를 실행하는 명령어로 PowerShell을 관리자 권한으로 열어 `docker exec [옵션] 컨테이너 명령어 [인수...]` 명령을 입력합니다.

```sh
$ docker exec [옵션] 컨테이너 명령어 [인수...]
```

| 옵션                | 설명                                                       |
| :------------------ | :--------------------------------------------------------- |
| `-i, --interactive` | 컨테이너와 연결(attach)되어 있지 않더라도 표준 입력을 유지 |
| `-t, --tty`         | 가상으로 터미널과 유사한 환경을 제공                       |
| `-d, --detach`      | 백그라운드에서 컨테이너를 실행하고 컨테이너 ID를 출력      |
| `-u, --user`        | Username 또는 UID (형식: `\<name\|uid\>\[:group\|gid\]`)   |

::: tip 컨테이너 command 실행 명령어 별칭
보통 `docker exec` 명령이 주로 사용되지만 현재 공식 사이트에서는 `docker container exec`이(가) 주 명령어로 표시되며 `docker exec`이(가) 별칭으로 표시되어 있습니다.
:::

## 컨테이너(구동 중) 구성 업데이트

구동 중인 Docker 컨테이너에 구성을 업데이트 하는 명령어로 PowerShell을 관리자 권한으로 열어 `docker update [옵션] 컨테이너 [컨테이너...]` 명령을 입력합니다.

```sh
$ docker update [옵션] 컨테이너 [컨테이너...]
```

| 옵션               | 설명                                                            |
| :----------------- | :-------------------------------------------------------------- |
| `--cpus`           | CPU 수                                                          |
| `--cpuset-cpus`    | 실행을 허용할 CPU(0-3, 0, 1)                                    |
| `-c, --cpu-shares` | CPU 점유율(상대적 가중치)                                       |
| `-m, --memory`     | 메모리 한도                                                     |
| `--memory-swap`    | 스왑 한도는 메모리에 스왑을 더한 값과 같습니다.(-1 무제한 스왑) |
| `--restart`        | 컨테이너가 종료됐을 때 재시작 관련 정책                         |

::: tip 컨테이너 구성 업데이트 명령어 별칭
보통 `docker update` 명령이 주로 사용되지만 현재 공식 사이트에서는 `docker container update`이(가) 주 명령어로 표시되며 `docker update`이(가) 별칭으로 표시되어 있습니다.
:::

## 컨테이너 로그

구동 중일 때 Docker 컨테이너에 남겨진 로그를 일괄 검색하는 명령어로 PowerShell을 관리자 권한으로 열어 `docker logs [옵션] 컨테이너` 명령을 입력합니다.

```sh
$ docker logs [옵션] 컨테이너
```

| 옵션               | 설명                                                                 |
| :----------------- | :------------------------------------------------------------------- |
| `-f, --follow`     | 로그 출력 따라가기                                                   |
| `--since`          | 타임스탬프 값이나 상대적인 시간(예: 42m - 42분동안) 이후의 로그 표시 |
| `--until`          | 타임스탬프 값이나 상대적인 시간(예: 42m - 42분동안) 이전의 로그 표시 |
| `-n, --tail`       | 로그의 끝부터 위로 표시할 줄 수                                      |
| `-t, --timestamps` | 타임스탬프 표시                                                      |

::: tip 컨테이너 로그 명령어 별칭
보통 `docker logs` 명령이 주로 사용되지만 현재 공식 사이트에서는 `docker container logs`이(가) 주 명령어로 표시되며 `docker logs`이(가) 별칭으로 표시되어 있습니다.
:::

## 컨테이너 통계

구동 중인 Docker 컨테이너의 사용 통계를 실시간 스트림으로 표시해주는 명령어로 PowerShell을 관리자 권한으로 열어 `docker stats [옵션] [컨테이너...]` 명령을 입력합니다.

```sh
$ docker stats [옵션] [컨테이너...]
```

| 옵션         | 설명                                                   |
| :----------- | :----------------------------------------------------- |
| `-a, --all`  | 모든 컨테이너 표시(기본적으로 실행 중인 것으로 표시됨) |
| `--no-trunc` | 출력이 잘리지 않고 표시되도록 설정                     |

::: tip 컨테이너 통계 명령어 별칭
보통 `docker stats` 명령이 주로 사용되지만 현재 공식 사이트에서는 `docker container stats`이(가) 주 명령어로 표시되며 `docker stats`이(가) 별칭으로 표시되어 있습니다.
:::
