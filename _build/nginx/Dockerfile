FROM nginx

COPY _build/nginx/local.conf /etc/nginx/conf.d/default.conf
COPY _build/nginx/start.sh /

CMD ["sh", "/start.sh"]