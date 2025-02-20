FROM node:18-alpine

WORKDIR /app

# Install necessary tools
RUN apk add --no-cache \
    netcat-openbsd \
    mysql-client

# Copy package files first for better caching
COPY package*.json ./
RUN npm install

# Copy prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy wait-for-it script and make it executable
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Copy the rest of the application
COPY . .

EXPOSE 3000

# Wait for databases and start app
CMD sh -c "/wait-for-it.sh mysql_db:3306 && \
           npx prisma migrate deploy && \
           npm start"