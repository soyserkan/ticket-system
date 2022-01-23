FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install --only=prod
COPY . .

CMD ["npm","run","--inspect=9229","dev"]