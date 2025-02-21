FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/


# Install dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy rest of the app
COPY . .

EXPOSE 3000

CMD ["sh", "-c", "if [ \"$RUN_TESTS\" = \"true\" ]; then npm test; else npm start; fi"]