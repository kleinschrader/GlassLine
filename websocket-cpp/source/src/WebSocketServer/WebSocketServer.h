#include <websocketpp/config/asio_no_tls.hpp>

#include <websocketpp/server.hpp>

#include "sessionHandler/sessionHandler.h"

using websocketpp::lib::placeholders::_1;
using websocketpp::lib::placeholders::_2;
using websocketpp::lib::bind;

typedef websocketpp::server<websocketpp::config::asio>::message_ptr message_ptr;

class server : public websocketpp::server<websocketpp::config::asio> 
{
private:
    std::vector<sessionHandler*> sessions;
public:
    void handleNewConnection(websocketpp::connection_hdl hdl);
    void handleMessage(std::string const& message, websocketpp::connection_hdl hdl, websocketpp::frame::opcode::value opcode);
    void handleClosure(websocketpp::connection_hdl hdl);
};

