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
for /f "delims=" %%i in ('npm -v 2^>nul') do set output=%%i
IF "!output!" EQU "" (
	echo Node.js could not be found. please try again later
	pause
	exit
) else (
	goto start
)

:: Run npm start
:start
echo Vyond Legacy Online is now starting...
start /MIN open_nodejs.bat
PING -n 6 127.0.0.1>nul
start http://localhost
