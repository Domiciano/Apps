# Self-hosted Supabase

<!-- tags: Supabase self-hosted, Docker Compose, docker compose up, Supabase Studio, ANON_KEY, localhost:8000, 10.0.2.2, ENABLE_EMAIL_AUTOCONFIRM, Cleartext HTTP traffic not permitted, Cannot connect to the Docker daemon -->

`Supabase` es una alternativa de código abierto a Firebase: ofrece base de datos Postgres, autenticación, almacenamiento y tiempo real detrás de una sola API. Puedes usarlo en la nube (supabase.com) o instalarlo tú mismo, que es lo que hace esta lección con Docker Compose.

Tener una instancia propia significa que corre en tu máquina o servidor, sin límites de proyectos ni de cuota, y con la interfaz web `Studio` incluida. El resto del curso funciona igual con cualquiera de las dos opciones: solo cambian la URL y la clave con las que se conecta la app.

## Requisitos

- `Git`.
- `Docker Desktop` (o Docker Engine con el plugin `compose`) corriendo. Comprueba con `docker compose version`.

## Pasos para la instalación

```bash
# Clona el repositorio oficial de Supabase
git clone --depth 1 https://github.com/supabase/supabase

# Crea un directorio para tu proyecto Supabase
mkdir supabase-project

# Copia los archivos de Docker al nuevo proyecto
cp -rf supabase/docker/* supabase-project

# Copia las variables de entorno de ejemplo
cp supabase/docker/.env.example supabase-project/.env

# Entra al directorio de tu proyecto
cd supabase-project

# Descarga las imágenes más recientes
docker compose pull

# Inicia los servicios en segundo plano
docker compose up -d
```

La primera vez tarda varios minutos. Verifica que los servicios estén arriba:

```bash
docker compose ps
```

Para detenerlos usa `docker compose down` (los datos se conservan) y para volver a iniciarlos `docker compose up -d`.

## Acceso a la interfaz web

Abre `Studio` en [http://localhost:8000](http://localhost:8000). Credenciales por defecto:

```md
user: supabase
password: this_password_is_insecure_and_should_be_updated
```

Cambia la contraseña (`DASHBOARD_PASSWORD` en el archivo `.env`) antes de exponer la instancia fuera de tu máquina.

## Acceso a las APIs

Cada una de las APIs está disponible a través del mismo API gateway, en el puerto `8000`:

- REST: `http://<host>:8000/rest/v1/`
- Auth: `http://<host>:8000/auth/v1/`
- Storage: `http://<host>:8000/storage/v1/`
- Realtime: `http://<host>:8000/realtime/v1/`

Reemplaza `<host>` por la dirección de la máquina donde corre Supabase.

## Conectar la app Flutter

La app necesita dos datos: la URL del gateway y la clave anónima, que es el valor `ANON_KEY` de tu archivo `.env`. Nunca uses `SERVICE_ROLE_KEY` en la app: da acceso total a la base de datos.

```dart
await Supabase.initialize(
  url: 'http://10.0.2.2:8000',
  anonKey: 'VALOR_DE_ANON_KEY',
);
```

Qué `<host>` usar depende de dónde corre la app:

| App corriendo en | Host |
|---|---|
| Emulador Android | `10.0.2.2` (el `localhost` de tu computador) |
| Simulador de iOS | `localhost` |
| Celular físico | La IP de tu computador en la red local, en la misma red Wi-Fi |

Como la instancia local usa `http` y no `https`, Android bloquea la conexión con el error `Cleartext HTTP traffic not permitted` hasta que agregues `android:usesCleartextTraffic="true"` en la etiqueta `<application>` de `android/app/src/main/AndroidManifest.xml`. En iOS hace falta una excepción equivalente de `App Transport Security`.

## Confirmación de correo

Una instancia nueva no tiene servidor de correo configurado, así que los correos de confirmación de registro nunca llegan. Para el laboratorio, activa la confirmación automática en `.env` y reinicia los servicios:

```bash
ENABLE_EMAIL_AUTOCONFIRM=true
```

```bash
docker compose up -d
```
