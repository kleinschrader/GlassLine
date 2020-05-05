#include "sessionHandler.h"

sessionHandler::sessionHandler(websocketpp::connection_hdl newHDL)
{
    this->hdl = newHDL;
  
    std::cout << "[HDL: " << this->hdl.lock().get() << " ]: Connection Established" << std::endl;
}

std::string sessionHandler::handleMessage(std::string const& message)
{
    std::cout << "[HDL: " << this->hdl.lock().get() << " ]: Recived Message" << std::endl;

    return message;
}

sessionHandler::~sessionHandler()
{

}
