# Tests for test.ps1
Describe "Test Script" {
    It "Test script should exist" {
        Test-Path "$PSScriptRoot/../test.ps1" | Should -Be $true
    }
}
