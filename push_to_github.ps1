# Smart Student Companion - Push to GitHub Script
$git = "$env:USERPROFILE\bin\mingit\cmd\git.exe"

Write-Host "Connecting to https://github.com/aravindkole/Araviii-k.git..." -ForegroundColor Cyan
& $git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✓ Successfully pushed repository to GitHub!" -ForegroundColor Green
} else {
    Write-Host "`n[Note] If you need to authenticate with a GitHub Token, run:" -ForegroundColor Yellow
    Write-Host '& "$env:USERPROFILE\bin\mingit\cmd\git.exe" remote set-url origin https://<YOUR_GITHUB_TOKEN>@github.com/aravindkole/Araviii-k.git'
    Write-Host '& "$env:USERPROFILE\bin\mingit\cmd\git.exe" push -u origin main'
}
