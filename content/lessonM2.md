# Creando IPA iOS

Para publicar en el App Store necesitas firmar tu app con tu cuenta de Apple Developer y generar un archivo `.ipa`.

## Requisitos previos

- Una cuenta activa en [Apple Developer Program](https://developer.apple.com/) (tiene costo anual)
- Xcode instalado en macOS (puedes descargarlo desde la Mac App Store)
- Haber ejecutado `flutter pub get` en tu proyecto

## 1. Configurar el Bundle Identifier

El Bundle ID es el identificador único de tu app en el ecosistema Apple. Se configura en Xcode.

Abre el proyecto iOS desde la terminal:

```bash
open ios/Runner.xcworkspace
```

En Xcode:

- Selecciona el target `Runner` en el panel izquierdo
- Ve a la pestaña `Signing & Capabilities`
- En `Bundle Identifier` escribe el ID de tu app, por ejemplo `com.tuempresa.miapp`
- En `Team` selecciona tu cuenta de Apple Developer
- Asegúrate de que `Automatically manage signing` esté activado

## 2. Actualizar el versionCode en pubspec.yaml

Al igual que en Android, antes de cada release incrementa el número después del `+`:

```yaml
version: 1.0.0+1
```

En iOS el número antes del `+` es el `CFBundleShortVersionString` (versión visible) y el número después del `+` es el `CFBundleVersion` (build number). Apple App Store Connect exige que el build number sea mayor en cada subida.

## 3. Construir el IPA

Desde la terminal, en la raíz del proyecto:

```bash
flutter build ipa --release
```

Flutter compila la app, genera el archive y exporta el `.ipa`. El archivo queda en:

```bash
build/ios/ipa/NombreDeTuApp.ipa
```

Si el comando falla por problemas de firma, es más confiable usar el flujo de Xcode directamente.

## Alternativa: Archive desde Xcode

Si prefieres o necesitas usar Xcode:

- Abre `ios/Runner.xcworkspace` en Xcode
- En el menú superior selecciona como destino `Any iOS Device (arm64)`
- Ve a `Product` → `Archive`
- Xcode compilará y abrirá el Organizer automáticamente
- En el Organizer, selecciona el archive y haz clic en `Distribute App`
- Elige `App Store Connect` → `Upload`
- Sigue el asistente y haz clic en `Upload`

El archivo `.ipa` también puede exportarse a tu disco eligiendo `Export` en lugar de `Upload`.

## Verificar antes de subir

- El Bundle ID debe coincidir exactamente con el que registraste en App Store Connect
- El `versionCode` (build number) debe ser mayor al último que subiste
- El scheme de Xcode debe estar en modo `Release`, no `Debug`
