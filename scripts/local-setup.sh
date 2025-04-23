#!/bin/bash

### Init DB

# Create storage data folders
mkdir -p ~/data/db1 ~/data/db2 ~/data/db3

# Start db instances
echo "Starting MongoDB instances..."
mongod --port 27017 --dbpath ~/data/db1 --replSet rs0 --bind_ip localhost --fork --logpath ~/data/db1/mongod.log
mongod --port 27018 --dbpath ~/data/db2 --replSet rs0 --bind_ip localhost --fork --logpath ~/data/db2/mongod.log
mongod --port 27019 --dbpath ~/data/db3 --replSet rs0 --bind_ip localhost --fork --logpath ~/data/db3/mongod.log
echo "Started all db clusters"


# Start Redis server
echo "Starting Redis server..."
redis-server --daemonize yes
echo "Started Redis server"

# Log end
echo "All servers are started!"

sleep 20

### Config Mongo DB replica set

mongosh ./config-rs.js

echo "Replica set config done!"
