#include <iostream>


#include "src/WebSocketServer/WebSocketServer.h"


int main()
{
    std::cout << "Glassline Websocket INDEV" << std::endl;

    server websocketServer;

    try {
        // Initialize Asio
        websocketServer.init_asio();

        // Register our message handler
        //websocketServer.set_message_handler(bind(&websocketServer.handleMessage,&websocketServer,::_1,::_2));
        websocketServer.set_message_handler(bind([](server* s, websocketpp::connection_hdl hdl, message_ptr msg) {
            s->handleMessage(msg->get_payload(),hdl, msg->get_opcode());
        },&websocketServer,::_1,::_2));

        websocketServer.set_open_handler(bind([](server* s, websocketpp::connection_hdl hdl) {
            s->handleNewConnection(hdl);
        },&websocketServer,::_1));

        websocketServer.set_close_handler(bind([](server* s, websocketpp::connection_hdl hdl) {
            s->handleClosure(hdl);
        },&websocketServer,::_1));

        // Listen on port 9002
        websocketServer.listen(9002);

        // Start the server accept loop
        websocketServer.start_accept();

        // Start the ASIO io_service run loop
        websocketServer.run();
    } catch (websocketpp::exception const & e) {
        std::cout << e.what() << std::endl;
    } catch (...) {
        std::cout << "other exception" << std::endl;
    }

    return 0;
}