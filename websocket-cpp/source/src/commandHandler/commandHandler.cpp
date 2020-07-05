#include "commandHandler.h"

commandHandler::commandHandler(sessionHandler *currentSession)
{
    session = currentSession;

    createMap();
};

std::string commandHandler::handleCommand(std::string const& command) { 
    //pointer to a commandWrapper class, used to call funcktions
    commandWrapper* cmd = 0;

    const std::lock_guard<std::mutex> lock(session->MYSQLLock);

    //try and catch, used for when invalid json data is recieved
    try 
    {
        //parse the message from the client
        nlohmann::json commandData = nlohmann::json::parse(command);
        //prepare a response json object (only used if normal command parsing fails)
        nlohmann::json response;

        //get the command of the request
        std::string parsedCommand = commandData["cmd"];

        auto function = commandMap.find(parsedCommand);

        //command not found
        if (function == commandMap.end()) {
            //should the command not be recogniesed run this code

            //set successful to false and write unknown comannd to error description
            response["successful"] = false;
            response["error"] = "Unknown Command";

            //on failure we should still send the sequence
            response["seq"] = (int)commandData["seq"];

            session->debugOut("Issued unknown command");

            //convert the respone object to a json string and returnit
            return response.dump();
        }
        else
        {
            //run the cfound commmand
            cmd = (function->second)();
        }

        //store the sequence in the new object 
        cmd->setSequence(commandData["seq"]);

        //pass through the session pointer
        cmd->session = session;
        
        //Attempt code execution 
        cmd->run(commandData);

        //get the json string from the cmd object
        std::string jsonString = cmd->getJSONString();

        //free the used memory and return the response object
        delete cmd;

        return jsonString;
    }
    catch(nlohmann::json::exception& e)
    {
        //this usually gets called if parsing of the json string fails or no sequence object is provided

        //only delete the cmd object if it is set
        if(cmd != 0)
        {
            delete cmd;
        }
        
        session->debugOut("Issued malformed command");

        //set successful to false and write unknown comannd to error description
        nlohmann::json response;
        response["successful"] = false;
        response["error"] = "Malformed Command";

        //return the response object
        return response.dump();
    }
} 

void commandHandler::createMap()
{
    commandMap.insert(std::make_pair("checkCredLogin",(__CreateInstance)CreateInstance_checkCredLogin));
    commandMap.insert(std::make_pair("checkSetupToken",(__CreateInstance)CreateInstance_checkSetupToken));
    commandMap.insert(std::make_pair("checkTokenLogin",(__CreateInstance)CreateInstance_checkTokenLogin));
    commandMap.insert(std::make_pair("createTenant",(__CreateInstance)CreateInstance_createTenant));
    commandMap.insert(std::make_pair("createUser",(__CreateInstance)CreateInstance_createUser));
    commandMap.insert(std::make_pair("finishSetup",(__CreateInstance)CreateInstance_finishSetup));
    commandMap.insert(std::make_pair("generateMFASecret",(__CreateInstance)CreateInstance_generateMFASecret));
    commandMap.insert(std::make_pair("getAllServers",(__CreateInstance)CreateInstance_getAllServers));
    commandMap.insert(std::make_pair("getSetupRequired",(__CreateInstance)CreateInstance_getSetupRequired));
    commandMap.insert(std::make_pair("getTenants",(__CreateInstance)CreateInstance_getTenants));
    commandMap.insert(std::make_pair("getTenantServer",(__CreateInstance)CreateInstance_getTenantServer));
    commandMap.insert(std::make_pair("verifyOTP",(__CreateInstance)CreateInstance_verifyOTP));
}

commandWrapper* commandHandler::CreateInstance_checkCredLogin(){
    return new checkCredLogin;
}
commandWrapper* commandHandler::CreateInstance_checkSetupToken(){
    return new checkSetupToken;
}
commandWrapper* commandHandler::CreateInstance_checkTokenLogin(){
    return new checkTokenLogin;
}
commandWrapper* commandHandler::CreateInstance_createTenant(){
    return new createTenant;
}
commandWrapper* commandHandler::CreateInstance_createUser(){
    return new createUser;
}
commandWrapper* commandHandler::CreateInstance_finishSetup(){
    return new finishSetup;
}
commandWrapper* commandHandler::CreateInstance_generateMFASecret(){
    return new generateMFASecret;
}
commandWrapper* commandHandler::CreateInstance_getAllServers(){
    return new getAllServers;
}
commandWrapper* commandHandler::CreateInstance_getSetupRequired(){
    return new getSetupRequired;
}
commandWrapper* commandHandler::CreateInstance_getTenants(){
    return new getTenants;
}
commandWrapper* commandHandler::CreateInstance_getTenantServer(){
    return new getTenantServer;
}
commandWrapper* commandHandler::CreateInstance_verifyOTP(){
    return new verifyOTP;
}