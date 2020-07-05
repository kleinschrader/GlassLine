#ifndef FEB93581_231D_4B27_A3BF_1593EE5CFCFC
#define FEB93581_231D_4B27_A3BF_1593EE5CFCFC
#include "../../commandWrapper.h"



class createUser : public commandWrapper
{
private:
    
public:
    createUser() {};
    ~createUser() {};

    void run(const nlohmann::json &args);
};
#endif /* FEB93581_231D_4B27_A3BF_1593EE5CFCFC */
