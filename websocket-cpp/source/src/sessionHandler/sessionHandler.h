#ifndef sessionHandler_H_GUARD
#define sessionHandler_H_GUARD

#include <websocketpp/config/asio_no_tls.hpp>

#include <websocketpp/server.hpp>

#include <iostream>

#include <mysql/mysql.h>

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

namespace sessionFlags
{
    enum flags
    {
        FLAG_SETUP_PERMITTED = 1,
        FLAG_USER_LOGGED_ON = 2,
        FLAG_ADMIN_TENANT = 4
    };
};

struct sessionData
{
    std::string user_uuid = "";
    std::string tenant_uuid = "";
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

    static void handleMessage(websocketpp::connection_hdl hdl, std::string message, websocketpp::frame::opcode::value opcode, sessionHandler* session ,void* s);

    sessionData sessionInfo;

    websocketpp::connection_hdl hdl;

    MYSQL* MYSQLHandle;
};

#endif