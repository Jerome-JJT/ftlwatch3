# syntax=docker/dockerfile:1
FROM python:3.9

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

RUN git config --global user.email "jerome.jaquemet@gmail.com"
RUN git config --global user.name "Jérôme (auto docker)"

RUN echo "alias ll='ls -lAh'" > /root/.bashrc

#RUN git clone https://github.com/python-telegram-bot/python-telegram-bot



RUN echo "deb [ arch=amd64 ] https://downloads.skewed.de/apt bullseye main" >> /etc/apt/sources.list
RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-key 612DEFB798507F25
RUN apt-get update
RUN apt-get install -y python3-graph-tool
RUN apt-get install -y python3-gi