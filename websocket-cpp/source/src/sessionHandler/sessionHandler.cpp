#include "sessionHandler.h"

#include "../commandHandler/commandHandler.hpp"

#include "../WebSocketServer/WebSocketServer.h"

sessionHandler::sessionHandler(websocketpp::connection_hdl newHDL)
{
    this->hdl = newHDL;
  
    std::cout << "[HDL: " << this->hdl.lock().get() << " ]: Connection Established" << std::endl;
}

void sessionHandler::handleMessage(websocketpp::connection_hdl hdl, std::string message, websocketpp::frame::opcode::value opcode, sessionHandler* session ,void* s)
{
    session->debugOut("Recieved Message");

    ((server*)s)->handleCallback(hdl, handleCommand(session,message),opcode);
}

sessionHandler::~sessionHandler()
{

}

void sessionHandler::debugOut(std::string message)
{
    std::cout << "[HDL: " << this->hdl.lock().get() << " ]: " << message << std::endl;
}

 
