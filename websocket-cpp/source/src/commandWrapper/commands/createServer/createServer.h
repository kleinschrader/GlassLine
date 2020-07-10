#ifndef E88A637B_72AB_40B0_87D0_F0DBD8C87318
#define E88A637B_72AB_40B0_87D0_F0DBD8C87318
#include "../../commandWrapper.h"

class createServer : public commandWrapper
{
private:
    
public:
    createServer() {};
    ~createServer() {};

    void run(const nlohmann::json &args);
};
#endif /* E88A637B_72AB_40B0_87D0_F0DBD8C87318 */
