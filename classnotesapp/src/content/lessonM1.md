[t] Creando AAB Android

Para publicar en Google Play necesitas firmar tu app con un keystore y generar un archivo `.aab` (Android App Bundle).

[st] 1. Crear el keystore

El keystore es un archivo que contiene tu clave de firma. Se crea una sola vez y se reutiliza en cada release. Guárdalo en un lugar seguro, sin él no podrás actualizar tu app en el futuro.

[code:bash]
keytool -genkey -v -keystore ~/appkey.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
[endcode]

El comando pedirá:

[list]
Una contraseña para el keystore (guárdala, sin ella no puedes firmar)
Tu nombre, organización, ciudad, país
Esto creará el archivo `~/appkey.jks` en tu carpeta de usuario
[endlist]

[st] 2. Crear key.properties

Dentro de la carpeta `android/` crea el archivo `key.properties` con tus credenciales:

[code:properties]
storePassword=TU_PASSWORD_KEYSTORE
keyPassword=TU_PASSWORD_LLAVE
keyAlias=my-key-alias
storeFile=/Users/TU_USUARIO/appkey.jks
[endcode]

`storeFile` debe ser la ruta absoluta al archivo `.jks` que generaste.

Agrega este archivo a `.gitignore` para no subir tus credenciales al repositorio:

[code:bash]
echo "android/key.properties" >> .gitignore
[endcode]

[st] 3. Configurar build.gradle.kts

Abre `android/app/build.gradle.kts` y agrega la carga del keystore y la firma del release:

[code:java]
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
            keyAlias = keystoreProperties["keyAlias"] as String?
            keyPassword = keystoreProperties["keyPassword"] as String?
            storeFile = keystoreProperties["storeFile"]?.let { file(it) }
            storePassword = keystoreProperties["storePassword"] as String?
        }
    }

    buildTypes {
        getByName("release") {
            signingConfig = signingConfigs.getByName("release")
            isMinifyEnabled = false
            isShrinkResources = false
        }
    }
}
[endcode]

[st] 4. Gestionar el versionCode

Google Play exige que cada AAB que subas tenga un `versionCode` mayor que el anterior. Flutter toma este número directamente del `pubspec.yaml`:

[code:yaml]
version: 1.0.0+1
[endcode]

El número después del `+` es el `versionCode`. El número antes es el `versionName` que ven los usuarios.

[list]
Primera subida → `1.0.0+1`
Segunda subida → `1.0.0+2` (o `1.1.0+2` si cambias la versión visible)
Hotfix → `1.0.1+3`
Nueva versión mayor → `2.0.0+4`
[endlist]

Antes de cada build para producción, incrementa el número después del `+`. No importa cuánto lo incrementes, solo que sea mayor al anterior.

[st] 5. Generar el AAB

Con todo configurado, ejecuta:

[code:bash]
flutter build appbundle --release
[endcode]

El archivo generado queda en:

[code:bash]
build/app/outputs/bundle/release/app-release.aab
[endcode]

Ese es el archivo que subirás a Google Play.


[st] Generar el APK
De todos modos si quiere generar APK debe saber que el APK es dependente de la arquitectura del procesador del dispositivo móvil

Usando
[code:bash]
flutter build apk --release --split-per-abi
[endcode]

Esto genera 3 APKs firmados en `build/app/outputs/flutter-apk/`

[code:plain]
app-armeabi-v7a-release.apk    # ARM 32-bit  (dispositivos antiguos)
app-arm64-v8a-release.apk      # ARM 64-bit  (la mayoría hoy en día)
app-x86_64-release.apk         # x86 64-bit  (emuladores)
[endcode]
.