# alpine 16 버전 기반
FROM node:16-alpine

# 작업 디렉토리
WORKDIR /app

# 코드 복사
COPY . .

# 의존성 설치 및 프로젝트 빌드
RUN npm install \
    && npm run docs:build