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
        
        boost::thread thread(this->sessions[connection]->handleMessage,hdl, message, opcode,this->sessions[connection],this);
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

void server::handleCallback( websocketpp::connection_hdl hdl, std::string data, websocketpp::frame::opcode::value opcode) {
    try 
    {
           this->send(hdl, data, opcode);
    }
    catch (websocketpp::exception const & e) 
    {
            std::cout << "[HDL: " << hdl.lock().get() << " ]: Failed to send respone: " << e.what() << std::endl;
    }
}