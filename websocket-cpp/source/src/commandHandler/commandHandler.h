#ifndef commandHandler_H_GUARD
#define commandHandler_H_GUARD

#include <iostream>

#include <nlohmann/json.hpp>

#include "../sessionHandler/sessionHandler.h"

#include "../commandWrapper/commands.h"

std::string handleCommand(sessionHandler* session, std::string const& command) {
    
    //pointer to a commandWrapper class, used to call funcktions
    commandWrapper* cmd = 0;

    //try and catch, used for when invalid json data is recieved
    try 
    {
        //parse the message from the client
        nlohmann::json commandData = nlohmann::json::parse(command);
        //prepare a response json object (only used if normal command parsing fails)
        nlohmann::json response;

        //get the command of the request
        std::string parsedCommand = commandData["cmd"];

        //create a fitting class based on the command of the client
        if(parsedCommand == "getSetupRequired")
        {
            cmd = new getSetupRequired;
        }
        else if(parsedCommand == "checkSetupToken")
        {
            cmd = new checkSetupToken;
        }
        else if(parsedCommand == "checkTokenLogin")
        {
            cmd = new checkTokenLogin;
        }
        else if(parsedCommand == "createTenant")
        {
            cmd = new createTenant;
        }
        else if(parsedCommand == "createUser")
        {
            cmd = new createUser;
        }
        else if(parsedCommand == "finishSetup")
        {
            cmd = new finishSetup;
        }
        else {
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

        //store the sequence in the new object 
        cmd->setSequence(commandData["seq"]);

        //pass through the session pointer
        cmd->session = session;
        
        //Attempt code execution 
        try
        {
            cmd->run(commandData);
        }
        catch(...)
        {
            session->debugOut("Send Malformed Data and execution failed");
        }

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

#endif