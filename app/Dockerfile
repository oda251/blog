# syntax=docker/dockerfile:1

FROM oven/bun:1.1 AS base

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .

RUN bun run build

EXPOSE 4321

CMD ["bun", "run", "preview"]