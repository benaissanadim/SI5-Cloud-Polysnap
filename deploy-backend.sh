#!/bin/bash

function deploy()  # $1 is the dir to get it
{
    cd "$1" || exit
    npm run build
    npm run deploy
    cd ..
}

echo "Deploying backend..."

deploy "media-service"
deploy "messaging-reader-service"
deploy "messaging-service"
deploy "messaging-store-service"
deploy "stories-service"
deploy "users-service"

echo "** Done all"