@echo off
echo ============== Building Chrome Extension for MediaPlus ====================

rd ..\..\bin\opera /S /Q

md ..\..\bin\opera
echo Copying files from current directory

xcopy . ..\..\bin\opera /E /Q /I /R /K /Y

echo Copying FlashPlus Core files
xcopy ..\..\core\*.* ..\..\bin\opera\core /E /Q /I /R /K /Y 
xcopy ..\..\lib\*.* ..\..\bin\opera\lib /E /Q /I /R /K /Y

del ..\..\bin\opera\build.bat

echo ============== All files for Opera extension copied ====================