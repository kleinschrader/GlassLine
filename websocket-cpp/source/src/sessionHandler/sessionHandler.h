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

class sessionHandler
{
private:
    
public:
    sessionHandler(websocketpp::connection_hdl newHDL);
    ~sessionHandler();

    void debugOut(std::string message);

    static void handleMessage(websocketpp::connection_hdl hdl, std::string message, websocketpp::frame::opcode::value opcode, sessionHandler* session ,void* s);

    websocketpp::connection_hdl hdl;

    MYSQL* MYSQLHandle;
};

#endif