const WebSocket = require('ws');
const db_functions = require('./dbqueryfunctions.js')


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
    }

    handleConnection(data) {
      try
      {
        //to keep the connection alive empty packets are send, we dont need to do anything
        if(data === null)
        {
          return;
        }

        let commandData = this.splitCommand(data);

        switch(commandData.command) {
            case 'CHECKTOKENLOGIN':
                db_functions.checkTokenLogin(commandData.params,this.socket)
                break;
            
            default:
                this.socket.send("Unknown command.")
                break;
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

    splitCommand(rawCommand) {
        //creats an object to return
        let retOBJ = new Object()

        //extracts the text before '&' aka the command
        let matchCommandResult = rawCommand.match(/^([A-Z]+)/gm)
        let matchRawParamResult = rawCommand.match(/&.+$/gm)[0]

        retOBJ.command = matchCommandResult[0]

        
        
        //only get parameters if there are actually any...
        if(matchRawParamResult)
        {
          //extracts each parameter with filtering for '&&'
          let matchParamResult = matchRawParamResult.match(/(\&.+?[^&])(?!&&)(?=&|$)/gm)
          
          //remove the & and replace '&&' with '&'
          for(let i = 0; i < matchParamResult.length; i++)
          {
              matchParamResult[i] = matchParamResult[i].substr(1).replace('&&','&')

          }

          //pass the param array to the function and return it
          retOBJ.params = matchParamResult;
        }
        else
        {
          //create an array so we can check how manay paraeters there are even if there are none
          retOBJ.params = [];
        }
        return retOBJ;
    }

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