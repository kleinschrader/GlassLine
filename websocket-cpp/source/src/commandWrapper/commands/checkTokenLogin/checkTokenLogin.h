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