#include "getSetupRequired.h"

void getSetupRequired::run(const nlohmann::json &args)
{
    mysql_query(
        session->MYSQLHandle,
        "SELECT setUpComplete,UuidFromBin(setupToken) AS setupToken from settings"
    );


    MYSQL_RES *result = mysql_store_result(session->MYSQLHandle);
   
    if(result == NULL)
    {
        setFailure("DB Error");
        return;
    }

    MYSQL_ROW row;
    row = mysql_fetch_row(result);


    responseObject["setupRequired"] = ((int)atoi(row[0]) == 0);
    std::cout << "Glassline Setup Tocken: " << row[1] << std::endl;

    mysql_free_result(result);
}