#include "createServer.h"

void createServer::run(const nlohmann::json &args)
{
    //create a buffer for the required parameters
    std::string servername;
    std::string tenant;
    std::string parent;

    //place all parameters in their respective buffer
    getParameter(args,"servername",servername);
    getParameter(args,"tenant",tenant);
    getParameter(args,"parent",parent);

    if(servername.length() > 64) {
        setFailure("Servername to long");
        return;
    }

    //Verify that UUIDs are actually uuids.
    if(!verifyUUID(tenant))
    {
        setFailure("UUID Failure");
        return;
    }

    if(!verifyUUID(parent))
    {
        setFailure("UUID Failure");
        return;
    }

    mysqlWrapper sql(session->MYSQLHandle,"INSERT INTO servers(serverid,servername,accessToken,childOf,tenant) VALUES (UuidToBin('%1%'), '%2%', '%3%', UuidToBin('%4%'), UuidToBin('%5%'))");

    std::string uuid = genUUID();
    sql.addFormat(uuid);

    sql.escapeStringAndFormat(servername.c_str());

    sql.addFormat(generateRandomString(64));

    sql.addFormat(parent);
    
    sql.addFormat(tenant);

    sql.runQuery();

    sql.await();

    responseObject["successful"] = true;
    responseObject["uuid"] = uuid;
};