#include "../../commandWrapper.h"

class getTenantServer : public commandWrapper
{
private:

public:
    getTenantServer() {};
    ~getTenantServer() {};

    void run(const nlohmann::json &args);
};

