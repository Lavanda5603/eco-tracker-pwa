FROM node:18-alpine

WORKDIR /app

# Копирую всё
COPY . .

# Устанавливаю зависимости
RUN npm install

# Устанавливаю nginx
RUN apk add --no-cache nginx

# Чищу дефолт
RUN rm -rf /usr/share/nginx/html/*

# Копирую фронт
RUN cp -r public/* /usr/share/nginx/html
RUN cp -r src /usr/share/nginx/html/src

# nginx конфиг
COPY nginx/nginx.conf /etc/nginx/http.d/default.conf

# Порты
EXPOSE 3000
EXPOSE 4000

# Запускаем и сервер, и nginx
CMD node server/server.js & nginx -g 'daemon off;'