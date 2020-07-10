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
    char escapedUUID[uuid.length() * 2 + 1];
 
    // escaped the string to prevent SQL Injection
    mysql_real_escape_string(session->MYSQLHandle, escapedUUID,uuid.c_str(),uuid.length());

    boost::format query(
    "UPDATE users SET resumeSessionCodeSpoil = DATE_ADD(DATE(),INTERVAL 14 DAY) WHERE userid = UuidToBin('%1')"
    );

    //update the expirery of the resumeCode in the database
    mysql_query(
        session->MYSQLHandle,
        boost::str(query % std::string(escapedUUID)).c_str()
    );

    // save the changes to the database
    mysql_commit(session->MYSQLHandle);
}

std::string commandWrapper::genUUID()
{
    //generate a random uuid, convert it to a string and return it
    return boost::uuids::to_string(boost::uuids::random_generator()());
}

bool commandWrapper::verifyUUID(std::string &uuid)
{
    //initialise the uuid regex
    //as the regex never changes we dont need to recompile it everytime so static is perfect here
    static boost::regex uuidRE{"^[0-9a-f]{8}\\-[0-9a-f]{4}\\-[0-9a-f]{4}\\-[0-9a-f]{4}\\-[0-9a-f]{12}$"};


    // 2020-07-10: Actually i see a lot of conflicting information regarding the use of static variables so im not sure i should keep it. For now it does it's job.

    //match and return :)
    return boost::regex_match(uuid,uuidRE);
}

 std::string commandWrapper::generateRandomString(u_int16_t length, const std::string * charset)
 {
    const std::string defaultCharset = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    
    const std::string * charsetToUse;

    if(charset == nullptr)
    {
        charsetToUse = &defaultCharset;
    }
    else
    {
        charsetToUse = charset;
    }

    static boost::random::mt19937 gen;
    std::chrono::milliseconds ms = std::chrono::duration_cast< std::chrono::milliseconds  >(std::chrono::system_clock::now().time_since_epoch());
    gen.seed(ms.count());

    boost::random::uniform_int_distribution<> dist(0, charsetToUse->length() - 1);

    std::stringstream buffer;

    for(int i = 0; i < length; i++)
    {    
        buffer << charsetToUse->at(dist(gen));
    }
    
    return buffer.str();
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
