FROM node:20-buster-slim as builder

RUN apt-get update && \
    apt-get install -y python3-dev make gcc g++ git build-essential openssh-client openssl bash libc6-dev wget

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["node", "dist/main"]

EXPOSE 3000