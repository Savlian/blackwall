FROM node:20-alpine AS builder
WORKDIR /app

# Only copy package files first (cache-friendly)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Now copy the rest
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY docker-nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
