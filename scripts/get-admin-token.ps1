param(
  [Parameter(Mandatory = $true)]
  [string]$ShopDomain,

  [Parameter(Mandatory = $true)]
  [string]$ClientId,

  [Parameter(Mandatory = $true)]
  [string]$ClientSecret
)

$ErrorActionPreference = "Stop"

Write-Host "Requesting Admin API access token for $ShopDomain..." -ForegroundColor Cyan

$oauthResponse = Invoke-RestMethod `
  -Method Post `
  -Uri "https://$ShopDomain/admin/oauth/access_token" `
  -ContentType "application/x-www-form-urlencoded" `
  -Body "grant_type=client_credentials&client_id=$ClientId&client_secret=$ClientSecret"

if (-not $oauthResponse.access_token) {
  throw "Shopify did not return an Admin API access token."
}

$adminAccessToken = $oauthResponse.access_token

Write-Host ""
Write-Host "Admin API access token created successfully:" -ForegroundColor Green
Write-Host $adminAccessToken -ForegroundColor Yellow
Write-Host ""
Write-Host "Update .env.local with:" -ForegroundColor Cyan
Write-Host "SHOPIFY_ADMIN_ACCESS_TOKEN=$adminAccessToken"
Write-Host ""

try {
  Set-Clipboard -Value $adminAccessToken
  Write-Host "Token copied to clipboard." -ForegroundColor Green
}
catch {
  # Clipboard is optional
}
