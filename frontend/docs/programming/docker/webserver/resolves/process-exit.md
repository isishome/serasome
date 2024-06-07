---
title: SIGTERM SIGINT
description: 프로세스에 전달되는 SIGTERM SIGINT 신호에 대해 알아봅시다.
---

# SIGTERM SIGINT
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
// connections
const connections = new Set()

httpServer.on('connection', connection => {
  connections.add(connection)
  connection.on('close', (r) => {
    connections.delete(connection)
  })
})

// gracefully shutdown logic
const disconnect = async () => {
  console.log('Closing mariadb connection.')
  try {
    await pool.end()
  }
  catch (e) {
    console.log(`Failed to close mariadb connection : ${e}`)
  }

  console.log('All socket instances disconnect')
  try {
    io.disconnectSockets(true)
  }
  catch (e) {
    console.log(`Failed to disconnect socket instances : ${e}`)
  }

  console.log('Close all session store')
  await closeStores()
}

const shutdownHandler = async () => {
  console.info('SIGTERM or SIGINT signal received')

  console.log('Closing http server.')
  httpServer.close(async (err) => {
    if (err) {
      console.log(`Failed to close http server : ${err}`)
    }

    await disconnect()
    console.log('Complete gracefully shutdown.')
    process.exit(0)
  })

  setTimeout(async () => {
    await disconnect()
    console.error('Could not close connections in time, forcefully shutting down')
    process.exit(1)
  }, 10000)

  connections.forEach(c => c.end())
  setTimeout(() => connections.forEach(c => c.destroy()), 5000)
}

process.on('SIGTERM', shutdownHandler)
process.on('SIGINT', shutdownHandler)
```
`shutdownHandler` 핸들러에 차례대로

1. **http 연결 닫기**
1. **mariadb 연결 닫기**
1. **socket 연결 끊기**
1. **session 저장소 제거** 


프로세스에 `SIGTERM`과 `SIGINT` 신호를 받았을 동작하도록 핸들러를 연결해 주었습니다.

> [!info] SIGTERM, SIGINT
> - **SIGTERM** : 프로세스에 전달되는 종료 신호의 하나로 **kill** 명령을 내릴 때 전송됩니다.
> - **SIGINT** : 프로세스에 전달되는 종료 신호의 하나로 **Ctrl + C**를 누를 전송됩니다.