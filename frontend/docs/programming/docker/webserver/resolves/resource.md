---
title: 컨테이너 자원 분배
description: Docker 컨테이너에 자원을 분배하는 방법을 알아봅시다.
---

# 컨테이너 자원 분배
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

> [!info] 사용 예
>- `--cpus`는 지정된 CPU의 수치를 설정합니다.
>    - 예를 들어 4개의 CPU를 사용하는 인스턴스에서 `--cpus=1`로 설정하면 4개의 CPU를 모두 사용합니다.
>    - 4개의 CPU를 사용하는 인스턴스에서 `--cpus=.5`로 설정하면 2개의 CPU를 사용합니다.
>    - 지정된(`--cpuset-cpus`를 설정하지 않은 경우 전체) CPU를 총 1로 놓고 원하는 할당량을 설정하면 됩니다.
>- `--cpuset-cpus`는 사용할 CPU를 선택하는 설정입니다.
>    - 2개의 CPU를 사용하는 인스턴스는 각 CPU를 0, 1로 구분합니다.
>    - 4개의 CPU를 사용하는 인스턴스는 각 CPU를 0, 1, 2, 3으로 구분합니다.
>    - 4개의 CPU를 사용하는 인스턴스에서 특정 컨테이너를 `--cpuset-cpus=0`으로 설정하면 첫 번째 CPU만 사용합니다.
>    - 4개의 CPU를 사용하는 인스턴스에서 특정 컨테이너를 `--cpuset-cpus=0,2`으로 설정하면 첫 번째, 세 번째 CPU만 사용합니다.
>    - 4개의 CPU를 사용하는 인스턴스에서 특정 컨테이너를 `--cpuset-cpus=0-2`으로 설정하면 첫 번째, 두 번째, 세 번째 CPU만 사용합니다.
>- `--cpu-shares`는 지정된 CPU를 얼마나 점유할지 설정합니다. 기본값은 1024입니다.
>    - 0번 CPU를 사용하는 총 2개의 컨테이너가 있다고 가정했을 때 컨테이너 1에 1024를 컨테이너 2에 2048을 설정한 경우 두 컨테이너 각각 1:2 비율로 0번 CPU를 점유합니다.
>- `--memory`는 말 그대로 메모리 한도를 지정합니다.
>- `--memory-swap`는 말 그대로 메모리 스왑 한도를 지정합니다. **메모리 스왑 한도는 메모리 한도를 포함합니다**.
>    - `--memory=1g --memory-swap=2g`로 설정한 경우 실제 인스턴스의 메모리를 **1gb** 한도로 하고 더 많은 메모리가 필요한 경우 **1gb**를 디스크 공간에서 사용합니다.(**2gb - 1gb**)

컨테이너를 시작할 때 자원 할당량을 설정하려면 `docker run` 명령에 옵션을 함께 사용하면 됩니다.
```Shell
$ sudo docker run --cpuset-cpus=0 --cpu-shares=1024 --memory=500 --memory-swap=1g 컨테이너
```

컨테이너 별 자원량을 할당해 준 뒤로는 다행히 인스턴스(호스트)가 죽는 현상은 발생하지 않았습니다.