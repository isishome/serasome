---
title: MariaDB 커넥션 풀
description: Mariadb 사용 시 미리 생성된 커넥션 풀에서 가져온 Connection을 반환하는 방법을 알아봅시다.
---

# MariaDB 커넥션 풀
> [!info] 커넥션 풀(Connection Pool)
> Express.js에서 MariaDB 미들웨어 사용 시 **정해진 수만큼 미리 커넥션 풀을 만들고**, 만들어진 커넥션 풀에서 연결을 가져와 데이터를 조회하거나 가공하는 데 사용합니다.
> 미리 생성된 커넥션을 재사용하기 때문에 불필요한 자원 소모를 방지하고 연결에 소비되는 시간도 절약할 수 있습니다.

## 커넥션 풀 강제 종료(반환)

지난 포스트인 [SIGTERM SIGINT](./process-exit.md)에서 확인했던 커넥션 풀 목록 중 **Sleep** 상태로 오랜 시간 대기 중인 연결들이 항상 여러 개 남아있는 것이 이상했습니다.

```shell
$ sudo mariadb
```
```shell
MariaDB > show processlist;
```
```console{5,7}
+----+--------+--------------+---------+---------+-------+-------+------+----------+
| Id | User   | Host         | db      | Command | Time  | State | Info | Progress |
+----+--------+--------------+---------+---------+-------+-------+------+----------+
|  0 | tester | 0.0.0.0:1000 | tr***** | Sleep   |     2 |       | NULL |    0.000 |
|  1 | tester | 0.0.0.0:1001 | tr***** | Sleep   |  2034 |       | NULL |    0.000 |
|  2 | tester | 0.0.0.0:1002 | tr***** | Sleep   |     2 |       | NULL |    0.000 |
|  3 | tester | 0.0.0.0:1002 | tr***** | Sleep   |  3014 |       | NULL |    0.000 |
|  . |    .   |      .       |    .    |    .    |     . |       |  .   |        . |
|  . |    .   |      .       |    .    |    .    |     . |       |  .   |        . |
|  . |    .   |      .       |    .    |    .    |     . |       |  .   |        . |
```

오랜 시간 사용되지 않고 Sleep 상태인 커넥션 풀은 `kill Id;` 명령으로 강제로 종료해도 됩니다.
```shell
MariaDB > kill 1;
Query OK, 0 rows affected (0.00 sec)
```
하지만 그것도 그때뿐 한참 뒤 확인하면 비슷한 숫자의 **놀고 있는 커넥션 풀**이 생겨납니다. 그렇게 고민을 한창 하던 중에 갑자기 머리를 스치고 지나가는 것이 있었으니...

## 커넥션 풀 반환

MariaDB 미들웨어에서 데이터를 조회하거나 가공할 때 풀 개체의 `getConnection()` 메서드를 사용해 커넥션 풀에서 사용 가능한 **커넥션**을 가져옵니다. 사용이 끝난 커넥션은 `release()` 메서드를 사용해 **반환해 주는 과정이 꼭 필요합니다.**
```js{4,13}
import { createPool } from 'mariadb'

const pool = createPool(디비 연결 정보)
const conn = await pool.getConnection()

try {
  const names = await conn.query(`select name from users`)
}
catch {
  // 예외 처리
}
finally {
  conn.release()
}

```

커넥션을 가져와 사용하는 코드를 모두 찾아 혹시나 누락된 반환 작업이 없는지 확인했고, **역시나 일부 누락된 반환 작업이 있음을 확인하고** 추가함과 동시에 코드 일관성을 위해 `try { } catch { } finally { }`를 사용해 항시 실행되도록 **finally** 구문에 `release()` 메서드를 호출하도록 변경해 주었습니다.