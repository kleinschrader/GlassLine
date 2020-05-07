#ifndef commandHandler_H_GUARD
#define commandHandler_H_GUARD

#include <iostream>

#include <nlohmann/json.hpp>

#include "../sessionHandler/sessionHandler.h"

#include "../commandWrapper/commands.h"

std::string handleCommand(sessionHandler* session, std::string const& command) {
    
    commandWrapper* cmd = 0;

    try 
    {
        nlohmann::json commandData = nlohmann::json::parse(command);
        nlohmann::json response;

        std::string parsedCommand = commandData["cmd"];

        if(parsedCommand == "getSetupRequired")
        {
            cmd = new getSetupRequired;
        }
        else if(parsedCommand == "checkSetupToken")
        {
            cmd = new checkSetupToken;
        }
        else {
            delete cmd;

            response["successful"] = false;
            response["error"] = "Unknown Command";
            response["seq"] = (int)commandData["seq"];

            session->debugOut("Issued unknown command");

            return response.dump();
        }
        
        cmd->setSequence(commandData["seq"]);
        cmd->session = session;
        cmd->run(commandData);

        std::string jsonString = cmd->getJSONString();

        delete cmd;

        return jsonString;
    }
    catch(nlohmann::json::exception& e)
    {
        if(cmd == 0)
        {
            delete cmd;
        }

        session->debugOut("Issued malformed command");

        nlohmann::json response;
        response["successful"] = false;
        response["error"] = "Malformed Command";
        return response.dump();
    }
} 

#endif