@echo off

cmd /k "mongod" -new_console:t:mongod
timeout 5
cmd /k "node setup.js %1" -new_console:t:setup
echo. & echo Setup ran