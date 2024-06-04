---
title: 서버 장애 그리고 해결 과정
description: Docker로 구축한 웹서버에서 경험한 장애와 그 해결 과정 몇가지를 공유합니다.
---
# 서버 장애 그리고 해결 과정
> [!info] 들어가기 앞서
> 서버를 운영하다 보면 알 수 없는 장애로 인해 곤란한 상황을 겪는 경우가 종종 발생합니다.\
> 이 포스트에서는 [디아블로® IV | 트레이더스](https://d4.tradurs.com)를 실제 Docker 웹서버로 구축, 운영하면서 발생한 문제들과 그 해결 과정을 소개하도록 하겠습니다.

## Docker 리소스
Docker를 이용한 웹서버 구축 후 가볍게 자동 배포 및 접속 테스트까지 완료했습니다.

AWS Lightsail 지표도 `지속 가능 영역`에 안정적으로 안착해 있었습니다.
> [!WARNING] 지속 가능 영역과 버스트 가능 영역
> AWS Lightsail은 평소 인스턴스 **자원**을 일정량 모아두었다가 트래픽이 몰려 CPU 사용량이 늘어나 `지속 가능 영역`을 벗어나 `버스트 가능 영역`으로 들어가게 되면 모아두었던 **자원**을 조금씩 소비하게 됩니다.
> - 이때 모아둔 자원을 모두 소진하고도 `버스트 가능 영역`을 벗어나지 못하면 **서버에 문제가 발생할 수 있으니 주의해야 합니다**.

|![AWS Lightsail 지표](./images/resolve/lightsail.webp){:class='image'}|
|:--:|
| *AWS Lightsail 지표*{:class='caption'} |

### 인스턴스 접속 불가
실제 웹서버를 운영해 보면 혹시 문제가 있지 않을까 한 번씩 접속해 보곤 합니다.

그래서 운영 중인 사이트 중 아무거나 한곳을 클릭했는데...

|![만나고 싶지 않은 페이지](./images/resolve/502.webp){:class='image'}|
|:--:|
| *만나고 싶지 않은 페이지*{:class='caption'} |

**올 것이 왔구나...**

서둘러 AWS Lightsail에 접속해 SSH 연결을 시도했습니다.

|![AWS Lightsail SSH 접속 시도](./images/resolve/ssh.webp){:class='image'}|
|:--:|
| *AWS Lightsail SSH 접속 시도*{:class='caption'} |

평소대로라면 Ubuntu Shell 화면이 떠야 정상이지만, **SSH 접속조차 불가한 걸 보니 상황이 꽤 심각하다는 것을 알 수 있었습니다.**
사실 크게 당황하지는 않았습니다. 그도 그럴 것이 초기 Lightsail 최 하위 사양의 인스턴스를 사용하면서 이미 몇 번 겪었던 일이었기 때문이죠.

AWS Lightsail 관리자 페이지에 접속해 해당 **인스턴스를 재부팅 해줍니다**. 재부팅 되는 1~2분 정도를 기다린 후 SSH에 다시 접속했습니다.

`docker ps` 명령을 이용해 혹시 컨테이너들이 중지되진 않았는지 먼저 확인하였고, 다행히 Docker 컨테이너들은 정상적으로 동작 중이었습니다.
```Shell
$ sudo docker ps -a
```

재부팅 이후 웹사이트 접속은 가능했지만 장애가 재발할 가능성이 있기 때문에 원인을 찾아보기로 했습니다. **Docker 자원 관리**에 대한 정보를 검색하다 보니 간과하거나 잘못 알고 있던 것들이 생각보다 꽤나 많았습니다.

우선, Docker 컨테이너를 구성하면 **Docker가 각 컨테이너들의 자원을 자동으로 배분해 줄 것이라 착각**했습니다. 그리고 **Docker가 호스트의 자원을 어느 정도 보장해 줄 것이라 생각했는데** 이 두 원인 때문에 인스턴스(호스트)가 중지된 것으로 확신하게 되었고, 컨테이너 별로 자원 제한을 해주기로 했습니다.

## 컨테이너 자원 분배
`docker stats` 명령을 이용해 **컨테이너들의 현재 자원 이용 상황을 먼저 확인**해봅시다.
```Shell
$ sudo docker stats
```
```Shell
CONTAINER ID   NAME           CPU %     MEM USAGE / LIMIT   MEM %   NET I/O           BLOCK I/O        PIDS
000000000000   tradurs-d4     11.08%    50.15MiB / 2GiB     2.5%    789MB / 1.79GB    1.24MB / 0B      1
000000000001   nginx-host     4.50%     56.29MiB / 2GiB     2.81%   24.6GB / 15.7GB   89.8MB / 696kB   2
000000000002   tradurs-back   26.20%    157.5MiB / 2GiB     7.87%   8.28GB / 21.1GB   22.7MB / 0B      3
000000000003   jenkins        0.13%     270MiB / 2GiB       13.5%   42.6kB / 36.7kB   253MB / 47.5MB   4
```

현재 4개의 컨테이너가 실행 중이고 각 컨테이너의 메모리 사용량은 인스턴스의 전체 메모리(2Gb)에 크게 영향이 없는 것으로 보입니다. 그럼 이제 CPU 사용량을 확인해 봅시다. Node.js로 구동 중인 `tradurs-d4` 컨테이너와 `tradurs-back` 컨테이너의 CPU 사용량이 들쑥날쑥합니다. **최대 90%까지 치솟고 있었습니다.**

현재 구동 중인 컨테이너의 상태를 업데이트 하려면 `docker update` 명령을 사용합니다.
```Shell
$ sudo docker update --cpuset-cpus=0 --cpu-shares=1024 --memory=500 --memory-swap=1g 컨테이너
```
|옵션|설명|
|:-|:-|
|`--cpus`|CPU 수|
|`--cpuset-cpus`|실행을 허용할 CPU(0-3, 0, 1)|
|`-c, --cpu-shares`|CPU 점유율(상대적 가중치)|
|`-m, --memory`|메모리 한도|
|`--memory-swap`|스왑 한도는 메모리에 스왑을 더한 값과 같습니다.(-1 무제한 스왑)|

::: details 사용 예
- `--cpus`는 지정된 CPU의 수치를 설정합니다.
    - 예를 들어 4개의 CPU를 사용하는 인스턴스에서 `--cpus=1`로 설정하면 4개의 CPU를 모두 사용합니다.
    - 4개의 CPU를 사용하는 인스턴스에서 `--cpus=.5`로 설정하면 2개의 CPU를 사용합니다.
    - 지정된(`--cpuset-cpus`를 설정하지 않은 경우 전체) CPU를 총 1로 놓고 원하는 할당량을 설정하면 됩니다.
- `--cpuset-cpus`는 사용할 CPU를 선택하는 설정입니다.
    - 2개의 CPU를 사용하는 인스턴스는 각 CPU를 0, 1로 구분합니다.
    - 4개의 CPU를 사용하는 인스턴스는 각 CPU를 0, 1, 2, 3으로 구분합니다.
    - 4개의 CPU를 사용하는 인스턴스에서 특정 컨테이너를 `--cpuset-cpus=0`으로 설정하면 첫 번째 CPU만 사용합니다.
    - 4개의 CPU를 사용하는 인스턴스에서 특정 컨테이너를 `--cpuset-cpus=0,2`으로 설정하면 첫 번째, 세 번째 CPU만 사용합니다.
    - 4개의 CPU를 사용하는 인스턴스에서 특정 컨테이너를 `--cpuset-cpus=0-2`으로 설정하면 첫 번째, 두 번째, 세 번째 CPU만 사용합니다.
- `--cpu-shares`는 지정된 CPU를 얼마나 점유할지 설정합니다. 기본값은 1024입니다.
    - 0번 CPU를 사용하는 총 2개의 컨테이너가 있다고 가정했을 때 컨테이너 1에 1024를 컨테이너 2에 2048을 설정한 경우 두 컨테이너 각각 1:2 비율로 0번 CPU를 점유합니다.
- `--memory`는 말 그대로 메모리 한도를 지정합니다.
- `--memory-swap`는 말 그대로 메모리 스왑 한도를 지정합니다. **메모리 스왑 한도는 메모리 한도를 포함합니다**.
    - `--memory=1g --memory-swap=2g`로 설정한 경우 실제 인스턴스의 메모리를 **1gb** 한도로 하고 더 많은 메모리가 필요한 경우 **1gb**를 디스크 공간에서 사용합니다.(**2gb - 1gb**)
:::

컨테이너를 시작할 때 자원 할당량을 설정하려면 `docker run` 명령에 옵션을 함께 사용하면 됩니다.
```Shell
$ sudo docker run --cpuset-cpus=0 --cpu-shares=1024 --memory=500 --memory-swap=1g 컨테이너
```

컨테이너 별 자원량을 할당해 준 뒤로는 다행히 인스턴스(호스트)가 죽는 현상은 발생하지 않았습니다.

## SIGTERM SIGINT
다른 컨테이너들은 **무중단 배포**가 이상 없이 성공하는데 `tradurs-back` 컨테이너는 자동 배포 시 구동 후 **일정 시간이 지나면 중지돼버리는 문제가 발생했습니다**.

`docker logs` 명령으로 해당 컨테이너 로그를 확인했습니다.
```shell
$ sudo docker logs 컨테이너
```
```console
fatal: false,
errno: 45028,
sqlState: 'HY000',
code: 'ER_GET_CONNECTION_TIMEOUT' 
Error: retrieve connection from pool timeout
```
**mariadb**의 `pool`이 일정 시간마다 timeout이 발생하고 있었습니다. 
- ❌ **mariadb 미들웨어**의 `acquireTimeout` 설정값을 늘려줘도 같은 시간마다 timeout 발생했습니다.
단순히 `pool` 연결 시간문제가 아니라 **MariaDB 서버**가 연결된 `pool`을 강제로 끊어버리고 있었습니다.

- :heavy_check_mark: Nginx에서 **tradurs-back** 컨테이너의 설정 부분을 주석 처리하고 컨테이너를 `restart` 명령으로 재시작 했습니다. **컨테이너가 당연하게(?) 중지되지 않고 정상적으로 동작합니다.**
    - 내부적인 연결에는 문제가 없고, Nginx를 통해 외부와 연결될 때만 문제가 발생하고 있습니다.
    - 해당 상태(외부 연결이 끊김)에서 Nginx를 **tradurs-back** 컨테이너와 연결하면 다시 timeout 문제가 발생합니다.

**MariaDB 서버**에 접속해 `show processlist;` 명령으로 pool 목록을 확인해 보기로 했습니다.
```shell
$ sudo mariadb
```
```shell
MariaDB > show processlist;
```
```console
+----+--------+--------------+---------+---------+-------+-------+------+----------+
| Id | User   | Host         | db      | Command | Time  | State | Info | Progress |
+----+--------+--------------+---------+---------+-------+-------+------+----------+
|  0 | tester | 0.0.0.0:1000 | tr***** | Sleep   |     2 |       | NULL |    0.000 |
|  1 | tester | 0.0.0.0:1001 | tr***** | Sleep   |     1 |       | NULL |    0.000 |
|  2 | tester | 0.0.0.0:1002 | tr***** | Sleep   |     2 |       | NULL |    0.000 |
|  . |    .   |      .       |    .    |    .    |     . |       |  .   |        . |
|  . |    .   |      .       |    .    |    .    |     . |       |  .   |        . |
|  . |    .   |      .       |    .    |    .    |     . |       |  .   |        . |
```

정상적으로 연결된 `pool` 리스트가 보입니다.\
다시 Nginx를 통해 외부와 연결되면, 알 수 없는 `pool`들이 급격하게 증가하고, 기본 설정된 timeout 시간(10초)이 경과하면 **정상적으로 연결되었던 `pool`들까지 모두 강제로 끊어버립니다.**

기존 **tradurs-back** 컨테이너에 연결 또는 대기 중이던 요청들이 호스트 네트워크에 남아있다가 Nginx가 연결되면 요청을 재개하면서 발생하는 문제라고 판단, 컨테이너를 중지하거나 새 컨테이너가 시작될 때 `http server`, `mariadb connection`, `socket connection`, `express session`을 정리하는 로직을 추가하기로 결정했습니다.

> [!info] Graceful Shutdown
> 소프트웨어의 기능을 통해 운영 체제가 프로세스를 안전하게 종료하고 연결을 닫는 작업을 수행하는 것을 뜻합니다.

<br />

Node.js의 `index.js`에 아래와 같은 **SIGTERM**과 **SIGINT** 신호 구문을 추가했습니다.
```js
const shutdownHandler = async () => {
  console.info('SIGTERM or SIGINT signal received')
  console.log('Closing http server.')
  httpServer.close(async (err) => {
    if (err) {
      console.log(`Failed to close http server : ${err}`)
      process.exit(1)
    }

    console.log('Closing mariadb connection.')

    try {
      await Promise.all([pool.end(), poold4.end()])
    }
    catch (e) {
      console.log(`Failed to close mariadb connection : ${e}`)
      process.exit(1)
    }

    console.log('All socket instances disconnect')
    try {
      io.disconnectSockets()
    }
    catch (e) {
      console.log(`Failed to disconnect socket instances : ${e}`)
      process.exit(1)
    }

    console.log('Destroy all session store')
    destroySession()

    console.log('Complete gracefully shutdown.')

    process.exit(0)
  })
}

process.on('SIGTERM', shutdownHandler)
process.on('SIGINT', shutdownHandler)
```
`shutdownHandler` 핸들러에 차례대로
1. **http 연결 닫기**
1. **mariadb 연결 닫기**
1. **socket 연결 끊기**
1. **session 제거** 

프로세스에 `SIGTERM`과 `SIGINT` 신호를 받았을 동작하도록 핸들러를 연결해 주었습니다.

> [!info] SIGTERM, SIGINT
> - **SIGTERM** : 프로세스에 전달되는 종료 신호의 하나로 **kill** 명령을 내릴 때 전송됩니다.
> - **SIGINT** : 프로세스에 전달되는 종료 신호의 하나로 **Ctrl + C**를 누를 전송됩니다.