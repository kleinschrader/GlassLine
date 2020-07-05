#ifndef commandWrapper_H_GUARD
#define commandWrapper_H_GUARD

#include <string>

#include <nlohmann/json.hpp>

#include <stdlib.h>    

//#include "../sessionHandler/sessionHandler.h"
#include "../sessionHandler/sessionHandler.h"

#include <boost/uuid/uuid.hpp>
#include <boost/uuid/random_generator.hpp>
#include <boost/uuid/string_generator.hpp>
#include <boost/uuid/uuid_io.hpp>
#include <boost/format.hpp>

#include <chrono>

#include <cryptopp/sha3.h>
#include <cryptopp/hex.h>

#include <liboath/oath.h>

#include "../mysqlWrapper/mysqlWrapper.h"


class commandWrapper
{
private:

public:
    commandWrapper(/* args */) {};
    ~commandWrapper() {};

    /**
        * Stores the sequence in the response object
        *
        *  @param sequence The number of the sequence
    */
    void setSequence(const unsigned int sequence);

    /**
        * Check if a value is contained in an json string
        * if not it will also set successful to false and put "Missing Argument" as an error description
        *  
        * @param args A reference to a json object
        * @param expectedArg The Name of the expected Value
        * @returns True if the Value has been found, elso false
    */
    bool checkArgument(const nlohmann::json &args, const std::string &expectedArg);

    /**
        * Sets successful to false in the response object and places the failure string inside the json object
        * 
        * @param failure The reason for failure
    */
    void setFailure(const std::string &failure);
  
    nlohmann::json responseObject;
  
    //a reference to the session 
    sessionHandler* session;

    /**
     * Gets the response json string
     * 
     * @returns the json string from the return object
    */
    std::string getJSONString();


    /**
     * A Virtual function overriden by all commands
     * 
     * @param args The request object
    */
    virtual void run(const nlohmann::json &args) = 0;

    /**
     * Generate a valid randmo uuid
     * 
     * @returns the uuid as string
    */
    std::string genUUID();

    /**
     * Hash a password with a salt
     * 
     * @param password The password to be hashed
     * @param salt The salt used to hash the password
     * @returns A Base-16 Representation of the hash string
    */
    std::string hashPassord(const std::string &password, const std::string &salt);

    /**
     * Reset the expirey date on a login token 
     * 
     * @param uuid The uuid of the user where the token should be refreshed
    */
    void refreshLoginToken(const std::string &uuid);

    /**
     * Get a parameter with strict type casting
     * 
     * @param args a reference to the request json object
     * @param name The name of the variable to get
     * @param buffer an std::string to store the data in
     * 
     * @returns True if paramter was successfully recieved
    */
    bool getParameter(const nlohmann::json &args, const std::string &name, std::string &buffer);

    /**
     * Get a parameter with strict type casting
     * 
     * @param args a reference to the request json object
     * @param name The name of the variable to get
     * @param buffer an bool to store the data in
     * 
     * @returns True if paramter was successfully recieved
    */
    bool getParameter(const nlohmann::json &args, const std::string &name, bool &buffer);

    /**
     * Get a parameter with strict type casting
     * 
     * @param args a reference to the request json object
     * @param name The name of the variable to get
     * @param buffer an int to store the data in
     * 
     * @returns True if paramter was successfully recieved
    */
    bool getParameter(const nlohmann::json &args, const std::string &name, int &buffer);
};


#endif