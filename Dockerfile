FROM node:12-alpine

COPY ./ ~/
WORKDIR ~/

RUN npm install

CMD npm start
