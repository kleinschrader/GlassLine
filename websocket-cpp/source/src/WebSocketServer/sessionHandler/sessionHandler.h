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

    std::string handleMessage(std::string const& message);

    websocketpp::connection_hdl hdl;
};

#endif