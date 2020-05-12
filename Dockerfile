FROM  node:8.17.0

RUN npm install -g \
    sails \
    gulp \ 
    bower

WORKDIR /var/sails_workshop

COPY backend/package.json backend/package-lock.json backend/
COPY frontend/package.json frontend/package-lock.json frontend/bower.json frontend/

WORKDIR /var/sails_workshop/backend
RUN npm install

WORKDIR /var/sails_workshop/frontend
RUN npm install
RUN bower install --allow-root --config.interactive=false

WORKDIR /var/sails_workshop

COPY . .

EXPOSE 1337
EXPOSE 8000

RUN apt-get update
RUN apt-get install net-tools

ENTRYPOINT export LOCAL_IP=`ifconfig | grep "inet " | grep -v 127.0.0.1 | grep -v 169.254 | grep -v "\-\->" | cut -f10 -d " "`
