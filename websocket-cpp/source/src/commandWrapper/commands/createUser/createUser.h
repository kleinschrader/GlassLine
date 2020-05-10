#include "../../commandWrapper.h"



class createUser : public commandWrapper
{
private:
    
public:
    createUser() {};
    ~createUser() {};

    void run(const nlohmann::json &args);
};