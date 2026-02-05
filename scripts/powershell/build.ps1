# Build project for production

. "$PSScriptRoot/common.ps1"

function Run-Build {
    Write-Log "Starting production build..." "INFO"

    if (-not (Test-EnvironmentPrerequisites)) {
        exit 1
    }

    Write-Log "Building Server..."
    Push-Location server
    pnpm build
    if ($LASTEXITCODE -ne 0) { 
        Write-Log "Server build failed." "ERROR"
        Pop-Location
        exit 1 
    }
    Pop-Location

    Write-Log "Building Client..."
    Push-Location client
    pnpm build
    if ($LASTEXITCODE -ne 0) { 
        Write-Log "Client build failed." "ERROR"
        Pop-Location
        exit 1 
    }
    Pop-Location

    Write-Log "Build completed successfully!" "SUCCESS"
}

Run-Build
