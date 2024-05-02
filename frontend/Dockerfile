# alpine 16 버전 기반
FROM node:16-alpine as build-stage

# 작업 디렉토리
WORKDIR /app

# 코드 복사
COPY . .

# 의존성 설치
RUN npm install && \

# 프로젝트 빌드
    npm run docs:build

# nginx 1.26.0 alpine 버전 기반
FROM nginx:1.26.0-alpine as service-stage

# 작업 디렉토리
WORKDIR /etc/nginx

# 코드 복사
COPY ./nginx.conf ./

# 빌드 정리
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 포트 명시
EXPOSE 80

# node 실행
ENTRYPOINT ["nginx", "-g", "daemon off;"]