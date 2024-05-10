# syntax=docker/dockerfile:1
FROM python:3.9

WORKDIR /app

COPY ./_build/api/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt


RUN echo "alias ll='ls -lah'" > /root/.bashrc

COPY ./_build/api/start.sh /

COPY ./api /apifiles

CMD ["bash", "/start.sh"]