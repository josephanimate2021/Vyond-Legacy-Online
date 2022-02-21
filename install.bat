@echo off
for /f "delims=" %%i in ('git --version 2^>nul') do set output=%%i
IF "!output!" EQU "" (
	echo Git could not be found.
        pause
        exit
) else (
        pushd ..\..\
	git clone https://github.com/ykranimate2021-ga/GA2016O3.0.git
        start GA2016O3.0
        echo GoAnimate 2016 Offline Is Installed. Exiting...
        pause
        exit
)
