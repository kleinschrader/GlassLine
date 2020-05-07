#include "commandWrapper.h"

void commandWrapper::setSequence(const unsigned int sequence) 
{
    this->responseObject["seq"] = sequence;
}


std::string commandWrapper::getJSONString()
{
    return this->responseObject.dump();
}

bool commandWrapper::checkArgument(const nlohmann::json &args, const std::string &expectedArg)
{
    if(args.contains(expectedArg))
    {
        return true;
    }
    
    this->responseObject["successful"] = false;
    this->responseObject["error"] = "Missing Argument";

    return false;
}