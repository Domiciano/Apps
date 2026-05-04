[t] Laboratorio 7: Chat App

Lo han contratado porque la empresa Not Too Far ha sabido que usted y su equipo saben de aplicaciones móviles. Su tarea es implementar la funcionalidad de chat en una aplicación existente.

Primero, clónese este repositorio: [link] (AppMóvil261) https://github.com/Domiciano/AppMovil261
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
.

