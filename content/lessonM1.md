# Generación de artefactos: AAB e IPA

<!-- tags: AAB, IPA, keytool, keystore, key.properties, build.gradle.kts, signingConfigs,
     flutter build appbundle, flutter build ipa, applicationId, Bundle Identifier,
     keytool no se reconoce como un comando, CocoaPods, Xcode, versionCode -->

Cada tienda pide un archivo firmado: Google Play un **AAB** (Android App Bundle) y el App Store un **IPA**. Los dos salen del mismo proyecto Flutter.

```svg
<svg id="arFlujo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 380" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="arFlujo-ttl arFlujo-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="arFlujo-ttl">Un artefacto por tienda</title>
  <desc id="arFlujo-dsc">Dos filas. Arriba, Android: la versión del pubspec, el keystore con key.properties, el comando flutter build appbundle, el archivo app-release.aab y Google Play. Abajo, iOS, solo en un Mac: la versión del pubspec, la firma en Xcode con el Team y el Bundle ID, el comando flutter build ipa, el archivo .ipa, Transporter y App Store Connect.</desc>
  <defs>
    <style>
      #arFlujo .title{fill:#161A26;font-size:22px;font-weight:700}
      #arFlujo .sub{fill:#79809A;font-size:13.5px}
      #arFlujo .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #arFlujo .foot{fill:#79809A;font-size:12px}
      #arFlujo .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #arFlujo .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #arFlujo .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#arFlujo-arrow)}
    </style>
    <marker id="arFlujo-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="380" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Un artefacto por tienda</text>
  <text class="sub" x="48" y="80" data-fit="860">Los dos salen del mismo proyecto y de la misma versión del pubspec.yaml.</text>
  <text x="48" y="170" dy="0.35em" font-size="14" font-weight="700" fill="#3A8235" text-anchor="start">Android</text>
<rect x="176" y="140" width="126" height="62" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="239" y="162" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="110">pubspec.yaml</text><text x="239" y="181" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="110">version</text>
<rect x="326" y="140" width="126" height="62" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="389" y="162" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="110">keystore</text><text x="389" y="181" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="110">key.properties</text>
  <path class="link" d="M304,171 L322,171"/>
<rect x="476" y="140" width="126" height="62" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="539" y="162" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="110">flutter build</text><text x="539" y="181" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="110">appbundle</text>
  <path class="link" d="M454,171 L472,171"/>
<rect x="626" y="140" width="126" height="62" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="689" y="162" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#3A8235" data-fit="110">app-release</text><text x="689" y="181" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="110">.aab</text>
  <path class="link" d="M604,171 L622,171"/>
<rect x="776" y="140" width="126" height="62" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="839" y="162" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#3A8235" data-fit="110">Google Play</text><text x="839" y="181" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="110">Play Console</text>
  <path class="link" d="M754,171 L772,171"/>
  <text x="48" y="292" dy="0.35em" font-size="14" font-weight="700" fill="#4453C9" text-anchor="start">iOS · solo Mac</text>
<rect x="176" y="262" width="126" height="62" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="239" y="284" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="110">pubspec.yaml</text><text x="239" y="303" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="110">version</text>
<rect x="326" y="262" width="126" height="62" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="389" y="284" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="110">Xcode</text><text x="389" y="303" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="110">Team · Bundle ID</text>
  <path class="link" d="M304,293 L322,293"/>
<rect x="476" y="262" width="126" height="62" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="539" y="284" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="110">flutter build</text><text x="539" y="303" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="110">ipa</text>
  <path class="link" d="M454,293 L472,293"/>
<rect x="626" y="262" width="126" height="62" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="689" y="284" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#4453C9" data-fit="110">miapp</text><text x="689" y="303" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="110">.ipa</text>
  <path class="link" d="M604,293 L622,293"/>
<rect x="776" y="262" width="126" height="62" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="839" y="284" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#4453C9" data-fit="110">App Store</text><text x="839" y="303" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="110">por Transporter</text>
  <path class="link" d="M754,293 L772,293"/>
  <text class="foot" x="48" y="352" data-fit="860">El keystore y la cuenta de Apple son lo único que no viene en el proyecto: cada quien crea los suyos.</text>
</svg>
```

