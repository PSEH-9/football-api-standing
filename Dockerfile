FROM node:12-alpine

COPY ./ ~/
WORKDIR ~/
RUN ls -l

RUN npm install

CMD npm start
