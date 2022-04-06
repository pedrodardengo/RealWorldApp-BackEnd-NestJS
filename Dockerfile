FROM node:17-alpine as builder

# Creates a ENV variable NODE_ENV to define enviroment
ENV NODE_ENV build


WORKDIR /app

# Copies package.json in order to install with npm ci (instead of npm i)
# it prevents npm from trying to update dependencies
# copying only from src to ignore unecessary files
COPY package*.json ./
RUN npm ci --only=production

# compiling code
COPY ./src .
RUN npm run build

# ---

FROM node:17-alpine

ENV NODE_ENV production

WORKDIR /app

COPY --from=builder /home/node/package*.json ./
COPY --from=builder /home/node/node_modules/ ./node_modules/
COPY --from=builder /home/node/dist/ ./dist/

CMD ["node", "dist/main.js"]