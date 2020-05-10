#include "../../commandWrapper.h"



class finishSetup : public commandWrapper
{
private:
    
public:
    finishSetup() {};
    ~finishSetup() {};

    void run(const nlohmann::json &args);
};