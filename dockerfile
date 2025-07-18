# Use official Node.js image
FROM node:18




RUN npm install

RUN yum update -y && \
    yum install httpd -y && \
    yum clean all

COPY . /var/www/html




CMD ["node", "index.js"]

