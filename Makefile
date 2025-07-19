all:
	@docker-compose up -d

build:
	@docker-compose up -d --build

stop:
	@docker-compose down

logs:
	@docker-compose logs -f

re: stop all

.PHONY: all build stop logs re