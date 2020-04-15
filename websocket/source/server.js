const WebSocket = require('ws');
const mysql = require('mysql')

//set up connection to the database
var db = mysql.createConnection({
  host     : 'database',
  user     : 'db_user_gl',
  password : 'passwd12',
  database : 'glassline'
});

//a class that gets created if a ws is created
//handles all commands, session managment etc
class wsConnection {
  /** Initialises a new wsConnection
  * This Class handels all communication over a single websocket
  * @param {Object} Websocket
  */
  constructor(WebSocket)
  {
      this.bindFunctions()

      //makes it so the websocket is avalabile from this.socket
      this.socket = WebSocket

      this.socket.on('message',this.handleConnection)
  }

    /** Binds 'this' to all functions in this class
    * This is necessary so that all methods and variables in this class can be accessist 
    */
    bindFunctions()
    {
      this.handleConnection = this.handleConnection.bind(this)
      this.checkTokenLoginCallback = this.checkTokenLoginCallback.bind(this)
    }

    /** This is the main function to handle all data send to the server
     *  It converts an json string to an js object and calls functions requested by the user
     *  It has no concept of sequences or the current state of the session this has to be handled by the induvidual functions
     * @param {string} data
     */
    handleConnection(data) {
      try
      {
        //to keep the connection alive empty packets are send, we dont need to do anything
        if(data === "")
        {
          return;
        }

        //convert the json string to an js object
        let dataObject = JSON.parse(data);

        //find the applicable function to the users request and call it
        switch(dataObject.cmd) {
          case 'checkTokenLogin':
            this.checkTokenLogin(dataObject);
          case 'checkCredLogin':
            this.checkCredLogin(dataObject);
        }
      }
      catch(e)
      {
        // NOTE: This will get called if a malformed json object if being send

        //Log IP of the client and save the error message
        console.log(this.socket._socket.remoteAddress + " : issued a malformed command")
        console.log(e)

        //reply to the socket that the server was unable to parse the object and close the socket
        this.socket.send("Malformed input or Server error. Disconnecting...")
        this.socket.close(1011 /* Internal Error */)
      }
    }
    // SECTION MainCommands

    /** This function check if an identifying token is contained in side the database.
     *  If the token is not exactly 128 byte long it will call checkTokenLoginCallback with an error flag
     *  If the token is formated correctly it will issue an sql qurry and pipe the result to checkTokenLoginCallback
     * @param {Object} data - The Object containing the data
     * @param {string} data.token - The 128 Byte token for authentification
     * @param {number} data.seq - The original sequence
     * 
    */
    checkTokenLogin(data) {

      //if the token is not even set we can just call checkTokenLoginCallback with an error message
      if(data.token === null) {
        this.checkTokenLoginCallback("INVALTOKEN",null,null,data.seq)
        return;
      }

      //set a temporary reference to checkTokenLoginCallback as 'this' is not avalibe in an anonymos function
      let checkTokenLoginCallback = this.checkTokenLoginCallback

      //only query the db if the length is correct, otherwise we dont need to buffer
      if(data.token.length === 128) {
        //just select the uuid from the user table where our session code matches and send everything to checkTokenLoginCallback
        db.query('SELECT 1 FROM users WHERE resumeSessionCode = ?', [data.token], function(error, results, fields) {setTimeout(checkTokenLoginCallback,500,error, results, fields,data.seq)})
        return;
      }
      
      //the following command gets only called if the length is wrong
      //call checkTokenLoginCallback with an error message
      this.checkTokenLoginCallback("INVALTOKEN",null,null,data.seq)
    }

    /** The callback function to checkTokenLogin handles the returning values from mysql and sends the result back to the client
     * @param {string} error - Any Error that occured, standard in mysql but can be hijacked to force failure
     * @param {*} results
     * @param {*} fields 
     * @param {number} sequence - The original sequence
     */
    checkTokenLoginCallback(error, results, fields, sequence) {
      //create a JS Object we can send back as json
      let returnObj = new Object();
      //already place the sequence in the object
      returnObj.seq = sequence;
      
      //if the error is not empty something went wrong and we just send back successful : false
      if(error !== null) {
        returnObj.successful = false;
        this.socket.send(JSON.stringify(returnObj))
        return;
      }

      //if the result is not exactly one we will deny access
      if(results.length !== 1) {
        returnObj.successful = false;
        this.socket.send(JSON.stringify(returnObj))
        return;
      }

      // TODO : Set the UUID of the user in 'this'

      //any faliure condition is handled, if the code reaches this postion we will send back that the login was successful
      returnObj.successful = true;
      this.socket.send(JSON.stringify(returnObj))
      return;
    }

     /** This function will take login credentials and verify the user against the database
      *  If keepLoggedIn is true it will create a token to be used for session login
     * @param {Object}  data - The Object containing the data
     * @param {string}  data.username - The username of the user
     * @param {string}  data.password - The password of the user
     * @param {boolean} data.keepLoggedIn - If the user wishes to remain logged in
     * @param {number}  data.seq - The original sequence
     * 
    */
    checkCredLogin(data) {
      //if either of the parameters is missing just assume the whole data is junk and scrap it
      if(data.username === null || data.password === null || data.keepLoggedIn === null)
      {
        this.checkCredLoginCallback("INVALDATA",null,null,data.seq)
        return;
      }

      //set a temporary reference to checkCredLoginCallback as 'this' is not avalibe in an anonymos function
      let checkCredLoginCallback = this.checkCredLoginCallback

      // TODO : Implement query
      // TODO : Implement callback
    }

    /** The callback function to checkCredLogin handles the returning values from mysql and sends the result back to the client
     * @param {string} error - Any Error that occured, standard in mysql but can be hijacked to force failure
     * @param {*} results
     * @param {*} fields 
     * @param {boolean} keepLoggedIn
     * @param {number} sequence - The original sequence
     */
    checkCredLoginCallback(error, results, fields, keepLoggedIn, sequence) {
      // TODO : grab the password and use password_verify to compare to value in the database to the provided one
      // TODO : if keepLoggedIn in is on and token in db expired / na, generate a new token
      // TODO : if keepLoggedIn in is on and token in db valid, extend token validity
      // TODO : send result back to user (if keepLoggedIn is on send also toke)
    }


    // !SECTION


    socket = null
}

const ws = new WebSocket.Server({
  port: 80,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024 // Size (in bytes) below which messages
    // should not be compressed.
  }
});

ws.on('connection', function connection(ws){ new wsConnection(ws) } );