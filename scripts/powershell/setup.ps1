# Project Setup Script for Windows

. "$PSScriptRoot/common.ps1"

function Run-Setup {
    Write-Log "Starting Project Setup..." "INFO"

    if (-not (Test-EnvironmentPrerequisites)) {
        Write-Log "Prerequisites failed. Please install missing tools." "ERROR"
        exit 1
    }

    # Check Execution Policy
    $policy = Get-ExecutionPolicy
    if ($policy -eq "Restricted") {
        Write-Log "PowerShell Execution Policy is 'Restricted'. Run 'Set-ExecutionPolicy RemoteSigned -Scope CurrentUser' as Admin." "WARN"
    }

    Write-Log "Installing root dependencies..."
    pnpm install

    Write-Log "Setting up Server..."
    Push-Location server
    pnpm install
    npx prisma generate
    Pop-Location

    Write-Log "Setting up Client..."
    Push-Location client
    pnpm install
    Pop-Location

    Write-Log "Setup completed successfully!" "SUCCESS"
}

Run-Setup
