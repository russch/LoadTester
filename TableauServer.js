var exec = require('child_process').spawn;
var http = require('http');

//Listen for ping from Test Driving Machine for a Tabadmin restart 

var server = http.createServer(function(req, res) {
// ================= Monitoring code
           res.writeHead(200);
           res.end('Tableau Primary: I heard you!'); 
            restartTableau(function (result) {
                   
                 // Executing failoverprimary failed
                    if (result != 0) {
                       console.log ("Attempt to restart failed");
                       process.exit(1);
                    }
                    console.log('SUCCESS. Pinging Load Generator\n');
                    httpRequest();
                   
            });
});

// Execute tabadmin restart 
restartTableau = function (callback) {

    try {
        argArray = [];
        argArray.push('restart');


        console.log('===== Executing Tabadmin restart');
        spawn = exec('tabadmin.exe', argArray);
    } catch (e) {
        console.log(e);
    }

    spawn.stdout.on('data', function (data) {
        console.log('stout: ' + data);
       // callback(0);
    });


    spawn.stderr.on('data', function (data) {
        console.log('sterr failoverprimary: ' + data);
        callback(1);
    });

    spawn.on('close', function (code) {
        callback(0);
    });
}

// Helper to call back to Testing machine to let it know to carry on. 
var httpRequest = function () {
    var options = {
      host: '192.168.203.29',
      path: '/foo',
      port: 7999    
    };

    callback = function(response) {
      var str = '';

      //another chunk of data has been recieved, so append it to `str`
      response.on('data', function (chunk) {
        str += chunk;
      });

      //the whole response has been recieved, so we just print it out here
      response.on('end', function () {
        console.log(str);
      });
    }
    
    http.request(options, callback).end();
}


//Start Listening
server.listen(7999);

//Ping Testing machine to let it know to get started. 
httpRequest();

