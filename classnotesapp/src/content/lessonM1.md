# Creando AAB Android

Para publicar en Google Play necesitas firmar tu app con un keystore y generar un archivo `.aab` (Android App Bundle).

## 1. Crear el keystore

El keystore es un archivo que contiene tu clave de firma. Se crea una sola vez y se reutiliza en cada release. Guárdalo en un lugar seguro, sin él no podrás actualizar tu app en el futuro.

```bash
keytool -genkey -v -keystore ~/appkey.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
```

El comando pedirá:

- Una contraseña para el keystore (guárdala, sin ella no puedes firmar)
- Tu nombre, organización, ciudad, país
- Esto creará el archivo `~/appkey.jks` en tu carpeta de usuario

## 2. Crear key.properties

Dentro de la carpeta `android/` crea el archivo `key.properties` con tus credenciales:

```properties
storePassword=TU_PASSWORD_KEYSTORE
keyPassword=TU_PASSWORD_LLAVE
keyAlias=my-key-alias
storeFile=/Users/TU_USUARIO/appkey.jks
```

`storeFile` debe ser la ruta absoluta al archivo `.jks` que generaste.

Agrega este archivo a `.gitignore` para no subir tus credenciales al repositorio:

```bash
echo "android/key.properties" >> .gitignore
```

## 3. Configurar build.gradle.kts

Abre `android/app/build.gradle.kts` y agrega la carga del keystore y la firma del release:

```java
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
```

## 4. Gestionar el versionCode

Google Play exige que cada AAB que subas tenga un `versionCode` mayor que el anterior. Flutter toma este número directamente del `pubspec.yaml`:

```yaml
version: 1.0.0+1
```

El número después del `+` es el `versionCode`. El número antes es el `versionName` que ven los usuarios.

- Primera subida → `1.0.0+1`
- Segunda subida → `1.0.0+2` (o `1.1.0+2` si cambias la versión visible)
- Hotfix → `1.0.1+3`
- Nueva versión mayor → `2.0.0+4`

Antes de cada build para producción, incrementa el número después del `+`. No importa cuánto lo incrementes, solo que sea mayor al anterior.

## 5. Generar el AAB

Con todo configurado, ejecuta:

```bash
flutter build appbundle --release
```

El archivo generado queda en:

```bash
build/app/outputs/bundle/release/app-release.aab
```

Ese es el archivo que subirás a Google Play.

## Generar el APK

De todos modos si quiere generar APK debe saber que el APK es dependente de la arquitectura del procesador del dispositivo móvil

Usando

```bash
flutter build apk --release --split-per-abi
```

Esto genera 3 APKs firmados en `build/app/outputs/flutter-apk/`

```plain
app-armeabi-v7a-release.apk    # ARM 32-bit  (dispositivos antiguos)
app-arm64-v8a-release.apk      # ARM 64-bit  (la mayoría hoy en día)
app-x86_64-release.apk         # x86 64-bit  (emuladores)
```

.
