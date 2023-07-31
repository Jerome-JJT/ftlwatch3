
APP_NAME	= ftlwatch3

COMPOSE_BASE		= -f ./docker-compose.yml
COMPOSE_DEV		= -f ./docker-compose.yml -f ./docker-compose.dev.yml
COMPOSE_PROD	= -f ./docker-compose.yml -f ./docker-compose.override.yml

#Dev
DOCKER		= docker compose ${COMPOSE_DEV} -p ${APP_NAME}

#Prod
# DOCKER		= docker compose ${COMPOSE_PROD} ${ENV_FILE} -p ${APP_NAME}

all:		start

build:
			${DOCKER} build



start:
			${DOCKER} up -d --build

ps:
			${DOCKER} ps -a

logs:
			${DOCKER} logs
flogs:
			${DOCKER} logs -f

logsfront:
			${DOCKER} logs front
logsapi:
			${DOCKER} logs back
logspostg:
			${DOCKER} logs db

flogsfront:
			${DOCKER} logs -f front
flogsback:
			${DOCKER} logs -f back
flogspostg:
			${DOCKER} logs -f db

refront:
			${DOCKER} restart front
reback:
			${DOCKER} restart back
repostg:
			${DOCKER} restart db


run:
			${DOCKER} exec front sh
runapi:
			${DOCKER} exec back bash
runpostg:
			${DOCKER} exec postgres bash
rundb:
			${DOCKER} exec postgres psql --host=postgres --dbname=test_db --username=user -W





down:
			${DOCKER} down

clean:		down
#			${DOCKER} down --volumes

re:			clean build start

.PHONY:		all build start ps logs flogs run api down clean re
