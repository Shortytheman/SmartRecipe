FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Create a script to handle database setup
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3001

# Use the entrypoint script
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "start"]