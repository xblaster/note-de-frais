# Tests for common utilities
BeforeAll {
    . $PSScriptRoot/../common.ps1
}

Describe "Common Utilities" {
    It "Write-Log should exist" {
        Get-Command Write-Log | Should -Not -BeNullOrEmpty
    }

    It "Test-EnvironmentPrerequisites should return a boolean" {
        $result = Test-EnvironmentPrerequisites
        $result.GetType().Name | Should -Be "Boolean"
    }
}
