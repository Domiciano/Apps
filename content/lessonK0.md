# Notificaciones Push

Permiten que el servidor de una app envíe mensajes importantes a tus usuarios, incluso cuando no están usando activamente la aplicación.

## El Problema: El Gasto de Batería

¿Por qué las apps no reciben mensajes directamente de internet todo el tiempo? Si cada aplicación en tu teléfono mantuviera una conexión abierta esperando mensajes, la batería de tu dispositivo se agotaría en muy poco tiempo. Sería un caos de conexiones ineficientes.

## La Solución: Un Intermediario Confiable

Para solucionar esto, tanto Android como iOS utilizan un sistema centralizado. El sistema operativo (Android o iOS) mantiene una única conexión de bajo consumo con los servidores de Google o Apple. Todas las notificaciones para todas las aplicaciones viajan a través de esta única "tubería" optimizada.

## Los Grandes Jugadores: APN y FCM

Estos intermediarios son los servicios de notificaciones push de Apple y Google.

- APN (Apple Push Notification service): Es el servicio exclusivo y obligatorio de Apple para enviar notificaciones a dispositivos iOS (iPhone, iPad) y macOS. Toda notificación destinada a un producto de Apple debe pasar por aquí.

![Imagen](https://peasi.com/hubfs/Blog/understanding-apns-apple-push-notification-service.png)

- FCM (Firebase Cloud Messaging): Es la solución de Google. Es el sistema estándar para dispositivos Android. Su gran ventaja es que es multiplataforma: también puede gestionar el envío de notificaciones a aplicaciones de iOS y web.

![Imagen](https://miro.medium.com/v2/resize:fit:1400/1*eJKXDpxooNQWafg5PiyVJQ.png)

## Protocolo

Aunque el patrón de funcionamiento es similar a un sistema de publicación y suscripción como MQTT, en la práctica no es exactamente así. Tanto APN como FCM utilizan sus propios protocolos binarios, altamente optimizados y propietarios. El de Apple, por ejemplo, está construido sobre HTTP/2. Estos protocolos están diseñados para ser extremadamente eficientes en redes móviles, minimizando el uso de datos y batería, algo que un protocolo estándar como MQTT no garantizaría de la misma forma.

## El Viaje de una Notificación en 4 Pasos

El flujo de una notificación es bastante sencillo:
1. Un dispositivo se suscribe a un topic
2. El servidor de tu aplicación envía una notificación al servicio de push (APN o FCM).
3. El servicio de push recibe la petición, identifica tu dispositivo y envía el mensaje a través de su canal optimizado.
4. El sistema operativo de tu teléfono recibe el mensaje.
5. Finalmente, el sistema operativo muestra la notificación en tu pantalla y, si es necesario, "despierta" a la aplicación correspondiente para que procese el mensaje.

## El Rol de FCM en el Mundo de Apple

Como se mencionó, puedes usar FCM para enviar notificaciones a usuarios de iOS. En este caso, FCM no reemplaza a APN, sino que actúa como un gestor. Tu servidor solo necesita hablar con FCM, y FCM se encarga de comunicarse con APN para entregar la notificación al dispositivo Apple. Para que esto funcione, es necesario configurar el proyecto de Firebase con las credenciales obtenidas de una cuenta de Apple Developer.

![Imagen](https://miro.medium.com/v2/resize:fit:1400/1*9nTXnD2u-eB-E4HDue9R1A.png)

## Reflexión

Dada la complejidad de configurar las notificaciones para ambas plataformas y para mantener las cosas simples, las siguientes lecciones se centrarán principalmente en la implementación y configuración de notificaciones push para Android a través de Firebase.
