# ANGULAR SSR APP BUILDER

# Build Stage

FROM node:14-slim as dist

ARG BUILD_APP_ENV=production

ENV APP_ENV=$BUILD_APP_ENV

WORKDIR /usr/src/app/

COPY *.json *.js *.ts ./
COPY src/ src/

ARG BUILD_APP_ENV=production
ENV APP_ENV=$BUILD_APP_ENV

RUN npm install
RUN npm run build:ssr


# Production Node Modules Stage

FROM node:14-slim as node_modules

WORKDIR /usr/src/app/

COPY package.json package-lock.json tsconfig.json tsconfig.app.json tsconfig.server.json ./

RUN npm install --production


# Compose Stage

FROM node:14-slim

EXPOSE 80
ENV PORT=80

ARG APP_UID=1000
ENV APP_UID=${APP_UID}

RUN if [ $APP_UID = "1000" ]; then\
    userdel node; \
fi

RUN groupadd --gid $APP_UID application && \
    useradd --uid $APP_UID --gid $APP_UID --shell /bin/bash --create-home application

RUN apt-get update && apt-get install -y libcap2-bin
RUN setcap 'cap_net_bind_service=+ep' /usr/local/bin/node

WORKDIR /app

# Production setup part

ARG BUILD_APP_ENV=production
ENV APP_ENV=$BUILD_APP_ENV
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENV PAGES_CACHE=0

COPY --from=node_modules /usr/src/app/node_modules ./node_modules
COPY --from=dist /usr/src/app/dist ./dist
COPY --from=dist /usr/src/app/package.json ./package.json

RUN chown -R application:application /app

CMD su application -c "npm run serve:ssr"
