#!/bin/bash

# Fully redeploy by cleaning up the `data` and `.ponder` directories

docker compose down
sudo rm -rf ./server/.ponder
sudo rm -rf ./data
export $(grep -v '^#' .env | xargs) # Load environment variables
docker compose up -d --build
docker compose logs -f
