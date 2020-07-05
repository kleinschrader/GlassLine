#include "createTenant.h"

void createTenant::run(const nlohmann::json &args)
{
    std::string tenantname;
    bool useMFA;
    bool globalAdmin;

    getParameter(args,"tenantname",tenantname);
    getParameter(args,"useMFA",useMFA);
    getParameter(args,"globalAdmin",globalAdmin);

    mysqlWrapper sql(session->MYSQLHandle,"INSERT INTO tenants(tenantid,tenantname,globalAdmin,forceMFA) \
         VALUES (UuidToBin('%1%'),'%2%',%3%,%4%)");

    std::string uuid = genUUID();
    responseObject["uuid"] = uuid;

    
    sql.addFormat(uuid);
    sql.escapeStringAndFormat(tenantname.c_str());
    sql.addFormat(globalAdmin);
    sql.addFormat(useMFA);

    sql.runQuery();

    sql.await();
}