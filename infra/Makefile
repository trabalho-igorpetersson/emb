PROJECT=embarcados
SHELL=/bin/bash


up: infra-up

down: infra-down


infra-up:
	sudo docker compose -f ./docker-compose.yaml -p $(PROJECT) up -d

infra-down:
	sudo docker compose -f ./docker-compose.yaml -p $(PROJECT) down --remove-orphans

