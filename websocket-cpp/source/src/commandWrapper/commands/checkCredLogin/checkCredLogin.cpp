#include "checkCredLogin.h"

void checkCredLogin::run(const nlohmann::json &args)
{
    // buffer for all arguments
    std::string username;
    std::string password;
    bool keepLoggedIn;

    // copy the value to the buffer
    getParameter(args,"username",username);
    getParameter(args,"password",password);
    getParameter(args,"keepLoggedIn",keepLoggedIn);

    // THE SQL query as a format object, all %NUMBER% will be replaced
    boost::format query("SELECT \
    UuidFromBin(users.userid),users.passwd,users.passwdSalt,users.tenantAdmin, UuidFromBin(users.tenant), users.mfakey , tenants.globalAdmin, tenants.forceMFA \
    FROM users \
    LEFT JOIN tenants\
    ON users.tenant = tenants.tenantid \
    WHERE users.username = '%1%'");

    // the max username length is 64, so if its more than that we can assume its not correct
    if(username.length() > 64)
    {
        setFailure("Username too long");
        return;
    }

    // define a buffer for the username but escaped for mysql
    // it needs to be twice as big + 1
    //
    // the reason for this is that if all caracters need to be escaped,
    // we need and extra backslash
    // and at the end we still need the \0 caracter
    char usernameEscaped[username.length() * 2 + 1];

    //escape the username and store it in the escaped buffer
    mysql_real_escape_string(session->MYSQLHandle,usernameEscaped,username.c_str(),username.length());

    // run the sql query
    mysql_query(session->MYSQLHandle, boost::str(query % usernameEscaped).c_str());
    
    // this is the result buffer where all data and meta from the query is stored
    MYSQL_RES *result = mysql_store_result(session->MYSQLHandle);

    // if its NULL it means we encounterd an backend error
    if(result == NULL)
    {
        setFailure("Backend Error");
        session->debugOut("DB Error: " + std::string(mysql_error(session->MYSQLHandle)));
        return;
    }

    // if we dont get exactly one result, we know such a user does not exist
    if(mysql_num_rows(result) != 1)
    {
        //delete sql buffer
        mysql_free_result(result);

        setFailure("USER/PASS Invalid");
        return;
    }

    // row is an array wehre all the data is stored
    // usually you call it in a for loop,
    // however since we only got one row we can run it outside
    MYSQL_ROW row;
    row = mysql_fetch_row(result);

    // hash the password using the salt
    std::string hashedPW = hashPassord(password,row[2]);

    // run this code if the password does not match up with the one in the database
    if(hashedPW != std::string(row[1]))
    {
        // delete sql buffer
        mysql_free_result(result);

        setFailure("USER/PASS Invalid");
        return;
    }

    // check if tenant forces 2fa
    if(atoi(row[7]) == 1)
    {
        // check if user has 2fa setup
        if(row[5] == NULL)
        {
            // user does not have two fa setup
            responseObject["mfa"] = "setup";
        }
        else
        {
            // user has two fa setup
            responseObject["mfa"] = "verify";
        }
    }
    else
    {
        // no mfa is required, just set the user to be logged in
        session->setFlag(sessionFlags::FLAG_USER_LOGGED_ON,true);
        responseObject["mfa"] = "none";
    }
    
    // save the user and tenant info to the session
    session->sessionInfo.user_uuid = row[0];
    session->sessionInfo.tenant_uuid = row[2];

    // set flag based on the data in the database
    session->setFlag(sessionFlags::FLAG_USER_ADMIN, (atoi(row[3]) != 0));
    session->setFlag(sessionFlags::FLAG_ADMIN_TENANT,(atoi(row[6]) != 0));
    

    responseObject["successful"] = true;

    // delete sql buffer
    mysql_free_result(result);
}