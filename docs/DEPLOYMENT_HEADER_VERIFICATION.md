# Private-deployment header verification

This is the release-evidence procedure for the private Atlas deployment. It
does not run automatically and it does not invent a hosting URL. Perform it
only after the learner-facing deployment reports a successful deployment, using
the exact reviewed source/deployment identifier.

## Check both Worker response paths

In a trusted local shell, set the deployment URL manually and keep the raw
header capture outside the repository:

```powershell
$AtlasDeploymentUrl = "https://<private-deployment-host>"
$AtlasHeaderCapture = Join-Path $env:TEMP "atlas-deployment-headers.txt"
curl.exe --fail --silent --show-error --location --max-time 20 `
  -D $AtlasHeaderCapture -o NUL "$AtlasDeploymentUrl/"
Get-Content -LiteralPath $AtlasHeaderCapture
```

Repeat the request against the deployed `/_vinext/image` route with a real,
non-sensitive image query that the deployment accepts. The ordinary application
response and image-optimization response must both carry the shared policy:

| Header | Required value or rule |
| --- | --- |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), geolocation=(), microphone=(), payment=(), usb=()` |
| `Strict-Transport-Security` | `max-age=31536000` on HTTPS; absent on local HTTP |
| `X-DNS-Prefetch-Control` | `off` |

The repository intentionally does not guess a CSP or frame policy for the
private Sites embedding boundary. Record any platform-added CSP, frame, or
cross-origin policy separately after checking its compatibility with the
rendered portal; absence of a guessed header is not evidence that a deployment
is secure.

## Evidence record

For a release ledger entry, record the deployment URL or private locator,
observed UTC time, reviewed source commit, deployment/version identifier,
ordinary-route result, image-route result, and any platform-added headers.
Keep credentials, private learner data, raw captures, and hosting tokens out of
Git. A local unit test, a Worker source inspection, or a configured remote does
not substitute for this direct deployment observation.
