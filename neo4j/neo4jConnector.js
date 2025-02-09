import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

const NEO4J_URI = process.env.NEO4J_URI;
const NEO4J_USER = process.env.NEO4J_USER;
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD;

if (!NEO4J_URI || !NEO4J_USER || !NEO4J_PASSWORD) {
    throw new Error('Neo4j connection details are not fully defined in the environment variables.');
}

const driver = neo4j.driver(
    NEO4J_URI,
    neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD)
);

driver.verifyConnectivity()
    .then(() => {
        console.log('Connected to Neo4j successfully.');
    })
    .catch((error) => {
        console.error('Error connecting to Neo4j:', error);
        process.exit(1);
    });

export { driver }; 