## Antes de empezar: el identificador

Cada app tiene un identificador único que no se puede cambiar después de publicar. Flutter crea uno con `com.example`, y Google Play rechaza cualquier identificador que empiece así. Usa uno propio, como `co.edu.icesi.miapp`.

- **Android**: en `android/app/build.gradle.kts`, dentro de `defaultConfig`, cambia `applicationId`.
- **iOS**: es el *Bundle Identifier*, que se pone en Xcode (paso 2 de iOS).

Si la app usa Firebase, después de cambiarlo vuelve a correr `flutterfire configure`: la configuración de Firebase está atada al identificador.

## Android · el AAB

```svg
<svg id="arAndroid" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 460" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="arAndroid-ttl arAndroid-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="arAndroid-ttl">Tres archivos para firmar el AAB</title>
  <desc id="arAndroid-dsc">A la izquierda, la carpeta de usuario con upload-keystore.jks, fuera del proyecto y con respaldo. A la derecha, el proyecto mi_app: dentro de android está key.properties, que no se sube a git, y dentro de android/app está build.gradle.kts, que lee key.properties para firmar. Flechas: build.gradle.kts lee key.properties, y key.properties apunta al keystore.</desc>
  <defs>
    <style>
      #arAndroid .title{fill:#161A26;font-size:22px;font-weight:700}
      #arAndroid .sub{fill:#79809A;font-size:13.5px}
      #arAndroid .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #arAndroid .foot{fill:#79809A;font-size:12px}
      #arAndroid .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #arAndroid .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #arAndroid .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#arAndroid-arrow)}
    </style>
    <marker id="arAndroid-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="460" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Tres archivos para firmar el AAB</text>
  <text class="sub" x="48" y="80" data-fit="860">El keystore vive fuera del proyecto. key.properties dice dónde está y build.gradle.kts lo lee.</text>
  <rect x="48" y="112" width="300" height="190" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <path d="M68,132 H79 L83,136 H98 V154 H68 Z" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text x="108" y="145" dy="0.35em" font-size="13.5" font-weight="700" fill="#161A26" text-anchor="start">Carpeta de usuario</text>
  <path d="M88,184 H108 L116,192 V218 H88 Z" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><path d="M108,184 V192 H116" fill="none" stroke="#F0C572" stroke-width="1.5"/>
  <text class="mono" x="126" y="196" dy="0.35em" font-size="12.5" font-weight="700" fill="#A96C05" data-fit="200">upload-keystore.jks</text>
  <text x="126" y="213" dy="0.35em" font-size="11.5" fill="#79809A" data-fit="200">tu llave de firma</text>
  <rect x="88" y="251" width="232" height="22" rx="11" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.25"/><text x="204" y="262" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#C2354F">fuera del proyecto · haz respaldo</text>
  <rect x="412" y="112" width="500" height="250" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <path d="M432,132 H443 L447,136 H462 V154 H432 Z" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="472" y="145" dy="0.35em" font-size="13.5" font-weight="700" fill="#161A26" text-anchor="start">mi_app</text>
  <path d="M452,176 H463 L467,180 H482 V198 H452 Z" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="492" y="189" dy="0.35em" font-size="13" font-weight="700" fill="#161A26" text-anchor="start">android</text>
  <path d="M472,210 H492 L500,218 V244 H472 Z" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><path d="M492,210 V218 H500" fill="none" stroke="#F0C572" stroke-width="1.5"/>
  <text class="mono" x="510" y="222" dy="0.35em" font-size="12.5" font-weight="700" fill="#A96C05" data-fit="220">key.properties</text>
  <text x="510" y="239" dy="0.35em" font-size="11.5" fill="#79809A" data-fit="220">contraseñas y ruta del keystore</text>
  <rect x="740" y="216" width="110" height="22" rx="11" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.25"/><text x="795" y="227" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#C2354F">en .gitignore</text>
  <path d="M472,264 H483 L487,268 H502 V286 H472 Z" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="512" y="277" dy="0.35em" font-size="13" font-weight="700" fill="#161A26" text-anchor="start">app</text>
  <path d="M492,298 H512 L520,306 V332 H492 Z" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><path d="M512,298 V306 H520" fill="none" stroke="#9FD68D" stroke-width="1.5"/>
  <text class="mono" x="530" y="310" dy="0.35em" font-size="12.5" font-weight="700" fill="#3A8235" data-fit="240">build.gradle.kts</text>
  <text x="530" y="327" dy="0.35em" font-size="11.5" fill="#79809A" data-fit="240">firma el release con esos datos</text>
  <path class="link" d="M482,312 C458,300 452,250 466,236"/>
  <text x="418" y="274" dy="0.35em" font-size="11.5" font-weight="400" fill="#79809A" text-anchor="start">lee</text>
  <path class="link" d="M472,226 C420,226 380,206 352,206"/>
  <text x="360" y="196" dy="0.35em" font-size="11.5" font-weight="400" fill="#79809A" text-anchor="start">apunta a</text>
<g transform="translate(48,320)"><rect width="300" height="77" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#C2354F" data-fit="272">Si pierdes el keystore</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="272">No podrás firmar actualizaciones</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="272">con la misma llave.</text></g>
  <text class="foot" x="48" y="432" data-fit="860">pubspec.yaml no cambia de lugar: de su línea version salen el nombre y el número de cada artefacto.</text>
</svg>
```

