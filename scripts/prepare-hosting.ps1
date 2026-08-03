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
Write-Host " HOSTING CHECKLIST — vastualok.com"
Write-Host "=========================================="
Write-Host "1. Edit apps/backend/.env"
Write-Host "   - FRONTEND_ORIGIN = https://vastualok.com"
Write-Host "   - BACKEND_PUBLIC_URL = https://vastualok.com"
Write-Host "   - DATABASE_URL = (Neon PostgreSQL URL)"
Write-Host "   - RESEND_API_KEY, ADMIN_API_KEY"
Write-Host ""
Write-Host "2. Upload this Vastu_proj folder to your VPS"
Write-Host "   On server:"
Write-Host "     cd Vastu_proj"
Write-Host "     docker compose -f infra/docker-compose.simple.yml --env-file apps/backend/.env up -d --build"
Write-Host "   Test: http://YOUR-SERVER-IP/api/health"
Write-Host ""
Write-Host "3. DNS: A record @ -> VPS IP, www -> VPS or vastualok.com"
Write-Host "4. HTTPS: Certbot + infra/docker-compose.prod.yml (see README)"
Write-Host ""
Write-Host "5. Render: delete old service at dashboard.render.com (repo no longer has render.yaml)"
Write-Host "=========================================="
