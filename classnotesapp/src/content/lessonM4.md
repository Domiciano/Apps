# Publicar en App Store Connect

Con el `.ipa` generado o el archive subido desde Xcode puedes publicar tu app en el App Store.

## 1. Crear la app en App Store Connect

Si es la primera vez que publicas esta app:

- Ve a [App Store Connect](https://appstoreconnect.apple.com/)
- Haz clic en `+` → `Nueva app`
- Selecciona `iOS` como plataforma
- Rellena el nombre, idioma principal y Bundle ID (debe coincidir con el de Xcode)
- Asigna un SKU (puede ser cualquier identificador interno, ej: `miapp-001`)
- Haz clic en `Crear`

## 2. Completar la ficha de la tienda

Apple requiere bastante información antes de permitir la revisión. En la pestaña `App Store`:

- Sube capturas de pantalla para cada tamaño requerido (iPhone 6.9", iPhone 6.5", iPad si aplica)
- Escribe una descripción y palabras clave
- Agrega una URL de soporte y, si aplica, una URL de política de privacidad
- Marca la categoría de la app

## 3. Subir el build

El build que subiste desde Xcode (o con `flutter build ipa`) aparece automáticamente en App Store Connect tras unos minutos de procesamiento.

- Ve a la pestaña `TestFlight` o a la sección `Build` dentro de la versión del App Store
- Selecciona el build que quieres publicar
- Si Apple requiere información sobre permisos de privacidad, completa las preguntas de cumplimiento de exportación (generalmente elige `No` si no usas criptografía propia)

## 4. Enviar a revisión

- Vuelve a la pestaña `App Store` y selecciona la versión que estás preparando
- En la sección `Build`, haz clic en `+` y selecciona el build que subiste
- Rellena las `Notas de revisión` si tu app requiere inicio de sesión (proporciona credenciales de prueba)
- Haz clic en `Agregar a revisión`
- Confirma con `Enviar a revisión`

La revisión de Apple tarda entre 24 y 48 horas normalmente.

## Publicar una actualización

Para subir la versión `n+1`:

- Incrementa el número después del `+` en `pubspec.yaml`
- Ejecuta `flutter build ipa --release` o haz Archive desde Xcode
- Sube el build desde Xcode Organizer (`Distribute App` → `App Store Connect` → `Upload`)
- En App Store Connect, ve a tu app → `+` en versiones → `Nueva versión de iOS`
- Escribe el nuevo número de versión, selecciona el build y envía a revisión

## TestFlight: probar antes de publicar

TestFlight te permite distribuir la app a testers antes del lanzamiento oficial.

- Sube el build exactamente igual que para producción
- Ve a la pestaña `TestFlight` en App Store Connect
- Agrega testers internos (hasta 100 personas de tu equipo) o externos (hasta 10.000 personas con enlace de invitación)
- Los testers recibirán una notificación en la app TestFlight en su iPhone para instalar la versión
