#ifndef sessionHandler_H_GUARD
#define sessionHandler_H_GUARD

#include <websocketpp/config/asio_no_tls.hpp>

#include <websocketpp/server.hpp>

#include <iostream>


class sessionHandler
{
private:
    
public:
    sessionHandler(websocketpp::connection_hdl newHDL);
    ~sessionHandler();

    void debugOut(std::string message);

    static void handleMessage(websocketpp::connection_hdl hdl, std::string message, websocketpp::frame::opcode::value opcode, sessionHandler* session ,void* s);

    websocketpp::connection_hdl hdl;
};

#endif