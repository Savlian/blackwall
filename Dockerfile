FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist/ /usr/share/nginx/html/
RUN rm -f /usr/share/nginx/html/sw.js /usr/share/nginx/html/sw.js.map || true
EXPOSE 80