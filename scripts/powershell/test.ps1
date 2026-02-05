# Run tests for Client and Server

. "$PSScriptRoot/common.ps1"

function Run-Tests {
    Write-Log "Starting test execution..." "INFO"

    if (-not (Test-EnvironmentPrerequisites)) {
        exit 1
    }

    $failed = $false

    Write-Log "Running Server Tests (Jest)..."
    Push-Location server
    pnpm test
    if ($LASTEXITCODE -ne 0) { $failed = $true }
    Pop-Location

    Write-Log "Running Client Tests (Vitest)..."
    Push-Location client
    pnpm test run
    if ($LASTEXITCODE -ne 0) { $failed = $true }
    Pop-Location

    if ($failed) {
        Write-Log "Some tests failed." "ERROR"
        exit 1
    } else {
        Write-Log "All tests passed successfully!" "SUCCESS"
    }
}

Run-Tests
