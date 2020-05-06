#include "commandWrapper.h"

void commandWrapper::setSequence(const unsigned int sequence) 
{
    this->responseObject["seq"] = sequence;
}


std::string commandWrapper::getJSONString()
{
    return this->responseObject.dump();
}
