# syntax=docker/dockerfile:1

FROM oven/bun:1.1 AS base

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .

RUN bun run build

EXPOSE 3000

# Use bun dev for local development, bun run build/preview for production
CMD ["bun", "dev"]