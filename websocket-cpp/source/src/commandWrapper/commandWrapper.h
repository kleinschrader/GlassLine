#ifndef commandWrapper_H_GUARD
#define commandWrapper_H_GUARD

#include <string>

#include <nlohmann/json.hpp>

#include <stdlib.h>    

#include "../sessionHandler/sessionHandler.h"

#include <boost/uuid/uuid.hpp>
#include <boost/uuid/random_generator.hpp>
#include <boost/uuid/string_generator.hpp>
#include <boost/uuid/uuid_io.hpp>
#include <boost/format.hpp>

#include <cryptopp/sha3.h>
#include <cryptopp/hex.h>


class commandWrapper
{
private:

public:
    commandWrapper(/* args */) {};
    ~commandWrapper() {};

    void setSequence(const unsigned int sequence);

    bool checkArgument(const nlohmann::json &args, const std::string &expectedArg);

    virtual void setFailure(const std::string &failure);
  
    nlohmann::json responseObject;
    sessionHandler* session;

    std::string getJSONString();

    virtual void run(const nlohmann::json &args) = 0;

    virtual std::string genUUID();

    std::string hashPassord(const std::string &password, const std::string &salt);

    void refreshLoginToken(const std::string &uuid);
};


#endif