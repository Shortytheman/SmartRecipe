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

const connectWithRetry = async () => {
    const maxRetries = 5;
    const retryDelay = 5000; // 5 seconds

    for (let i = 0; i < maxRetries; i++) {
        try {
            await driver.getServerInfo();
            console.log('Connected to Neo4j successfully.');
            return driver;
        } catch (error) {
            if (i === maxRetries - 1) {
                console.error('Failed to connect to Neo4j after multiple attempts:', error);
                process.exit(1);
            }
            console.log(`Neo4j connection attempt ${i + 1} failed. Retrying in ${retryDelay/1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }
};

await connectWithRetry();

export { driver };