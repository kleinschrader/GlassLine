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

    mysqlWrapper sql(session->MYSQLHandle,"SELECT \
    UuidFromBin(users.userid) as userid,users.passwd,users.passwdSalt,users.tenantAdmin, UuidFromBin(users.tenant) as tenant, users.mfakey ,tenants.globalAdmin, tenants.forceMFA \
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

    sql.escapeStringAndFormat(username.c_str());

    sql.runQuery();

    // if we dont get exactly one result, we know such a user does not exist
    if(sql.numberRows != 1)
    {
        setFailure("USER/PASS Invalid");
        return;
    }

    // hash the password using the salt
    std::string hashedPW = hashPassord(password,sql[0]["passwdSalt"]);

    // run this code if the password does not match up with the one in the database
    if(hashedPW != sql[0]["passwd"])
    {
        setFailure("USER/PASS Invalid");
        return;
    }

    // check if tenant forces 2fa
    if(atoi( sql[0]["forceMFA"] ) == 1)
    {
        // check if user has 2fa setup
        if( sql[0]["mfakey"] == NULL)
        {
            // user does not have two fa setup
            responseObject["mfa"] = "setup";
            session->setFlag(sessionFlags::FLAG_MFA_SETUP_PERMITTED,true);
        }
        else
        {
            // user has two fa setup
            responseObject["mfa"] = "verify";
            session->sessionInfo.mfa_key = sql[0]["mfakey"];
        }
    }
    else
    {
        // no mfa is required, just set the user to be logged in
        session->setFlag(sessionFlags::FLAG_USER_LOGGED_ON,true);
        responseObject["mfa"] = "none";
    }
    
    // save the user and tenant info to the session
    session->sessionInfo.user_uuid = sql[0]["userid"];
    session->sessionInfo.tenant_uuid = sql[0]["tenant"];

    // set flag based on the data in the database
    session->setFlag(sessionFlags::FLAG_USER_ADMIN, (atoi(sql[0]["tenantAdmin"]) != 0));
    session->setFlag(sessionFlags::FLAG_ADMIN_TENANT,(atoi(sql[0]["globalAdmin"]) != 0));
    

    responseObject["successful"] = true;

};