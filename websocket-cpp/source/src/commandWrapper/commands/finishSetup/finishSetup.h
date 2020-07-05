#ifndef BE109C16_E0E1_4C3A_9CD1_DF5DC1970364
#define BE109C16_E0E1_4C3A_9CD1_DF5DC1970364
#include "../../commandWrapper.h"



class finishSetup : public commandWrapper
{
private:
    
public:
    finishSetup() {};
    ~finishSetup() {};

    void run(const nlohmann::json &args);
};
#endif /* BE109C16_E0E1_4C3A_9CD1_DF5DC1970364 */
