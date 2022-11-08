FROM node:14-alpine

WORKDIR /build

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile \
    && yarn cache clean

ARG APP_ENV
ARG APP_URL
ARG IMAGE_URL
ARG SERVER_API_URL
ARG BROWSER_API_URL
ARG SENTRY_DSN
ARG MIX_GA_ID

ENV APP_ENV=${APP_ENV:-production} \
    APP_URL=${APP_URL:-https://jobfair.sun-asterisk.vn} \
    IMAGE_URL=${IMAGE_URL:-https://jobfair.sun-asterisk.vn/images} \
    SERVER_API_URL=${SERVER_API_URL:-http://api} \
    BROWSER_API_URL=${BROWSER_API_URL:-/api} \
    SENTRY_DSN=${SENTRY_DSN:-https://78e9980015fa4b0caa2de706d1064572@sentry.io/187078944} \
    MIX_GA_ID=${MIX_GA_ID:-UA-88817199-2043}

COPY . .

RUN yarn build
