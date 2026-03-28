FROM nginx:alpine

# Удаляю стандартный контент nginx
RUN rm -rf /usr/share/nginx/html/*

# Копирую public и src
COPY public /usr/share/nginx/html/public
COPY src /usr/share/nginx/html/src

# Копирую конфиг nginx
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Экспонирую порт
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]