FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY apps/backend/package*.json apps/backend/
COPY packages/shared-types/package*.json packages/shared-types/
RUN npm install
COPY . .
WORKDIR /app/apps/backend
EXPOSE 5000
CMD ["npm", "run", "start"]
