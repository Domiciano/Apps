# Configurando Firebase para Enviar Notificaciones Push

Para que un backend pueda enviar notificaciones a tu app, necesita una autorización segura. Esta guía explica cómo configurar una "Cuenta de Servicio" en Firebase para obtener las credenciales necesarias.

## Requisitos Previos

- Tener un proyecto de Firebase creado.
- Haber conectado tu app de Flutter a Firebase, como se explica en la lección K0.

## Habilitar la API de Cloud Messaging (v1)

Primero, asegúrate de que la API para enviar mensajes esté activa en tu proyecto.

1. Ve a tu proyecto en la [Consola de Firebase](https://console.firebase.google.com/.)
2. Haz clic en el ícono de engranaje (⚙️) junto a "Project Overview" y selecciona Configuración del proyecto.
3. Ve a la pestaña Cloud Messaging.
4. Si la "Firebase Cloud Messaging API (V1)" está desactivada, actívala. Generalmente, Firebase proporciona un enlace directo para hacerlo.

## Crear una Cuenta de Servicio (Service Account)

Una cuenta de servicio actúa como un "usuario robot" que representa a tu backend.
1. En la Configuración del proyecto, ve a la pestaña Cuentas de servicio.
2. Haz clic en el botón Crear cuenta de servicio.
3. Asigna un nombre descriptivo, como `backend-server` o `notifications-admin`.
4. En el campo Rol, busca `Administrador de Firebase` (o `Firebase Admin`). Este rol le da permisos amplios para gestionar tu proyecto.
5. Haz clic en Listo para crear la cuenta.

## Generar la Clave JSON

La clave es un archivo que tu backend usará para autenticarse de forma segura.

1. En Google Cloud Console, entra a la cuenta de servicio que acabas de crear
2. Ve al apartado `Claves`, entra y ve a crear clave
3. Selecciona el tipo de clave JSON y haz clic en CREAR.

El navegador descargará automáticamente un archivo `.json`.

Este archivo contiene credenciales de administrador para tu proyecto de Firebase. Trátalo como una contraseña: guárdalo en un lugar seguro y nunca lo subas a un repositorio público.

Con este archivo JSON, tu backend ahora tiene la autorización para autenticarse con los servidores de Google y enviar notificaciones push a través de FCM a tu aplicación de Flutter.
