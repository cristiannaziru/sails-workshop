FROM  node:8.17.0

RUN npm install -g \
    sails \
    gulp

WORKDIR /var/sails_workshop

COPY backend/package.json backend/package-lock.json backend/
COPY frontend/package.json frontend/package-lock.json frontend/

WORKDIR /var/sails_workshop/backend
RUN npm install --save

WORKDIR /var/sails_workshop/frontend
RUN npm install
RUN npm install lodash --save

WORKDIR /var/sails_workshop

EXPOSE 1337
EXPOSE 8000
