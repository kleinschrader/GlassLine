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

void commandWrapper::refreshLoginToken(const std::string &uuid)
{
    mysql_query(
        session->MYSQLHandle,
        "UPDATE users SET resumeSessionCodeSpoil = DATE_ADD(DATE(),INTERVAL 14 DAY) WHERE userid = UuidToBin(%1)"
    );

    mysql_commit(session->MYSQLHandle);
}

std::string commandWrapper::genUUID()
{
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