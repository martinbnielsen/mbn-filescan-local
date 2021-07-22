FROM alpine:latest
LABEL maintainer="Martin B. Nielsen"

RUN apk update && apk add pv clamav clamav-libunrar unrar bash npm

# Create app directory
ENV APP_PATH /usr/src/app
WORKDIR $APP_PATH

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY src/package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY src/. .

EXPOSE 3000
COPY bootstrap.sh /bootstrap.sh
ENTRYPOINT [ "sh", "/bootstrap.sh" ]