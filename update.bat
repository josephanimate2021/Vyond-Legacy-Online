@echo off
if not exist .git ( goto nogit ) else ( goto yesgit )
:nogit
echo Sorry, git cannot be found. please use the batch file in this lvm project to clone this repo and try again.
pause & exit
:yesgit
echo Updating Vyond Legacy Offline...
git pull || cls & echo Update Failled! Please try again later! & pause & exit
cls
echo Update Sucessfull!
pause
