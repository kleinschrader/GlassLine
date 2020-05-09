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

    

    mysql_query(
        session->MYSQLHandle,
        "SELECT UuidFromBin(userid), DATEDIFF(resumeSessionCodeSpoil, DATE()), UuidFromBin(tenant), tenants.globalAdmin \
        FROM users \
        LEFT JOIN tenants \
        ON users.tenant = tenants.tenantid \
        WHERE resumeSessionCode = ?"
    );

    MYSQL_RES *result = mysql_store_result(session->MYSQLHandle);
   
    if(mysql_num_rows(result) != 1)
    {
        setFailure("Token Invalid");
        mysql_free_result(result);
        return;
    }

    MYSQL_ROW row;
    row = mysql_fetch_row(result);

    if(atoi(row[1]) < 0)
    {
        setFailure("Token Expired");
        mysql_free_result(result);
        return;
    }

    session->sessionInfo.user_uuid = row[0];
    session->sessionInfo.tenant_uuid = row[2];

    session->setFlag(sessionFlags::FLAG_ADMIN_TENANT,(atoi(row[3]) != 0));
    session->setFlag(sessionFlags::FLAG_USER_LOGGED_ON,true);

    responseObject["successful"] = true;
    mysql_free_result(result);
};

