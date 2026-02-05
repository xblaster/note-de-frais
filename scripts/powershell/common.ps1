# Shared utilities for project automation

function Write-Log {
    param(
        [Parameter(Mandatory=$true)]
        [String]$Message,
        [Parameter(Mandatory=$false)]
        [ValidateSet("INFO", "WARN", "ERROR", "SUCCESS")]
        [String]$Level = "INFO"
    )

    $colors = @{
        "INFO"    = "Cyan"
        "WARN"    = "Yellow"
        "ERROR"   = "Red"
        "SUCCESS" = "Green"
    }

    $timestamp = Get-Date -Format "HH:mm:ss"
    Write-Host "[$timestamp] [$Level] $Message" -ForegroundColor $colors[$Level]
}

function Test-EnvironmentPrerequisites {
    Write-Log "Checking environment prerequisites..."
    
    $requiredTools = @("node", "pnpm", "git")
    $missingTools = @()

    foreach ($tool in $requiredTools) {
        if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) {
            $missingTools += $tool
        }
    }

    if ($missingTools.Count -gt 0) {
        Write-Log "Missing required tools: $($missingTools -join ', ')" "ERROR"
        return $false
    }

    Write-Log "Environment validation successful." "SUCCESS"
    return $true
}

# Export functions
Export-ModuleMember -Function Write-Log, Test-EnvironmentPrerequisites
