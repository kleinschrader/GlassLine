#ifndef B483C99A_111B_4273_BA03_2B7164D1ADDF
#define B483C99A_111B_4273_BA03_2B7164D1ADDF
#include "../../commandWrapper.h"

#include <math.h>

class checkTokenLogin : public commandWrapper
{
private:
    
public:
    checkTokenLogin() {};
    ~checkTokenLogin() {};

    void run(const nlohmann::json &args);
};
#endif /* B483C99A_111B_4273_BA03_2B7164D1ADDF */
