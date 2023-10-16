FROM node:16-slim
WORKDIR /app

COPY ./package.json /app/package.json
RUN npm install -g pnpm
RUN pnpm i

COPY . .
CMD ["pnpm", "start"]