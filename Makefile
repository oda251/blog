all:
	@docker compose up -d
	@docker compose logs -f

build:
	@docker compose up -d --build

stop:
	@docker compose down

rm-volumes:
	@docker compose down -v

logs:
	@docker compose logs -f

re: stop all

.PHONY: all build stop logs re