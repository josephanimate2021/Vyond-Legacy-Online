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
if exist notinstalled (
	echo Vyond Legacy Online is not installed! Installing...
	call npm install
	ren "notinstalled" "installed"
	cls
	goto start
) else (
	goto start
)

:: Run npm start
:start
echo Vyond Legacy Online is now starting...
start /MIN open_nodejs.bat
PING -n 16 127.0.0.1>nul
start http://localhost
