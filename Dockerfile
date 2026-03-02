FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

# Run sync script to create tables, then start the server
CMD ["sh", "-c", "node dist/sync.js && node dist/index.js"]
