#include "../../commandWrapper.h"

class getSetupRequired : public commandWrapper
{
private:
    /* data */
public:
    getSetupRequired() {};
    ~getSetupRequired() {};

    void run(const nlohmann::json &args);
};

