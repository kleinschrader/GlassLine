#include "WebSocketServer.h"

void server::handleNewConnection(websocketpp::connection_hdl hdl)
{
    sessionMutex.lock();
    
    sessionHandler* newHandler = new sessionHandler(hdl);

    sessions.push_back(newHandler);
    
    sessionMutex.unlock();
}

void server::handleMessage(std::string const& message, websocketpp::connection_hdl hdl, websocketpp::frame::opcode::value opcode)
{
    unsigned int connection = 0;
    bool connectionFound = false;

    sessionMutex.lock();

    while(connection < sessions.size())
    {
        if(sessions[connection]->hdl.lock().get() == hdl.lock().get()) {
            connectionFound = true;
            break;
        }

        connection++;
    }

    sessionMutex.unlock();

    if(connectionFound) {
        std::string response;
        
        boost::thread thread(sessions[connection]->handleMessage,hdl, message, opcode,sessions[connection],this);
    }
    else {
        std::cout << "[HDL: " << hdl.lock().get() << " ]: Session not found." << std::endl;
    }
}

void server::handleClosure(websocketpp::connection_hdl hdl) {
    unsigned int connection = 0;

    sessionMutex.lock();

    while(connection < sessions.size())
    {
        if(sessions[connection]->hdl.lock().get() == hdl.lock().get()) {
            delete sessions[connection];
            sessions.erase(sessions.begin() + connection);
            std::cout << "[HDL: " << hdl.lock().get() << " ]: Session closed." << std::endl;
        }

        connection++;
    }

    sessionMutex.unlock();
}

void server::handleCallback( websocketpp::connection_hdl hdl, std::string data, websocketpp::frame::opcode::value opcode) {
    try 
    {
           send(hdl, data, opcode);
    }
    catch (websocketpp::exception const & e) 
    {
            std::cout << "[HDL: " << hdl.lock().get() << " ]: Failed to send respone: " << e.what() << std::endl;
    }
}