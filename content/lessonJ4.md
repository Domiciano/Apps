# Laboratorio 8

## Parte 1 — Foto de perfil

Como usuario, quiero poder agregar o cambiar mi foto de perfil para personalizar mi cuenta.

## Tareas

- Crea un bucket en Supabase Storage para almacenar las fotos de perfil.
- Agrega la dependencia `image_picker` al proyecto.
- Implementa la selección de imagen desde la galería o cámara.
- Sube la imagen al bucket de Supabase Storage.
- Guarda la URL de la imagen en la tabla de usuarios.
- Muestra la foto de perfil en la pantalla de perfil.

## Parte 2 — Fotos en el chat

Como usuario, quiero ver la foto de perfil de cada persona junto a sus mensajes en el chat.

## Tareas

- Enriquece la consulta de mensajes para incluir el `avatar_url` del remitente.
- Muestra el avatar del remitente junto a cada burbuja de mensaje.
- Si el usuario no tiene foto, muestra su inicial como fallback.
