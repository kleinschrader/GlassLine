#include "finishSetup.h"

void finishSetup::run(const nlohmann::json &args)
{
    if(session->getFlag(!sessionFlags::FLAG_SETUP_PERMITTED))
    {
        setFailure("Permission denied");
        return;
    }

    mysql_query(session->MYSQLHandle,"UPDATE settings SET setUpComplete = 1");
    session->resetFlags();
}