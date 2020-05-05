FROM archlinux:latest

RUN mkdir /tmp/glassline-websocket
COPY ./source /tmp/glassline-websocket

RUN mkdir /init/
COPY init.sh /init/
RUN chmod +x /init/init.sh

COPY json/json.hpp /usr/local/include/nlohmann/json.hpp

RUN /init/init.sh

WORKDIR /usr/app/

CMD ["./glassline-websocket"]