#ifndef D9B22FCA_A4A8_45AD_A52B_33B486E5E7EF
#define D9B22FCA_A4A8_45AD_A52B_33B486E5E7EF
#include "../../commandWrapper.h"

class createTenant : public commandWrapper
{
private:
    
public:
    createTenant() {};
    ~createTenant() {};

    void run(const nlohmann::json &args);
};
#endif /* D9B22FCA_A4A8_45AD_A52B_33B486E5E7EF */
