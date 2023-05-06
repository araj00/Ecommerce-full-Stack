FROM node:17-alpine

WORKDIR /ecommerce

COPY package.json .

RUN npm install -g nodemon

RUN npm install

COPY . ./

EXPOSE 5000

CMD ["npm","run","start"]