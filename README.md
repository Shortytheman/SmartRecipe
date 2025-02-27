# Multi-Database recipe recommendation system

## Overview

This project demonstrates a multi-database setup using SQL, MongoDB, and Neo4j for a recipe recommendation system. It includes a Node.js backend with Express.js to handle CRUD operations. Prisma is used as the ORM for SQL databases.

# Setup

## .env variables
`DATABASE_URL="mysql://root:password@localhost:3306/smartrecipe"`

`MONGODB_URI="mongodb://localhost:27017/smartrecipe"`

`NEO4J_URI="bolt://localhost:7687"`

`NEO4J_USER="neo4j"`

### Run Setup Scripts

`DB_HOST=localhost`

`DB_USERNAME=root`

`DB_PASSWORD=password`

`DB_PORT=3306`

`DB_DATABASE=smartrecipe`

## Run Setup Scripts

`npm prisma:generate`

`npm prisma:migrate`

`npm run seed:mysql`

`npm run seed:mongo`

`npm run seed:neo4j`

# Access Neo4j In Docker
cypher-shell -u neo4j -p password

return all recipes

`MATCH (r:Recipe) RETURN r`;

## Our Dumpfiles
https://github.com/Shortytheman/SmartRecipe/tree/main/dumpfiles

## Our SQL scripts
https://github.com/Shortytheman/SmartRecipe/blob/main/prisma/seed.js

## Server config
PORT=3000
NODE_ENV=development

## Running the Application

1. Install dependencies: `npm install`
2. Start the server: `npm run dev`
3. Access the API at `http://localhost:3000`

## Example API Calls

## Get Recipe
`http://localhost:3000/mongodb/recipe/:id`

`http://localhost:3000/neo4j/recipe/:id`

`http://localhost:3000/mysql/recipe/:id`


## Visualizations

http://localhost:7474/browser/ for Neo4j

MongoDB Compass for MongoDB

## Link to hosted Projects Swagger

https://humble-transformation-production.up.railway.app/docs/


## Google cloud hosting commands

# First clone the repository
git clone https://github.com/Shortytheman/SmartRecipe.git
cd SmartRecipe

# Then checkout the specific branch
git switch google-cloud

# Build and start
docker-compose up --build -d

# Run seeders
docker-compose exec app npm run seed

# Stop the container
docker-compose down

# Start the container
docker-compose up -d

# Remove the container
docker rmi smartrecipe_app

# Show logs
docker-compose logs app

# Remove volumes
docker-compose down -v


# Docker exec commands


# Install curl in the container
docker-compose exec app apt-get update
docker-compose exec app apt-get install -y curl


# Railway commands

# Connect to the Railway project
railway link

# Run migrations
railway run npx prisma migrate deploy

# Generate Prisma client
railway run npx prisma generate

# Deploy
railway up

# Pull
railway pull


# Run seeders
railway run npm run seed:mysql
railway run npm run seed:mongo


# APP URL

humble-transformation-production.up.railway.app

# Swagger URL

https://humble-transformation-production.up.railway.app/docs/