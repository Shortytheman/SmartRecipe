# Multi-Database recipe recommendation system

## Overview

This project demonstrates a multi-database setup using SQL, MongoDB, and Neo4j for a recipe recommendation system. It includes a Node.js backend with Express.js to handle CRUD operations. Prisma is used as the ORM for SQL databases.

## Project Structure

- **src**: Contains the application code.
  - **routes**: Defines API endpoints.
  - **controllers**: Handles request logic.
  - **services**: Contains business logic for each database type.
  - **models**: Defines data models for each database.

- **scripts**: Contains setup scripts for databases.

## Setup

1. **SQL**: Run `npx prisma migrate dev` to create tables and insert sample data.
2. **MongoDB**: Execute `scripts/setupMongo.js` to populate collections.
3. **Neo4j**: Run `scripts/setupNeo4j.cql` to create nodes and relationships.

# In Docker Neo4j
cypher-shell -u neo4j -p password

## Running the Application

1. Install dependencies: `npm install`
2. Start the server: `npm start`
3. Access the API at `http://localhost:3000`

## Extending the Project

- Add new entities by defining models and services in the respective folders.
- Update routes and controllers to handle new operations. 


## Visualizations

http://localhost:7474/browser/ for Neo4j

MongoDB Compass for MongoDB