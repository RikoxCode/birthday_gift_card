FROM node:18-alpine AS build

WORKDIR /app

COPY project/package*.json ./

# Install all dependencies (including devDependencies for building)
RUN npm ci
RUN npm install -g @angular/cli

COPY project/ .

# Build for production
RUN npm run build --configuration=production

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist/birthday/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
