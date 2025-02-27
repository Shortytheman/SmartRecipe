#!/bin/sh

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
sleep 10

# Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy

# Start the application
exec "$@"