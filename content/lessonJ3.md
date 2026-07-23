# Políticas de Seguridad en Supabase Storage

Cuando trabajas con Supabase Storage, no basta con subir archivos. Es crucial definir quién puede acceder a ellos y qué pueden hacer. Esto se gestiona a través de "Policies" (Políticas), que son reglas de seguridad a nivel de base de datos.

## ¿Qué son las Políticas?

Las políticas son conjuntos de reglas SQL que se ejecutan antes de cada operación (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) en tus buckets de Storage. Si no hay una política que permita la acción, la solicitud será denegada.

Por defecto, todos los buckets son privados y ninguna acción está permitida hasta que crees una política. Para crear una, ve a `Storage` -> `Policies` en tu dashboard de Supabase.

## 1. Política para subidas públicas (sin autenticación)

Esta configuración es útil si necesitas que cualquier persona, incluso sin iniciar sesión, pueda subir archivos a un bucket específico. Sigue estos pasos en tu dashboard de Supabase (`Storage` -> `Policies`).

## Configuración paso a paso para permitir subidas sin autenticación

- `Policy name:` Dale un nombre descriptivo, como `Public uploads to bucket alfa`.
- `Allowed operation:` Marca únicamente la casilla `INSERT`.
- `Target roles:` En el menú desplegable, selecciona el rol `public`.
- `Policy definition:` En el editor `WITH CHECK expression`, escribe exactamente: `bucket_id = 'alfa'`

Esto basta para permitir que cualquier persona (sin sesión) pueda hacer `upload()` al bucket `alfa`.

## 2. Políticas para Usuarios Autenticados

Este es el escenario más común y seguro: solo los usuarios que han iniciado sesión en tu app pueden acceder al bucket.

## Configuración para LECTURA de usuarios autenticados

- `Policy name:` `Authenticated read access to alfa`
- `Allowed operation:` Marca `SELECT`.
- `Target roles:` Selecciona `authenticated`.
- `Policy definition (`USING expression`):` `bucket_id = 'alfa'`

Esta regla permite que cualquier usuario logueado pueda leer (descargar/ver) cualquier archivo del bucket `alfa`.

## Configuración para ESCRITURA de usuarios autenticados

- `Policy name:` `Authenticated write access to alfa`
- `Allowed operation:` Marca `INSERT`.
- `Target roles:` Selecciona `authenticated`.
- `Policy definition (`WITH CHECK expression`):` `bucket_id = 'alfa'`

Esta regla permite que cualquier usuario logueado pueda subir archivos al bucket `alfa`.

Puedes combinar estas reglas o hacerlas más específicas. Por ejemplo, podrías crear una política para que un usuario solo pueda ver los archivos que él mismo ha subido, usando una condición como `auth.uid() = owner_id` en la definición de la política.
