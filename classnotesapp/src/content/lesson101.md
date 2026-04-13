[t] Conceptos inciales

En este laboratorio, daremos un paso fundamental en el desarrollo de aplicaciones robustas y escalables. Aprenderemos a consumir una API REST externa, en este caso la API de Deezer, para obtener datos y mostrarlos en nuestra aplicación Flutter. Para gestionar el estado y la lógica de negocio de una manera organizada y eficiente, implementaremos el patrón de arquitectura BLoC (Business Logic Component).

[i] https://bloclibrary.dev/_astro/bloc_architecture_full.CYn-T9Ox_emLFv.webp

[st] Arquitectura BLoC: Separación de Responsabilidades
Antes de escribir código, es crucial entender la arquitectura que vamos a implementar. El patrón BLoC promueve una clara separación de responsabilidades, lo que hace que la aplicación sea más fácil de probar, mantener y escalar.
[i] https://bloclibrary.dev/_astro/architecture.DXhmDgKF_Z1jU9hW.webp

[st] UI (Capa de Presentación)
Es la parte visible de la aplicación: lo que el usuario ve e interactúa.

`Responsabilidad`
Renderizar el estado que recibe desde el BLoC.
Notificar eventos de usuario (ejemplo: presionar un botón, introducir texto).

`No debe saber`
No conoce de dónde vienen los datos ni cómo se procesan.

[st] BLoC 
Es el "cerebro" de la funcionalidad. Actúa como intermediario entre la UI y el repositorio.

`Responsabilidad`
Recibir eventos de la UI.
Ejecutar la lógica de negocio (validaciones, reglas, etc.).
Solicitar datos al Repository.
Emitir nuevos estados que la UI usará para renderizarse.

`No debe saber`
No sabe cómo ni desde dónde se obtienen los datos (API, base de datos, caché, etc.).
Solo conoce la interfaz del Repository.

[st] Repository
Es una fachada que abstrae el origen de los datos y expone una API limpia al BLoC. Puede conectarse a múltiples fuentes de datos para obtener la información que expone a BloC

`Responsabilidad`
Centralizar el acceso a datos.
Decidir si los obtiene de la red (Data Provider) o de almacenamiento local (base de datos, caché).
Aplicar transformaciones antes de entregarlos al BLoC.
Ser la fuente única de verdad (SSoT) para la aplicación.

`No debe saber`
No conoce nada de la UI.
No maneja reglas de negocio específicas del BLoC.
Su única tarea es proveer datos confiables.

[st] Data Provider
Es la capa más externa y específica. Aquí ocurre la comunicación cruda con fuentes externas.

`Responsabilidad`
Ejecutar operaciones de bajo nivel:
Peticiones HTTP y manejo de respuestas.
Parseo de JSON.
Acceso a base de datos local.
Exponer APIs simples para operaciones CRUD.

`No debe saber`
No conoce reglas de negocio.
No interactúa con la UI ni con la lógica de presentación
