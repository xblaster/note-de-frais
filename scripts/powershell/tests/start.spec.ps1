# Tests for start.ps1
Describe "Start Script" {
    It "Start script should exist" {
        Test-Path "$PSScriptRoot/../start.ps1" | Should -Be $true
    }
}
