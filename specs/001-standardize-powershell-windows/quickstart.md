# Quickstart: PowerShell Automation

## Prerequisites
- Windows 10/11
- Node.js 20+
- pnpm 9+

## Initial Setup
If you haven't enabled script execution on your machine, run this in an Administrative PowerShell:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Running the Project

### 1. Full Setup
Installs all dependencies and prepares the database:
```powershell
./scripts/powershell/setup.ps1
```

### 2. Start Development
```powershell
./scripts/powershell/start.ps1
```

### 3. Run Tests
```powershell
./scripts/powershell/test.ps1
```
