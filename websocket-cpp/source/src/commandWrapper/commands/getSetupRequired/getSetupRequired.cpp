#include "getSetupRequired.h"

void getSetupRequired::run()
{
    mysql_query(
        this->session->MYSQLHandle,
        "SELECT setUpComplete,UuidFromBin(setupToken) AS setupToken from settings"
    );


    MYSQL_RES *result = mysql_store_result(this->session->MYSQLHandle);
   
    MYSQL_ROW row;
    row = mysql_fetch_row(result);


    this->responseObject["setupRequired"] = ((int)atoi(row[0]) == 0);
    std::cout << row[0] << std::endl;
    std::cout << "Glassline Setup Tocken: " << row[1] << std::endl;

    mysql_free_result(result);
    
}