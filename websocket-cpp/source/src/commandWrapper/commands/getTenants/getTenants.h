#ifndef D393A1E8_3E28_412C_82C6_A29D45EACA88
#define D393A1E8_3E28_412C_82C6_A29D45EACA88
#include "../../commandWrapper.h"

class getTenants : public commandWrapper
{
private:

public:
    getTenants() {};
    ~getTenants() {};

    void run(const nlohmann::json &args);
};

#endif /* D393A1E8_3E28_412C_82C6_A29D45EACA88 */
