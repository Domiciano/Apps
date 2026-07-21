# El Rol del Backend en las Notificaciones Push

Ya configuramos tanto el cliente de Flutter como el proyecto de Firebase. Ahora, es crucial entender cómo un servidor backend utiliza las credenciales que generamos para enviar notificaciones de forma segura.

## La Clave de Cuenta de Servicio: La Identidad de tu Backend

El archivo `.json` que descargaste en la lección K2 es una Clave de Cuenta de Servicio (`Service Account Key`). Esta clave es, en esencia, el nombre de usuario y la contraseña de tu servidor. Su único propósito es vivir en tu backend (por ejemplo, una aplicación Node.js, Python o Java) y nunca, bajo ninguna circunstancia, debe ser incluida en tu aplicación Flutter.

## ¿Qué es una Cuenta de Servicio?

Una cuenta de servicio es una cuenta especial de Google que no pertenece a un usuario humano, sino a una aplicación o una máquina virtual. Cuando tu backend usa esta clave para autenticarse, le está diciendo a Google: "Hola, soy el servidor autorizado para gestionar el proyecto de Firebase `flutterdomibaas`".

El permiso que le asignamos, `Administrador de Firebase` (`Firebase Admin`), le otorga un control casi total sobre tu proyecto. Puede leer y escribir en tu base de datos, modificar reglas de seguridad y, por supuesto, enviar notificaciones.

## Seguridad Crítica: ¿Por Qué la Clave NO Debe Estar en la App?

Incluir el archivo `.json` en tu aplicación móvil sería un error de seguridad catastrófico. Sería como entregarle las llaves de tu casa a cada persona que pasa por la calle.

- Cualquier persona podría descompilar tu aplicación (APK o IPA) y extraer el archivo de la clave.
- Con esa clave, un atacante tendría control total sobre tu proyecto de Firebase, pudiendo robar datos, borrar información o enviar notificaciones maliciosas a todos tus usuarios.
- Los costos podrían dispararse si el atacante usa tus servicios de Firebase de forma abusiva.

La aplicación Flutter solo necesita el archivo `firebase_options.dart` para identificarse como un cliente legítimo, pero nunca debe tener los permisos de administrador que otorga la clave de servicio.

## Flujo completo

El proceso detallado es el siguiente:
1.  Acción del Usuario: Un usuario en la app móvil realiza una acción que debe disparar una notificación (por ejemplo, enviar un mensaje a otro usuario).
2.  Comunicación con el Backend: La app no intenta enviar la notificación directamente. En su lugar, envía una petición a tu propio servidor backend (por ejemplo, a través de una API REST).
3.  Autenticación del Backend: Tu backend recibe la petición. Usando la clave de la cuenta de servicio (el archivo `.json`), se autentica con los servicios de Google a través del SDK de Firebase Admin.
4.  Publicación del Mensaje: Una vez autenticado, el backend le dice a Firebase Cloud Messaging (FCM): "Por favor, envía este mensaje a este `topic` o a este dispositivo específico".
5.  Entrega de FCM: FCM se encarga de la logística pesada: localiza los dispositivos suscritos y les envía la notificación a través del canal optimizado de Apple (APN) o Google.
6.  Recepción en la App: La aplicación Flutter recibe la notificación y se muestra de acuerdo a lo que se haya programado en la aplicación

## Endpoint clave de FCM

Para enviar una notificación a FCM desde tu backend, realizarías una petición HTTP POST a la API de FCM. La estructura básica de esa petición:

## URL del Endpoint

```http
https://fcm.googleapis.com/v1/projects/YOUR_PROJECT_ID/messages:send
```

Reemplaza `YOUR_PROJECT_ID` con el ID de tu proyecto de Firebase (por ejemplo, `flutterdomibaas`).

## Headers Necesarios

Necesitarás al menos dos headers:

```text
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN
```

El `YOUR_ACCESS_TOKEN` se obtiene después de que tu backend se autentica con la clave de cuenta de servicio. El SDK de Firebase Admin se encarga de generar y refrescar este token automáticamente.

## Body de la Petición (JSON)

Este es el payload que enviarás a FCM. Contiene la información de la notificación y los datos personalizados.

```js
{
    "message": {
        "topic": "mi_topic_general",
        "notification": {
            "title": "Titulo de notificación",
            "body": "Ejemplo de notificación"
        },
        "data": {
            "example": "Notification data"
        },
        "android": {
            "priority": "high"
        }
    }
}
```

- `topic`: El nombre del tema al que deseas enviar la notificación. Los dispositivos deben estar suscritos a este tema.
- `notification`: Contiene el `title` y `body` que se mostrarán al usuario.
- `data`: Un objeto de clave-valor con datos personalizados que tu aplicación puede procesar. No se muestra directamente al usuario.
- `android`: Opciones específicas para Android, como la `priority`.

## Middleware de Reenvío

Este endpoint no se consume desde la aplicación móvil como se dijo, sino que se hace por medio de un middleware que haga el trabajo de recibir la notificación y que se autentique contra Google para finalmente poder enviar el mensaje a FCM.

Puede usar este endpoint de prueba en el que está programado para recibir el mensaje y la clave JSON y hace el reenvío de mensajes a FCM.

Para usarlo, solo necesitas hacer una petición POST a la siguiente URL:

```http
https://i2thub.icesi.edu.co:5443/fcm/messages
```

## Estructura del Body (JSON)

El cuerpo de la petición debe ser un objeto JSON que contenga dos claves principales: `data` (con el mensaje para FCM) y `key` (con el contenido completo de tu clave de cuenta de servicio).

```js
{
    "data": {
        "message": {
            "topic": "mi_topic_general",
            "notification": {
                "title": "Titulo de notificación",
                "body": "Ejemplo de notificación"
            },
            "data": {
                "example": "Notification data"
            },
            "android": {
                "priority": "high"
            }
        }
    },
    "key": {
        "type": "service_account",
        "project_id": "...",
        "private_key_id": "...",
        "private_key": "...",
        "client_email": "...",
        "client_id": "...",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "...",
        "universe_domain": "googleapis.com"
    }
}
```

Si toda la configuración ha sido correcta podrá ver los mensajes en la aplicación, incluso cuando esta no está abierta.
