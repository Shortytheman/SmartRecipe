import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in the environment variables.');
}

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: DATABASE_URL,
        },
    },
});

prisma.$connect()
    .then(() => {
        console.log('Connected to MySQL via Prisma successfully.');
    })
    .catch((error) => {
        console.error('Error connecting to MySQL via Prisma:', error);
        process.exit(1);
    });

export { prisma }; 