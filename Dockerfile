FROM node:20.12.2 as node-image

WORKDIR /app
COPY package.json /app/
COPY yarn.lock /app/
RUN yarn install
COPY . ./
CMD ["yarn", "start:dev"]