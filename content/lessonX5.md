# Self-hosted Supabase

En esta lección aprenderás a instalar Supabase en modo self-hosted usando Docker Compose. Esto te permitirá tener una instancia local de Supabase con base de datos, autenticación, almacenamiento y la interfaz web Studio.

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

## Acceso a la interfaz web

Puedes ingresar a la interfaz web de Supabase en [(](http://localhost:8000)) http://localhost:8000

Credenciales por defecto

```md
user:supabase
password:this_password_is_insecure_and_should_be_updated
```

Por seguridad, cambia la contraseña en producción.

## Acceso a las APIs

Cada una de las APIs está disponible a través del mismo API gateway:

- REST:     http://`<your-ip>`:`8000` `/rest/v1/`
- Auth:     http://`<your-domain>`:`8000` `/auth/v1/`
- Storage:  http://`<your-domain>`:`8000` `/storage/v1/`
- Realtime: http://`<your-domain>`:`8000` `/realtime/v1/`

Reemplaza `<your-ip>` o `<your-domain>` por la dirección de tu máquina o servidor donde esté corriendo Supabase.
