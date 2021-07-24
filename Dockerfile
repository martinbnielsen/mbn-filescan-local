FROM alpine:latest
LABEL maintainer="Martin B. Nielsen"

RUN apk update && apk add pv clamav clamav-libunrar unrar bash npm

# Setup clamd directory
RUN mkdir /run/clamav \
    && chown clamav:clamav /run/clamav \
    && touch /var/log/clamav/freshclam.log \
    && chown clamav:clamav /var/log/clamav/freshclam.log

# Create app directory
ENV APP_PATH /usr/src/app
WORKDIR $APP_PATH

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY src/package*.json ./

# Build node project for production
RUN npm ci --only=production

# Bundle app source
COPY src/. .

EXPOSE 3000
COPY bootstrap.sh /bootstrap.sh
ENTRYPOINT [ "sh", "/bootstrap.sh" ]