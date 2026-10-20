# Security notes

Do not use credentials from old commits. Revoke exposed API keys, replace the JWT
secret, and require users to sign in again before deploying this revision.
Configuration examples contain no live credentials. Never create administrator
accounts through the public registration endpoint.

Report a suspected vulnerability privately through the contact listed on the
[author's portfolio](https://portfoliohawala.vercel.app/), without posting secrets
in a public issue.
