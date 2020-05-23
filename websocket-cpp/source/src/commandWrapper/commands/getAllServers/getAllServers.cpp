#include "getAllServers.h"

void getAllServers::run(const nlohmann::json &args)
{
    if(!session->getFlag(sessionFlags::FLAG_USER_LOGGED_ON))
    {
        setFailure("Not Authorised");
        return;
    }

    if(!session->getFlag(sessionFlags::FLAG_ADMIN_TENANT))
    {
        setFailure("Not Authorised");
        return;
    }

    if(!session->getFlag(sessionFlags::FLAG_USER_ADMIN))
    {
        setFailure("Not Authorised");
        return;
    }

    mysqlWrapper sql(session->MYSQLHandle,"SELECT UuidFromBin(serverid) AS serverid, servername FROM servers");

    sql.runQuery();

    
    auto server = nlohmann::json::array();

    for(int i = 0; i < sql.numberRows; i++)
    {
        auto serverObj = nlohmann::json::object();
        serverObj["id"] = sql[i]["serverid"];
        serverObj["name"] = sql[i]["servername"];

        server.push_back(serverObj);
    }

    responseObject["server"] = server;
    responseObject["successful"] = true;
}