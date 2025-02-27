import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in the environment variables.');
}

const prisma = new PrismaClient();

const connectWithRetry = async () => {
    const maxRetries = 5;
    const retryDelay = 5000;

    for (let i = 0; i < maxRetries; i++) {
        try {
            await prisma.$connect();
            console.log('Connected to MySQL via Prisma successfully.');
            return prisma;
        } catch (error) {
            console.log(`MySQL connection attempt ${i + 1} failed. Retrying in ${retryDelay/1000} seconds...`);
            if (i === maxRetries - 1) {
                console.error('Failed to connect to MySQL after multiple attempts:', error);
                process.exit(1);
            }
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }
};

export { prisma, connectWithRetry };