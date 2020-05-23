#include "../../commandWrapper.h"

class getAllServers : public commandWrapper
{
private:
    
public:
    getAllServers() {};
    ~getAllServers() {};

    void run(const nlohmann::json &args);
};