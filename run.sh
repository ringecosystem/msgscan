#!/bin/bash

# check if `docker compose` or `docker-compose` is installed
if ! command -v docker-compose &> /dev/null
then
    if ! command -v docker compose &> /dev/null
    then
        echo "docker-compose or docker compose could not be found."
        exit 1
    else
        alias docker-compose='docker compose'
    fi
fi

# stop and clean
docker-compose down
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
    docker-compose up -d --build
else
    docker-compose up -d
fi

docker-compose logs -f