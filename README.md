# Multi-Database recipe recommendation system

## Overview

This project demonstrates a multi-database setup using SQL, MongoDB, and Neo4j for a recipe recommendation system. It includes a Node.js backend with Express.js to handle CRUD operations. Prisma is used as the ORM for SQL databases.

## Setup

### Run Setup Scripts

# USIKKER PÅ OM MAN SKAL KØRE MIGRATE SCRIPTS PPÅ NY COMPUTER??

`npm run seed:mysql`

`npm run seed:mongo`

`npm run seed:neo4j`

# Access Neo4j In Docker
cypher-shell -u neo4j -p password

return all recipes

`MATCH (r:Recipe) RETURN r`;
## Running the Application

1. Install dependencies: `npm install`
2. Start the server: `npm run dev`
3. Access the API at `http://localhost:3001`

## Example API Calls

### Get Recipe
`http://localhost:3001/mongodb/recipe/:id`

`http://localhost:3001/neo4j/recipe/:id`

`http://localhost:3001/mysql/recipe/:id`


## Visualizations

http://localhost:7474/browser/ for Neo4j

MongoDB Compass for MongoDB

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