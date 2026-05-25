[t] Publicar en Google Play

Con el `.aab` generado ya puedes publicar tu app. El proceso se hace desde la Google Play Console.

[st] 1. Crear la app en Google Play Console

Si es la primera vez que publicas esta app:

[list]
Ve a [link] (Google Play Console) https://play.google.com/console
Haz clic en `Crear app`
Rellena el nombre, idioma y tipo de app
Acepta las políticas y crea la app
[endlist]

[st] 2. Completar la ficha de la tienda

Antes de poder publicar, Google requiere que llenes la información básica de la app. En el panel lateral ve a `Presencia en Play Store`:

[list]
Sube el ícono de la app (512×512 px, PNG)
Sube al menos 2 capturas de pantalla del teléfono
Escribe una descripción corta y una descripción completa
[endlist]

[st] 3. Subir el AAB

En el panel lateral ve a `Producción` → `Crear nueva versión`.

Si es la primera vez, Google te pedirá que actives la firma de app de Google Play (Play App Signing). Acéptalo.

[list]
Haz clic en `Subir` y selecciona el archivo `app-release.aab`
Espera a que Google procese el archivo (puede tardar unos segundos)
En `Novedades de la versión` escribe qué hay de nuevo (ej: `Primera versión`)
Haz clic en `Guardar`
[endlist]

[st] 4. Revisar y publicar

[list]
Haz clic en `Revisar versión`
Google te mostrará advertencias o errores pendientes si los hay
Si todo está en orden, haz clic en `Iniciar lanzamiento en producción`
Confirma con `Lanzar`
[endlist]

La revisión de Google tarda entre unas horas y 3 días la primera vez. Las actualizaciones posteriores suelen ser más rápidas.

[st] Publicar una actualización

Para subir la versión `n+1`:

[list]
Incrementa el `versionCode` en `pubspec.yaml` (el número después del `+`)
Ejecuta `flutter build appbundle --release`
Ve a Google Play Console → `Producción` → `Crear nueva versión`
Sube el nuevo `.aab` y publica
[endlist]

Google Play rechazará el AAB si el `versionCode` no es mayor al que ya está publicado.
