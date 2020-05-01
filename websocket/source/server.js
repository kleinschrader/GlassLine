const WebSocket = require('ws');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const uuid = require('uuid');
const uuidv4 =  require('uuid/v4');

let bcryptRounds = 10;

let b62alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

let globalConfig = {
  hasBeenSetup : false,
  setupToken : null
}

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
    this.getTenantsCallback = this.getTenantsCallback.bind(this)
    this.getTenantServerCallback = this.getTenantServerCallback.bind(this)
    this.genericSuccessfulReturn = this.genericSuccessfulReturn.bind(this)
    this.getAllServersCallback = this.getAllServersCallback.bind(this)
    this.getSetupRequiredCallback = this.getSetupRequiredCallback.bind(this)
    this.createTenantCallback = this.createTenantCallback.bind(this)
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
        case 'getSetupRequired':
          this.getSetupRequired(dataObject)
          break
        case 'checkSetupToken':
          this.checkSetupToken(dataObject)
          break
        case 'checkTokenLogin':
          this.checkTokenLogin(dataObject)
          break
        case 'checkCredLogin':
          this.checkCredLogin(dataObject)
          break
        case 'logoff':
          this.logoff(dataObject)
          break
        case 'getTenants':
          this.getTenants(dataObject)
        case 'getTenantServer':
          this.getTenantServer(dataObject)
          break
        case 'createServer':
          this.createServer(dataObject)
          break
        case 'checkAdminTenant':
          this.checkAdminTenant(dataObject)
          break
        case 'getAllServers':
          this.getAllServers(dataObject)
          break
        case 'createTenant':
          this.createTenant(dataObject)
          break
        case 'createUser':
          this.createUser(dataObject)
          break
        case 'finishSetup':
          this.finishSetup(dataObject)
          break
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

  getSetupRequired(data) {

    if(globalConfig.hasBeenSetup) {
      let responseObj = {}
      responseObj.seq = data.seq

      responseObj.setupRequired = false

      this.socket.send(JSON.stringify(responseObj))
    }
    else {
      let getSetupRequiredCallback = this.getSetupRequiredCallback

      this.db.query('SELECT setUpComplete,UuidFromBin(setupToken) AS setupToken from settings',function(error, results, fields){getSetupRequiredCallback(error, results, fields, data.seq)})
    }
  }

  getSetupRequiredCallback(error, results, fields, sequence) {
    let responseObj = {}
    responseObj.seq = sequence

    if(error === null)
    {
      responseObj.setupRequired = !results[0].setUpComplete

      globalConfig.hasBeenSetup = results[0].setUpComplete

      globalConfig.setupToken = results[0].setupToken

      console.log('The setuptoken for your glassline instance: ' + results[0].setupToken)
    }
    else
    {
      console.trace(error)
    }
    this.socket.send(JSON.stringify(responseObj))
  }

  checkSetupToken(data) {
    let responseObj = {}
    responseObj.seq = data.seq

    if(data.token === globalConfig.setupToken && globalConfig.setupToken !== null) {
      responseObj.successful = true
      this.setupPermitted = true
    }
    else {
      responseObj.successful = false
    }

    this.socket.send(JSON.stringify(responseObj))
  }

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
      this.db.query('SELECT UuidFromBin(userid) AS userid, resumeSessionCodeSpoil, UuidFromBin(tenant) AS tenant, tenants.globalAdmin AS adminTenant FROM users LEFT JOIN tenants ON users.tenant = tenants.tenantid WHERE resumeSessionCode = ?', [data.token], function(error, results, fields) {setTimeout(checkTokenLoginCallback,200,error, results, fields,data.seq)})

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
    this.tenant = results[0].tenant
    this.adminTenant = results[0].adminTenant

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
    this.db.query('SELECT UuidFromBin(userid) AS userid,passwd,resumeSessionCode,resumeSessionCodeSpoil,UuidFromBin(tenant) AS tenant, tenants.globalAdmin AS adminTenant FROM users LEFT JOIN tenants ON users.tenant = tenants.tenantid WHERE username = ?', [data.username], function(error, results, fields){
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
      this.tenant = results[0].tenant
      this.adminTenant = results[0].adminTenant

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

  /** This function will query all tenants from the db aslong as the tenant of the user is an admin
  * @param {Object} data - The Object containing the data
  */
  getTenants(data) {
    //disallow non authenticated users to run this command
    if(this.uuid === null) {
      this.getTenantsCallback("NONAUTH","","",data.seq)
      return
    }

    //dissallow non admin tenants to run this command
    if(!this.adminTenant) {
      this.getTenantsCallback("NONAUTH","","",data.seq)
      return
    }

    //set a temporary reference to getTenantsCallback as 'this' is not avalibe in an anonymos function
    let getTenantsCallback = this.getTenantsCallback

    // select all tenants from the database
    this.db.query("SELECT UuidFromBin(tenantid) AS tenantid, tenantname FROM tenants", function(error, results, fields) {getTenantsCallback(error, results, fields, data.seq)})
  }

  /** The callback function to checkCredLogin handles the returning values from mysql and sends the result back to the client
   * @param {string} error - Any Error that occured, standard in mysql but can be hijacked to force failure
   * @param {*} results
   * @param {*} fields 
   * @param {number} sequence - The original sequence
   */
  getTenantsCallback(error, results, fields, sequence) {
    let returnObj = new Object;
    returnObj.seq = sequence;
    
    if(error === null)
    {
      returnObj.tenants = []
      for(let i = 0; i < results.length; i++)
      {
        returnObj.tenants[i] = new Object;
        returnObj.tenants[i].id = results[i].tenantid
        returnObj.tenants[i].name = results[i].tenantname
      }
    }
    else
    {
      returnObj.tenants = false
    }

    this.socket.send(JSON.stringify(returnObj))
  }

  getTenantServer(data) {
    if(this.uuid === null) {
      this.getTenantServerCallback("NONAUTH","","",data.seq)
      return
    }

    if(!this.adminTenant) {
      this.getTenantServerCallback("NONAUTH","","",data.seq)
      return
    }

    let getTenantServerCallback = this.getTenantServerCallback

    this.db.query("SELECT UuidFromBin(serverid) AS serverid, servername FROM servers WHERE tenant = (UuidToBin(?))", [data.tenant],function(error, results, fields) {getTenantServerCallback(error, results, fields,data.seq)})
  }

  getTenantServerCallback(error, results, fields, sequence) {
    let returnObj = new Object;
    returnObj.seq = sequence;
    
    if(error === null)
    {
      returnObj.server = []


      for(let i = 0; i < results.length; i++) {
        returnObj.server[i] = {}
        returnObj.server[i].id = results[i].serverid
        returnObj.server[i].name = results[i].servername
      }
    }
    else
    {
      console.trace(error)
      returnObj.server = false;
    }

    this.socket.send(JSON.stringify(returnObj))
  }

  createServer(data) {
    if(this.uuid === null) {
      this.getTenantServerCallback("NONAUTH","","",data.seq)
      return
    }

    let tenantToSet = this.adminTenant ? data.tenant : this.tenant

    let accessToken = ""

    for(let i = 0; i < 64; i++) {
      accessToken += b62alphabet[Math.floor(Math.random() * b62alphabet.length)]
    }

    let genericSuccessfulReturn = this.genericSuccessfulReturn
    this.db.query("INSERT INTO servers(serverid,servername,accessToken,childOf,tenant) VALUES (UuidToBin(UUID()), ?, ?, (UuidToBin(?)),(UuidToBin(?)))",[data.servername,accessToken,data.parent,tenantToSet], function(error, results, fields) {genericSuccessfulReturn(error, results, fields, data.seq)})

  }

  checkAdminTenant(data) {

    let responseObj = {};
    responseObj.seq = data.seq


    if(this.uuid === null) {
      responseObj.adminTenant = false
    }
    else {
      responseObj.adminTenant = this.adminTenant
    }

    this.socket.send(JSON.stringify(responseObj))
  }

  getAllServers(data) {
    if(this.uuid === null || !this.adminTenant) {
      this.genericSuccessfulReturn("NONAUTH","","",data.seq)
      return
    }

    let getAllServersCallback = this.getAllServersCallback 

    this.db.query('SELECT servername, UuidFromBin(serverid) AS serverid, tenants.tenantname  FROM servers LEFT JOIN tenants ON tenants.tenantid = servers.tenant;',function (error, results, fields){getAllServersCallback(error, results, fields,data.seq)})
  }

  createTenant(data) {
    if(!this.setupPermitted) {
      if(!this.adminTenant) {
        this.genericSuccessfulReturn("NONAUTH",null,null,data.seq)
        return
      }
    }

    let tenantUuid = uuidv4();
    let createTenantCallback = this.createTenantCallback
    this.db.query("INSERT INTO tenants(tenantid,tenantname,globalAdmin,forceMFA) VALUES (UuidToBin(?), ?, ? ,?)",[tenantUuid,data.tenantname,data.globalAdmin,data.useMFA], function(error,results, fields) {
      createTenantCallback(error,results, fields,tenantUuid , data.seq)
    })
  }

  createTenantCallback(error,results, fields, tenantUuid, sequence) {
    let returnObj = new Object;
    returnObj.seq = sequence;
    
    if(error !== null) {
      console.trace(error)
      returnObj.successful = false
    }
    else {
      returnObj.successful = true
      returnObj.uuid = tenantUuid
    }

    this.socket.send(JSON.stringify(returnObj))
  }

  createUser(data) {
    if(!this.setupPermitted) {
      if(!this.admin) {
        this.genericSuccessfulReturn("NONAUTH",null,null,data.seq)
        return
      }
    }

    let passwdHash = bcrypt.hashSync(data.password, bcryptRounds);

    let socket = this.socket

    this.db.query("INSERT INTO users(userid,username,passwd,tenantAdmin,tenant) VALUES(UuidToBin(UUID()),?,?,?,UuidToBin(?))",[data.username,passwdHash,data.tenantAdmin,data.tenant], function(error,results, fields){
      let returnObj = new Object
      returnObj.seq = data.seq
      
      if(error !== null) {
        console.trace(error)
        returnObj.successful = false
      }
      else {
        returnObj.successful = true
      }

      socket.send(JSON.stringify(returnObj))
    })
  }

  finishSetup(data) {
    globalConfig.hasBeenSetup = true
    this.db.query("UPDATE settings SET setUpComplete = false")
  }

  getAllServersCallback(error, results, fields, sequence) {
    let returnObj = new Object;
    returnObj.seq = sequence;
    
    if(error === null) {
      returnObj.server = []

      for(let i = 0; i < results.length; i++) {
        returnObj.server[i] = {}

        returnObj.server[i].servername = results[i].servername
        returnObj.server[i].serverid = results[i].serverid
        returnObj.server[i].tenantname = results[i].tenantname
      }
    }
    else {
      console.trace(error)
      returnObj.server = false;
    }

    this.socket.send(JSON.stringify(returnObj))
  }

  genericSuccessfulReturn(error, results, fields, sequence) {
    let returnObj = new Object;
    returnObj.seq = sequence;

    if(error === null) {
      returnObj.successful = true;
    }
    else {
      console.trace("SQL OR GEN ERROR " + error)
      returnObj.successful = false;
    }

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
  tenant = null
  adminTenant = false
  setupPermitted = false
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