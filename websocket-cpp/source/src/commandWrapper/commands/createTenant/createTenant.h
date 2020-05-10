#include "../../commandWrapper.h"

class createTenant : public commandWrapper
{
private:
    
public:
    createTenant() {};
    ~createTenant() {};

    void run(const nlohmann::json &args);
};