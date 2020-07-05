#ifndef DEBUG
#define DB_HOST "database"
#define DB_USERNAME "db_user_gl"
#define DB_PASSWORD "passwd12"
#define DB_DATABASE "glassline"
#else
#define DB_HOST "127.0.0.1"
#define DB_USERNAME "db_user_gl"
#define DB_PASSWORD "passwd12"
#define DB_DATABASE "glassline"
#endif


#ifndef sessionHandler_H_GUARD
#define sessionHandler_H_GUARD

#include <websocketpp/config/asio_no_tls.hpp>

#include <websocketpp/server.hpp>

#include <iostream>

#include <mysql/mysql.h>


namespace sessionFlags
{
    enum flags
    {
        FLAG_SETUP_PERMITTED = 0x1,
        FLAG_USER_LOGGED_ON = 0x2,
        FLAG_ADMIN_TENANT = 0x4,
        FLAG_USER_ADMIN = 0x8,
        FLAG_MFA_SETUP_PERMITTED = 0x10
    };
};

struct sessionData
{
    std::string user_uuid = "";
    std::string tenant_uuid = "";
    std::string mfa_key = "";
    bool keepLoggedIn = false;
};

class sessionHandler
{
private:
    u_int16_t flags = 0;
    
public:
    sessionHandler(websocketpp::connection_hdl newHDL);
    ~sessionHandler();

    void debugOut(std::string message);

    void setFlag(u_int16_t flag, bool newValue);
    bool getFlag(u_int16_t flag);

    void resetFlags();

    static void handleMessage(websocketpp::connection_hdl hdl, std::string message, websocketpp::frame::opcode::value opcode, sessionHandler* session ,void* s);

    sessionData sessionInfo;

    websocketpp::connection_hdl hdl;

    MYSQL* MYSQLHandle;
    std::mutex MYSQLLock;
};

#endif