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
    // checks if the json object contains the value passed in the string "expected"
    if(args.contains(expectedArg))
    {
        // returns true if its contained,
        // a return also stop code execution so we dont need an else clause
        return true;
    }

    // set the failure to missing argument and return false
    setFailure("Missing Argument");

    return false;
}

void commandWrapper::setFailure(const std::string &failure)
{
    // store the failure in the response object and set failure to false
    responseObject["successful"] = false;
    responseObject["error"] = failure;
}

void commandWrapper::refreshLoginToken(const std::string &uuid)
{
    // prepare a buffer for the escaped uuid
    char* escapedUUID[uuid.length() * 2 + 1];
 
    // escaped the string to prevent SQL Injection
    mysql_real_escape_string(session->MYSQLHandle, escapedUUID,uuid.c_str(),uuid.length());

    //! TODO: Implement the actual formating

    //update the expirery of the resumeCode in the database
    mysql_query(
        session->MYSQLHandle,
        "UPDATE users SET resumeSessionCodeSpoil = DATE_ADD(DATE(),INTERVAL 14 DAY) WHERE userid = UuidToBin('%1')"
    );

    // save the changes to the database
    mysql_commit(session->MYSQLHandle);
}

std::string commandWrapper::genUUID()
{
    //generate a random uuid, convert it to a string and return it
    return boost::uuids::to_string(boost::uuids::random_generator()());
}

std::string commandWrapper::hashPassord(const std::string &password, const std::string &salt)
{
    std::string postSaltPasswort = password + salt;

    std::string HexString;

    CryptoPP::HexEncoder encoder(new CryptoPP::StringSink(HexString));

    std::string digest;

    CryptoPP::SHA3_256 hash;
    hash.Update((const u_int8_t*)postSaltPasswort.c_str(), postSaltPasswort.length());
    digest.resize(hash.DigestSize());
    hash.Final((u_int8_t*)&digest[0]);

    CryptoPP::Redirector redirector(encoder);

    CryptoPP::StringSource(digest, true, new CryptoPP::Redirector(encoder));

    return HexString;
}

bool commandWrapper::getParameter(const nlohmann::json &args, const std::string &name, std::string &buffer)
{
    if(!checkArgument(args,name))
    {
        return false;
    }

    if(args[name].type() == nlohmann::json::value_t::string)
    {
        buffer = args[name];
        return true;
    }

    setFailure("Invalid Type");
    return false;
}

bool commandWrapper::getParameter(const nlohmann::json &args, const std::string &name, bool &buffer)
{
    if(!checkArgument(args,name))
    {
        return false;
    }

    if(args[name].type() == nlohmann::json::value_t::boolean )
    {
        buffer = args[name];
        return true;
    }

    setFailure("Invalid Type");
    return false;
}


bool commandWrapper::getParameter(const nlohmann::json &args, const std::string &name, int &buffer)
{
    if(!checkArgument(args,name))
    {
        return false;
    }

    if(args[name].type() == nlohmann::json::value_t::number_integer )
    {
        buffer = args[name];
        return true;
    }

    setFailure("Invalid Type");
    return false;
}
