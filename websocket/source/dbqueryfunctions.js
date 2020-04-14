var mysql = require('mysql')

var connection = mysql.createConnection({
  host     : 'database',
  user     : 'db_user_gl',
  password : 'passwd12',
  database : 'glassline'
});


function checkTokenLogin(params,socket) {
    if(params.length !== 1) {
        checkTokenLoginCallback("ERR",0,0,socket)
        return;
    }
    
    if(params[0].length != 128) {
        checkTokenLoginCallback("ERR",0,0,socket)
        return;
    }

    connection.query('SELECT 1 FROM users WHERE resumeSessionCode = ?', [params[0]], function(error,results,fields) {
        checkTokenLoginCallback(error,results,fields,socket)
    });
}

function checkTokenLoginCallback(error,results,fields,socket) {
    if(error !== null) {
        socket.send("0");
        return;
    }
    
    if(results.length === 1)
    {
        socket.send("1")
        return;
    }
    setTimeout(function(){socket.send("0")},2000);
}

exports.checkTokenLogin = checkTokenLogin;