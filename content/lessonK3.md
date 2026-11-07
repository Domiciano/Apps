# Recibir notificaciones en Flutter

<!-- tags: firebase_messaging, flutter_local_notifications, onMessage, onBackgroundMessage,
     subscribeToTopic, requestPermission, POST_NOTIFICATIONS, canal de notificaciones,
     coreLibraryDesugaring, la notificación no aparece con la app abierta, APNs, iPhone -->

Con la app conectada a Firebase, faltan tres cosas: pedir permiso, suscribirse a un topic y mostrar lo que llega.

## 1. Dependencias

```shell
flutter pub add firebase_core firebase_messaging flutter_local_notifications:^22.3.3
```

`flutter_local_notifications` va fijo en la versión 22: la 23 exige compilar contra Android 17 (API 37), que la plantilla de Flutter todavía no usa.

## 2. Gradle

`flutter_local_notifications` necesita *desugaring*. En `android/app/build.gradle.kts`, agrega la primera línea de `compileOptions` y el bloque `dependencies` al final del archivo:

```kotlin
android {
    compileOptions {
        isCoreLibraryDesugaringEnabled = true
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

dependencies {
    coreLibraryDesugaring("com.android.tools:desugar_jdk_libs:2.1.4")
}
```

## 3. Quién muestra la notificación

```svg
<svg id="pnEstados" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 400" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="pnEstados-ttl pnEstados-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="pnEstados-ttl">Quién muestra la notificación</title>
  <desc id="pnEstados-dsc">Tres columnas. App abierta: llega a onMessage y la muestra flutter_local_notifications, porque Android no muestra nada por su cuenta. App en segundo plano: el sistema muestra la notificación y además corre onBackgroundMessage. App cerrada: igual que en segundo plano.</desc>
  <defs>
    <style>
      #pnEstados .title{fill:#161A26;font-size:22px;font-weight:700}
      #pnEstados .sub{fill:#79809A;font-size:13.5px}
      #pnEstados .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #pnEstados .foot{fill:#79809A;font-size:12px}
      #pnEstados .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #pnEstados .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #pnEstados .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#pnEstados-arrow)}
    </style>
    <marker id="pnEstados-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="400" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Quién muestra la notificación</text>
  <text class="sub" x="48" y="80" data-fit="860">Depende de si la app está abierta. Con la app abierta, Android no la muestra: lo hace tu código.</text>
  <rect x="124" y="110" width="120" height="150" rx="20" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/>
  <rect x="162" y="118" width="44" height="6" rx="3" fill="#2A3040"/>
  <text x="140" y="144" dy="0.35em" font-size="13" font-weight="700" fill="#556074" text-anchor="start" data-fit="92">Abierta</text>
  <path d="M126,160 H242" stroke="#D9DEE8" stroke-width="1.25"/>
  <rect x="138" y="176" width="92" height="64" rx="6" fill="#E8F6E3"/>
  <rect x="132" y="166" width="104" height="22" rx="6" fill="#FFFFFF" stroke="#3A8235" stroke-width="1.5"/>
  <text x="184" y="177" dy="0.35em" font-size="10.5" font-weight="700" fill="#3A8235" text-anchor="middle">Nuevo mensaje</text>
<rect x="48" y="280" width="272" height="44" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="184" y="302" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#7439B8" data-fit="256">onMessage</text>
  <text x="184" y="344" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26" text-anchor="middle">la muestra: flutter_local_notifications</text>
  <text x="184" y="364" dy="0.35em" font-size="12" font-weight="400" fill="#79809A" text-anchor="middle">tu código la muestra</text>
  <rect x="420" y="110" width="120" height="150" rx="20" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/>
  <rect x="458" y="118" width="44" height="6" rx="3" fill="#2A3040"/>
  <text x="436" y="144" dy="0.35em" font-size="13" font-weight="700" fill="#556074" text-anchor="start" data-fit="92">Segundo plano</text>
  <path d="M422,160 H538" stroke="#D9DEE8" stroke-width="1.25"/>
  <rect x="434" y="176" width="92" height="64" rx="6" fill="#EFF1F5"/>
  <rect x="428" y="166" width="104" height="22" rx="6" fill="#FFFFFF" stroke="#A96C05" stroke-width="1.5"/>
  <text x="480" y="177" dy="0.35em" font-size="10.5" font-weight="700" fill="#A96C05" text-anchor="middle">Nuevo mensaje</text>
<rect x="344" y="280" width="272" height="44" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="480" y="302" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#7439B8" data-fit="256">onBackgroundMessage</text>
  <text x="480" y="344" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26" text-anchor="middle">la muestra: el sistema</text>
  <text x="480" y="364" dy="0.35em" font-size="12" font-weight="400" fill="#79809A" text-anchor="middle">se muestra sola</text>
  <rect x="716" y="110" width="120" height="150" rx="20" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/>
  <rect x="754" y="118" width="44" height="6" rx="3" fill="#2A3040"/>
  <text x="732" y="144" dy="0.35em" font-size="13" font-weight="700" fill="#556074" text-anchor="start" data-fit="92">Cerrada</text>
  <path d="M718,160 H834" stroke="#D9DEE8" stroke-width="1.25"/>
  <rect x="730" y="176" width="92" height="64" rx="6" fill="#EFF1F5"/>
  <rect x="724" y="166" width="104" height="22" rx="6" fill="#FFFFFF" stroke="#A96C05" stroke-width="1.5"/>
  <text x="776" y="177" dy="0.35em" font-size="10.5" font-weight="700" fill="#A96C05" text-anchor="middle">Nuevo mensaje</text>
<rect x="640" y="280" width="272" height="44" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text class="mono" x="776" y="302" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#7439B8" data-fit="256">onBackgroundMessage</text>
  <text x="776" y="344" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26" text-anchor="middle">la muestra: el sistema</text>
  <text x="776" y="364" dy="0.35em" font-size="12" font-weight="400" fill="#79809A" text-anchor="middle">se muestra sola</text>
</svg>
```

Con la app cerrada o en segundo plano, Android muestra la notificación solo. Con la app abierta no muestra nada: el mensaje llega a `onMessage` y tu código decide qué hacer. Por eso existe `flutter_local_notifications`.

## 4. PushNotifications

Crea `lib/push/push_notifications.dart`:

```dart
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

/// Asks for permission, subscribes to the topic and shows foreground messages.
class PushNotifications {
  static const topic = 'general';
  static const _channel = AndroidNotificationChannel(
    'general',
    'Notificaciones generales',
    importance: Importance.max,
  );
  static final _local = FlutterLocalNotificationsPlugin();

  static Future<void> init() async {
    final messaging = FirebaseMessaging.instance;
    await messaging.requestPermission();
    await _local.initialize(
      settings: const InitializationSettings(
        android: AndroidInitializationSettings('@mipmap/ic_launcher'),
      ),
    );
    await _local
        .resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin
        >()
        ?.createNotificationChannel(_channel);
    await messaging.subscribeToTopic(topic);
    FirebaseMessaging.onMessage.listen(_show);
  }

  static void _show(RemoteMessage message) {
    final notification = message.notification;
    if (notification == null) return;
    _local.show(
      id: message.hashCode,
      title: notification.title,
      body: notification.body,
      notificationDetails: NotificationDetails(
        android: AndroidNotificationDetails(
          _channel.id,
          _channel.name,
          importance: Importance.max,
          priority: Priority.high,
        ),
      ),
    );
  }
}
```

- `requestPermission` muestra el diálogo de Android 13 o superior. Si el usuario lo rechaza, no llega nada.
- El canal con importancia máxima es el que hace que la notificación aparezca arriba de la pantalla.
- `subscribeToTopic` es la suscripción del viaje de la notificación: el backend enviará al topic `general`.

## 5. main.dart

```dart
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:mi_app/firebase_options.dart';
import 'package:mi_app/push/push_notifications.dart';

@pragma('vm:entry-point')
Future<void> onBackgroundMessage(RemoteMessage message) async {
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  debugPrint('Llegó en segundo plano: ${message.notification?.title}');
}

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  FirebaseMessaging.onBackgroundMessage(onBackgroundMessage);
  await PushNotifications.init();
  runApp(const App());
}
```

`onBackgroundMessage` tiene que ser una función de primer nivel, fuera de cualquier clase, y llevar `@pragma('vm:entry-point')`: sin esa línea, el build de release la elimina y no corre. El orden de `main` importa: Firebase se inicializa antes que todo lo demás.

Para probar, usa un emulador **con Google Play** o un teléfono real. En la siguiente lección envías el primer mensaje.

## ¿Y en iPhone?

```svg
<svg id="pnApple" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 440" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="pnApple-ttl pnApple-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="pnApple-ttl">En iPhone, FCM entrega a través de APNs</title>
  <desc id="pnApple-dsc">Diagrama de arquitectura. El backend envía a FCM. Hacia Android, FCM entrega por su propia capa de transporte. Hacia iPhone, FCM reenvía el mensaje a APNs, el servicio de notificaciones de Apple, que lo entrega al iPhone. Para que FCM pueda hablar con APNs, se sube a Firebase la llave de autenticación de APNs, un archivo .p8 con su Key ID y el Team ID.</desc>
  <defs>
    <style>
      #pnApple .title{fill:#161A26;font-size:22px;font-weight:700}
      #pnApple .sub{fill:#79809A;font-size:13.5px}
      #pnApple .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #pnApple .foot{fill:#79809A;font-size:12px}
      #pnApple .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #pnApple .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #pnApple .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#pnApple-arrow)}
    </style>
    <marker id="pnApple-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="440" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">En iPhone, FCM entrega a través de APNs</text>
  <text class="sub" x="48" y="80" data-fit="860">Tu backend sigue hablando solo con FCM. FCM le pasa el mensaje a APNs, el servicio de Apple.</text>
<rect x="48" y="196" width="170" height="80" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text x="133" y="227" dy="0.35em" text-anchor="middle" font-size="16" font-weight="700" fill="#7439B8" data-fit="154">Backend</text><text x="133" y="246" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="154">tu servidor</text>
<rect x="330" y="196" width="170" height="80" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="415" y="227" dy="0.35em" text-anchor="middle" font-size="16" font-weight="700" fill="#A96C05" data-fit="154">FCM</text><text x="415" y="246" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="154">Firebase</text>
  <path class="link" d="M222,236 L324,236"/>
<rect x="742" y="120" width="170" height="70" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="827" y="146" dy="0.35em" text-anchor="middle" font-size="15" font-weight="700" fill="#3A8235" data-fit="154">Android</text><text x="827" y="165" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="154">teléfono</text>
  <path class="link" d="M504,222 C600,200 640,160 736,155"/>
  <text x="600" y="150" dy="0.35em" font-size="11.5" font-weight="700" fill="#3A8235" text-anchor="end">transporte de Android</text>
<rect x="560" y="280" width="140" height="70" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="630" y="306" dy="0.35em" text-anchor="middle" font-size="15" font-weight="700" fill="#4453C9" data-fit="124">APNs</text><text x="630" y="325" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="124">Apple</text>
<rect x="742" y="280" width="170" height="70" rx="10" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/><text x="827" y="306" dy="0.35em" text-anchor="middle" font-size="15" font-weight="700" fill="#4453C9" data-fit="154">iPhone</text><text x="827" y="325" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" data-fit="154">teléfono</text>
  <path class="link" d="M504,252 C530,280 530,310 554,314"/>
  <path class="link" d="M704,315 L736,315"/>
  <rect x="330" y="306" width="170" height="64" rx="10" fill="#FFFFFF" stroke="#A9B4F2" stroke-width="1.5" stroke-dasharray="5 4"/>
  <text class="mono" x="415" y="326" dy="0.35em" font-size="12" font-weight="700" fill="#4453C9" text-anchor="middle">llave de APNs (.p8)</text>
  <text x="415" y="348" dy="0.35em" font-size="11.5" font-weight="400" fill="#454C61" text-anchor="middle">Key ID · Team ID</text>
  <path d="M415,300 V282" stroke="#4453C9" stroke-width="1.75" stroke-dasharray="3 3"/>
<g transform="translate(48,300)"><rect width="250" height="60" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#556074" data-fit="222">El backend no cambia</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="222">Envía igual que para Android.</text></g>
  <text class="foot" x="48" y="412" data-fit="860">La llave .p8 se crea en la cuenta de Apple Developer y se sube en la consola de Firebase.</text>
</svg>
```

Apple tiene su propio intermediario, **APNs** (Apple Push Notification service), y solo él puede entregar a un iPhone. FCM no lo reemplaza: le reenvía el mensaje. Tu backend sigue enviando a FCM igual que para Android; lo que cambia es la configuración.

1. **Crear la llave de APNs.** En [developer.apple.com](https://developer.apple.com/account), entra a *Certificates, Identifiers & Profiles → Keys*, crea una llave con **Apple Push Notifications service (APNs)** y descarga el `.p8`. Solo se descarga una vez. Anota su *Key ID* y tu *Team ID*, que aparece en *Membership*.
2. **Subirla a Firebase.** En *Configuración del proyecto → Cloud Messaging → Configuración de la app para Apple*, en *Clave de autenticación de APNs*, pulsa **Subir** y pon el `.p8`, el Key ID y el Team ID.
3. **Activar las capacidades en Xcode.** En `ios/Runner.xcworkspace`, target *Runner → Signing & Capabilities*, agrega **Push Notifications** y **Background Modes**, y en este último marca *Background fetch* y *Remote notifications*.
4. **Ajustar el código.** Registra también la app iOS con `flutterfire configure`. En iPhone, `subscribeToTopic` falla si todavía no llegó el token de APNs: antes de suscribirte, espera `await messaging.getAPNSToken()`. Para ver las notificaciones con la app abierta, llama a `messaging.setForegroundNotificationPresentationOptions(alert: true, sound: true)`.

Necesitas una cuenta del Apple Developer Program, y lo más confiable es probar en un iPhone real.
