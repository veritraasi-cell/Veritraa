param(
    [Parameter(Mandatory = $true)]
    [string]$Shop,

    [Parameter(Mandatory = $true)]
    [string]$ClientId,

    [Parameter(Mandatory = $true)]
    [string]$ClientSecret,

    [string]$RedirectUri = 'http://localhost:8085/callback',

    [string]$Scopes = 'read_products,write_products,read_orders,write_orders,read_customers,write_customers,read_locations,read_inventory,write_inventory'
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

Add-Type -AssemblyName System.Web

function New-ShopifyState {
    [guid]::NewGuid().ToString('N')
}

function Parse-CallbackInput {
    param(
        [Parameter(Mandatory = $true)]
        [string]$InputText
    )

    $trimmedInput = $InputText.Trim()

    if ($trimmedInput -match '^https?://') {
        $uri = [uri]$trimmedInput
        $query = [System.Web.HttpUtility]::ParseQueryString($uri.Query)

        return [pscustomobject]@{
            Code = $query['code']
            State = $query['state']
            Shop = $query['shop']
            IsUrl = $true
        }
    }

    return [pscustomobject]@{
        Code = $trimmedInput
        State = $null
        Shop = $null
        IsUrl = $false
    }
}

function Invoke-ShopifyTokenExchange {
    param(
        [Parameter(Mandatory = $true)]
        [string]$ShopDomain,

        [Parameter(Mandatory = $true)]
        [string]$AppClientId,

        [Parameter(Mandatory = $true)]
        [string]$AppClientSecret,

        [Parameter(Mandatory = $true)]
        [string]$AuthorizationCode
    )

    $body = @{
        client_id = $AppClientId
        client_secret = $AppClientSecret
        code = $AuthorizationCode
    }

    Invoke-RestMethod -Method Post -Uri "https://$ShopDomain/admin/oauth/access_token" -ContentType 'application/x-www-form-urlencoded' -Body $body
}

$state = New-ShopifyState
$encodedScopes = [uri]::EscapeDataString($Scopes)
$encodedRedirectUri = [uri]::EscapeDataString($RedirectUri)
$encodedState = [uri]::EscapeDataString($state)

$authUrl = "https://$Shop/admin/oauth/authorize?client_id=$ClientId&scope=$encodedScopes&redirect_uri=$encodedRedirectUri&state=$encodedState"

Write-Host ''
Write-Host 'Open this URL and approve the app:'
Write-Host $authUrl
Write-Host ''
Write-Host 'After Shopify redirects, copy the full callback URL from the browser and paste it here.'
Write-Host 'If you only paste the code, state validation will be skipped.'
Write-Host ''

Start-Process $authUrl

$callbackInput = Read-Host 'Callback URL or code'
$parsedCallback = Parse-CallbackInput -InputText $callbackInput

if ($parsedCallback.IsUrl) {
    if ($parsedCallback.Shop -and $parsedCallback.Shop -ne $Shop) {
        throw "Callback shop '$($parsedCallback.Shop)' does not match '$Shop'."
    }

    if (-not $parsedCallback.Code) {
        throw 'No authorization code was found in the callback URL.'
    }

    if ($parsedCallback.State -and $parsedCallback.State -ne $state) {
        throw 'State mismatch. Start the script again and complete the flow in the same browser session.'
    }
}
elseif (-not $parsedCallback.Code) {
    throw 'No authorization code was provided.'
}

Write-Host ''
Write-Host 'Exchanging code for token...'

$tokenResponse = Invoke-ShopifyTokenExchange `
    -ShopDomain $Shop `
    -AppClientId $ClientId `
    -AppClientSecret $ClientSecret `
    -AuthorizationCode $parsedCallback.Code

Write-Host ''
Write-Host 'Access token:'
Write-Host $tokenResponse.access_token
Write-Host ''

if ($tokenResponse.scope) {
    Write-Host "Granted scopes: $($tokenResponse.scope)"
}

if ($tokenResponse.expires_in) {
    Write-Host "Expires in: $($tokenResponse.expires_in) seconds"
}

if ($tokenResponse.refresh_token) {
    Write-Host "Refresh token: $($tokenResponse.refresh_token)"
}

try {
    Set-Clipboard -Value $tokenResponse.access_token
    Write-Host 'Access token copied to clipboard.'
}
catch {
    # Clipboard is optional; ignore failures on systems without a clipboard session.
}

Write-Host ''
Write-Host 'Update .env.local with:'
Write-Host "SHOPIFY_ADMIN_ACCESS_TOKEN=$($tokenResponse.access_token)"