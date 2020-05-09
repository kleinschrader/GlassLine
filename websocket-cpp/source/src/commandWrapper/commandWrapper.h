#ifndef commandWrapper_H_GUARD
#define commandWrapper_H_GUARD

#include <string>

#include <nlohmann/json.hpp>

#include <stdlib.h>    

#include "../sessionHandler/sessionHandler.h"

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


    void refreshLoginToken(const std::string uuid);
};


#endif