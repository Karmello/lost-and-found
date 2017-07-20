@echo off

if "%1" == "app" (

	cmd /k "mongod" -new_console:t:mongod
	timeout 5
	cmd /k "nodemon ./js/server/server.js --watch ./js/server" -new_console:t:nodemon
	cmd /k "gulp compile" -new_console:t:compile
	echo. & echo App started
)

if "%1" == "setup" (

	cmd /k "node js/setup/run.js %2 %3"
	echo. & echo Done
)

if "%1" == "test" (

	if "%2" == "-unit" (
		cmd /k "karma start karma.conf.js" -new_console:t:unit
		echo. & echo Unit tests started
	)

	if "%2" == "-e2e" (
		cmd /k "mongod" -new_console:t:mongod
		cmd /k "ls" -new_console:d:"%cd%\tests\end-to-end"
		echo. & echo End to end tests started
	)

	if "%2" == "-db" (
		cmd /k "mongod" -new_console:t:mongod
		cmd /k "ls" -new_console:d:"%cd%\tests\db"
		echo. & echo Db tests started
	)
)

if "%1" == "zip" (

	cmd /k "7z a -tzip laf.zip"
)