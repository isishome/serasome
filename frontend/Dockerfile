# alpine 16 버전 기반
FROM node:16-alpine

# 작업 디렉토리
WORKDIR /app

# 코드 복사
COPY . .

# 의존성 설치
RUN npm install && \

# 프로젝트 빌드
    npm run docs:build