import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = 'mongodb://mongo_db:27017/smartrecipe';

if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in the environment variables.');
}

const connectWithRetry = async () => {
    const maxRetries = 5;
    const retryDelay = 5000;

    for (let i = 0; i < maxRetries; i++) {
        try {
            await mongoose.connect(MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('Connected to MongoDB successfully.');
            return;
        } catch (error) {
            if (i === maxRetries - 1) {
                console.error('Failed to connect to MongoDB after multiple attempts:', error);
                process.exit(1);
            }
            console.log(`MongoDB connection attempt ${i + 1} failed. Retrying in ${retryDelay/1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }
};

await connectWithRetry();

export { mongoose };