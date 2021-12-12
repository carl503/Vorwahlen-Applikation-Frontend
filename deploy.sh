#!/usr/bin/env bash

if [ "$APPVEYOR_REPO_TAG" = true ] ; then
echo "    ____             __           "
echo "   / __ \___  ____  / /___  __  __"
echo "  / / / / _ \/ __ \/ / __ \/ / / /"
echo " / /_/ /  __/ /_/ / / /_/ / /_/ / "
echo "/_____/\___/ .___/_/\____/\__, /  "
echo "          /_/            /____/   "

echo BUILDING DOCKER IMAGE
echo "$DOCKERHUB_PASS" | docker login --username vorwahlen --password-stdin
docker build -t frontend .
docker tag frontend vorwahlen/frontend:latest
docker push vorwahlen/frontend

echo SETTING UP SSH
curl -sflL 'https://raw.githubusercontent.com/appveyor/secure-file/master/install.sh' | bash -e -
./appveyor-tools/secure-file -decrypt ./pa.pem.enc -secret $SSH_ENC_PW -salt $SSH_ENC_SALT -out pa.pem
chmod 0600 pa.pem
echo -e "Host *\n\tStrictHostKeyChecking no\n\n" > ~/.ssh/config

echo RUNNING DOCKER IMAGE UPDATE ON REMOTE SERVER
ssh -i pa.pem ubuntu@vorwahlen.cloudlab.zhaw.ch "cd wpm; docker-compose pull && docker-compose up -d"

echo "Image has been uploaded to Docker Hub."

fi