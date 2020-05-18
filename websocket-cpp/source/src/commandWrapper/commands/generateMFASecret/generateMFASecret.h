#include "../../commandWrapper.h"

class generateMFASecret : public commandWrapper
{
private:

public:
    generateMFASecret() {};
    ~generateMFASecret() {};

    void run(const nlohmann::json &args);

    /** Covvert a string to a hexidecimal representaion of the string
     * @param in A pointer to the string to be converted
     * @param length The length of the string to be converted
     * @param out A pointer to an array where the result can be stored. The size can be caluclated like this (Required Size = length * 2 + 1)
    */
    void convertToHexString(const char* in, unsigned int length, char* out);
};

