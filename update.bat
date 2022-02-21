@echo off
if not exist .git ( goto nogit ) else ( goto yesgit )
:nogit
echo Sorry, git cannot be found. please use the batch file in this lvm project to clone this repo and try again.
:yesgit
echo Updating Vyond Legacy Online...
git pull
