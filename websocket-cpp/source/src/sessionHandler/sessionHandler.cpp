#include "sessionHandler.h"

#include "../commandHandler/commandHandler.hpp"

#include "../WebSocketServer/WebSocketServer.h"

sessionHandler::sessionHandler(websocketpp::connection_hdl newHDL)
{
    hdl = newHDL;
  
    std::cout << "[HDL: " << hdl.lock().get() << " ]: Connection Established" << std::endl;

    MYSQLHandle = mysql_init(NULL);
    MYSQL* result = mysql_real_connect(MYSQLHandle,DB_HOST,DB_USERNAME,DB_PASSWORD,DB_DATABASE,0,0,0);

    if(result == NULL)
    {
        std::cout << "[HDL: " << hdl.lock().get() << " ]: DB Connection failed" << std::endl;
    }
}

void sessionHandler::handleMessage(websocketpp::connection_hdl hdl, std::string message, websocketpp::frame::opcode::value opcode, sessionHandler* session ,void* s)
{
    session->debugOut("Recieved Message");

    ((server*)s)->handleCallback(hdl, handleCommand(session,message),opcode);
}

sessionHandler::~sessionHandler()
{
    mysql_close(MYSQLHandle);
}

void sessionHandler::debugOut(std::string message)
{
    std::cout << "[HDL: " << hdl.lock().get() << " ]: " << message << std::endl;
}

 bool sessionHandler::getFlag(u_int16_t flag)
 {
    return (flags & flag) != 0;
 }

void sessionHandler::setFlag(u_int16_t flag, bool newValue)
 {
    if(newValue)
    {
        flags = flags ^ flag;
    }
    else
    {
        flags = flags | ~flag;
    }
 }