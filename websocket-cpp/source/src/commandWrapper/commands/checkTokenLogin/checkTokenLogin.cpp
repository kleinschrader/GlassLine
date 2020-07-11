#include "checkTokenLogin.h"

void checkTokenLogin::run(const nlohmann::json &args)
{
    if(!checkArgument(args,"token"))
    {
        return;
    }

    std::string token = args["token"];

    if(token.length() != 128)
    {
        setFailure("Token Invalid Format");
        return;
    }

    mysqlWrapper sql(session->MYSQLHandle,"SELECT UuidFromBin(userid) AS userUUID, (DATEDIFF(resumeSessionCodeSpoil, DATE())) AS dateDiffrence, UuidFromBin(tenant) AS tenantUUID, tenants.globalAdmin AS globalAdmin \
        FROM users \
        LEFT JOIN tenants \
        ON users.tenant = tenants.tenantid \
        WHERE resumeSessionCode = '%1%'");



    sql.escapeStringAndFormat(token.c_str());
   
    sql.runQuery();

    sql.await();

    if(sql.numberRows != 1)
    {
        setFailure("Token Invalid");
        return;
    }


    if(atoi(sql[0]["dateDiffrence"]) < 0)
    {
        setFailure("Token Expired");
        return;
    }

    refreshLoginToken(sql[0]["userUUID"]);

    session->sessionInfo.user_uuid = sql[0]["userUUID"];
    session->sessionInfo.tenant_uuid = sql[0]["tenantUUID"];

    session->setFlag(sessionFlags::FLAG_ADMIN_TENANT,(atoi(sql[0]["globalAdmin"]) != 0));
    session->setFlag(sessionFlags::FLAG_USER_LOGGED_ON,true);

    responseObject["successful"] = true;
    responseObject["mfa"] = "none";
};