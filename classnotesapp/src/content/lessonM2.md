[t] Creando IPA iOS

Para publicar en el App Store necesitas firmar tu app con tu cuenta de Apple Developer y generar un archivo `.ipa`.

[st] Requisitos previos

[list]
Una cuenta activa en [link] (Apple Developer Program) https://developer.apple.com/ (tiene costo anual)
Xcode instalado en macOS (puedes descargarlo desde la Mac App Store)
Haber ejecutado `flutter pub get` en tu proyecto
[endlist]

[st] 1. Configurar el Bundle Identifier

El Bundle ID es el identificador único de tu app en el ecosistema Apple. Se configura en Xcode.

Abre el proyecto iOS desde la terminal:

[code:bash]
open ios/Runner.xcworkspace
[endcode]

En Xcode:

[list]
Selecciona el target `Runner` en el panel izquierdo
Ve a la pestaña `Signing & Capabilities`
En `Bundle Identifier` escribe el ID de tu app, por ejemplo `com.tuempresa.miapp`
En `Team` selecciona tu cuenta de Apple Developer
Asegúrate de que `Automatically manage signing` esté activado
[endlist]

[st] 2. Actualizar el versionCode en pubspec.yaml

Al igual que en Android, antes de cada release incrementa el número después del `+`:

[code:yaml]
version: 1.0.0+1
[endcode]

En iOS el número antes del `+` es el `CFBundleShortVersionString` (versión visible) y el número después del `+` es el `CFBundleVersion` (build number). Apple App Store Connect exige que el build number sea mayor en cada subida.

[st] 3. Construir el IPA

Desde la terminal, en la raíz del proyecto:

[code:bash]
flutter build ipa --release
[endcode]

Flutter compila la app, genera el archive y exporta el `.ipa`. El archivo queda en:

[code:bash]
build/ios/ipa/NombreDeTuApp.ipa
[endcode]

Si el comando falla por problemas de firma, es más confiable usar el flujo de Xcode directamente.

[st] Alternativa: Archive desde Xcode

Si prefieres o necesitas usar Xcode:

[list]
Abre `ios/Runner.xcworkspace` en Xcode
En el menú superior selecciona como destino `Any iOS Device (arm64)`
Ve a `Product` → `Archive`
Xcode compilará y abrirá el Organizer automáticamente
En el Organizer, selecciona el archive y haz clic en `Distribute App`
Elige `App Store Connect` → `Upload`
Sigue el asistente y haz clic en `Upload`
[endlist]

El archivo `.ipa` también puede exportarse a tu disco eligiendo `Export` en lugar de `Upload`.

[st] Verificar antes de subir

[list]
El Bundle ID debe coincidir exactamente con el que registraste en App Store Connect
El `versionCode` (build number) debe ser mayor al último que subiste
El scheme de Xcode debe estar en modo `Release`, no `Debug`
[endlist]
