#include "WebSocketServer.h"

void server::handleNewConnection(websocketpp::connection_hdl hdl)
{
    this->sessionMutex.lock();
    
    sessionHandler* newHandler = new sessionHandler(hdl);

    this->sessions.push_back(newHandler);
    
    this->sessionMutex.unlock();
}

void server::handleMessage(std::string const& message, websocketpp::connection_hdl hdl, websocketpp::frame::opcode::value opcode)
{
    unsigned int connection = 0;
    bool connectionFound = false;

    this->sessionMutex.lock();

    while(connection < this->sessions.size())
    {
        if(this->sessions[connection]->hdl.lock().get() == hdl.lock().get()) {
            connectionFound = true;
            break;
        }

        connection++;
    }

    this->sessionMutex.unlock();

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

    this->sessionMutex.lock();

    while(connection < this->sessions.size())
    {
        if(this->sessions[connection]->hdl.lock().get() == hdl.lock().get()) {
            delete this->sessions[connection];
            this->sessions.erase(this->sessions.begin() + connection);
            std::cout << "[HDL: " << hdl.lock().get() << " ]: Session closed." << std::endl;
        }

        connection++;
    }

    this->sessionMutex.unlock();
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