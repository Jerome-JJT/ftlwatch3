
APP_NAME	= ftlwatch3

COMPOSE_BASE		= -f ./docker-compose.yml
COMPOSE_DEV		= -f ./docker-compose.yml -f ./docker-compose.dev.yml
COMPOSE_PROD	= -f ./docker-compose.yml -f ./docker-compose.override.yml


ifeq ($(hostname), 42lwatch3)
	#Dev
	DOCKER		= docker compose ${COMPOSE_DEV} -p ${APP_NAME}_dev
else
	#Prod
	DOCKER		= docker compose ${COMPOSE_PROD} ${ENV_FILE} -p ${APP_NAME}
endif


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
logsback:
			${DOCKER} exec back tail -n30 /var/log/apache2/mylogger.log
logsback2:
			${DOCKER} logs back
logspostg:
			${DOCKER} logs db
logsf:
			${DOCKER} logs flyway

flogsfront:
			${DOCKER} logs -f front
flogsback:
			${DOCKER} exec back tail -f /var/log/apache2/mylogger.log
flogsback2:
			${DOCKER} logs -f back
flogspostg:
			${DOCKER} logs -f db

refront:
			${DOCKER} restart front
reback:
			${DOCKER} restart back
repostg:
			${DOCKER} restart db

info:
			${DOCKER} exec flyway bash /flyway/sql/_myflyway.sh info
migrate:
			${DOCKER} exec flyway bash /flyway/sql/_myflyway.sh migrate
repair:
			${DOCKER} exec flyway bash /flyway/sql/_myflyway.sh repair
revert:
			${DOCKER} exec flyway bash /flyway/sql/_myflyway.sh undo

runf:
			${DOCKER} exec flyway bash
runapi:
			${DOCKER} exec api bash
api:
			${DOCKER} exec api python -i _api.py
runfront:
			${DOCKER} exec front sh
runback:
			${DOCKER} exec back bash
runpostg:
			${DOCKER} exec postgres bash
rundb:
			${DOCKER} exec postgres psql --host=postgres --dbname=test_db --username=user -W





down:
			${DOCKER} down

clean:		down
					${DOCKER} down --volumes

re:			
					${MAKE} clean 
					${MAKE} all
					sleep 4
					${MAKE} migrate


.PHONY:		all build start ps logs flogs run api down clean re
