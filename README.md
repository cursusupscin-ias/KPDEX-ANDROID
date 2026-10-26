# KPDEX – Android app

The web app lives in `www/index.html`. GitHub Actions wraps it with Capacitor, builds the APK and attaches it to a GitHub Release.

## One-time setup

1. **Supabase redirect (required for Google login in the app)**
   Supabase dashboard -> Authentication -> URL Configuration -> Redirect URLs -> add:
   `com.kpdex.app://login-callback`
   (keep your Netlify/site URL there too).

2. **Create a signing key (once, keep it forever)** - needs Java installed:
   ```
   keytool -genkeypair -v -keystore release.keystore -alias kpdex -keyalg RSA -keysize 2048 -validity 10000
   ```
   Back this file up. Never commit it (it is in .gitignore).
   Convert it: Windows PowerShell `[Convert]::ToBase64String([IO.File]::ReadAllBytes("release.keystore")) | Set-Clipboard`

3. **GitHub repo -> Settings -> Secrets and variables -> Actions -> New repository secret**
   - `KEYSTORE_BASE64` = the base64 text
   - `KEYSTORE_PASSWORD` = the password you chose
   - `KEY_ALIAS` = `kpdex`
   (If the key password differs from the keystore password, tell Claude - one extra line is needed.)

## Every release

```
git add . && git commit -m "update" && git push
git tag v1.0.0 && git push --tags
```
Wait a few minutes -> repo -> Releases -> download `KPDEX.apk`.
Next release: tag `v1.0.1`, etc. (version code is set automatically, so installs update in place).

To change the app: edit `www/index.html`, push, tag again.
