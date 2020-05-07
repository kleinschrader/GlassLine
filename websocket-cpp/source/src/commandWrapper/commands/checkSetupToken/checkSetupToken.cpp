#include "checkSetupToken.h"

void checkSetupToken::run(const nlohmann::json &args)
{

    if(!checkArgument(args,"token"))
    {
        return;
    }

    mysql_query(
        this->session->MYSQLHandle,
        "SELECT UuidFromBin(setupToken) AS setupToken from settings"
    );

    MYSQL_RES *result = mysql_store_result(this->session->MYSQLHandle);
   
    MYSQL_ROW row;
    row = mysql_fetch_row(result);

    if(args["token"] == row[0])
    {
        this->session->setFlag(sessionFlags::FLAG_SETUP_PERMITTED, true);
        this->responseObject["successful"] = true;
    }
    else
    {
        this->responseObject["successful"] = false;
        this->responseObject["error"] = "Wrong Token";
    }

    mysql_free_result(result);
}