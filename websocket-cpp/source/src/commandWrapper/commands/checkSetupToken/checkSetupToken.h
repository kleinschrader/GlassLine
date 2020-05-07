#include "../../commandWrapper.h"

class checkSetupToken : public commandWrapper
{
private:
    
public:
    checkSetupToken() {};
    ~checkSetupToken() {};

    void run(const nlohmann::json &args);
};