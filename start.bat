:: Important stuff
@echo off && cls
title Vyond Legacy Offline

::::::::::::::::::::
:: Initialization ::
::::::::::::::::::::

:: Terminate existing node.js apps
TASKKILL /IM node.exe /F 2>nul
cls

::::::::::::::::::::::::::::::::
:: Start Vyond Legacy Offline ::
::::::::::::::::::::::::::::::::

:: Check for installation
echo Checking For Node.js Instalation...
for /f "delims=" %%i in ('npm -v 2^>nul') do set output=%%i
IF "!output!" EQU "" (
	echo Node.js could not be found. please try again later
	pause
	exit
) else (
        echo Node.js has been detected. Processing Bootup...
	PING -n 6 127.0.0.1>nul
	if exist node_modules (
	goto start
	) else ( goto install )
)

:: Install Vyond Legacy Offline
:install
if not exist node_modules (
echo Vyond Legacy Offline Is Not Installed! Installing...
npm install
goto start ) else ( goto start )

:: Run npm start
:start
cls
echo Vyond Legacy Offline is now starting...
start /MIN open_nodejs.bat
PING -n 6 127.0.0.1>nul
if not exist chromium.exe ( start http://localhost ) else ( start chromium.exe http://localhost )
