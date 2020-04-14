# Websocket Documentation v0.1

## Calling functions

To call a function simply send the data in the following format:

>  **FUNCTIONCALLHANDLE**&param1&param2

You can escape the **&** sign using  ``&&``

Functions call handle are only valid if writen in all uppercase.
If no parameters are required the function can simply be called like this:

> **FUNCTIONCALLHANDLE**

### Function checkTokenLogin
**Call handle**: CHECKTOKENLOGIN
**Param 1**: A 128 Byte Token to login automaticly 
**Returns**: true or false.
**Description**: This is used when the user decides to stay logged in, in that case instead of using a username or password login happes via a token saved in the browsers cookies. Once called it returns either false to signify a wrong token or true if everything is ok and authentication was succesfull.