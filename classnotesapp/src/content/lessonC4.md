# Configurando dispositivos virtuales

En esta lección aprenderás a configurar y lanzar emuladores Android e iOS, añadir rutas importantes a tu variable de entorno PATH y recomendaciones clave para tu entorno de desarrollo Flutter.

```youtube
VbKg1s24mEM
```

## Acceder al SDK Manager en Android Studio

Abre Android Studio y haz clic en el icono del cubo con flecha hacia abajo (SDK Manager). Puedes acceder desde la pantalla principal o desde cualquier proyecto abierto.
La ruta que aparece en el SDK Manager es importante: allí se encuentran las herramientas necesarias para emular dispositivos.

## Añadir rutas a la variable PATH

Debes añadir la carpeta `emulator` (y opcionalmente `tools`, `platform-tools`, `bin`) de tu instalación de Android SDK a la variable de entorno PATH de tu sistema.

- En Windows, puedes hacerlo desde las variables de entorno del sistema.
- En Mac/Linux, edita tu archivo de configuración de shell (por ejemplo, `~/.zshrc` o `~/.bashrc`).
- Después de modificar el PATH, cierra y vuelve a abrir la terminal para que los cambios tengan efecto.

## Lanzar emuladores desde la terminal

Los siguientes comandos solo tienen sentido si ya tienes las variables de entorno coniguradas. Si tenías la terminal abierta al momento de añadir las variables de entorno, ciérrala y vuelvela a abrir. Esto es porque al inicio, el shell carga todas la variables de entorno

Para listar los emuladores disponibles

```shell
emulator -list-avds
```

Para lanzar un emulador específico

```shell
emulator -avd NOMBRE_DEL_EMULADOR
```

Puedes tener una terminal dedicada para los logs del emulador.

## Consideraciones importantes

- Los emuladores requieren buena memoria RAM y CPU. Si tu computador es limitado, usa un dispositivo físico.
- No puedes usar el mismo emulador desde Android Studio y la terminal al mismo tiempo: ciérralo en uno antes de abrirlo en el otro.
- En Windows solo puedes emular Android. Para iOS necesitas una Mac.

## Lanzar el simulador de iOS (solo en Mac)

Asegúrate de haber abierto Xcode al menos una vez. Para abrir el simulador de iOS

```shell
open -a simulator
```

Esto abrirá la última versión de simulador disponible (por ejemplo, iPhone 14 Pro Max).

## Recorderis

Usa el comando

```shell
flutter devices
```

El segundo parámetro de cada línea es el ID del dispositivo, que puedes usar con

```shell
flutter run -d ID_DEL_DISPOSITIVO
```

Con esto, puede ejecutar la app en cualquier devices disponible
