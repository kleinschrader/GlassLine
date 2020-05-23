#include "../../commandWrapper.h"

class getTenants : public commandWrapper
{
private:

public:
    getTenants() {};
    ~getTenants() {};

    void run(const nlohmann::json &args);
};

