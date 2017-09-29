FROM node:6.2.2
MAINTAINER JuYeong <worean@naver.com>

RUN apt-get update
RUN apt-get install -y python-opencv
RUN ln /dev/null /dev/raw1394

RUN mkdir -p /app
RUN mkdir -p /root/Comics
COPY . /app
WORKDIR /app

ENV NODE_ENV development

EXPOSE 3000 80

CMD ["/bin/bash"]
