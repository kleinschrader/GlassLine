#include "commandWrapper.h"

void commandWrapper::setSequence(const unsigned int sequence) 
{
    responseObject["seq"] = sequence;
}


std::string commandWrapper::getJSONString()
{
    return responseObject.dump();
}

bool commandWrapper::checkArgument(const nlohmann::json &args, const std::string &expectedArg)
{
    if(args.contains(expectedArg))
    {
        return true;
    }

    setFailure("Missing Argument");

    return false;
}

void commandWrapper::setFailure(const std::string &failure)
{
    responseObject["successful"] = false;
    responseObject["error"] = failure;
}

void commandWrapper::refreshLoginToken(const std::string uuid)
{
    mysql_query(
        session->MYSQLHandle,
        "UPDATE users SET resumeSessionCodeSpoil = DATE_ADD(DATE(),INTERVAL 14 DAY) WHERE userid = UuidToBin(%1)"
    );

    mysql_commit(session->MYSQLHandle);
}