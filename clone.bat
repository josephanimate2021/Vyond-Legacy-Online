echo Cloning Vyond Legacy Offline......
cd ..\..\
if exist Vyond-Legacy-Online-offline ( del Vyond-Legacy-Online-offline )
git clone --single-branch --branch-offline https://github.com/josephanimate2021/Vyond-Legacy-Online.git
cd Vyond-Legacy-Online
if exist clone.bat del clone.bat
cls
echo Vyond Legacy Offline has been installed!
pause
