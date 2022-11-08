ARG REGISTRY_PATH
ARG TAG

#### PHP
FROM ${REGISTRY_PATH}/laravel-app:${TAG} as laravel

#### Web service
FROM sunasteriskrnd/php:7.4-nginx-alpine

RUN wget -qO /usr/local/bin/wait-for https://raw.githubusercontent.com/eficode/wait-for/master/wait-for \
    && chmod +x /usr/local/bin/wait-for

COPY cont-init.d /etc/cont-init.d

WORKDIR /srv/jfs

ENV DOCUMENT_ROOT=/srv/jfs/public

COPY --from=laravel --chown=www-data:www-data /composer/vendor vendor
COPY --from=laravel --chown=www-data:www-data /srv/jfs .
COPY --from=laravel --chown=www-data:www-data /composer-autoload vendor

ENV PHP.expose_php=0
ENV PHP.opcache.validate_timestamps=0

ENV PHP_FPM.pm=ondemand
ENV PHP_FPM.pm.max_children=40
ENV PHP_FPM.pm.process_idle_timeout=300s
