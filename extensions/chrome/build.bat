@echo off
echo ============== Building Chrome Extension for MediaPlus ====================

rd ..\..\bin\chrome /S /Q

md ..\..\bin\chrome
echo Copying files from current directory

copy *.* ..\..\bin\chrome

echo Copying FlashPlus Core files
xcopy ..\..\core\*.* ..\..\bin\chrome\core /E /Q /I /R /K /Y 
xcopy ..\..\lib\*.* ..\..\bin\chrome\lib /E /Q /I /R /K /Y

del ..\..\bin\chrome\build.bat

echo ============== All files for Chrome extension copied ====================