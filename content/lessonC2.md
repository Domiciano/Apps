# Tu primera app Flutter

En esta lección aprenderás a crear tu primer proyecto Flutter desde cero usando el comando `flutter create` y a entender la estructura básica del proyecto.

```youtube
44JrbFEeMrE
```

## Crear el proyecto con flutter create

Para crear tu primer proyecto, abre una terminal en la carpeta donde quieras guardar tus proyectos y ejecuta:

```shell
flutter create --org com.tuempresa mi_primera_app
```

Este comando crea una nueva app Flutter en la carpeta `mi_primera_app` y configura el identificador de paquete (package name) con el dominio de tu organización (`com.tuempresa`).

- Cambia `com.tuempresa` por el dominio de tu organización o tu nombre invertido (ejemplo: `com.ejemplo`).
- Cambia `mi_primera_app` por el nombre que quieras para tu proyecto.
- El nombre del proyecto y la carpeta debe estar en minúsculas y usar guión bajo para separar palabras (snake_case). Ejemplo: `first_app` o `mi_primera_app`.

## Path del proyecto

Por nada del mundo permitas que el path de tu proyecto tenga non-ASCII characters o espacios. El nombre del proyecto debe ir en minúsculas usando `snake_case`

## Abrir el proyecto en Visual Studio Code

Abre Visual Studio Code y selecciona la carpeta de tu nuevo proyecto para comenzar a trabajar en él.

- Ve a "File > Open Folder" y selecciona la carpeta creada.
- Confirma que confías en los archivos del proyecto.
- No te preocupes si ves muchas carpetas y archivos, lo importante es la carpeta `lib` donde está el código principal.

## Estructura del proyecto Flutter

El proyecto generado tiene varias carpetas

- `android` y `ios`: aquí puedes editar configuraciones específicas de cada plataforma, como permisos o integraciones nativas.
- `lib`: aquí va el código principal de tu app (por defecto, el archivo `main.dart`).
- `linux`, `web`, `windows`: carpetas para soporte multiplataforma (enfoque principal: Android/iOS).

## El archivo pubspec.yaml

El archivo `pubspec.yaml` es donde se gestionan las dependencias de tu proyecto Flutter, similar a `package.json` en Node.js.

- Aquí puedes añadir paquetes y plugins que tu app necesite.
- Cada vez que modifiques este archivo, ejecuta `flutter pub get` para instalar las dependencias.
- ¡Listo! Ahora tienes tu primer proyecto Flutter creado, abierto en VS Code y listo para comenzar a desarrollar.
