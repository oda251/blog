SQLS := $(shell find ./db/init -name "*.sql")
MODE ?= dev

init-db:
	@echo "Initializing database..."
	@dotenv -e .env.local -- bq query --use_legacy_sql=false "$(shell cat $(SQLS))"