#Automate TabJolt

Automates TabJolt.

-TableauServer.js: Listens for "test complete" signals on 7999 from Load Generator and fires tabadmin restart to reset before next test.

-LoadGenerator.js: Runs tests and pings Tableau Server to tell it to restart before running the next test. You must run this script from inside the TABJOLT folder. For example, if tabjolt is installed to c:\tabjolt, and these scripts sit in c:\loadgen, you must CD to \tabjolt and run: node c:\loadgen\LoadGenerator.js