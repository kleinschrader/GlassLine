#include "checkSetupToken.h"

void checkSetupToken::run(const nlohmann::json &args)
{

    if(!checkArgument(args,"token"))
    {
        return;
    }

    mysql_query(
        session->MYSQLHandle,
        "SELECT UuidFromBin(setupToken) AS setupToken from settings"
    );

    MYSQL_RES *result = mysql_store_result(session->MYSQLHandle);
   
    MYSQL_ROW row;
    row = mysql_fetch_row(result);

    if(args["token"] == row[0])
    {
        session->setFlag(sessionFlags::FLAG_SETUP_PERMITTED, true);
        responseObject["successful"] = true;
    }
    else
    {
        setFailure("Wrong Token");
    }

    mysql_free_result(result);
}