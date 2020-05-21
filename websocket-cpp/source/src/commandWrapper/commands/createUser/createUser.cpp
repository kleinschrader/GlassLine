#include "createUser.h"

const char* hexGenString = "0123456789ABCDEF";

void createUser::run(const nlohmann::json &args)
{
    std::string username;
    std::string password;
    std::string tenant;
    bool tenantAdmin;

    getParameter(args,"username",username);
    getParameter(args,"password",password);
    getParameter(args,"tenant",tenant);
    getParameter(args,"tenantAdmin",tenantAdmin);

    if(!session->getFlag(sessionFlags::FLAG_ADMIN_TENANT) && !session->getFlag(sessionFlags::FLAG_SETUP_PERMITTED))
    {
        if(session->sessionInfo.tenant_uuid != tenant)
        {
            setFailure("Perrmission Denied");
            return;
        }
    }

    std::string uuid = genUUID();

    std::string passwordSalt;
    passwordSalt.resize(32);

    srand (time(NULL));
    for(int i = 0; i < 32; i++)
    {
        passwordSalt[i] = hexGenString[rand() % 17];
    }

    std::string passwordHash = hashPassord(password,passwordSalt);


    if(username.length() > 64)
    {
        setFailure("Username to long");
        return;
    }

    mysqlWrapper sql(session->MYSQLHandle,"INSERT INTO users \
    (userid,username,passwd,passwdSalt,tenantAdmin,tenant) \
    VALUES \
    (UuidToBin('%1%'),'%2%','%3%','%4%',%5%,UuidToBin('%6%'))");

    sql.addFormat(uuid);
    sql.escapeStringAndFormat(username.c_str());
    sql.addFormat(passwordHash);
    sql.addFormat(passwordSalt);
    sql.addFormat(tenantAdmin);
    sql.addFormat(tenant);

    sql.runQuery();

    responseObject["successful"] = true;
}