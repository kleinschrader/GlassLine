#include "WebSocketServer.h"

void server::handleNewConnection(websocketpp::connection_hdl hdl)
{
    sessionHandler* newHandler = new sessionHandler(hdl);

    this->sessions.push_back(newHandler);
}

void server::handleMessage(std::string const& message, websocketpp::connection_hdl hdl, websocketpp::frame::opcode::value opcode)
{
    unsigned int connection = 0;
    bool connectionFound = false;

    while(connection < this->sessions.size())
    {
        if(this->sessions[connection]->hdl.lock().get() == hdl.lock().get()) {
            connectionFound = true;
            break;
        }
    }

    if(connectionFound) {
        std::string response;

        response = this->sessions[connection]->handleMessage(message);

        try {
           this->send(hdl, response, opcode);
        } catch (websocketpp::exception const & e) {
            std::cout << "[HDL: " << hdl.lock().get() << " ]: Failed to send respone: " << e.what() << std::endl;
        }
    }
    else {
        std::cout << "[HDL: " << hdl.lock().get() << " ]: Session not found." << std::endl;
    }
}

void server::handleClosure(websocketpp::connection_hdl hdl) {
    unsigned int connection = 0;

    while(connection < this->sessions.size())
    {
        if(this->sessions[connection]->hdl.lock().get() == hdl.lock().get()) {
            delete this->sessions[connection];
            std::cout << "[HDL: " << hdl.lock().get() << " ]: Session closed." << std::endl;
        }
    }
}