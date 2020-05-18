#include "generateMFASecret.h"

void generateMFASecret::run(const nlohmann::json &args)
{

    if(!session->getFlag(sessionFlags::FLAG_MFA_SETUP_PERMITTED))
    {
        setFailure("Not Autherised");
        return;
    }

    //a place to store the secret key in binary
    char mfasecretkey[16];
    
    //get the current millisecounds since epoch. Also i refuse to use the use namespace functionality resulting in this abomanation
    std::chrono::milliseconds ms = std::chrono::duration_cast< std::chrono::milliseconds > ( std::chrono::system_clock::now().time_since_epoch());
    
    //convert the milliseconds to an interger and feed them to srand
    srand(ms.count());


    //generate a random interger value for each position in the string
    for(int i = 0; i < 16; i++)
    {
        mfasecretkey[i] = rand() % 256;
    }

    //create a buffer for the hex version of the string
    char hexsecretkey[16 * 2 +1];

    //convert the ranodom key the a hex string
    convertToHexString(mfasecretkey,16,hexsecretkey);

    //place the hexstring in the respobnse object
    responseObject["MFASecret"] = hexsecretkey;

    session->sessionInfo.mfa_key = hexsecretkey;
}

void generateMFASecret::convertToHexString(const char* in, unsigned int length, char* out)
{
    const char* hexLookUpTable = "0123456789ABCDEF";

    for(unsigned int i = 0; i < length; i++)
    {
        int minorPostion = (uint8_t)in[i] % 16;
        int majorPostion = (uint8_t)in[i] / 16;

        out[i*2] = hexLookUpTable[majorPostion];
        out[i*2+1] = hexLookUpTable[minorPostion];
    }

    out[length * 2] = 0;
}