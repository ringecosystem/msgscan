#!/bin/bash

# check if `docker compose` or `docker-compose` is installed
if ! command -v docker-compose &> /dev/null
then
    if command -v docker &> /dev/null
    then
        DOCKER_COMPOSE='docker compose'
    else
        echo "docker-compose could not be found. Please install it."
        exit 1
    fi
else
    DOCKER_COMPOSE='docker-compose'
fi

# stop if services are running
if $DOCKER_COMPOSE ps | grep -q "Up"
then
    echo "Stopping the services..."
    $DOCKER_COMPOSE down
fi

read -p "Do you want to remove the data and .ponder directories? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    sudo rm -rf ./server/.ponder
    sudo rm -rf ./data
fi

# check if .env file exists
if [ ! -f .env ]; then
    echo "No .env file found. Please create one."
    exit 1
fi
echo "Loading environment variables from .env file..."
export $(grep -v '^#' .env | xargs) # Load environment variables

# start the services
read -p "Do you want to build the images? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    $DOCKER_COMPOSE up -d --build
else
    $DOCKER_COMPOSE up -d
fi

$DOCKER_COMPOSE logs -f