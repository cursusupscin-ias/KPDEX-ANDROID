// Runs in CI after `npx cap add android`: adds the login deep link + version numbers.
import fs from 'node:fs';

const manifestPath = 'android/app/src/main/AndroidManifest.xml';
let manifest = fs.readFileSync(manifestPath, 'utf8');
if (!manifest.includes('login-callback')) {
  const filter = `
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="com.kpdex.app" android:host="login-callback" />
            </intent-filter>
        </activity>`;
  manifest = manifest.replace('</activity>', filter);
  fs.writeFileSync(manifestPath, manifest);
}

const gradlePath = 'android/app/build.gradle';
let gradle = fs.readFileSync(gradlePath, 'utf8');
const code = process.env.GITHUB_RUN_NUMBER || '1';
const name = (process.env.GITHUB_REF_NAME || '1.0.0').replace(/^v/, '').replace(/[^0-9A-Za-z.\-]/g, '') || '1.0.0';
gradle = gradle.replace(/versionCode\s+\d+/, `versionCode ${code}`).replace(/versionName\s+"[^"]*"/, `versionName "${name}"`);
fs.writeFileSync(gradlePath, gradle);
console.log(`Patched manifest + version (code ${code}, name ${name})`);
