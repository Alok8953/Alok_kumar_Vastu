# Run from Windows PowerShell before uploading to a server:
#   cd c:\Alok_Kumar_Vastu\Vastu_proj
#   powershell -ExecutionPolicy Bypass -File scripts/prepare-hosting.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$envExample = Join-Path $root "apps\backend\.env.production.example"
$envFile = Join-Path $root "apps\backend\.env"

if (-not (Test-Path $envFile)) {
  Copy-Item $envExample $envFile
  Write-Host "Created apps/backend/.env from production template."
} else {
  Write-Host "apps/backend/.env already exists (not overwritten)."
}

Write-Host ""
Write-Host "Building production frontend..."
npm run build

Write-Host ""
Write-Host "=========================================="
Write-Host " HOSTING CHECKLIST"
Write-Host "=========================================="
Write-Host "1. Edit apps/backend/.env"
Write-Host "   - FRONTEND_ORIGIN = https://YOUR-DOMAIN.com"
Write-Host "   - DB_PASSWORD, GMAIL_APP_PASSWORD, ADMIN_API_KEY"
Write-Host ""
Write-Host "2. OPTION A - VPS (Ubuntu + Docker)"
Write-Host "   Upload this Vastu_proj folder to the server"
Write-Host "   On server:"
Write-Host "     cd Vastu_proj"
Write-Host "     docker compose -f infra/docker-compose.simple.yml --env-file apps/backend/.env up -d --build"
Write-Host "   Open: http://YOUR-SERVER-IP"
Write-Host ""
Write-Host "3. OPTION B - Render.com (easier, no SSH)"
Write-Host "   Push code to GitHub"
Write-Host "   render.com -> New Blueprint -> connect repo"
Write-Host "   Set FRONTEND_ORIGIN to your Render URL or custom domain"
Write-Host ""
Write-Host "4. Point domain DNS A-record to server IP"
Write-Host "5. Add HTTPS (Certbot on VPS, or Render auto-SSL)"
Write-Host "=========================================="
