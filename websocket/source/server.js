const WebSocket = require('ws');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

let bcryptRounds = 10;

let b62alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

//set up connection parameters to the database
var dbpool = mysql.createPool({
  host     : 'database',
  user     : 'db_user_gl',
  password : 'passwd12',
  database : 'glassline',
  connectionLimit : 0
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

      //set up connection to the database
      dbpool.getConnection(this.onDBConnection)

      //makes it so the websocket is avalabile from this.socket
      this.socket = WebSocket
      this.socket.addEventListener('close',this.onSocketDie)

      this.socket.on('message',this.handleConnection)
  }

  /** Binds 'this' to all functions in this class
  * This is necessary so that all methods and variables in this class can be accessist 
  */
  bindFunctions()
  {
    this.handleConnection = this.handleConnection.bind(this)
    this.checkTokenLoginCallback = this.checkTokenLoginCallback.bind(this)
    this.checkCredLoginCallback = this.checkCredLoginCallback.bind(this)
    this.onSQLDie = this.onSQLDie.bind(this)
    this.onSocketDie = this.onSocketDie.bind(this)
    this.onDBConnection = this.onDBConnection.bind(this)
  }

  onDBConnection(err, connection) {
    if(err != null)
    {
      console.log(err)
    }

    this.db = connection;
    this.db.on('error',this.onSQLDie)
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
        this.db.query('SELECT 1')
        return;
      }

      //convert the json string to an js object
      let dataObject = JSON.parse(data);

      //find the applicable function to the users request and call it
      switch(dataObject.cmd) {
        case 'checkTokenLogin':
          this.checkTokenLogin(dataObject);
          break;
        case 'checkCredLogin':
          this.checkCredLogin(dataObject);
          break;
        case 'logoff':
          this.logoff(dataObject);
          break;
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
    if(data.token == null) {
      this.checkTokenLoginCallback("INVALTOKEN",null,null,data.seq)
      return;
    }

    //set a temporary reference to checkTokenLoginCallback as 'this' is not avalibe in an anonymos function
    let checkTokenLoginCallback = this.checkTokenLoginCallback

    //only query the db if the length is correct, otherwise we dont need to buffer
    if(data.token.length === 128) {
      //just select the uuid from the user table where our session code matches and send everything to checkTokenLoginCallback
      this.db.query('SELECT UuidFromBin(userid) AS userid,resumeSessionCodeSpoil FROM users WHERE resumeSessionCode = ?', [data.token], function(error, results, fields) {setTimeout(checkTokenLoginCallback,200,error, results, fields,data.seq)})
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
      console.log("SQL Connection error : " + error)
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

    //if the 'spoilage' date is before today fail the token authentication
    let today = new Date()
    if(results[0].resumeSessionCodeSpoil < today)
    {
      returnObj.successful = false;
      this.socket.send(JSON.stringify(returnObj))
      return;
    }

    //save the uuid in the current session
    this.uuid = results[0].userid

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
    if(data.username == null || data.password == null || data.keepLoggedIn == null)
    {
      this.checkCredLoginCallback("INVALDATA",null,null,data.seq)
      return;
    }

    //set a temporary reference to checkCredLoginCallback as 'this' is not avalibe in an anonymos function
    let checkCredLoginCallback = this.checkCredLoginCallback

    //grab the uuid, the hashed password the token and the token expire and call the checkCredLoginCallback function with the results
    this.db.query('SELECT UuidFromBin(userid) AS userid,passwd,resumeSessionCode,resumeSessionCodeSpoil FROM users WHERE username = ?', [data.username], function(error, results, fields){
      checkCredLoginCallback(error, results, fields, data.password, data.keepLoggedIn, data.seq)
    })

  }

  /** The callback function to checkCredLogin handles the returning values from mysql and sends the result back to the client
   * @param {string} error - Any Error that occured, standard in mysql but can be hijacked to force failure
   * @param {*} results
   * @param {*} fields 
   * @param {string} password
   * @param {boolean} keepLoggedIn
   * @param {number} sequence - The original sequence
   */
  checkCredLoginCallback(error, results, fields, password,keepLoggedIn, sequence) {
    
    let returnObj = new Object;
    returnObj.seq = sequence;

    if(error === null && results.length === 1)
    {
      //compare the provided password with out saved hash
      let passwordOk = (bcrypt.compareSync(password,results[0].passwd))

      //create the return object and save the sequence and if the login was in the object
      returnObj.successful = passwordOk;

      //this code should only run if the user is authenticated and the keep logged in flag is off
      if(passwordOk && keepLoggedIn)
      {
        let today = new Date();

        //this code runs if the resume session code is not set or expired
        if(results[0].resumeSessionCode == null || results[0].resumeSessionCodeSpoil < today) {
          
          //generate a new 128 byte token
          let newKey = ""
          for(let i = 0; i < 128; i++)
          {
            newKey = newKey + b62alphabet[Math.floor(Math.random() * 62)]
          }

          //set a new spoil date 16 days in the future
          let spoilDate = new Date();
          spoilDate.setDate(spoilDate.getDate() + 16)

          //update the session code and spoil date in the database
          this.db.query('UPDATE users SET resumeSessionCode = ?,resumeSessionCodeSpoil = ? WHERE userid = UuidToBin(?)', [newKey,spoilDate,results[0].userid])

          //set the token in the return object
          returnObj.token = newKey
        }
        else
        {
          //set a new spoil date 16 days in the future
          let spoilDate = new Date();
          spoilDate.setDate(spoilDate.getDate() + 16)

          //update the spoil date
          this.db.query('UPDATE users SET resumeSessionCodeSpoil = ? WHERE userid = UuidToBin(?)', [spoilDate,results[0].userid])

          //set the token in the return object
          returnObj.token = results[0].resumeSessionCode
        }
      }
      
      //save the uuid in the current session
      this.uuid = results[0].userid

    }
    else {
      if(error !== null)
      {
        console.log("SQL Connection error : " + error)
      }
      returnObj.successful = false;
    }

    //send back the data via the websocket
    this.socket.send(JSON.stringify(returnObj))
  }

  onSQLDie(error) {
    try
    {
      console.log("DB Closed.")

      this.onSocketDie = function(){}

      this.socket.close()
    }
    catch(e)
    {
      console.log(e)
    }
  }

  onSocketDie(error) {
    try
    {
      console.log("WebSocket Closed.")

      this.onSQLDie = function(){}

      this.db.release()
    }
    catch(e)
    {
      console.log(e)
    }
  }

  /** This function will reset all stored variables in the websocket, resetting the session
   * @param {*} data 
   */
  logoff(data) {
    this.uuid = null

    let retObj = new Object();
    retObj.seq = data.seq;
    retObj.successful = true;

    this.socket.send(JSON.stringify(retObj))
  }

  // !SECTION

  // NOTE if adding a variable please also add a line to reset it to default in the logoff function
  uuid = null
  socket = null
  db = null
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