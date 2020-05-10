#include "createTenant.h"

void createTenant::run(const nlohmann::json &args)
{
    if(!checkArgument(args, "tenantname"))
    {
        return;
    }

    if(!checkArgument(args, "useMFA"))
    {
        return;
    }

    if(!checkArgument(args,"globalAdmin"))
    {
        return;
    }

    int useMFA = args["useMFA"] ? 1 : 0;
    int globalAdmin = args["globalAdmin"] ? 1 : 0;

    std::string tenantname = args["tenantname"];

    char* tenantnameEscaped = new char[tenantname.length() + 1];

    mysql_real_escape_string(session->MYSQLHandle,tenantnameEscaped,tenantname.c_str(),tenantname.length());

    std::string uuid = genUUID();
    responseObject["uuid"] = uuid;

    std::string query = "INSERT INTO tenants(tenantid,tenantname,globalAdmin,forceMFA) \
         VALUES (UuidToBin('%1%'),'%2%',%3%,%4%)";
    

    std::string finalQuery = boost::str((boost::format(query) % (uuid) % tenantnameEscaped % globalAdmin % useMFA));

    std::cout << finalQuery << std::endl;

    mysql_query(session->MYSQLHandle,finalQuery.c_str());

    delete [] tenantnameEscaped;

    mysql_commit(session->MYSQLHandle);
}