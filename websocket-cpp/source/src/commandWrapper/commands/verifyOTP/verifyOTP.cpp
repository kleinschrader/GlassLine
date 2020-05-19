#include "verifyOTP.h"

void verifyOTP::run(const nlohmann::json &args)
{
    //get the provieded token
    std::string token;
    if(!getParameter(args,"otp",token))
    {
        return;
    }

    //covert the session's mfa key to a local variable, because why not
    std::string mfasecret;
    mfasecret = session->sessionInfo.mfa_key;

    //if its empty the user never attempted to login
    if(mfasecret == "")
    {
        setFailure("Not Autherised");
        return;
    }

    //initialise the oath libary
    oath_init();

    //valide the token provided against the secret
    int otpValidateReturn = oath_totp_validate2(mfasecret.c_str(),mfasecret.length(),time(0),30,0,0,NULL,token.c_str());
    
    //close the libary again
    oath_done();


    //if the result is prositive we can assume the code matched as all errors are negative intergers
    if(otpValidateReturn >= 0) {
        //set the login flag to true
        session->setFlag(sessionFlags::FLAG_USER_LOGGED_ON,true);
        responseObject["successful"] = true;
    }
    else {
        setFailure("No Match");
        return;
    }

    //if the mfa setup was just done, noticable by the flag, we stroe the key in the database 
    if(session->getFlag(sessionFlags::FLAG_MFA_SETUP_PERMITTED))
    {
        std::string query = boost::str(boost::format("UPDATE users SET mfakey = '%1%' WHERE userid = UuidToBin('%2%')") % mfasecret % session->sessionInfo.user_uuid);

        std::cout << query << std::endl;

        mysql_query(session->MYSQLHandle,query.c_str());

        mysql_commit(session->MYSQLHandle);
    }
}