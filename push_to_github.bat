@echo off
echo ========================================================
echo Pushing Smart Student Companion to GitHub Repository
echo Repo: https://github.com/aravindkole/Araviii-k.git
echo ========================================================

set GIT_EXE="%USERPROFILE%\bin\mingit\cmd\git.exe"
%GIT_EXE% push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [SUCCESS] Repository pushed to GitHub successfully!
) else (
    echo.
    echo [INFO] If prompted for password, use your GitHub Personal Access Token (PAT):
    echo Create one at: https://github.com/settings/tokens (select 'repo' scope)
)

pause
