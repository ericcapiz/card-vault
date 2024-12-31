# syntax = docker/dockerfile:1

ARG NODE_VERSION=18
FROM node:${NODE_VERSION}

LABEL fly_launch_runtime="Node.js"

WORKDIR /app

ENV NODE_ENV="production"

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install ALL node modules, including devDependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build TypeScript
RUN npm run build

# Clean up dev dependencies
RUN npm prune --production

ENV PORT=5000
EXPOSE 5000

CMD [ "npm", "start" ]