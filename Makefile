
APP_NAME	= ftlwatch3

COMPOSE_BASE		= -f ./docker-compose.yml
COMPOSE_DEV		= -f ./docker-compose.yml -f ./docker-compose.dev.yml
COMPOSE_PROD	= -f ./docker-compose.yml -f ./docker-compose.override.yml

#Dev
DOCKER		= docker compose ${COMPOSE_DEV} -p ${APP_NAME}_dev

ifeq ($(shell hostname), 42lwatch3)
	ifeq ($(shell pwd), /var/www/ftlwatch3)
		#Prod
		DOCKER		= docker compose ${COMPOSE_PROD} -p ${APP_NAME}
	endif
endif


all:		start

build:
			${DOCKER} build

testenv:
		@echo $(hostname)
		@echo ${DOCKER}

presetup:
			docker network create logging_logstash
setup:		
			${DOCKER} exec back composer install
			$(MAKE) migrate
			sleep 60
			${DOCKER} exec rabbit bash /setup.sh
makerabbit:
			${DOCKER} exec rabbit bash /setup.sh


msgdev:
			${DOCKER} exec api python -c "from _rabbit import send_to_rabbit; send_to_rabbit('errors.server.message.queue', {'content': 'Deploy dev ${RELEASE_VERSION} done'})"
msgprod:
			${DOCKER} exec api python -c "from _rabbit import send_to_rabbit; send_to_rabbit('errors.server.message.queue', {'content': 'Deploy prod ${RELEASE_VERSION} done'})"

start:
			${DOCKER} up -d --build


ps:
			${DOCKER} ps -a

logs:
			${DOCKER} logs
flogs:
			${DOCKER} logs --tail 40 -ft

logsfront:
			${DOCKER} logs front
logsback:
			${DOCKER} exec back tail -n30 /var/log/apache2/mylogger.log
logsapi:
			${DOCKER} logs api
logspostg:
			${DOCKER} logs db
logsf:
			${DOCKER} logs flyway
logsnginx:
			${DOCKER} logs nginx

flogsfront:
			${DOCKER} logs --tail 40 -ft front
flogsback:
			${DOCKER} exec back tail -fn20 /var/log/apache2/mylogger.log
flogsapi:
			${DOCKER} logs --tail 40 -ft api
flogspostg:
			${DOCKER} logs --tail 40 -ft db
flogsnginx:
			${DOCKER} logs --tail 40 -ft nginx

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
runnginx:
			${DOCKER} exec nginx bash
runrabbit:
			${DOCKER} exec rabbit bash




down:
			${DOCKER} down

clean:		down
					${DOCKER} down --volumes

re:			
					${MAKE} clean 
					${MAKE} all
					sleep 4
					${MAKE} migrate


stats:
			\wc -l back/*.php back/controller/*.php back/controller/**/*.php back/model/*.php back/model/**/*.php back/routes/*.php
			\wc -l site/src/*.tsx site/src/components/*/*.tsx
			\wc -l api/*.py
			\wc -l sql/*.sql
			

.PHONY:		all build start ps logs flogs run api down clean re
