# cicd
FROM nodejs:18.0
RUN yum install httpd -y
COPY ./* /var/www/html/
CMD ["/usr/sbin/httpd", "-D", "FOREGROUND"]
