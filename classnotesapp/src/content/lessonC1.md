# Instalación de Flutter

En esta lección aprenderás a instalar Flutter en tu sistema operativo (Windows, macOS o Linux) y a dejarlo listo para comenzar a desarrollar aplicaciones móviles.

```youtube
dUMqg_JQsEc
```

## Descargar Flutter

Para comenzar, ve a la página oficial de instalación de Flutter en [la página oficial de instalación de Flutter](https://docs.flutter.dev/get-started/install)

- Elige tu sistema operativo (Windows, macOS o Linux) en la página de instalación.
- Descarga el archivo ZIP de Flutter, que tiene un tamaño aproximado de 900 MB.
- Descomprime el archivo ZIP en una carpeta de tu preferencia. Se recomienda usar un disco local, pero también puedes elegir las carpetas Descargas o Documentos.

## Agregar Flutter al PATH del sistema

Para poder ejecutar el comando `flutter` desde cualquier terminal, debes agregar la carpeta `bin` de Flutter a la variable de entorno PATH.

## En Windows

- Busca "Editar las variables de entorno del sistema" en el menú de inicio y ábrelo.
- Haz clic en "Variables de entorno".
- En la sección "Variables del sistema", busca y selecciona la variable `Path` y haz clic en "Editar".
- Haz clic en "Nuevo" y agrega la ruta completa a la carpeta `bin` de Flutter (por ejemplo, `C:\flutter\bin`).
- Haz clic en "Aceptar" para guardar los cambios.

## En macOS/Linux:

- Abre tu terminal.
- Edita el archivo de configuración de tu shell (por ejemplo, `~/.zshrc` o `~/.bashrc`).
- Agrega la siguiente línea al final del archivo:

```shell
export PATH="$PATH:/ruta/a/flutter/bin"
```

- Guarda el archivo y ejecuta `source ~/.zshrc` (o el archivo correspondiente) para aplicar los cambios.

## Verificar la instalación

Abre una nueva terminal y ejecuta:

```shell
flutter --version
```

Si ves la versión de Flutter, la instalación fue exitosa. Ahora puedes ejecutar el comando `flutter` desde cualquier carpeta.

## Usar flutter doctor

Ejecuta el siguiente comando para verificar que todo esté correctamente instalado y ver qué dependencias adicionales necesitas:

```shell
flutter doctor
```

`flutter doctor` te indicará si necesitas instalar Android Studio, Xcode (en Mac), o aceptar licencias. Sigue las instrucciones que aparecen en la terminal.

## Instalar Android Studio y Xcode (si aplica)

Descarga e instala Android Studio desde [Android Studio](https://developer.android.com/studio)

Abre Android Studio al menos una vez y crea un proyecto para que se configuren las herramientas.

En Android Studio, abre el "SDK Manager" y asegúrate de instalar el "Android SDK Command-line Tools (latest)".

Si usas Mac, instala Xcode desde la App Store y ábrelo al menos una vez.

## Instalar extensiones en Visual Studio Code

Si usas VS Code, instala las extensiones "Flutter" y "Dart" desde el marketplace de extensiones para tener soporte completo de desarrollo.

## Probar la instalación

Abre una terminal en cualquier carpeta y ejecuta:

```shell
flutter doctor
```

Si ves todos los checks en verde, ¡ya puedes comenzar a crear proyectos Flutter!
