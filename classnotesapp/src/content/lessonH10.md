[t] Laboratorio 7: Chat App

Lo han contratado porque la empresa Not Too Far ha sabido que usted y su equipo saben de aplicaciones móviles. Su tarea es implementar la funcionalidad de chat en una aplicación existente.

Primero, clónese este repositorio: [link] (AppMóvil252) https://github.com/Domiciano/AppMovil261
[code:ini]
https://github.com/Domiciano/AppMovil261
[endcode]

[st] Modelo de Base de Datos
A continuación se presenta el modelo de base de datos que se utilizará para la funcionalidad de chat. Asegúrese de que estas tablas existan en su base de datos de Supabase.

[i] dblab7.png

Tabla de perfiles (ya debería estar creada)
[code:sql]
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  created_at timestamp with time zone default now()
);
[endcode]

Tabla de conversaciones (entre 2 perfiles)
[code:sql]
create table conversations (
  id uuid primary key default gen_random_uuid(),
  profile1_id uuid references profiles(id) on delete cascade,
  profile2_id uuid references profiles(id) on delete cascade,
  created_at timestamp with time zone default now()
);
[endcode]

Tabla de mensajes
[code:sql]
create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  sender_id uuid references profiles(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default now()
);
[endcode]

[st] Flujos de lista de usuarios
Revise el flujo de la aplicación y desarrolle lo necesario para
[list]
Resolver `getAllProfiles()`
[endlist]
Para poder obtener la lista de usuarios y listarla en la pantalla correspondiente.

[list]
Al dar clic en un usuario, navegar hacia la pantalla de chat correspondiente, verifique cómo sucede la navegación
[endlist]



[st] Flujos del chat

[st] DataSource
Implemente los siguientes métodos en su capa de DataSource para manejar las conversaciones y los mensajes.

[list]
Implementar `findConversation(String profile1Id, String profile2Id)`
[endlist]
Debemos consultar si existe un registro en el que 2 usuarios ya esten conversando. El método devuelve la conversación o nulo si no existe el registro.

[list]
Implementar `createConversation(String profile1Id, String profile2Id)`
[endlist]
Debemos crear un registro de conversación dados 2 ID de dos perfiles. Este registro representa que hay una conversación entre el usuario con `Id1` y el usuario con el `Id2`

[list]
Implementar `sendMessage(String conversationId, String senderId, String content)`
[endlist]
Enviar mensaje a la tabla de messages usando el `conversationId`, `senderId` y `content`. Esto genera nuevos registro para una conversación entre 2 usuarios

[list]
Implementar `getMessagesByConversation(String conversationId)`
[endlist]
Obtener todos los mensajes de una conversación

[list]
Implementar `listenMessagesByConversation(String conversationId)`
[endlist]
Escuchar nuevos mensajes de una conversación especifica. Déjelo para el final

[st] Repository
Implemente los siguientes métodos en su capa de Repository.

[list]
Implementar `findOrCreateConversation(String profile1Id, String profile2Id)`
[endlist]
El método consiste en buscar la conversación entre dos usuarios y de no existir, crearla

[list]
Implementar `sendMessage(String conversationId, String senderId, String content)`
[endlist]
Enviar el mensaje usando el DataSource apropiado

[list]
Implementar `getMessagesByConversation(String conversationId)`
[endlist]
Hacer GET de los mensajes usando el datasource apropiado

[list]
Implementar `listenMessages(String conversationId)`
[endlist]
Escuchar los mensajes en tiempo real. Solo tiene que devolver el `Stream`

[st] BLoC
Resuelva la lógica del BLoC para el chat, manejando los siguientes eventos

[list]
`on<InitializeChatEvent>(_onInitializeChat)` 
[endlist]
Debe cargar los mensajes existentes entre los interlocutores al abrir la pantalla

[list]
`on<SendMessageEvent>(_onSendMessage)`
[endlist]
Debe enviar un nuevo mensaje a la conversación por medio del botón de envío

[list]
`on<ChatNewMessageArriveEvent>(_onMessageArrived)`
[endlist]
Debe manejar la llegada de un nuevo mensaje y actualizar la UI.

Revise los eventos existentes para acomodarlos en la UI y asegurar que el flujo de chat funcione correctamente.