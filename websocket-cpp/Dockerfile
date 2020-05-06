FROM archlinux:latest

RUN mkdir /tmp/glassline-websocket
COPY ./source /tmp/glassline-websocket

RUN mkdir /init/
COPY init.sh /init/
COPY install.sh /init/
RUN chmod +x /init/init.sh
RUN chmod +x /init/install.sh

COPY json/json.hpp /usr/local/include/nlohmann/json.hpp

RUN /init/install.sh
RUN /init/init.sh

WORKDIR /usr/app/

CMD ["./glassline-websocket"]