#include "../../commandWrapper.h"

class checkSetupToken : public commandWrapper
{
private:
    
public:
    checkSetupToken() {};
    ~checkSetupToken() {};

    /**
     * Checks if a user with a setup token exists and log him on
     *
     * @param args["token"] A 128 Bit token
    */
    void run(const nlohmann::json &args);
};