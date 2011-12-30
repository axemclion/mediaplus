@echo off
echo ============== Building Firefox Extension for MediaPlus ====================

rd ..\..\bin\firefox /S /Q

md ..\..\bin\firefox
echo Copying files from current directory

xcopy . ..\..\bin\firefox /E /I /R /K /Y 

echo Copying FlashPlus Core files
xcopy ..\..\core\*.* ..\..\bin\firefox\data\core /E /Q /I /R /K /Y 
xcopy ..\..\lib\*.* ..\..\bin\firefox\data\lib /E /Q /I /R /K /Y

del ..\..\bin\firefox\build.bat


echo ============== All files for Firefox  extension copied ====================