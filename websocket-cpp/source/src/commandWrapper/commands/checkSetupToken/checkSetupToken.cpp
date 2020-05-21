#include "checkSetupToken.h"

void checkSetupToken::run(const nlohmann::json &args)
{
    std::string token;
    getParameter(args,"token",token);

    if(!checkArgument(args,"token"))
    {
        return;
    }

    mysqlWrapper sql(session->MYSQLHandle,"SELECT UuidFromBin(setupToken) AS setupToken from settings");

    sql.runQuery();
   

    if(token == sql[0]["setupToken"])
    {
        session->setFlag(sessionFlags::FLAG_SETUP_PERMITTED, true);
        responseObject["successful"] = true;
    }
    else
    {
        setFailure("Wrong Token");
    }
}