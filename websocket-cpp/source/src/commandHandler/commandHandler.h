#ifndef DF0B6769_5610_4897_8E9B_CC72F5479ED2
#define DF0B6769_5610_4897_8E9B_CC72F5479ED2

#include <iostream>
#include <map>

#include <nlohmann/json.hpp>

#include "../sessionHandler/sessionHandler.h"

#include "../commandWrapper/commands.h"

typedef commandWrapper*(*__CreateInstance)();

class commandHandler
{
public:
    commandHandler(sessionHandler *currentSession);
    ~commandHandler();

    std::string handleCommand(std::string const& command);
private:
    bool createMap(std::map<std::string,__CreateInstance> *commandMap);

    sessionHandler* session;

    //Create new Instance of each
    static commandWrapper* CreateInstance_checkCredLogin();
    static commandWrapper* CreateInstance_checkSetupToken();
    static commandWrapper* CreateInstance_checkTokenLogin();
    static commandWrapper* CreateInstance_createTenant();
    static commandWrapper* CreateInstance_createUser();
    static commandWrapper* CreateInstance_finishSetup();
    static commandWrapper* CreateInstance_generateMFASecret();
    static commandWrapper* CreateInstance_getAllServers();
    static commandWrapper* CreateInstance_getSetupRequired();
    static commandWrapper* CreateInstance_getTenants();
    static commandWrapper* CreateInstance_getTenantServer();
    static commandWrapper* CreateInstance_verifyOTP();
};
#endif /* DF0B6769_5610_4897_8E9B_CC72F5479ED2 */
