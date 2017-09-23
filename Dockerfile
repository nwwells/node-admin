FROM node:8.4.0-alpine as webpack

# Block Explorer is based at the root dir
WORKDIR /node-admin

# Copy package.json and install dependencies
#   - we do this first to take advantage of caching
ARG NPM_TOKEN
COPY ./config/.npmrc /node-admin/.npmrc
COPY ./package.json /node-admin/package.json
COPY ./yarn.lock /node-admin/yarn.lock

RUN ["yarn", "install"]
RUN ["rm", "-f", ".npmrc"]

# Copy the client-side of the app over and trigger the build.
COPY ./ /node-admin
ENV NODE_ENV production

# build static assets (stored in `/build`)
RUN ["yarn", "run", "build"]


FROM nginx:1.13.3-alpine
COPY --from=webpack /node-admin/build/ /var/www/
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf
