# Enviar notificaciones desde el backend

<!-- tags: FCM HTTP v1, messages:send, topic, notification, data, Authorization Bearer,
     FCMNode, Spring Boot, mvnw spring-boot:run, curl, 10.0.2.2, cuenta de servicio,
     enviar mensaje de prueba, campaña de Firebase -->

La app ya está suscrita al topic `general`. Falta que alguien envíe.

## Primera prueba: desde la consola

Antes de escribir un backend, comprueba que la app recibe:

1. En la consola de Firebase, entra a **Messaging** y pulsa **Crear tu primera campaña** → *Mensajes de Firebase Notifications*.
2. Escribe un título y un texto.
3. En *Segmentación*, elige **Tema** y escribe `general`.
4. Pulsa *Revisar* y luego *Publicar*.

Prueba con la app cerrada, en segundo plano y abierta: en los tres casos debe aparecer la notificación.

## Quién envía de verdad

```svg
<svg id="pnBackend" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 380" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="pnBackend-ttl pnBackend-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="pnBackend-ttl">La llave vive en el backend</title>
  <desc id="pnBackend-dsc">De izquierda a derecha: la app hace una petición a tu backend. El backend tiene la llave JSON de la cuenta de servicio, con ella obtiene un token de acceso de Google y hace POST a la API v1 de FCM. FCM entrega a los teléfonos suscritos. Abajo, tachado: la llave dentro de la app, que cualquiera podría extraer del APK.</desc>
  <defs>
    <style>
      #pnBackend .title{fill:#161A26;font-size:22px;font-weight:700}
      #pnBackend .sub{fill:#79809A;font-size:13.5px}
      #pnBackend .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #pnBackend .foot{fill:#79809A;font-size:12px}
      #pnBackend .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #pnBackend .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #pnBackend .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#pnBackend-arrow)}
    </style>
    <marker id="pnBackend-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="380" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">La llave vive en el backend</text>
  <text class="sub" x="48" y="80" data-fit="860">La app le avisa al backend; el backend, con la llave, le pide a FCM que envíe.</text>
<rect x="48" y="140" width="170" height="80" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="133" y="171" dy="0.35em" text-anchor="middle" font-size="16" font-weight="700" fill="#3A8235" data-fit="154">App</text><text x="133" y="190" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="154">pide enviar</text>
<rect x="316" y="140" width="220" height="80" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text x="426" y="171" dy="0.35em" text-anchor="middle" font-size="16" font-weight="700" fill="#7439B8" data-fit="204">Backend</text><text x="426" y="190" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="204">con la llave JSON</text>
<rect x="634" y="140" width="170" height="80" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="719" y="171" dy="0.35em" text-anchor="middle" font-size="16" font-weight="700" fill="#A96C05" data-fit="154">FCM</text><text x="719" y="190" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="154">API v1</text>
  <path class="link" d="M222,180 L310,180"/>
  <text x="266" y="166" dy="0.35em" font-size="11.5" font-weight="400" fill="#79809A" text-anchor="middle">HTTP</text>
  <path class="link" d="M540,180 L628,180"/>
  <text x="584" y="166" dy="0.35em" font-size="11.5" font-weight="400" fill="#79809A" text-anchor="middle">POST + token</text>
  <path class="link" d="M808,180 L836,180"/>
  <text x="842" y="180" dy="0.35em" font-size="12" font-weight="700" fill="#161A26" text-anchor="start">teléfonos</text>
  <rect x="48" y="256" width="420" height="80" rx="10" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/>
  <text x="68" y="280" dy="0.35em" font-size="13.5" font-weight="700" fill="#C2354F" text-anchor="start">✕  Nunca: la llave dentro de la app</text>
  <text x="68" y="304" dy="0.35em" font-size="12.5" font-weight="400" fill="#454C61" text-anchor="start">Cualquiera la extrae del APK y controla tu proyecto.</text>
<g transform="translate(492,256)"><rect width="420" height="60" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#7439B8" data-fit="392">En el curso</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="392">FCMNode, en Spring Boot, corre en tu computador.</text></g>
</svg>
```

En una app real, la notificación la dispara algo que pasa, como un mensaje nuevo en el chat. La app le avisa a tu backend, y el backend, con la llave de *La llave del backend*, le pide a FCM que envíe. La llave nunca va en la app.

## La petición a FCM

El backend hace un `POST` a la API v1 de FCM:

```http
POST https://fcm.googleapis.com/v1/projects/TU_PROYECTO/messages:send
Content-Type: application/json
Authorization: Bearer TOKEN_DE_ACCESO
```

El token de acceso lo saca el backend de la llave JSON. El SDK de Firebase Admin lo hace solo, en Node.js, Python o Java. El cuerpo:

```json
{
  "message": {
    "topic": "general",
    "notification": {
      "title": "Nuevo mensaje",
      "body": "Ana: ¿Vienes a clase?"
    },
    "data": {
      "chatId": "42"
    },
    "android": {
      "priority": "high"
    }
  }
}
```

- `topic`: a quién va. Llega a todos los suscritos a `general`.
- `notification`: el título y el texto que se ven.
- `data`: datos para la app, que no se muestran. Sirven, por ejemplo, para abrir el chat correcto.
- `android.priority`: `high` la entrega de inmediato, aunque el teléfono esté en reposo.

## Tu backend en localhost

[FCMNode](https://github.com/Domiciano/FCMNode) es un backend mínimo en Spring Boot que hace exactamente eso: recibe el mensaje, saca el token con la llave y se lo pasa a FCM. Necesitas el JDK 17 o superior; compruébalo con `java -version`.

1. Clónalo:

```shell
git clone https://github.com/Domiciano/FCMNode
cd FCMNode
```

2. Copia la llave que descargaste en *La llave del backend* a la raíz de `FCMNode` y renómbrala `fcm-key.json`. Ya está en el `.gitignore`.

3. Arráncalo. No hace falta instalar Maven: el proyecto trae `mvnw`.

```shell
./mvnw spring-boot:run
```

En Windows, el comando es `mvnw.cmd spring-boot:run`. Cuando aparezca `Started FcmNodeApplication`, el servidor está en `http://localhost:8080/fcm/messages`.

4. Guarda el cuerpo de la sección anterior en `mensaje.json` y envíalo desde otra terminal:

```shell
curl -X POST http://localhost:8080/fcm/messages \
  -H "Content-Type: application/json" \
  -d @mensaje.json
```

En PowerShell, usa `curl.exe` en una sola línea y pon `"@mensaje.json"` entre comillas. También sirve Postman.

Si todo está bien, responde `200` con el nombre del mensaje y la notificación llega al teléfono, aunque la app esté cerrada. Si falta la llave, el servidor responde `500` y dice en qué carpeta la buscó.

Cuando sea la app la que pida enviar, desde el emulador de Android tu computador es `10.0.2.2`: la URL es `http://10.0.2.2:8080/fcm/messages`.
