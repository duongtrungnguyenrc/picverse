#!/bin/bash

mkdir -p ~/data/db1 ~/data/db2 ~/data/db3

echo "Starting MongoDB instances..."
mongod --port 27017 --dbpath ~/data/db1 --replSet rs0 --fork --logpath ~/data/db1/mongodb.log
mongod --port 27018 --dbpath ~/data/db2 --replSet rs0 --fork --logpath ~/data/db2/mongodb.log
mongod --port 27019 --dbpath ~/data/db3 --replSet rs0 --fork --logpath ~/data/db3/mongodb.log

echo "Starting Redis server..."
redis-server &

echo "All servers are started!"