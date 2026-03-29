FROM node:18-alpine

WORKDIR /app

# Копирую весь проект
COPY . .

# Ставлю зависимости
RUN npm install

# Ставлю nginx
RUN apk add --no-cache nginx

# Создаю папку вручную
RUN mkdir -p /usr/share/nginx/html

# Чищу
RUN rm -rf /usr/share/nginx/html/*

# Копирую фронт
RUN cp -r public/* /usr/share/nginx/html/
RUN cp -r src /usr/share/nginx/html/src

# Копирую nginx конфиг
COPY nginx/nginx.conf /etc/nginx/http.d/default.conf

# Порты
EXPOSE 3000
EXPOSE 4000

# Запускаю сервер + nginx
CMD node server/server.js & nginx -g 'daemon off;'