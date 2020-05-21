#include <mysql/mysql.h>

#include <boost/format.hpp>

#include <future>
#include <mutex>

#include <string>

#include <string.h>

#include <iostream>

struct mysqlWrapperFieldHashmapObject
{
    const char* fieldName;
    unsigned int postion;
};

class mysqlWrapper;

class mysqlSubWrapper 
{
    private:
        mysqlWrapper* wrapper;
        int row;
    public:

        const char* operator[](const char* fieldname);

        mysqlSubWrapper(mysqlWrapper * msqlwrp, int _row);

};

class mysqlWrapper
{
private:
    boost::format *_query = 0;
    MYSQL *_handle = 0;
    MYSQL_RES *_result = 0;

    unsigned int numberOfFields = 0;

    mysqlWrapperFieldHashmapObject* fieldHashmap = 0;

    MYSQL_ROW *rows;

    std::mutex _mtex;

    void _runQuery();

    friend mysqlSubWrapper;
public:
    mysqlWrapper(MYSQL *handle, const char* query);
    ~mysqlWrapper();

    void addFormat(const char* value);
    void addFormat(int value);
    void addFormat(bool value);
    void addFormat(std::string value);

    void escapeStringAndFormat(const char* string);

    void runQuery();

    mysqlSubWrapper operator[](int lookup);

    bool encounterdError = false;

    unsigned int numberRows;
};

