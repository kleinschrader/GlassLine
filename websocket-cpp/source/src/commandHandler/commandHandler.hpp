#ifndef commandHandler_H_GUARD
#define commandHandler_H_GUARD

#include <iostream>

#include <nlohmann/json.hpp>

#include "../sessionHandler/sessionHandler.h"

std::string handleCommand(sessionHandler* session, std::string const& command) {
    try 
    {
        auto commandData = nlohmann::json::parse(command);
        nlohmann::json response;

        std::string parsedCommand = commandData["cmd"];
        
        if(parsedCommand == "getSetupRequired") {

        }
        
        response["successful"] = false;
        response["error"] = "Unknown Command";
        response["seq"] = (int)commandData["seq"];

        session->debugOut("Issued unknown command");

        return response.dump();
    }
    catch(nlohmann::json::exception& e)
    {
        session->debugOut("Issued malformed command");

        nlohmann::json response;
        response["successful"] = false;
        response["error"] = "Malformed Command";
        return response.dump();
    }
} 

#endif