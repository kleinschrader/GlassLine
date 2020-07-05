#ifndef B778E9DB_EB6A_4683_9F4C_C2F5393AB9FF
#define B778E9DB_EB6A_4683_9F4C_C2F5393AB9FF
#include "../../commandWrapper.h"

class getSetupRequired : public commandWrapper
{
private:

public:
    getSetupRequired() {};
    ~getSetupRequired() {};

    void run(const nlohmann::json &args);
};

#endif /* B778E9DB_EB6A_4683_9F4C_C2F5393AB9FF */
