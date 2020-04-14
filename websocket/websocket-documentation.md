# Websocket Documentation v0.1

## Calling functions

All comunications from and to the sever are done using json data (excluding exceptions and keepalive)
To call a function simply send a json object with the value command an the call handle

Parameters are defined as extra values in the same array

Furthermore it is expected that every request will include a sequence number, it is irelivant if its a number that counts up or is just randomly selected. This allows out of sequence communication so you can request multiple thinkgs at once. It is expected to be in the base of the json string with the name "seq"

To keep the connection alive send an empty packet every x secounds.

Example json: ``{"cmd": "checkTokenLogin","token": "TOKEN","seq": 100}`

### Function checkTokenLogin
**Call handle**: checkTokenLogin
**token**: A 128 Byte Token to login automaticly 
**Request Exmaple** : {}
**Response Example**: ``{"successful": true}``
**Description**: This is used when the user decides to stay logged in, in that case instead of using a username or password login happes via a token saved in the browsers cookies.

### Function checkCredLogin
**Call handle**: checkCredLogin
**username**: The Username of the User
**password**: The Plaintext Password of the User
**keepLoggedIn**: true or false, depending if user wants to remain logged in
**Returns**: A JSON object with the value successful thats either true or false depending if credentials are correct and a token containing the checkTokenLogin token
**Description**: This is the standart login 
**Notes**: In the future we may change it so the password gets also hashed on the users end.