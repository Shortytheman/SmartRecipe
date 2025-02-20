FROM node:18-alpine

WORKDIR /app

# Install only mysql-client (we don't need netcat anymore)
RUN apk add --no-cache mysql-client

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy the rest of the application
COPY . .

EXPOSE 3000

# Start the app
CMD ["npm", "start"]