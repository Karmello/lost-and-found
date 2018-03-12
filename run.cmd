@echo off

if "%1" == "app" (

	cmd /k "mongod" -new_console:t:mongod
	timeout 5
	cmd /k "nodemon ./server/server.js --watch ./server" -new_console:t:nodemon
	cmd /k "gulp compile" -new_console:t:compile
	echo. & echo App started
)

if "%1" == "setup" (

	cmd /k "node mockup/setup/run.js %2 %3"
	echo. & echo Done
)

if "%1" == "test" (

	if "%2" == "-unit" (
		cmd /k "karma start karma.conf.js" -new_console:t:unit
		echo. & echo Unit tests started
	)

	if "%2" == "-model" (
		cmd /k "mongod" -new_console:t:mongod
		cmd /k "cd tests/model" -new_console:t:mocha
		echo. & echo Db tests started
	)
)

if "%1" == "zip" (

	cmd /k "7z a -tzip laf.zip"
)