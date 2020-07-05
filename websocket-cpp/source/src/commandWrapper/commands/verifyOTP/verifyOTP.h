#ifndef DA7FF3E5_BDC3_4ACE_A76D_03B46C51B136
#define DA7FF3E5_BDC3_4ACE_A76D_03B46C51B136
#include "../../commandWrapper.h"

class verifyOTP : public commandWrapper
{
private:

public:
    verifyOTP() {};
    ~verifyOTP() {};

    void run(const nlohmann::json &args);
};

#endif /* DA7FF3E5_BDC3_4ACE_A76D_03B46C51B136 */
