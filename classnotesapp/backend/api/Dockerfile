FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

ENV PORT=3001
EXPOSE 3001

CMD ["node", "server.js"]

