#include "../../commandWrapper.h"



class checkCredLogin : public commandWrapper
{
private:
    
public:
    checkCredLogin() {};
    ~checkCredLogin() {};

    void run(const nlohmann::json &args);
};