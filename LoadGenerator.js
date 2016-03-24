var exec = require('child_process').spawn;
var http = require('http');
var currentTest = 0;

var testArray = [];

// Add the tests you want to run here: [# seconds, # vusers, which test to run]
testArray.push([1200,10, 'ViewInteractVizLoadTest']);
testArray.push([1200,20, 'ViewInteractVizLoadTest']);
testArray.push([1200,30, 'ViewInteractVizLoadTest']);
testArray.push([1200,40, 'ViewInteractVizLoadTest']);
testArray.push([1200,50, 'ViewInteractVizLoadTest']);
testArray.push([1200,60, 'ViewInteractVizLoadTest']);
testArray.push([1200,70, 'ViewInteractVizLoadTest']);
testArray.push([1200,80, 'ViewInteractVizLoadTest']);
testArray.push([1200,90, 'ViewInteractVizLoadTest']);
testArray.push([1200,100, 'ViewInteractVizLoadTest']);
testArray.push([1200,110, 'ViewInteractVizLoadTest']); 
testArray.push([1200,120, 'ViewInteractVizLoadTest']); 
//testArray.push([600,130, 'ViewInteractVizLoadTest']); 
//testArray.push([600,140, 'ViewInteractVizLoadTest']); 
//testArray.push([600,150, 'ViewInteractVizLoadTest']); 
//testArray.push([600,160, 'ViewInteractVizLoadTest']);
//testArray.push([600,170, 'ViewInteractVizLoadTest']);
//testArray.push([600,180, 'ViewInteractVizLoadTest']);
//testArray.push([600,190, 'ViewInteractVizLoadTest']);
//testArray.push([600,200, 'ViewInteractVizLoadTest']);
//testArray.push([600,210, 'ViewInteractVizLoadTest']); 
//testArray.push([600,220, 'ViewInteractVizLoadTest']); 
//testArray.push([600,230, 'ViewInteractVizLoadTest']); 
//testArray.push([600,240, 'ViewInteractVizLoadTest']); 
/*testArray.push([600,250, 'ViewInteractVizLoadTest']); 
testArray.push([600,260, 'ViewInteractVizLoadTest']);
testArray.push([600,270, 'ViewInteractVizLoadTest']);
testArray.push([600,280, 'ViewInteractVizLoadTest']);
testArray.push([600,290, 'ViewInteractVizLoadTest']);
testArray.push([600,300, 'ViewInteractVizLoadTest']);
testArray.push([600,310, 'ViewInteractVizLoadTest']); 
testArray.push([600,320, 'ViewInteractVizLoadTest']); 
testArray.push([600,330, 'ViewInteractVizLoadTest']); 
testArray.push([600,340, 'ViewInteractVizLoadTest']); 
testArray.push([600,350, 'ViewInteractVizLoadTest']); 
testArray.push([600,360, 'ViewInteractVizLoadTest']);
testArray.push([600,370, 'ViewInteractVizLoadTest']);
testArray.push([600,380, 'ViewInteractVizLoadTest']);
testArray.push([600,390, 'ViewInteractVizLoadTest']);
testArray.push([600,400, 'ViewInteractVizLoadTest']);
testArray.push([600,410, 'ViewInteractVizLoadTest']); 
testArray.push([600,420, 'ViewInteractVizLoadTest']); 
testArray.push([600,430, 'ViewInteractVizLoadTest']); 
testArray.push([600,440, 'ViewInteractVizLoadTest']); 
testArray.push([600,450, 'ViewInteractVizLoadTest']); 
testArray.push([600,460, 'ViewInteractVizLoadTest']);
testArray.push([600,470, 'ViewInteractVizLoadTest']);
testArray.push([600,480, 'ViewInteractVizLoadTest']);
testArray.push([600,490, 'ViewInteractVizLoadTest']);
testArray.push([600,500, 'ViewInteractVizLoadTest']);  */

var testSize = testArray.length;
console.log(testSize);





// Execute test

var executeTest = function  ( testParameters, callback) {

    try {
        argArray = [];

        
        
    // For TabJolt v9 internal -- this has been modified for release version
   /*  argArray.push('-jar');
        argArray.push('c://tabjolt//bin//perfrunharness.jar');
        argArray.push('--t=\\testplans\\' + testParameters[2] + '.jmx');
        argArray.push('--d=' + testParameters[0] );
        argArray.push('--c='+ testParameters[1]);
        // Name of the test so I can refer to it later
        argArray.push('--r=2x4-Simple');*/
        
    //   For TabJolt v9 Public   
      argArray.push('-cp');
        argArray.push('c:\\tabjolt\\bin\\perfRunHarness\\*');
        argArray.push('com.tableausoftware.test.tools.perfRunHarness.Main');
        argArray.push('--rootPath=c:\\tabjolt');
        argArray.push('--t=\\testplans\\' + testParameters[2] + '.jmx');
        argArray.push('--d=' + testParameters[0] );
        argArray.push('--c='+ testParameters[1]);
        // Name of the test so I can refer to it later        
        argArray.push('--r=' + testParameters[2] + 'Some sort of Description Goes Here');
        argArray.push('--e=HereIsWhereICanDescribeMyEnviornment');
       
        

        console.log('===== Executing Load Test');
        console.log(argArray);
        spawn = exec('java.exe', argArray);

    } catch (e) {
        console.log('error spawning!');
        console.log(e);
        console.log(e.message);
    }

    spawn.stdout.on('data', function (data) {
        console.log(data.toString());
       
    });

/*    spawn.stderr.on('data', function (data) {
        console.log('sterr failoverprimary: ' + data.toString());
        callback(1);
    });*/

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
	//ip or hostname of the Tableau Server
      host: '111.111.111.111',
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
            
