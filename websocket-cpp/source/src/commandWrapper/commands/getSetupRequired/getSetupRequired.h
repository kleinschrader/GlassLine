#include "../../commandWrapper.h"

class getSetupRequired : public commandWrapper
{
private:

public:
    getSetupRequired() {};
    ~getSetupRequired() {};

    void run(const nlohmann::json &args);
};

