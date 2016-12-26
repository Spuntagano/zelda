FROM node:5.11.1-slim

# Needed librairies
RUN apt-get update -y && \
    apt-get -y install python-pip && \
    apt-get install git -y && \
    apt-get clean all && \
    apt-get install -y awscli

# Supervisor config
RUN /usr/bin/pip install meld3==1.0.1 supervisor==3.1.3 && \
    rm -rf /tmp/pip-build-root/ && \
    mkdir -p /etc/supervisord/conf.d

COPY ./aws /root/.aws

COPY ./docker/supervisord/supervisord.conf /etc/supervisord.conf
ADD docker/supervisord/zelda.conf /etc/supervisord/conf.d/zelda.conf

WORKDIR /www/zelda/

EXPOSE 2000

ADD . /www/zelda

RUN cd /www && \
    git clone https://github.com/irrelon/ige && \
    cd ige/server && \
    npm install && \
    npm install -g nodemon && \
    cd /www/ige && \
    node server/ige.js -deploy ../zelda -to ../zelda/assets/js

ARG deploy=0
RUN if [ $deploy -eq 1 ]; then aws s3 rm s3://zelda-jizz --recursive && \
    aws s3 cp assets s3://zelda-jizz/assets --recursive --acl public-read && \
    aws s3 cp index.html s3://zelda-jizz --acl public-read; fi


CMD ["supervisord", "-n", "-c", "/etc/supervisord.conf"]
