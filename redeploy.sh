#!/bin/bash

# Fully redeploy by cleaning up the `data` and `.ponder` directories

docker compose down
sudo rm -rf ~/msgscan/server/.ponder
sudo rm -rf ~/msgscan/data
export $(grep -v '^#' .env | xargs) # Load environment variables
docker compose up -d --build