# Использую лёгкий nginx
FROM nginx:alpine

# Удаляю стандартный контент nginx
RUN rm -rf /usr/share/nginx/html/*

# Копирую файлы из корня проекта (т.к. Dockerfile в /docker/)
COPY ../public /usr/share/nginx/html
COPY ../src /usr/share/nginx/html/src

# Копирую конфиг nginx
COPY ../nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Экспонирую порт
EXPOSE 3000

# Запуск nginx
CMD ["nginx", "-g", "daemon off;"]