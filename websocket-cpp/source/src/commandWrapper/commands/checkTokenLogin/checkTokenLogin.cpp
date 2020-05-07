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
        this->responseObject["successful"] = false;
        this->responseObject["error"] = "Token Invalid Format";
        return;
    }

    

    mysql_query(
        this->session->MYSQLHandle,
        "SELECT UuidFromBin(userid), DATEDIFF(resumeSessionCodeSpoil, DATE()), UuidFromBin(tenant), tenants.globalAdmin \
        FROM users \
        LEFT JOIN tenants \
        ON users.tenant = tenants.tenantid \
        WHERE resumeSessionCode = ?"
    );

    MYSQL_RES *result = mysql_store_result(this->session->MYSQLHandle);
   
    if(mysql_num_rows(result) != 1)
    {
        this->responseObject["successful"] = false;
        this->responseObject["error"] = "Token Invalid";
        mysql_free_result(result);
        return;
    }

    MYSQL_ROW row;
    row = mysql_fetch_row(result);

    if(atoi(row[1]) < 0)
    {
        this->responseObject["successful"] = false;
        this->responseObject["error"] = "Token Expired";
        mysql_free_result(result);
        return;
    }

    this->session->sessionInfo.user_uuid = row[0];
    this->session->sessionInfo.tenant_uuid = row[2];

    this->session->setFlag(sessionFlags::FLAG_ADMIN_TENANT,(atoi(row[3]) != 0));
    this->session->setFlag(sessionFlags::FLAG_USER_LOGGED_ON,true);

    this->responseObject["successful"] = true;
    mysql_free_result(result);
};

