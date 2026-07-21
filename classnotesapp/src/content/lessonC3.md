# Ejecutar las apps

En esta lección aprenderás a ejecutar tu app Flutter en emuladores Android/iOS y en dispositivos físicos, tanto desde Android Studio como desde la línea de comandos.

```youtube
RINBqyRgAAU
```

## Crear y lanzar un emulador Android desde Android Studio

Abre Android Studio y ve a "Virtual Device Manager"

- Haz clic en "Create Device" y elige un modelo (por ejemplo, Pixel XL).
- Selecciona una versión de Android (recomendado: la más reciente, por ejemplo API 33, API 34, API 35).
- Sigue los pasos y haz clic en "Finish" para crear el emulador.
- Puedes lanzar el emulador desde el botón de Play en Device Manager.

## Consideraciones de hardware

- Los emuladores requieren buena memoria RAM y CPU. Si tu computador es limitado, es mejor usar un dispositivo Android físico conectado por USB.
- En Windows, solo puedes emular Android. Para emular iOS necesitas una Mac.

## Ejecutar un emulador Android desde la línea de comandos

Asegúrate de que la carpeta `platform-tools` de Android esté en tu variable de entorno PATH.
Para listar los emuladores disponibles:

```shell
emulator -list-avds
```

Para lanzar un emulador específico:

```shell
emulator -avd Pixel_2_API_33
```

Puedes dedicar una consola aparte para ver los logs del emulador.

## Abrir un simulador iOS desde la línea de comandos (solo en Mac)

```shell
open -a simulator
```

## Ejecutar la app en un dispositivo o emulador

Para ver los dispositivos disponibles:

```shell
flutter devices
```

Un output típico de este comando es

```bash
Domi ➤ flutter devices
Found 3 connected devices:
  Domi iPhone (mobile) • 00008130-001610E03E60001C • ios            • iOS 18.5 22F76
  macOS (desktop)      • macos                     • darwin-arm64   • macOS 15.5 24F74 darwin-arm64
  Chrome (web)         • chrome                    • web-javascript • Google Chrome 138.0.7204.158

No wireless devices were found.
```

Para ejecutar la app en el dispositivo por defecto:

```shell
flutter run
```

Para ejecutar la app en un dispositivo específico, usa el ID mostrado por `flutter devices`:

```shell
flutter run -d emulator-5554
```

Por ejemplo, para iOS:

```shell
flutter run -d 833FEF07-C34F-4BE9-944C-DE01BF091C7C
```

## Recomendaciones

- Siempre usa nombres de proyecto y carpetas en minúsculas y con guión bajo (snake_case).
- Si tu computador no puede emular Android, conecta un dispositivo físico.
- Para iOS, solo puedes emular en Mac.

¡Listo! Ahora sabes cómo ejecutar tu app Flutter en emuladores y dispositivos físicos, tanto desde Android Studio como desde la terminal.
