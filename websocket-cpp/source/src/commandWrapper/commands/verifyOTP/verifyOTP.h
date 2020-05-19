#include "../../commandWrapper.h"

class verifyOTP : public commandWrapper
{
private:

public:
    verifyOTP() {};
    ~verifyOTP() {};

    void run(const nlohmann::json &args);
};

