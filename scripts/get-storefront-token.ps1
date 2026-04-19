param(
  [Parameter(Mandatory = $true)]
  [string]$ShopDomain,

  [Parameter(Mandatory = $true)]
  [string]$ClientId,

  [Parameter(Mandatory = $true)]
  [string]$ClientSecret,

  [string]$ApiVersion = "2026-04",

  [string]$TokenTitle = "Veritraa Storefront Token"
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

Write-Host "Admin API access token received. Creating Storefront API access token..." -ForegroundColor Cyan

$requestBody = @{
  storefront_access_token = @{
    title = $TokenTitle
  }
} | ConvertTo-Json -Depth 5

$storefrontResponse = Invoke-RestMethod `
  -Method Post `
  -Uri "https://$ShopDomain/admin/api/$ApiVersion/storefront_access_tokens.json" `
  -Headers @{
    "X-Shopify-Access-Token" = $adminAccessToken
    "Content-Type" = "application/json"
  } `
  -Body $requestBody

$storefrontToken = $storefrontResponse.storefront_access_token.access_token

if (-not $storefrontToken) {
  throw "Shopify did not return a Storefront API access token."
}

Write-Host ""
Write-Host "Storefront API access token created successfully:" -ForegroundColor Green
Write-Host $storefrontToken -ForegroundColor Yellow
Write-Host ""
Write-Host "Add this to .env.local:" -ForegroundColor Cyan
Write-Host "SHOPIFY_STORE_DOMAIN=$ShopDomain"
Write-Host "SHOPIFY_STOREFRONT_ACCESS_TOKEN=$storefrontToken"
Write-Host "SHOPIFY_STOREFRONT_API_VERSION=$ApiVersion"
