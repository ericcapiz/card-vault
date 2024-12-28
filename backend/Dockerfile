# syntax = docker/dockerfile:1

ARG NODE_VERSION=20.11.0
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Node.js"

WORKDIR /app

ENV NODE_ENV="production"

FROM base as build

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

COPY package-lock.json package.json ./
RUN npm ci --include=dev

COPY . .

# Remove build step since we don't have a build process for the backend
# RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev

FROM base

COPY --from=build /app /app

# Change port to 5000
EXPOSE 5000
CMD [ "npm", "run", "start" ]