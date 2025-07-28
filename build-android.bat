@echo off
echo Building Professional Resume Builder Android App...
echo.

echo Step 1: Building web assets...
call npm run build
if %errorlevel% neq 0 (
    echo Error: Failed to build web assets
    pause
    exit /b %errorlevel%
)

echo.
echo Step 2: Syncing with Capacitor...
call npx cap sync android
if %errorlevel% neq 0 (
    echo Error: Failed to sync with Capacitor
    pause
    exit /b %errorlevel%
)

echo.
echo Step 3: Building Android APK...
cd android
call gradlew assembleDebug
if %errorlevel% neq 0 (
    echo Error: Failed to build Android APK
    cd ..
    pause
    exit /b %errorlevel%
)

cd ..
echo.
echo ✅ Android build completed successfully!
echo APK location: android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo To install on device: adb install android\app\build\outputs\apk\debug\app-debug.apk
echo.
pause