### 1. Tener keytool

`keytool` crea el keystore y viene con Java. Comprueba si lo tienes:

```shell
keytool -help
```

Si responde `command not found` o `keytool no se reconoce como un comando`, usa el Java que trae Android Studio. `flutter doctor -v` muestra su ruta en la línea `Java binary at:`, y `keytool` está en la misma carpeta:

- **macOS**: `/Applications/Android Studio.app/Contents/jbr/Contents/Home/bin/keytool`
- **Windows**: `C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe`

En los comandos de abajo, cambia `keytool` por esa ruta entre comillas. En PowerShell, antepón `&`: `& "C:\…\keytool.exe" -genkey …`.

### 2. Crear el keystore

Se crea **una sola vez** y sirve para todas las versiones de la app. En macOS:

```shell
keytool -genkey -v -keystore ~/upload-keystore.jks -keyalg RSA \
  -keysize 2048 -validity 10000 -alias upload
```

En Windows, con PowerShell:

```shell
keytool -genkey -v -keystore $env:USERPROFILE\upload-keystore.jks `
  -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

Te pide una contraseña (no se ve mientras escribes), tu nombre y organización, y una confirmación: responde `sí` o `yes`. Guarda el archivo y la contraseña con respaldo, fuera del proyecto.

### 3. key.properties

Crea `android/key.properties`:

```properties
storePassword=TU_CONTRASEÑA
keyPassword=TU_CONTRASEÑA
keyAlias=upload
storeFile=/Users/TU_USUARIO/upload-keystore.jks
```

En Windows, la ruta va con barras normales: `storeFile=C:/Users/TU_USUARIO/upload-keystore.jks`. El `.gitignore` de `android/` ya excluye `key.properties` y los `.jks`: compruébalo con `git status` antes de hacer commit.

### 4. build.gradle.kts

En `android/app/build.gradle.kts`, los dos `import` van en la primera línea del archivo, encima de `plugins`. El resto va después de `plugins`:

