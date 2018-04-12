#!/usr/bin/env bash

curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
sudo apt-get install -y nodejs
sudo apt-get update
sudo apt-get install --yes --force-yes mongodb-org
cd /vagrant/
npm install
npm update
npm run build
npm start

