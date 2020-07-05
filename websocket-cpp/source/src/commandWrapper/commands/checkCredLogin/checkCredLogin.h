#include "../../commandWrapper.h"

#ifndef checkCredLogin_H_GUARD
#define checkCredLogin_H_GUARD

class checkCredLogin : public commandWrapper
{
private:
    
public:
    checkCredLogin() {};
    ~checkCredLogin() {};

    void run(const nlohmann::json &args);
};

#endif