```kotlin
import java.util.Properties
import java.io.FileInputStream

val keystoreProperties = Properties()
val keystorePropertiesFile = rootProject.file("key.properties")
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(FileInputStream(keystorePropertiesFile))
}

android {
    signingConfigs {
        create("release") {
            keyAlias = keystoreProperties["keyAlias"] as String
            keyPassword = keystoreProperties["keyPassword"] as String
            storeFile = keystoreProperties["storeFile"]?.let { file(it) }
            storePassword = keystoreProperties["storePassword"] as String
        }
    }
    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("release")
        }
    }
}
```

`android { … }` ya existe: agrega `signingConfigs` dentro de él y, en `buildTypes`, cambia `getByName("debug")` por `getByName("release")`.

### 5. Generar el AAB

```shell
flutter build appbundle
```

El archivo queda en `build/app/outputs/bundle/release/app-release.aab`. Es el que se sube a Google Play.

## iOS · el IPA

Solo se puede hacer en un Mac.

### 1. Instalar lo necesario

- **Xcode**, desde la Mac App Store. Ábrelo una vez y luego, en la terminal:

```shell
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -runFirstLaunch
```

- **CocoaPods**, con [Homebrew](https://brew.sh):

```shell
brew install cocoapods
```

- **Una cuenta del Apple Developer Program** (pago anual). Agrégala en Xcode → *Settings* → *Accounts*.

`flutter doctor` debe mostrar Xcode sin errores antes de seguir.

### 2. Firmar en Xcode

```shell
open ios/Runner.xcworkspace
```

```svg
<svg id="arXcode" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 490" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="arXcode-ttl arXcode-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="arXcode-ttl">La firma en Xcode</title>
  <desc id="arXcode-dsc">Esquema de Xcode con el proyecto Runner abierto. A la izquierda, el target Runner seleccionado. Arriba, la pestaña Signing and Capabilities. En el panel: la casilla Automatically manage signing marcada (paso 1), el Team con tu cuenta del Apple Developer Program (paso 2) y el Bundle Identifier co.edu.icesi.miapp (paso 3).</desc>
  <defs>
    <style>
      #arXcode .title{fill:#161A26;font-size:22px;font-weight:700}
      #arXcode .sub{fill:#79809A;font-size:13.5px}
      #arXcode .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #arXcode .foot{fill:#79809A;font-size:12px}
      #arXcode .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #arXcode .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #arXcode .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#arXcode-arrow)}
    </style>
    <marker id="arXcode-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="490" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">La firma en Xcode</text>
  <text class="sub" x="48" y="80" data-fit="860">Runner → Signing &amp; Capabilities. Con la firma automática, Xcode crea los certificados por ti.</text>
  <rect x="48" y="104" width="864" height="340" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <path d="M48,138 V116 A12,12 0 0 1 60,104 H900 A12,12 0 0 1 912,116 V138 Z" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <circle cx="68" cy="121" r="4.5" fill="#F14C4C"/>  <circle cx="83" cy="121" r="4.5" fill="#E5C07B"/>  <circle cx="98" cy="121" r="4.5" fill="#6BCB77"/>
  <text x="480.0" y="121" dy="0.35em" font-size="13" font-weight="700" fill="#556074" text-anchor="middle" data-fit="724">Runner.xcworkspace</text>
  <rect x="48" y="138" width="190" height="306" fill="#F7F8FA"/>
  <path d="M238,138 V444" stroke="#D9DEE8" stroke-width="1.25"/>
  <text x="62" y="160" dy="0.35em" font-size="10.5" font-weight="700" fill="#79809A" text-anchor="start" data-fit="166">PROJECT</text>
  <text x="66" y="186" dy="0.35em" font-size="12.5" font-weight="400" fill="#454C61" text-anchor="start" data-fit="162">Runner</text>
  <text x="62" y="216" dy="0.35em" font-size="10.5" font-weight="700" fill="#79809A" text-anchor="start" data-fit="166">TARGETS</text>
  <rect x="54" y="229" width="178" height="26" rx="7" fill="#EFF1F5"/><rect x="54" y="229" width="4" height="26" rx="2" fill="#556074"/>
  <text x="66" y="242" dy="0.35em" font-size="12.5" font-weight="700" fill="#556074" text-anchor="start" data-fit="162">Runner</text>
  <text x="262" y="164" dy="0.35em" font-size="12.5" font-weight="400" fill="#556074" text-anchor="start">General</text>
  <text x="338.4" y="164" dy="0.35em" font-size="12.5" font-weight="700" fill="#4453C9" text-anchor="start">Signing &amp; Capabilities</text>
  <rect x="334.4" y="177" width="195" height="3" rx="1.5" fill="#4453C9"/>
  <text x="551.6" y="164" dy="0.35em" font-size="12.5" font-weight="400" fill="#556074" text-anchor="start">Info</text>
  <text x="606.4" y="164" dy="0.35em" font-size="12.5" font-weight="400" fill="#556074" text-anchor="start">Build Settings</text>
  <path d="M262,182 H888" stroke="#D9DEE8" stroke-width="1.25"/>
  <rect x="273" y="207" width="14" height="14" rx="3" fill="#4453C9" stroke="#4453C9" stroke-width="1.75"/><path d="M276,214 l3,3 l6,-6" fill="none" stroke="#FFFFFF" stroke-width="2"/>
  <text x="296" y="214" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start">Automatically manage signing</text>
  <circle cx="532" cy="214" r="11" fill="#C2354F"/><text x="532" y="214" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">1</text>
  <text x="272" y="244" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start" data-fit="400">Team</text>
  <rect x="272" y="256" width="400" height="30" rx="7" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.25"/>
  <text x="282" y="271" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start" data-fit="380">Tu nombre (Apple Developer Program)</text>
  <path d="M650,268 l6,6 l6,-6" fill="none" stroke="#556074" stroke-width="1.75"/>
  <circle cx="692" cy="268" r="11" fill="#C2354F"/><text x="692" y="268" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">2</text>
  <text x="272" y="304" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start" data-fit="400">Bundle Identifier</text>
  <rect x="272" y="316" width="400" height="30" rx="7" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.25"/>
  <text class="mono" x="282" y="331" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start" data-fit="380">co.edu.icesi.miapp</text>
  <circle cx="692" cy="328" r="11" fill="#C2354F"/><text x="692" y="328" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">3</text>
  <text x="272" y="376" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start">Signing Certificate</text>
  <text x="272" y="396" dy="0.35em" font-size="12.5" font-weight="400" fill="#79809A" text-anchor="start">Apple Development · lo crea Xcode</text>
<g transform="translate(712,228)"><rect width="176" height="77" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#4453C9" data-fit="148">El Bundle ID</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="148">es único y no se</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="148">cambia después.</text></g>
  <text class="foot" x="48" y="462" data-fit="860">Con un Team personal gratuito se puede probar en tu iPhone, pero no generar un IPA para la tienda.</text>
</svg>
```

Selecciona el target **Runner**, pestaña *Signing & Capabilities*: deja marcada la firma automática (1), elige tu Team (2) y escribe el Bundle Identifier (3).

### 3. Generar el IPA

```shell
flutter build ipa
```

El archivo `.ipa` queda en `build/ios/ipa/`. Si falla por la firma, vuelve a Xcode y revisa que el Team no muestre errores. El IPA se sube con Transporter, como verás en *Publicar en App Store*.

## La versión de cada artefacto

Los dos artefactos toman su versión de la misma línea de `pubspec.yaml`:

```yaml
version: 1.0.0+1
```

Lo de antes del `+` es el nombre que ve la gente y lo de después, un número que **tiene que subir en cada artefacto que subas a una tienda**. El detalle está en *Publicar en Google Play*, sección *Publicar una actualización*.
