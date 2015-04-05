var exec = require('child_process').spawn;
var http = require('http');
var currentTest = 0;

var testArray = [];

// Number of seconds, number of users for each test. 
testArray.push([600,10, 'InteractVizLoadTest' ]);
testArray.push([600,20, 'InteractVizLoadTest']);
testArray.push([600,30, 'InteractVizLoadTest']);
testArray.push([600,40, 'InteractVizLoadTest']);
testArray.push([600,50, 'InteractVizLoadTest']);
testArray.push([600,70, 'InteractVizLoadTest']);
testArray.push([600,100, 'InteractVizLoadTest']);
testArray.push([600,100, 'ViewVizLoadTest']);


var testSize = testArray.length;
console.log(testSize);




// Execute test

var executeTest = function  ( testParameters, callback) {

    try {
        argArray = [];
        argArray.push('-jar');
        argArray.push('c://tabjolt//bin//perfrunharness.jar');
        // Change the test plan below if you want
        argArray.push('--t=\\testplans\\' + testParameters[2] + '.jmx');
        argArray.push('--d=' + testParameters[0] );
        argArray.push('--c='+ testParameters[1]);


        console.log('===== Executing Load Test');
        spawn = exec('java.exe', argArray);
    } catch (e) {
        console.log(e);
    }

    spawn.stdout.on('data', function (data) {
        console.log(data.toString());
       
    });

    spawn.stderr.on('data', function (data) {
        console.log('sterr failoverprimary: ' + data.toString());
        callback(1);
    });

    spawn.on('close', function (code) {
        callback(0);
    });
}

// Listen for "I'm Done" request from Tableau Server's Node service after Tabadmin is complete.

var server = http.createServer(function(req, res) {
    res.writeHead(200);
    res.end('Signal received by Load Generator');        
    
    executeTest (testArray[currentTest], function (result){
        console.log("error", result);
        
        if (result != 0) {
           console.log ("Attempt to restart failed");
           process.exit(1);
        }
        // increment for next test
        currentTest++
        if (currentTest >= testSize)
        {
            console.log ("Test Complete, exiting");
            process.exit(0);
        }
        console.log("Test", currentTest, "of", testSize, "complete");
        console.log("Test", currentTest, "of", testSize, "complete");
        console.log('SUCCESS. Requesting remote TabAdmin restart\n');
        httpRequest();
      });

 });


var httpRequest = function () {
    var options = {
      // IP or hostname of Tableau Server Primary
      host: 'xxx.xxx.xxx.xxx',
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

server.listen(7999);
            
