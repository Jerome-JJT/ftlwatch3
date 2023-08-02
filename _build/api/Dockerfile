# syntax=docker/dockerfile:1
FROM python:3.9

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt


RUN echo "alias ll='ls -lah'" > /root/.bashrc

