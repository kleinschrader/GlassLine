const WebSocket = require('ws');
const mysql = require('mysql')

var db = mysql.createConnection({
  host     : 'database',
  user     : 'db_user_gl',
  password : 'passwd12',
  database : 'glassline'
});


class wsConnection {
    constructor(WebSocket)
    {
        this.bindFunctions()

        this.socket = WebSocket

        this.socket.on('message',this.handleConnection)
    }

    bindFunctions()
    {
      this.handleConnection = this.handleConnection.bind(this)
      this.checkTokenLoginCallback = this.checkTokenLoginCallback.bind(this)
    }

    handleConnection(data) {
      try
      {
        //to keep the connection alive empty packets are send, we dont need to do anything
        if(data === "")
        {
          return;
        }

        let dataObject = JSON.parse(data);

        switch(dataObject.cmd) {
          case 'checkTokenLogin':
            this.checkTokenLogin(dataObject);
          case 'checkCredLogin':
            this.checkCredLogin(dataObject);
        }
      }
      catch(e)
      {
        console.log(this.socket._socket.remoteAddress + " : issued a malformed or malitious command")
        console.log(e)

        this.socket.send("Malformed input or Server error. Disconnecting...")
        this.socket.close(1011)

        console.log("")
      }
    }
    // SECTION MainCommands

    checkTokenLogin(data) {
      if(data.token === null) {
        this.checkTokenLoginCallback("INVALTOKEN",null,null,data.seq)
        return;
      }

      let tmpCBVal = this.checkTokenLoginCallback

      if(data.token.length === 128) {
        db.query('SELECT 1 FROM users WHERE resumeSessionCode = ?', [data.token], function(error, results, fields) {setTimeout(tmpCBVal,500,error, results, fields,data.seq)})
        return;
      }

      this.checkTokenLoginCallback("INVALTOKEN",null,null,data.seq)
      return;
    }

    checkTokenLoginCallback(error, results, fields, sequence) {
      let returnObj = new Object();
      returnObj.seq = sequence;
      
      if(error !== null) {
        returnObj.successful = false;
        this.socket.send(JSON.stringify(returnObj))
      }

      if(results.length !== 1) {
        returnObj.successful = false;
        this.socket.send(JSON.stringify(returnObj))
      }
    }

    checkCredLogin(data) {
      if(data.username === null || data.password === null || keepLoggedIn === null)
      {
        this.checkCredLoginCallback("INVALDATA",null,null,data.seq)
        return;
      }

      let tmpCBVal = this.checkCredLoginCallback

      // TODO : Implement Password Validation
    }

    checkCredLoginCallback(error, results, fields, sequence) {

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