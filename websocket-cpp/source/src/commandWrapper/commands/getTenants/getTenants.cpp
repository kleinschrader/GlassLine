#include "getTenants.h"

void getTenants::run(const nlohmann::json &args)
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

    mysqlWrapper sql(session->MYSQLHandle,"SELECT UuidFromBin(tenantid) AS tenantid, tenantname FROM tenants");

    sql.runQuery();

    auto tenants = nlohmann::json::array();

    for(int i = 0; i < sql.numberRows; i++)
    {
        auto tenant = nlohmann::json::object();
        tenant["id"] = sql[i]["tenantid"];
        tenant["name"] = sql[i]["tenantname"];

        tenants.push_back(tenant);
    }

    responseObject["tenants"] = tenants;
    responseObject["successful"] = true;
}