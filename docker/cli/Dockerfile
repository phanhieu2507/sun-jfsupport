ARG REGISTRY_PATH
ARG TAG

#### PHP
FROM ${REGISTRY_PATH}/laravel-app:${TAG} as laravel

#### PHP CLI
FROM sunasteriskrnd/php:7.4-cli-alpine

RUN wget -qO /usr/local/bin/wait-for https://raw.githubusercontent.com/eficode/wait-for/master/wait-for \
    && chmod +x /usr/local/bin/wait-for

COPY bin /usr/local/bin

WORKDIR /srv/jfs

COPY --from=laravel --chown=www-data:www-data /composer/vendor vendor
COPY --from=laravel --chown=www-data:www-data /srv/jfs .
COPY --from=laravel --chown=www-data:www-data /composer-autoload vendor

ENV PHP.opcache.validate_timestamps=0

ENTRYPOINT [ "docker-entrypoint" ]
