#ifndef E7892905_E0EF_4646_8A71_C1E6A627CA82
#define E7892905_E0EF_4646_8A71_C1E6A627CA82
#include "../../commandWrapper.h"

class getAllServers : public commandWrapper
{
private:
    
public:
    getAllServers() {};
    ~getAllServers() {};

    void run(const nlohmann::json &args);
};
#endif /* E7892905_E0EF_4646_8A71_C1E6A627CA82 */
