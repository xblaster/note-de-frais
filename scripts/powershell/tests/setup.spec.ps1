# Tests for setup.ps1
Describe "Setup Script" {
    It "Setup script should exist" {
        Test-Path "$PSScriptRoot/../setup.ps1" | Should -Be $true
    }
}
