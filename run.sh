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

# env vars
echo "Setting up environment variables..."
export POSTGRES_HOST=pg
export POSTGRES_PORT=5432
export POSTGRES_USER=postgres
export POSTGRES_PASSWORD=password
export POSTGRES_DB=postgres
export PONDER_RPC_URL_ETHEREUM=https://mainnet.infura.io/v3/b4916cde136d459c8105e497ff300ec7
export PONDER_RPC_URL_SEPOLIA=https://sepolia.infura.io/v3/b4916cde136d459c8105e497ff300ec7
export PONDER_RPC_URL_ARBITRUM=https://arbitrum-mainnet.infura.io/v3/b4916cde136d459c8105e497ff300ec7
export PONDER_RPC_URL_ARBITRUM_SEPOLIA=https://arbitrum-sepolia.infura.io/v3/b4916cde136d459c8105e497ff300ec7
export PONDER_RPC_URL_POLYGON=https://polygon-mainnet.infura.io/v3/b4916cde136d459c8105e497ff300ec7
export PONDER_RPC_URL_BLAST=https://rpc.blast.io
export PONDER_RPC_URL_TAIKO_KATLA=https://rpc.katla.taiko.xyz
export PONDER_RPC_URL_TRON_SHASTA=https://api.shasta.trongrid.io/jsonrpc
export PONDER_RPC_URL_DARWINIA=http://c1.darwinia-rpc.itering.io:9944/
export PONDER_RPC_URL_CRAB=http://c2.crab-rpc.itering.io:9944/
export PONDER_RPC_URL_PANGOLIN=http://g1.testnets.darwinia.network:9940
export PONDER_RPC_URL_PANGORO=https://fraa-flashbox-2871-rpc.a.stagenet.tanssi.network
export PANGORO_MAX_REQUESTS_PER_SECOND=10

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
