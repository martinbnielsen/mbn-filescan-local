FROM alpine:latest
LABEL maintainer="Martin B. Nielsen"

RUN apk update && apk add pv clamav=0.103.2-r0 clamav-libunrar unrar bash npm

COPY bootstrap.sh /bootstrap.sh
ENTRYPOINT [ "sh", "/bootstrap.sh" ]