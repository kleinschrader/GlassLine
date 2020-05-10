#include "createUser.h"

const char* hexGenString = "0123456789ABCDEF";

void createUser::run(const nlohmann::json &args)
{
    if(!checkArgument(args, "username"))
    {
        return;
    }

    if(!checkArgument(args, "password"))
    {
        return;
    }

    if(!checkArgument(args,"tenant"))
    {
        return;
    }

    if(!checkArgument(args,"tenantAdmin"))
    {
        return;
    }

    if(!session->getFlag(sessionFlags::FLAG_ADMIN_TENANT) && !session->getFlag(sessionFlags::FLAG_SETUP_PERMITTED))
    {
        if(session->sessionInfo.tenant_uuid != args["tenant"])
        {
            setFailure("Perrmission Denied");
            return;
        }
    }

    int tenantAdmin = args["tenantAdmin"] ? 1 : 0;

    std::string parsedTenantUUID;

    try
    {
        std::string tanantUUID = (std::string)args["tenant"];
        const char* tanantUUIDCChar = tanantUUID.c_str();
        std::cout << tanantUUIDCChar << std::endl;

        parsedTenantUUID = boost::uuids::to_string(boost::uuids::string_generator()(tanantUUIDCChar));
    }
    catch(...)
    {
        setFailure("Tenant UUDI Parse Failed");
        return;
    }

    std::string uuid = genUUID();

    std::string passwordSalt;
    passwordSalt.resize(32);

    for(int i = 0; i < 32; i++)
    {
        passwordSalt[i] += hexGenString[random() % 17];
    }

    

    std::string passwordHash = hashPassord(args["password"],passwordSalt);


    std::string username = args["username"];

    if(username.length() > 64)
    {
        setFailure("Username to long");
        return;
    }

    char usernameEscaped[64 * 2 + 1]; 
    memset(usernameEscaped,0,65);

    mysql_real_escape_string(session->MYSQLHandle,usernameEscaped,username.c_str(),username.length());

    boost::format query("INSERT INTO users \
    (userid,username,passwd,passwdSalt,tenantAdmin,tenant) \
    VALUES \
    (UuidToBin('%1%'),'%2%','%3%','%4%',%5%,UuidToBin('%6%'))");

    mysql_query(session->MYSQLHandle, boost::str(query % uuid % usernameEscaped % passwordHash % passwordSalt % tenantAdmin % parsedTenantUUID).c_str());

    mysql_commit(session->MYSQLHandle);

    responseObject["successful"] = true;
}