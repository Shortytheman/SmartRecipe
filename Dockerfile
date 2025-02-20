FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy prisma and generate
COPY prisma ./prisma/
RUN npx prisma generate

# Copy rest of the app
COPY . .

EXPOSE 3000

CMD ["npm", "start"]