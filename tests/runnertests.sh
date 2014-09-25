#!/usr/bin/env bash
echo Starting self tests...

# Set up selenium server
cd bin
java -jar selenium-server-standalone-2.43.0.jar -log selenium.log -Dwebdriver.chrome.driver=../../node_modules/chromedriver/bin/chromedriver &

sleep 5

# Run server

cd ../..
node server.js &

sleep 2
 
./node_modules/.bin/intern-runner config=tests/runner

sleep 2

ps -ef | grep "node server.js" | awk '{print $2}' | xargs kill

sleep 2

# ps -ef | grep "java -jar selenium-server-standalone-2.43.0.jar" | awk '{print $2}' | xargs kill