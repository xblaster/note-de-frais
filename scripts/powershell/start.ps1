# Start development environment for Client and Server

param(
    [Switch]$ClientOnly,
    [Switch]$ServerOnly,
    [Int]$Port = 3000
)

. "$PSScriptRoot/common.ps1"

function Start-Development {
    Write-Log "Starting development environment..." "INFO"

    if ($ClientOnly -and $ServerOnly) {
        Write-Log "Cannot use both -ClientOnly and -ServerOnly. Choose one or none." "ERROR"
        exit 1
    }

    $jobs = @()

    if (-not $ServerOnly) {
        Write-Log "Launching Client (Vite)..."
        $clientJob = Start-Process pnpm -ArgumentList "run", "dev" -WorkingDirectory "$PSScriptRoot/../client" -NoNewWindow -PassThru
        $jobs += $clientJob
    }

    if (-not $ClientOnly) {
        Write-Log "Launching Server (NestJS) on port $Port..."
        $env:PORT = $Port
        $serverJob = Start-Process pnpm -ArgumentList "run", "start:dev" -WorkingDirectory "$PSScriptRoot/../server" -NoNewWindow -PassThru
        $jobs += $serverJob
    }

    Write-Log "Services launched. Press Ctrl+C to stop." "SUCCESS"
    
    try {
        # Keep the script running
        while ($true) { Start-Sleep -Seconds 1 }
    }
    finally {
        Write-Log "Stopping services..." "INFO"
        foreach ($job in $jobs) {
            Stop-Process -Id $job.Id -Force -ErrorAction SilentlyContinue
        }
    }
}

Start-Development
