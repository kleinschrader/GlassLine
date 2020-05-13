#include "checkCredLogin.h"

void checkCredLogin::run(const nlohmann::json &args)
{
    std::string username;
    std::string password;
    bool keepLoggedIn;

    getParameter(args,"username",username);
    getParameter(args,"password",password);
    getParameter(args,"keepLoggedIn",keepLoggedIn);

    boost::format query("SELECT \
    UuidFromBin(users.userid),users.passwd,users.passwdSalt,users.tenantAdmin, UuidFromBin(users.tenant), users.mfakey , tenants.globalAdmin, tenants.forceMFA \
    FROM users \
    LEFT JOIN tenants\
    ON users.tenant = tenants.tenantid \
    WHERE users.username = '%1%'");

    if(username.length() > 64)
    {
        setFailure("Username too long");
        return;
    }

    char usernameEscaped[username.length() * 2 + 1];

    mysql_real_escape_string(session->MYSQLHandle,usernameEscaped,username.c_str(),username.length());

    mysql_query(session->MYSQLHandle, boost::str(query % username).c_str());
    
    MYSQL_RES *result = mysql_store_result(session->MYSQLHandle);

    if(result == NULL)
    {
        setFailure("Backend Error");
        session->debugOut("DB Error: " + std::string(mysql_error(session->MYSQLHandle)));
        return;
    }

    if(mysql_num_rows(result) != 1)
    {
        mysql_free_result(result);

        setFailure("USER/PASS Invalid");
        return;
    }

    MYSQL_ROW row;
    row = mysql_fetch_row(result);

    std::string hashedPW = hashPassord(password,row[2]);


    if(hashedPW != std::string(row[1]))
    {
        std::cout << "Password Expected: " << row[1] << "\nPassword Calculated: "  << hashedPW << "\n Salt: " << row[2] << std::endl;

        mysql_free_result(result);

        setFailure("USER/PASS Invalid");
        return;
    }

    //check if tenant forces 2fa
    if(atoi(row[7]) == 1)
    {
        //check if user has 2fa setup
        if(row[5] == NULL)
        {
            //user does not have two fa setup
            responseObject["mfa"] = "setup";
        }
        else
        {
            //user has two fa setup
            responseObject["mfa"] = "verify";
        }
    }
    else
    {
        session->setFlag(sessionFlags::FLAG_USER_LOGGED_ON,true);
        responseObject["mfa"] = "none";
    }
    
    session->sessionInfo.user_uuid = row[0];
    session->sessionInfo.tenant_uuid = row[2];

    session->setFlag(sessionFlags::FLAG_USER_ADMIN, (atoi(row[3]) != 0));
    session->setFlag(sessionFlags::FLAG_ADMIN_TENANT,(atoi(row[6]) != 0));
    

    responseObject["successful"] = true;
    mysql_free_result(result);
}