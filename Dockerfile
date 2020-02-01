FROM node:12-slim

COPY ./ /home/src/
WORKDIR /home/src/

RUN npm install

CMD npm start
