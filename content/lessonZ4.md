# Proyecto final

`Transcurso del semestre`

Debe pensar en un problema de su entorno, que pueda ser solucionado a través de una aplicación móvil.

La solución del problema debe consistir en un servicio que se pueda prestar a través de la aplicación móvil, como por ejemplo un servicio de consultoría, de asesoría, de servicios técnicos, de apoyo emocial, de recreación, etc.

Como la aplicación móvil parte de un problema identificado, encuentre la necesidad que está supliendo y decida qué enfoque tendrá su aplicación.

## 1. Modelo Cliente - proveedor

- Número mínimo de roles: 2 roles
- Los clientes son quienes necesitan el servicio ofrecido por la aplicación.
- Los proveedores son quienes pueden ofrecer el servicio.
- Cada uno de los actores debe tener un perfil con paneles distintos que les permita usar funciones principales distintas:
- A. El cliente puede enviar solicitudes de un servicio ofrecido por los proveedores inscritos en la aplicación.
- B. El proveedor puede ver los servicios y atenderlos a través de la interacción con la publicación del cliente. A través de su interfaz puede enviar al solicitante una respuesta.

Por ejemplo, Uber en donde los proveedores serían los dueños de carros dispuestos a ofrecer un servicio de transporte a los usuarios de la plataforma y los clientes son las personas que necesitan el servicio de transporte.
Entonces el cliente solicita ser transportado a través de la aplicación (solicitud) y los proveedores pueden interactuar con la solicitud a través de la aplicación y atender el servicio (respuesta), de modo que tanto el cliente es retroalimentado sobre el resultado de su solicitud.

## 2. Modelo de comunidad

- Número mínimo de roles: 1 rol
- Cada integrante de la comunidad es capaz de realizar mínimo dos acciones principales usando una interfaz común para todos los miembros de la comunidad:
- A. El usuario puede postear, reportar, alertar, generar contenido. Este contenido debe tener algún alcance mínimo de difusión de modo que otros usuarios pueda ver estas publicaciones. La visibilidad o acceso a las publicaciones se define bajo sus propias políticas.
- B. La segunda función es poder ver e interactuar con las publicaciones de los demas usuarios de la comunidad. Al tratarse de una comunidad, estas interacciones deben tener la misma visibilidad que la publicación con la que se interactúa.

Por ejemplo Twitter, donde todos los usuarios pueden tuitear (publicación) y cualquiera ver el tuit e interactuar con él: comentar el tuit, retuitear, darle like. (interacción).

En cualquiera de los dos modelos, las dos funciones principales resumen en:

- A. Hacer una publicación (solicitud, post, reporte, alerta, contenido, etc)
- B. Interactuar con esa publicación (respuesta de la solicitud, interacción con la publicación)

## Requerimientos generales

- A. La idea de aplicación debe resolver un problema identificado en su entorno, por ustedes, mediante un servicio que preste la aplicación.
- B. El sistema puede tener dos roles (cliente y proveedor) o uno sólo (miembro de la comunidad). En ambos casos debe programar distintos procesos teniendo en cuenta que mínimo debe tener 2 funciones principales (publicación e interacción con la publicación).
- C. En el caso de los dos roles debe preparar una única aplicación de modo que al momento de hacer Log In, de acuerdo al rol ingrese a las funciones de cada rol respectivamente. Cada rol tiene a disposición 1 función principal.
- D. En el caso de la comunidad, la aplicación debe verse igual, pero debe poder ofrecerle al usuario dos funciones principales: una de publicación y una de interacción.

## Requerimientos técnicos

- A. Debe usar una base de datos de Google Firebase para almacenar las solicitudes, las respuestas y los usuarios.
- B. La aplicación tiene, como mínimo las siguientes pantallas:
- 1. Splash screen
- 2. Login
- 3. Registro
- Cliente-proveedor: deben haber dos registros, uno para el cliente y otro para el proveedor
- Comunidad: único registro para el usuario
- 4. Resumen del usuario donde debe aparecer su nombre, rol, descripción y calificación.
- 5. Pantalla publicación: donde el cliente puede llamar, postear, reportar, alertar, publicar.
- Cliente-proveedor: es la pantalla donde el usuario puede solicitar un servicio.
- Comunidad: es donde el usuario es capaz de generar una publicación.
- 6. Pantalla de interacción: donde el usaurio puede ver las publicaciones de los demás usaurios (feed de la aplicación) y le permite interactuar con estas publicaciones.
- Cliente-proveedor: le permite ver las solicitudes de un usuario y atenderlas.
- 7. Sistema de notificaciones para avisar a los usuarios mínimos 2 eventos dentro de la aplicación. Por ejemplo: nueva publicación de un usuario de comunidad, nueva solicitud, nueva interacción, nuevo usuario.

Nota: estas vistas pueden componerse de varias actividades o fragmentos, según la complejidad de su propuesta.

Piense en tres ideas preliminares donde haya una justificación, una identificación de roles y el problema que resuelve. Debe presentar estas ideas en el `Pitch Elevator`. La guía de esta exposición se puede ver en esta misma sección de `Asignaciones`

.
