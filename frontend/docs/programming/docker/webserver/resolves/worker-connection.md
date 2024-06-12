---
title: Nginx 작업자 연결 부족
description: Nginx의 worker_connections 부족으로 인해 발생하는 worker_connections are not enough 문제를 해결해 봅시다.
---

# Nginx 작업자 연결 부족
서비스 중인 [디아블로® IV | 트레이더스](https://d4.tradurs.com/) 사이트에 발생하는 이상 현상을 발견 했습니다.\
사이트 새로고침 시 간헐적으로 **일부 컨텐츠(데이터 + 이미지 등)가 누락**되고 있었습니다.

AWS Lightsail 지표에는 별다른 특이사항을 찾지 못했고 인스턴스에 접속해 Nginx 컨테이너의 로그를 확인해보기로 했습니다.
```shell
$ sudo docker logs --tail 100 컨테이너
```
> [!tip] 일부 로그만 확인
> **docker logs** 명령어의 `--tail` 옵션을 사용하면 가장 끝부터 위로 지정한 라인수만큼의 로그만 볼 수 있습니다.

> [!tip] error 로그만 확인
> - 다음 명령을 사용하면 Nginx 컨테이너의 에러 로그만 확인할 수 있습니다.
> ```shell
> $ sudo docker logs -f 컨테이너 1>/dev/null
> ```

정상적인 로그 사이에 이상한 로그가 대량으로 남아있었습니다.

<br />
<b style="padding:0 .2em;font-size:1.2em">1024 worker_connections are not enough</b>
<br />
<br />

작업자 연결수가 부족하여 일부 요청에 대한 응답이 실패하면서 컨텐츠가 표시되지 않는 현상이 발생하고 있었던 것이죠.

간단하게 `nginx.conf` 설정 파일에서 작업자 연결수를 늘려주면 해결됩니다만...
```ini
user  nginx;
worker_processes  auto;
worker_rlimit_nofile 500000;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;

events {
    worker_connections  1024; // [!code --]
    worker_connections  4096; // [!code ++] 
}
```
임시방편으로 작업자 연결 부족 문제는 해결했지만 **서버 성능을 고려하지 않고 임의**로 올려둔 거라 좀 불안하기도 했고,(<u>최종 목표가 낮은 사양에서 최고의 성능을 뽑을 수 있도록 웹서버 구축이었기 때문에...</u>) **트래픽 과부하도 아닌 상태에서 장애가 발생**했다는 게 뭔가 찜찜했습니다.

그래서 서버를 주기적으로 관찰하며 정확한 원인을 계속해서 찾아보기로 했습니다.