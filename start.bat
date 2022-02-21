:: Important stuff
@echo off && cls
title Vyond Legacy Online

::::::::::::::::::::
:: Initialization ::
::::::::::::::::::::

:: Terminate existing node.js apps
TASKKILL /IM node.exe /F 2>nul
cls

:::::::::::::::::::::::::::::::
:: Start Vyond Legacy Online ::
:::::::::::::::::::::::::::::::

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
	goto start
)

:: Install Vyond Legacy Online
if exist notinstalled (
echo Vyond Legacy Online Is Not Installed! Installing...
goto start ) else ( goto start )

:: Run npm start
:start
cls
echo Vyond Legacy Online is now starting...
start /MIN open_nodejs.bat
PING -n 6 127.0.0.1>nul
start http://localhost
