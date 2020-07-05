#ifndef F224F912_EBE5_4EBA_A860_3D939555F874
#define F224F912_EBE5_4EBA_A860_3D939555F874
#include "../../commandWrapper.h"

class getTenantServer : public commandWrapper
{
private:

public:
    getTenantServer() {};
    ~getTenantServer() {};

    void run(const nlohmann::json &args);
};

#endif /* F224F912_EBE5_4EBA_A860_3D939555F874 */
