#!/usr/bin/env bash
echo Starting self tests...

cd ..
# Run client tests
./node_modules/.bin/intern-client config=tests/intern

sleep 2

# Set up selenium server
cd tests/bin
java -jar selenium-server-standalone-2.43.0.jar -Dwebdriver.chrome.driver=../../node_modules/chromedriver/bin/chromedriver &

sleep 2

# Run server
cd ../..
node server.js &

sleep 2
 
./node_modules/.bin/intern-runner config=tests/intern
