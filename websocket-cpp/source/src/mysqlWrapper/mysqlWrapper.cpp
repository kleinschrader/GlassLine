#include "mysqlWrapper.h"

void mysqlWrapper::addFormat(const char* value)
{
    *_query = *_query % value;
}

void mysqlWrapper::addFormat(int value)
{
    *_query = *_query % value;
}

void mysqlWrapper::addFormat(bool value)
{
    *_query = *_query % (value ? 1 : 0);
}

void mysqlWrapper::addFormat(std::string value)
{
    *_query = *_query % value;
}

mysqlWrapper::mysqlWrapper(MYSQL *handle, const char* query)
{
    _handle = handle;
    _query = new boost::format(query);
}

mysqlWrapper::~mysqlWrapper()
{
    _mtex.lock();
    _mtex.unlock();
    delete _query;
    delete [] rows;
    mysql_free_result(_result);
}

void mysqlWrapper::runQuery()
{
    std::async(std::launch::async, [this]{ this->_runQuery(); });
}

void mysqlWrapper::_runQuery()
{

    _mtex.lock();

    if(_query == NULL)
    {
        return;
    }

    if(_handle == NULL)
    {
        return;
    }

    int returnCode = mysql_query(_handle,boost::str(*_query).c_str());

    if(returnCode != 0)
    {
        std::cout << "SQL Query Error: " << mysql_error(_handle) << std::endl;
        bool encounterdError = true;
        _mtex.unlock();
        return;
    }

    _result = mysql_store_result(_handle);

    if(_result == 0)
    {
        _mtex.unlock();
        mysql_commit(_handle);
        return;
    }

    numberOfFields = mysql_num_fields(_result);
    numberRows = mysql_num_rows(_result);

    rows = new MYSQL_ROW[numberRows];

    MYSQL_FIELD *fields = mysql_fetch_fields(_result);


    fieldHashmap = new mysqlWrapperFieldHashmapObject[numberOfFields];


    for(int i = 0; i < numberOfFields; i++)
    {
        fieldHashmap[i].fieldName = fields[i].name;
        fieldHashmap[i].postion = i;
    }

    for(int i = 0; i < numberRows; i++)
    {
        rows[i] = mysql_fetch_row(_result);
    }

    mysql_commit(_handle);

    _mtex.unlock();
}

mysqlSubWrapper mysqlWrapper::operator[](int lookup)
{
    _mtex.lock();
    _mtex.unlock();
    return mysqlSubWrapper(this,lookup);
}


mysqlSubWrapper::mysqlSubWrapper(mysqlWrapper * msqlwrp, int _row)
{
    wrapper = msqlwrp;
    row = _row;
}

const char* mysqlSubWrapper::operator[](const char* fieldname)
{
    for(int i = 0; i < wrapper->numberOfFields; i++)
    {
        if(strcmp(fieldname, wrapper->fieldHashmap[i].fieldName) == 0)
        {
            return wrapper->rows[row][wrapper->fieldHashmap[i].postion];
        }
    }

    return NULL;
}

void mysqlWrapper::escapeStringAndFormat(const char* string)
{
    unsigned int len = strlen(string);

    char buffer[len * 2 + 1];

    mysql_real_escape_string(_handle,buffer,string,len);

    *_query = *_query % (char*)buffer;
}