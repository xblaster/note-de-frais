# Tests for build.ps1
Describe "Build Script" {
    It "Build script should exist" {
        Test-Path "$PSScriptRoot/../build.ps1" | Should -Be $true
    }
}
