# Laboratorio 8 · Chat en tiempo real

<!-- tags: ChatBloc, listen en el Bloc, WatchMessagesUseCase, fetchBefore, OlderMessagesRequested,
     conversation_id, isMine, juntar por id, chat-images, createSignedUrl, asyncMap,
     el mensaje no aparece en tiempo real -->

El muro del Laboratorio 7 tiene ahora un botón de chat. Lleva a la lista de usuarios registrados, tú incluido, y al elegir uno chateas solo con esa persona. La lista, la tabla `conversations` y toda la interfaz ya están hechas. Te toca conectar las capas del chat, en tres partes:

- **Parte 1 · Chat sencillo en tiempo real.** Los mensajes llegan por un `Stream`. Los tuyos a la derecha, los de los demás a la izquierda.
- **Parte 2 · Paginación.** El Stream solo trae los 15 más nuevos. Al llegar arriba, se piden los 5 anteriores con un `Future`.
- **Parte 3 · Mensajes con imagen.** Cada mensaje puede llevar una sola foto, opcional, en un bucket privado.

La regla de todo el laboratorio: **las capas retornan el Stream, y solo `ChatBloc` hace `listen`**.

## Lo que vas a construir

```svg
<svg id="rtLabPantalla" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 600" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="rtLabPantalla-ttl rtLabPantalla-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="rtLabPantalla-ttl">Lo que vas a construir</title>
  <desc id="rtLabPantalla-dsc">Dos teléfonos con la pantalla del chat, uno con la cuenta de Ana y otro con la tuya, mostrando la misma conversación, la que tienen solo ustedes dos. En el de Ana, sus mensajes van a la derecha en verde y los tuyos a la izquierda en blanco. En el tuyo, al revés. Uno de los mensajes trae una foto. Abajo de cada teléfono, la barra para escribir, con el botón de foto y el de enviar. A los lados, notas: al llegar arriba se piden los cinco anteriores, y al llegar un mensaje nuevo la lista baja sola.</desc>
  <defs>
    <style>
      #rtLabPantalla .title{fill:#161A26;font-size:22px;font-weight:700}
      #rtLabPantalla .sub{fill:#79809A;font-size:13.5px}
      #rtLabPantalla .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #rtLabPantalla .foot{fill:#79809A;font-size:12px}
      #rtLabPantalla .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #rtLabPantalla .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #rtLabPantalla .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#rtLabPantalla-arrow)}
      #rtLabPantalla .ar-violet{fill:none;stroke:#7439B8;stroke-width:1.75;marker-end:url(#rtLabPantalla-ar-violet)}
      #rtLabPantalla .ar-amber{fill:none;stroke:#A96C05;stroke-width:1.75;marker-end:url(#rtLabPantalla-ar-amber)}
    </style>
    <marker id="rtLabPantalla-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="rtLabPantalla-ar-violet" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#7439B8"/></marker>
    <marker id="rtLabPantalla-ar-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#A96C05"/></marker>
  </defs>
  <rect width="960" height="600" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Lo que vas a construir</text>
  <text class="sub" x="48" y="80" data-fit="860">Una conversación entre dos personas, vista desde las dos cuentas. Lo de cada quien va a la derecha.</text>
<rect x="292" y="112" width="196" height="420" rx="18" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/><text x="308" y="136" dy="0.35em" font-size="14" font-weight="600" fill="#161A26">Chat · Ana</text><path d="M294,154 H486" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="352" y="168" width="124" height="30" rx="12" fill="#1F9D68"/>
  <text x="362" y="183" dy="0.35em" font-size="11.5" fill="#FFFFFF" data-fit="104">hola</text>
  <rect x="304" y="208" width="124" height="30" rx="12" fill="#FFFFFF" stroke="#DDE1E8" stroke-width="1.25"/>
  <text x="314" y="223" dy="0.35em" font-size="11.5" fill="#161A26" data-fit="104">¡hola! ¿cómo vas?</text>
  <rect x="352" y="248" width="124" height="94" rx="12" fill="#1F9D68"/>
  <rect x="358" y="254" width="112" height="58" rx="8" fill="#FFE3CC" stroke="#C2571A" stroke-width="1.25"/><path d="M368,304 L392,278 L410,296 L422,286 L460,304 Z" fill="#C2571A" opacity=".55"/>
  <text x="362" y="327" dy="0.35em" font-size="11.5" fill="#FFFFFF" data-fit="104">mira el tablero</text>
  <rect x="304" y="352" width="124" height="30" rx="12" fill="#FFFFFF" stroke="#DDE1E8" stroke-width="1.25"/>
  <text x="314" y="367" dy="0.35em" font-size="11.5" fill="#161A26" data-fit="104">jaja, listo</text>
  <path d="M294,482 H486" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="330" y="492" width="116" height="28" rx="14" fill="#F7F8FA" stroke="#DDE1E8" stroke-width="1.25"/>
  <text x="340" y="506" dy="0.35em" text-anchor="start" font-size="10" font-weight="400" fill="#79809A" data-fit="100">Escribe un mensaje</text>
  <rect x="304" y="496" width="20" height="20" rx="4" fill="none" stroke="#556074" stroke-width="1.75"/>
  <circle cx="466" cy="506" r="14" fill="#1F9D68"/><path d="M460,500 L474,506 L460,512 Z" fill="#FFFFFF"/>
<rect x="522" y="112" width="196" height="420" rx="18" fill="#FFFFFF" stroke="#2A3040" stroke-width="3"/><text x="538" y="136" dy="0.35em" font-size="14" font-weight="600" fill="#161A26">Chat · tú</text><path d="M524,154 H716" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="534" y="168" width="124" height="30" rx="12" fill="#FFFFFF" stroke="#DDE1E8" stroke-width="1.25"/>
  <text x="544" y="183" dy="0.35em" font-size="11.5" fill="#161A26" data-fit="104">hola</text>
  <rect x="582" y="208" width="124" height="30" rx="12" fill="#1F9D68"/>
  <text x="592" y="223" dy="0.35em" font-size="11.5" fill="#FFFFFF" data-fit="104">¡hola! ¿cómo vas?</text>
  <rect x="534" y="248" width="124" height="94" rx="12" fill="#FFFFFF" stroke="#DDE1E8" stroke-width="1.25"/>
  <rect x="540" y="254" width="112" height="58" rx="8" fill="#FFE3CC" stroke="#C2571A" stroke-width="1.25"/><path d="M550,304 L574,278 L592,296 L604,286 L642,304 Z" fill="#C2571A" opacity=".55"/>
  <text x="544" y="327" dy="0.35em" font-size="11.5" fill="#161A26" data-fit="104">mira el tablero</text>
  <rect x="582" y="352" width="124" height="30" rx="12" fill="#1F9D68"/>
  <text x="592" y="367" dy="0.35em" font-size="11.5" fill="#FFFFFF" data-fit="104">jaja, listo</text>
  <path d="M524,482 H716" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="560" y="492" width="116" height="28" rx="14" fill="#F7F8FA" stroke="#DDE1E8" stroke-width="1.25"/>
  <text x="570" y="506" dy="0.35em" text-anchor="start" font-size="10" font-weight="400" fill="#79809A" data-fit="100">Escribe un mensaje</text>
  <rect x="534" y="496" width="20" height="20" rx="4" fill="none" stroke="#556074" stroke-width="1.75"/>
  <circle cx="696" cy="506" r="14" fill="#1F9D68"/><path d="M690,500 L704,506 L690,512 Z" fill="#FFFFFF"/>
<g transform="translate(48,128)"><rect width="214" height="94" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="186">Al llegar arriba</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="186">OlderMessagesRequested:</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="186">los 5 anteriores, por Future.</text><text x="14" y="77" font-size="12.5" fill="#454C61" data-fit="186">Parte 2.</text></g>
  <path class="ar-amber" d="M262,160 C278,160 280,176 296,176"/>
<g transform="translate(48,300)"><rect width="214" height="94" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#7439B8" data-fit="186">La foto</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="186">Una sola por mensaje y</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="186">opcional. Bucket privado.</text><text x="14" y="77" font-size="12.5" fill="#454C61" data-fit="186">Parte 3.</text></g>
  <path class="ar-violet" d="M262,330 C320,330 330,300 350,296"/>
<g transform="translate(742,128)"><rect width="170" height="77" rx="10" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#3A8235" data-fit="142">Lo mío</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="142">isMine: a la derecha,</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="142">en verde.</text></g>
<g transform="translate(742,300)"><rect width="170" height="94" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#556074" data-fit="142">Mensaje nuevo</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="142">La lista baja sola</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="142">hasta el final.</text><text x="14" y="77" font-size="12.5" fill="#454C61" data-fit="142">Ya viene hecho.</text></g>
  <text class="foot" x="48" y="572" data-fit="860">Nadie agrega su mensaje a la lista al enviarlo: aparece porque el stream lo trae, en los dos teléfonos.</text>
</svg>
```

## Preparación

El punto de partida es [github.com/Domiciano/262App5](https://github.com/Domiciano/262App5): el Laboratorio 7 resuelto, más la feature `chat`.

```shell
git clone https://github.com/Domiciano/262App5
cd 262App5
flutter pub get
```

1. Pon en `lib/main.dart` la `Project URL` y la `publishable key` de tu proyecto, el mismo de los laboratorios anteriores.
2. Conéctate a tu proyecto y trae las migraciones anteriores, como en *Supabase Realtime*. `login` solo hace falta si nunca lo corriste en este computador:

```shell
npx supabase login
npx supabase init
npx supabase link --project-ref TU_IDENTIFICADOR
npx supabase migration fetch --linked
```

3. Crea las tablas `conversations` y `messages`, y agrega `messages` a la publicación de Realtime. El comando crea un archivo vacío en `supabase/migrations/`, y en él va el SQL:

```shell
npx supabase migration new create_chat
```

```sql
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  user1_id uuid not null references public.profiles(id) on delete cascade,
  user2_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user1_id, user2_id),
  check (user1_id <= user2_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null
    references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  content text not null default '',
  image_path text,
  created_at timestamptz not null default now()
);

grant select, insert on public.conversations to authenticated;
grant select, insert on public.messages to authenticated;

alter publication supabase_realtime add table public.messages;
```

Una conversación guarda a sus dos participantes, con el id menor en `user1_id`: así, entre dos personas solo puede haber una fila. Si eliges tu propio usuario, los dos ids son el tuyo.

```shell
npx supabase db push
```

Para probar necesitas **dos cuentas abiertas a la vez**: por ejemplo, una en Chrome con `flutter run -d chrome` y otra en el emulador o en tu teléfono.

## Lo que ya viene

```svg
<svg id="rtLabCarpetas" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 754" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="rtLabCarpetas-ttl rtLabCarpetas-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="rtLabCarpetas-ttl">La estructura de carpetas</title>
  <desc id="rtLabCarpetas-dsc">Árbol de carpetas del proyecto 262App5. La feature conversations ya viene completa: la lista de usuarios y la tabla conversations. En la feature chat ya vienen la entidad Message, el contrato MessageRepository, los eventos, el estado, ChatScreen y los componentes. Te tocan los cuatro casos de uso, los dos data sources, MessageRepositoryImpl y ChatBloc, marcados con la parte del laboratorio en que se completan: 1 el chat en tiempo real, 2 la paginación y 3 la imagen.</desc>
  <defs>
    <style>
      #rtLabCarpetas .title{fill:#161A26;font-size:22px;font-weight:700}
      #rtLabCarpetas .sub{fill:#79809A;font-size:13.5px}
      #rtLabCarpetas .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #rtLabCarpetas .foot{fill:#79809A;font-size:12px}
      #rtLabCarpetas .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #rtLabCarpetas .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #rtLabCarpetas .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#rtLabCarpetas-arrow)}
    </style>
    <marker id="rtLabCarpetas-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="754" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">La estructura de carpetas</text>
  <text class="sub" x="48" y="80" data-fit="860">En gris lo que ya viene hecho. Con número, la parte del laboratorio en la que lo completas.</text>
  <rect x="48" y="96" width="864" height="598" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <rect x="68" y="111" width="222" height="26" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="78" y="124" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="208">lib/features/conversations/</text>
  <text x="568" y="124" dy="0.35em" font-size="13" fill="#454C61" data-fit="250">Ya viene: usuarios y conversaciones</text>
  <rect x="68" y="145" width="155" height="26" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="78" y="158" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="141">lib/features/chat/</text>
  <path d="M78,171 V192 H89" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="92" y="179" width="230" height="26" rx="4" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="102" y="192" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="216">domain/entities/message.dart</text>
  <text x="568" y="192" dy="0.35em" font-size="13" fill="#454C61" data-fit="250">Ya viene: isMine, imagePath, imageUrl</text>
  <path d="M78,171 V226 H89" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="92" y="213" width="328" height="26" rx="4" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="102" y="226" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="314">domain/repository/message_repository.dart</text>
  <text x="568" y="226" dy="0.35em" font-size="13" fill="#454C61" data-fit="250">Ya viene: el contrato completo</text>
  <path d="M78,171 V260 H89" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="92" y="247" width="140" height="26" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="102" y="260" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="126">domain/usecases/</text>
  <path d="M102,273 V294 H113" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="116" y="281" width="222" height="26" rx="4" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>
  <text class="mono" x="126" y="294" dy="0.35em" font-size="12.5" font-weight="600" fill="#A96C05" data-fit="208">watch_messages_usecase.dart</text>
  <text x="568" y="294" dy="0.35em" font-size="13" fill="#454C61" data-fit="250">call · retorna el Stream</text>
  <rect x="847.0" y="283" width="53" height="22" rx="11" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/><text x="874" y="294" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#A96C05">1 · 3</text>
  <path d="M102,273 V328 H113" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="116" y="315" width="208" height="26" rx="4" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>
  <text class="mono" x="126" y="328" dy="0.35em" font-size="12.5" font-weight="600" fill="#A96C05" data-fit="194">send_message_usecase.dart</text>
  <text x="568" y="328" dy="0.35em" font-size="13" fill="#454C61" data-fit="250">call · inserta</text>
  <rect x="847.0" y="317" width="53" height="22" rx="11" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/><text x="874" y="328" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#A96C05">1 · 3</text>
  <path d="M102,273 V362 H113" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="116" y="349" width="260" height="26" rx="4" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>
  <text class="mono" x="126" y="362" dy="0.35em" font-size="12.5" font-weight="600" fill="#A96C05" data-fit="246">load_older_messages_usecase.dart</text>
  <text x="568" y="362" dy="0.35em" font-size="13" fill="#454C61" data-fit="250">call · Future</text>
  <rect x="847.0" y="351" width="53" height="22" rx="11" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/><text x="874" y="362" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#A96C05">2 · 3</text>
  <path d="M102,273 V396 H113" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="116" y="383" width="230" height="26" rx="4" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>
  <text class="mono" x="126" y="396" dy="0.35em" font-size="12.5" font-weight="600" fill="#A96C05" data-fit="216">pick_chat_image_usecase.dart</text>
  <text x="568" y="396" dy="0.35em" font-size="13" fill="#454C61" data-fit="250">call · abre la galería</text>
  <circle cx="886" cy="396" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="886" y="396" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">3</text>
  <path d="M78,171 V430 H89" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="92" y="417" width="110" height="26" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="102" y="430" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="96">data/source/</text>
  <path d="M102,443 V464 H113" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="116" y="451" width="268" height="26" rx="4" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="126" y="464" dy="0.35em" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="254">supabase_message_data_source.dart</text>
  <text x="568" y="464" dy="0.35em" font-size="13" fill="#454C61" data-fit="250">watchLatest, send, fetchBefore</text>
  <rect x="847.0" y="453" width="53" height="22" rx="11" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/><text x="874" y="464" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#A96C05">1 · 2</text>
  <path d="M102,443 V498 H113" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="116" y="485" width="290" height="26" rx="4" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="126" y="498" dy="0.35em" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="276">supabase_chat_image_data_source.dart</text>
  <text x="568" y="498" dy="0.35em" font-size="13" fill="#454C61" data-fit="250">upload, signedUrl</text>
  <circle cx="886" cy="498" r="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/><text x="886" y="498" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">3</text>
  <path d="M78,171 V532 H89" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="92" y="519" width="350" height="26" rx="4" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="102" y="532" dy="0.35em" font-size="12.5" font-weight="600" fill="#0F8478" data-fit="336">data/repository/message_repository_impl.dart</text>
  <text x="568" y="532" dy="0.35em" font-size="13" fill="#454C61" data-fit="250">los seis métodos, delegando</text>
  <rect x="817.4" y="521" width="83" height="22" rx="11" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/><text x="859" y="532" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#A96C05">1 · 2 · 3</text>
  <path d="M78,171 V566 H89" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="92" y="553" width="328" height="26" rx="4" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="102" y="566" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="314">ui/bloc/chat_event.dart · chat_state.dart</text>
  <text x="568" y="566" dy="0.35em" font-size="13" fill="#454C61" data-fit="250">Ya vienen: eventos y ChatState</text>
  <path d="M78,171 V600 H89" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="92" y="587" width="185" height="26" rx="4" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5"/>
  <text class="mono" x="102" y="600" dy="0.35em" font-size="12.5" font-weight="600" fill="#4453C9" data-fit="171">ui/bloc/chat_bloc.dart</text>
  <text x="568" y="600" dy="0.35em" font-size="13" fill="#454C61" data-fit="250">trae la Conversation; los on imprimen</text>
  <rect x="817.4" y="589" width="83" height="22" rx="11" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/><text x="859" y="600" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#A96C05">1 · 2 · 3</text>
  <path d="M78,171 V634 H89" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="92" y="621" width="222" height="26" rx="4" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="102" y="634" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="208">ui/screens/chat_screen.dart</text>
  <text x="568" y="634" dy="0.35em" font-size="13" fill="#454C61" data-fit="250">Ya viene: lista, scroll y SnackBar</text>
  <path d="M78,171 V668 H89" fill="none" stroke="#C4CBD8" stroke-width="1.5"/>
  <rect x="92" y="655" width="125" height="26" rx="8" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>
  <text class="mono" x="102" y="668" dy="0.35em" font-size="12.5" font-weight="600" fill="#556074" data-fit="111">ui/components/</text>
  <text x="568" y="668" dy="0.35em" font-size="13" fill="#454C61" data-fit="250">Ya vienen: burbuja y composer</text>
  <text class="h" x="898" y="88" text-anchor="end">PARTE</text>
  <text class="foot" x="48" y="726" data-fit="860">main.dart e injection_container.dart ya registran todo: no hay que tocarlos.</text>
</svg>
```

- **La lista de usuarios y las conversaciones.** La feature `conversations` está completa. `ContactsScreen` lista los perfiles, tú primero. Al tocar uno, `OpenConversationUseCase` busca la fila de `conversations` de esa pareja, la crea si no existe y abre el chat con ella.
- **El chat sabe con quién hablas.** `ChatBloc` recibe la `Conversation` en su constructor y la guarda en el campo `conversation`. En cada capa, los métodos ya reciben el `conversationId`.
- **Toda la interfaz.** `ChatScreen` con la lista al revés (el más nuevo abajo), `MessageBubble` y `MessageComposer`. Enviar, llegar arriba y el botón de foto ya lanzan su evento. Cuando cambia el mensaje más nuevo, la lista baja sola.
- **La entidad y el contrato.** `Message` con `isMine`, y `imagePath` e `imageUrl` opcionales. `MessageRepository` ya declara los seis métodos.
- **Los eventos y el estado.** `ChatStarted`, `MessagesUpdated`, `ChatStreamFailed`, `MessageSent`, `OlderMessagesRequested`, `ChatPhotoRequested`, `ChatPhotoRemoved` y `ChatState` con su `copyWith`.
- **Los métodos vacíos.** Cada método de cada capa ya tiene su firma y un `throw UnimplementedError()`. Los `on` de `ChatBloc` solo imprimen el evento.

Abre el chat desde el muro, elige a alguien, escribe algo y sube hasta el tope de la lista. En la consola verás:

```text
ChatBloc recibió ChatStarted()
ChatBloc recibió MessageSent(Hola)
```

`OlderMessagesRequested()` aparecerá cuando haya mensajes suficientes para hacer scroll. Lo vas a usar en la parte 2.

## Parte 1 · Chat sencillo en tiempo real

Del paso 1 al 4. Al terminar, dos cuentas conversan y cada mensaje aparece en las dos pantallas. Todo se hace sobre **una conversación**: cada consulta filtra por `conversation_id`.

## Paso 1 · El data source

`chat/data/source/supabase_message_data_source.dart` es el único archivo que toca la tabla `messages`. Agrega los campos y el mapeo de una fila a `Message`:

```dart
final SupabaseClient _client = Supabase.instance.client;

String get _uid {
  return _client.auth.currentUser!.id;
}

Message _toMessage(Map<String, dynamic> row) {
  return Message(
    id: row['id'] as String,
    content: row['content'] as String,
    createdAt: DateTime.parse(row['created_at'] as String),
    isMine: row['sender_id'] == _uid,
    imagePath: row['image_path'] as String?,
  );
}
```

`isMine` se decide aquí, comparando el autor con quien inició sesión. La vista solo lo lee.

`watchLatest` crea el Stream de una conversación y lo **retorna**, sin `async` y sin `await`:

```dart
Stream<List<Message>> watchLatest(
  String conversationId, {
  required int limit,
}) {
  return _client
      .from(table)
      .stream(primaryKey: ['id'])
      .eq('conversation_id', conversationId)
      .order('created_at', ascending: false)
      .limit(limit)
      .map((rows) => rows.map(_toMessage).toList());
}
```

Con `.eq`, Realtime solo te manda las filas de esa conversación: los mensajes de otras parejas no llegan.

`send` es un `insert` normal, un `Future`:

```dart
Future<void> send(
  String conversationId,
  String content, {
  String? imagePath,
}) async {
  try {
    await _client.from(table).insert({
      'conversation_id': conversationId,
      'sender_id': _uid,
      'content': content,
    });
  } on PostgrestException catch (e) {
    throw Exception(e.message);
  }
}
```

## Paso 2 · El repositorio

`chat/data/repository/message_repository_impl.dart` toma el data source de GetIt y delega, con `return`:

```dart
final SupabaseMessageDataSource _messages = sl();

@override
Stream<List<Message>> watchLatest(
  String conversationId, {
  required int limit,
}) {
  return _messages.watchLatest(conversationId, limit: limit);
}
```

`send` queda igual de corto. Los demás métodos se quedan con su `UnimplementedError` hasta la parte que los usa.

## Paso 3 · Los casos de uso

`WatchMessagesUseCase` retorna el Stream que le da el repositorio:

```dart
final MessageRepository _messages = sl();

Stream<List<Message>> call(String conversationId, {required int limit}) {
  return _messages.watchLatest(conversationId, limit: limit);
}
```

`SendMessageUseCase` limpia el texto y no envía mensajes vacíos:

```dart
final MessageRepository _messages = sl();

Future<void> call(
  String conversationId,
  String content, {
  PickedPhoto? photo,
}) async {
  final text = content.trim();
  if (text.isEmpty) return;
  await _messages.send(conversationId, text);
}
```

## Paso 4 · ChatBloc

Aquí, y solo aquí, se hace `listen`. El Bloc ya tiene el campo `conversation`, que le pasa la ruta al abrir el chat. Agrega los casos de uso y el campo de la suscripción:

```dart
final WatchMessagesUseCase _watchMessages = sl();
final SendMessageUseCase _sendMessage = sl();

StreamSubscription<List<Message>>? _subscription;

String _message(Object error) {
  return error.toString().replaceFirst('Exception: ', '');
}
```

`ChatStarted` se suscribe. La función de `listen` no emite: lanza `MessagesUpdated`.

```dart
Future<void> _onStarted(ChatStarted event, Emitter<ChatState> emit) async {
  emit(state.copyWith(status: ChatStatus.loading));
  await _subscription?.cancel();
  _subscription = _watchMessages(conversation.id, limit: liveSize).listen(
    (messages) => add(MessagesUpdated(messages)),
    onError: (Object error) => add(ChatStreamFailed(_message(error))),
  );
}

void _onMessagesUpdated(MessagesUpdated event, Emitter<ChatState> emit) {
  emit(state.copyWith(
    status: ChatStatus.success,
    messages: event.messages,
  ));
}

void _onStreamFailed(ChatStreamFailed event, Emitter<ChatState> emit) {
  emit(state.copyWith(
    status: ChatStatus.failure,
    errorMessage: event.message,
  ));
}
```

`MessageSent` solo inserta. El mensaje **no** se agrega a la lista: va a llegar por el Stream.

```dart
Future<void> _onMessageSent(
  MessageSent event,
  Emitter<ChatState> emit,
) async {
  if (state.isSending) return;
  emit(state.copyWith(isSending: true));
  try {
    await _sendMessage(conversation.id, event.content);
    emit(state.copyWith(isSending: false));
  } on Exception catch (e) {
    emit(state.copyWith(isSending: false, errorMessage: _message(e)));
  }
}
```

Y al cerrarse, el Bloc cancela lo que abrió:

```dart
@override
Future<void> close() async {
  await _subscription?.cancel();
  return super.close();
}
```

## La prueba de la parte 1

Con las dos cuentas abiertas, cada una elige a la otra en la lista y escribe. Cada mensaje aparece en las dos pantallas, a la derecha en la de quien lo envió. Escribe unos 20 mensajes y sube hasta el tope: solo hay 15, y la consola imprime `ChatBloc recibió OlderMessagesRequested()`. Eso es lo que resuelve la parte 2. Si abres el chat con un tercer usuario, o contigo, la conversación empieza vacía: cada pareja tiene la suya.

## Parte 2 · Paginación

```svg
<svg id="rtLabVentana" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 600" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="rtLabVentana-ttl rtLabVentana-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="rtLabVentana-ttl">Una ventana en vivo y páginas hacia atrás</title>
  <desc id="rtLabVentana-dsc">A la izquierda, la lista del chat de arriba abajo: dos páginas de cinco mensajes en ámbar, que llegaron por Future al llegar arriba, y debajo quince en verde azulado, que trae el stream. Una flecha arriba dice OlderMessagesRequested y fetchBefore con el más viejo y limit 5. A la derecha, dos columnas comparan qué pasa cuando llega un mensaje nuevo: si MessagesUpdated reemplaza la lista, las páginas viejas desaparecen; si junta por id, se quedan.</desc>
  <defs>
    <style>
      #rtLabVentana .title{fill:#161A26;font-size:22px;font-weight:700}
      #rtLabVentana .sub{fill:#79809A;font-size:13.5px}
      #rtLabVentana .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #rtLabVentana .foot{fill:#79809A;font-size:12px}
      #rtLabVentana .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #rtLabVentana .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #rtLabVentana .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#rtLabVentana-arrow)}
      #rtLabVentana .ar-amber{fill:none;stroke:#A96C05;stroke-width:1.75;marker-end:url(#rtLabVentana-ar-amber)}
      #rtLabVentana .ar-teal{fill:none;stroke:#0F8478;stroke-width:1.75;marker-end:url(#rtLabVentana-ar-teal)}
    </style>
    <marker id="rtLabVentana-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="rtLabVentana-ar-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#A96C05"/></marker>
    <marker id="rtLabVentana-ar-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#0F8478"/></marker>
  </defs>
  <rect width="960" height="600" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Una ventana en vivo y páginas hacia atrás</text>
  <text class="sub" x="48" y="80" data-fit="860">El stream cuida los 15 más nuevos. Lo anterior llega por Future, de 5 en 5, y se queda en el mismo estado.</text>
  <text class="mono" x="230.0" y="124" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#161A26">ChatState.messages</text>
  <rect x="120" y="144" width="220" height="18" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <rect x="120" y="166" width="220" height="18" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <rect x="120" y="188" width="220" height="18" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text x="230.0" y="175.0" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#A96C05" data-fit="208">página 2 · Future</text>
  <rect x="120" y="216" width="220" height="18" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <rect x="120" y="238" width="220" height="18" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <rect x="120" y="260" width="220" height="18" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <rect x="120" y="282" width="220" height="18" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <rect x="120" y="304" width="220" height="18" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text x="230.0" y="269.0" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#A96C05" data-fit="208">página 1 · Future · 5</text>
  <rect x="120" y="332" width="220" height="18" rx="6" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <rect x="120" y="354" width="220" height="18" rx="6" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <rect x="120" y="376" width="220" height="18" rx="6" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <rect x="120" y="398" width="220" height="18" rx="6" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <rect x="120" y="420" width="220" height="18" rx="6" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <rect x="120" y="442" width="220" height="18" rx="6" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <text x="230.0" y="396.0" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#0F8478" data-fit="208">en vivo · Stream · 15</text>
  <text x="230.0" y="476" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="400" fill="#79809A">el más nuevo, abajo</text>
  <path class="ar-amber" d="M100,328 V150"/>
  <text x="88" y="300" dy="0.35em" text-anchor="end" font-size="12" font-weight="400" fill="#A96C05" data-fit="70">llegar arriba</text>
  <text x="88" y="318" dy="0.35em" text-anchor="end" font-size="11.5" font-weight="400" fill="#A96C05">Parte 2</text>
  <rect x="120" y="498" width="300" height="34" rx="8" fill="#1F2430"/>
  <text class="mono" x="134" y="515" dy="0.35em" font-size="12.5" fill="#C9CFDA" data-fit="272">fetchBefore(oldest, limit: 5)</text>
  <text x="630" y="124" dy="0.35em" text-anchor="middle" font-size="11" font-weight="700" fill="#556074">LLEGA UN MENSAJE NUEVO</text>
  <text x="560" y="156" dy="0.35em" text-anchor="middle" font-size="14" font-weight="700" fill="#C2354F">Reemplazar</text>
  <text class="mono" x="560" y="178" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="400" fill="#454C61" data-fit="210">messages: event.messages</text>
  <rect x="490" y="200" width="140" height="16" rx="6" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <rect x="490" y="220" width="140" height="16" rx="6" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <rect x="490" y="240" width="140" height="16" rx="6" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <rect x="490" y="260" width="140" height="16" rx="6" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <rect x="490" y="280" width="140" height="16" rx="6" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <rect x="490" y="300" width="140" height="16" rx="6" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <text x="560.0" y="258.0" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#0F8478" data-fit="128">los 15 en vivo</text>
  <text x="560" y="338" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#C2354F">las páginas viejas</text>
  <text x="560" y="356" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="400" fill="#C2354F">se pierden</text>
  <text x="790" y="156" dy="0.35em" text-anchor="middle" font-size="14" font-weight="700" fill="#3A8235">Juntar por id</text>
  <text class="mono" x="790" y="178" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="400" fill="#454C61" data-fit="210">_merge(state.messages, …)</text>
  <rect x="720" y="200" width="140" height="16" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <rect x="720" y="220" width="140" height="16" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <rect x="720" y="240" width="140" height="16" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <rect x="720" y="260" width="140" height="16" rx="6" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.25"/>
  <text x="790.0" y="238.0" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#A96C05" data-fit="128">páginas</text>
  <rect x="720" y="286" width="140" height="16" rx="6" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <rect x="720" y="306" width="140" height="16" rx="6" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <rect x="720" y="326" width="140" height="16" rx="6" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <rect x="720" y="346" width="140" height="16" rx="6" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <rect x="720" y="366" width="140" height="16" rx="6" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <rect x="720" y="386" width="140" height="16" rx="6" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.25"/>
  <text x="790.0" y="344.0" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#0F8478" data-fit="128">los 15 en vivo</text>
  <text x="790" y="424" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#3A8235">las páginas se quedan</text>
  <text x="790" y="442" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="400" fill="#3A8235">y no hay repetidos</text>
  <text class="foot" x="48" y="572" data-fit="860">Con limit, el stream suelta los mensajes más viejos de su ventana: si el Bloc reemplaza, se van de la pantalla.</text>
</svg>
```

El Stream cuida una **ventana en vivo** con los 15 más nuevos. Lo anterior no se escucha: se pide una vez, con un `Future`, y se guarda en el mismo `ChatState.messages`.

Antes de escribir código, pruébalo en el teléfono. Sube hasta el tope del chat, escribe un mensaje o haz que Ana envíe uno. Las pestañas son lo que tiene tu `ChatBloc` en cada momento:

- **Parte 1**: lo que ya tienes. Al llegar arriba, el Bloc recibe `OlderMessagesRequested` y solo lo imprime.
- **Parte 2 · cargar anteriores**: con los pasos 5 a 7, llegar arriba trae 5 más por `Future`. Ahora escribe un mensaje.
- **Parte 2 · juntar por id**: el último cambio del paso 7. Repite lo mismo.

```interactive
chat-pagination
```

En la segunda pestaña, `_onMessagesUpdated` todavía **reemplaza** la lista: cuando llega un mensaje, la página que trajo el `Future` desaparece. Por eso el paso 7 también cambia `MessagesUpdated` para que junte.

## Paso 5 · fetchBefore

En el data source, los mensajes de la conversación anteriores al más viejo que hay en pantalla:

```dart
Future<List<Message>> fetchBefore(
  String conversationId,
  DateTime before, {
  required int limit,
}) async {
  try {
    final rows = await _client
        .from(table)
        .select()
        .eq('conversation_id', conversationId)
        .lt('created_at', before.toUtc().toIso8601String())
        .order('created_at', ascending: false)
        .limit(limit);
    return rows.map(_toMessage).toList();
  } on PostgrestException catch (e) {
    throw Exception(e.message);
  }
}
```

En el repositorio, `fetchBefore` delega igual que los otros.

## Paso 6 · LoadOlderMessagesUseCase

```dart
final MessageRepository _messages = sl();

Future<List<Message>> call(
  String conversationId,
  DateTime before, {
  required int limit,
}) {
  return _messages.fetchBefore(conversationId, before, limit: limit);
}
```

## Paso 7 · ChatBloc

Agrega el caso de uso y una función que junta dos listas **por id**, sin repetidos y con el más nuevo primero:

```dart
final LoadOlderMessagesUseCase _loadOlder = sl();

List<Message> _merge(List<Message> current, List<Message> incoming) {
  final byId = {
    for (final message in current) message.id: message,
    for (final message in incoming) message.id: message,
  };
  return byId.values.toList()
    ..sort((a, b) => b.createdAt.compareTo(a.createdAt));
}
```

`MessagesUpdated` ahora junta en vez de reemplazar:

```dart
messages: _merge(state.messages, event.messages),
```

Y `OlderMessagesRequested` pide los 5 anteriores al último de la lista, que es el más viejo:

```dart
Future<void> _onOlderRequested(
  OlderMessagesRequested event,
  Emitter<ChatState> emit,
) async {
  if (state.isLoadingOlder || !state.hasMore || state.messages.isEmpty) {
    return;
  }
  emit(state.copyWith(isLoadingOlder: true));
  try {
    final oldest = state.messages.last.createdAt;
    final older = await _loadOlder(
      conversation.id,
      oldest,
      limit: pageSize,
    );
    emit(state.copyWith(
      isLoadingOlder: false,
      messages: _merge(state.messages, older),
      hasMore: older.length == pageSize,
    ));
  } on Exception catch (e) {
    emit(state.copyWith(isLoadingOlder: false, errorMessage: _message(e)));
  }
}
```

`hasMore` se apaga cuando una página trae menos de 5: no hay nada más atrás.

## La prueba de la parte 2

Sube hasta el tope: aparece la barra de carga arriba y llegan 5 mensajes más. Sigue subiendo hasta el primero. Luego, con mensajes viejos en pantalla, escribe desde la otra cuenta: el nuevo llega, la lista baja sola y los viejos siguen ahí.

## Parte 3 · Mensajes con imagen

```svg
<svg id="rtLabFoto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 430" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="rtLabFoto-ttl rtLabFoto-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="rtLabFoto-ttl">El camino de una foto en el chat</title>
  <desc id="rtLabFoto-dsc">Dos filas de cajas. Arriba, al enviar: MessageComposer con la foto, SendMessageUseCase que primero sube al bucket privado chat-images y recibe un path, y luego inserta la fila en messages con image_path. Abajo, al leer: el stream trae la fila con image_path, WatchMessagesUseCase con asyncMap pide imageUrl, el repositorio firma con createSignedUrl y guarda la URL, y MessageBubble muestra la foto.</desc>
  <defs>
    <style>
      #rtLabFoto .title{fill:#161A26;font-size:22px;font-weight:700}
      #rtLabFoto .sub{fill:#79809A;font-size:13.5px}
      #rtLabFoto .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #rtLabFoto .foot{fill:#79809A;font-size:12px}
      #rtLabFoto .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #rtLabFoto .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #rtLabFoto .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#rtLabFoto-arrow)}
      #rtLabFoto .ar-amber{fill:none;stroke:#A96C05;stroke-width:1.75;marker-end:url(#rtLabFoto-ar-amber)}
      #rtLabFoto .ar-teal{fill:none;stroke:#0F8478;stroke-width:1.75;marker-end:url(#rtLabFoto-ar-teal)}
      #rtLabFoto .ar-violet{fill:none;stroke:#7439B8;stroke-width:1.75;marker-end:url(#rtLabFoto-ar-violet)}
    </style>
    <marker id="rtLabFoto-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="rtLabFoto-ar-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#A96C05"/></marker>
    <marker id="rtLabFoto-ar-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#0F8478"/></marker>
    <marker id="rtLabFoto-ar-violet" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#7439B8"/></marker>
  </defs>
  <rect width="960" height="430" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">El camino de una foto en el chat</text>
  <text class="sub" x="48" y="80" data-fit="860">La fila guarda el path. La URL firmada se pide al leer, en el caso de uso, y el repositorio la recuerda.</text>
  <text x="48" y="124" dy="0.35em" text-anchor="start" font-size="11" font-weight="700" fill="#A96C05">AL ENVIAR · PARTE 3</text>
  <rect x="48" y="140" width="196" height="66" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="mono" x="146.0" y="164" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8" data-fit="182">MessageComposer</text>
  <text x="146.0" y="186" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="400" fill="#454C61" data-fit="182">state.photo</text>
  <rect x="270" y="140" width="196" height="66" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>
  <text class="mono" x="368.0" y="164" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05" data-fit="182">SendMessageUseCase</text>
  <text x="368.0" y="186" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="400" fill="#454C61" data-fit="182">uploadImage primero</text>
  <path class="ar-amber" d="M247,173 H267"/>
  <rect x="492" y="140" width="196" height="66" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="590.0" y="164" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="182">chat-images</text>
  <text x="590.0" y="186" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="400" fill="#454C61" data-fit="182">bucket privado · path</text>
  <path class="ar-amber" d="M469,173 H489"/>
  <rect x="714" y="140" width="196" height="66" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="mono" x="812.0" y="164" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8" data-fit="182">messages</text>
  <text x="812.0" y="186" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="400" fill="#454C61" data-fit="182">insert con image_path</text>
  <path class="ar-amber" d="M691,173 H711"/>
  <text x="48" y="256" dy="0.35em" text-anchor="start" font-size="11" font-weight="700" fill="#0F8478">AL LEER</text>
  <rect x="48" y="272" width="196" height="66" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="146.0" y="296" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="182">stream</text>
  <text x="146.0" y="318" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="400" fill="#454C61" data-fit="182">fila con image_path</text>
  <rect x="270" y="272" width="196" height="66" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>
  <text class="mono" x="368.0" y="296" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05" data-fit="182">WatchMessagesUseCase</text>
  <text x="368.0" y="318" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="400" fill="#454C61" data-fit="182">asyncMap · imageUrl</text>
  <path class="ar-teal" d="M247,305 H267"/>
  <rect x="492" y="272" width="196" height="66" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/>
  <text class="mono" x="590.0" y="296" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="182">MessageRepositoryImpl</text>
  <text x="590.0" y="318" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="400" fill="#454C61" data-fit="182">createSignedUrl · lo guarda</text>
  <path class="ar-teal" d="M469,305 H489"/>
  <rect x="714" y="272" width="196" height="66" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/>
  <text class="mono" x="812.0" y="296" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8" data-fit="182">MessageBubble</text>
  <text x="812.0" y="318" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="400" fill="#454C61" data-fit="182">Image.network(url)</text>
  <path class="ar-teal" d="M691,305 H711"/>
  <text x="480" y="372" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="400" fill="#454C61" data-fit="860">Sin el mapa de URLs, cada emisión firmaría de nuevo todas las fotos y cada imagen se descargaría otra vez.</text>
  <text class="foot" x="48" y="402" data-fit="860">La URL firmada vence en una hora: es la duración que se le pide a createSignedUrl.</text>
</svg>
```

Cada mensaje puede llevar una foto. Va en un **bucket privado**, `chat-images`: la fila guarda el `image_path`, y para mostrarla se pide una URL firmada, igual que las imágenes de los posts del Laboratorio 7.

## Paso 8 · El bucket chat-images

Al final de `supabase/config.toml` agrega el bucket. Solo la tabla `[storage.buckets.chat-images]`: el archivo ya tiene su sección `[storage]`, y repetirla lo deja inválido.

```toml
[storage.buckets.chat-images]
public = false
file_size_limit = "2MiB"
allowed_mime_types = ["image/jpeg", "image/png", "image/webp"]
```

```shell
npx supabase seed buckets --linked
npx supabase migration new create_chat_images
```

```sql
create policy "chat-images: usuarios autenticados"
on storage.objects for all to authenticated
using (bucket_id = 'chat-images')
with check (bucket_id = 'chat-images');
```

```shell
npx supabase db push
```

La tabla no usa RLS, pero Storage sí: sin esta política, subir falla con `new row violates row-level security policy`.

## Paso 9 · El data source de imágenes

`chat/data/source/supabase_chat_image_data_source.dart` es igual al de las imágenes de los posts, con otro bucket:

```dart
final SupabaseClient _client = Supabase.instance.client;
final Uuid _uuid = const Uuid();

String get _uid {
  return _client.auth.currentUser!.id;
}

Future<String> upload(PickedPhoto photo) async {
  final path = '$_uid/${_uuid.v4()}.${photo.extension}';
  final type = photo.extension == 'jpg' ? 'jpeg' : photo.extension;
  try {
    await _client.storage.from(bucket).uploadBinary(
      path,
      photo.bytes,
      fileOptions: FileOptions(
        contentType: 'image/$type',
        cacheControl: '31536000',
      ),
    );
    return path;
  } on StorageException catch (e) {
    throw Exception(e.message);
  }
}

Future<String> signedUrl(String path) async {
  try {
    return await _client.storage.from(bucket).createSignedUrl(path, 3600);
  } on StorageException catch (e) {
    throw Exception(e.message);
  }
}
```

En `supabase_message_data_source.dart`, `send` ahora guarda también el path:

```dart
'image_path': imagePath,
```

## Paso 10 · El repositorio

Agrega los otros dos data sources. La galería es el `DevicePhotoDataSource` del Laboratorio 7:

```dart
final SupabaseChatImageDataSource _images = sl();
final DevicePhotoDataSource _device = sl();
final Map<String, String> _urls = {};
```

`pickImage` va a `_device.pick()` y `uploadImage` a `_images.upload(photo)`. `imageUrl` recuerda cada URL que ya firmó:

```dart
@override
Future<String> imageUrl(String path) async {
  final cached = _urls[path];
  if (cached != null) return cached;
  final url = await _images.signedUrl(path);
  _urls[path] = url;
  return url;
}
```

Sin ese mapa, cada emisión del Stream volvería a firmar todas las fotos, cada firma da una URL distinta y cada imagen se descargaría otra vez.

## Paso 11 · Los casos de uso

`PickChatImageUseCase` retorna `_messages.pickImage()`. `SendMessageUseCase` sube la foto antes de insertar:

```dart
Future<void> call(
  String conversationId,
  String content, {
  PickedPhoto? photo,
}) async {
  final text = content.trim();
  if (text.isEmpty && photo == null) return;
  final path = photo == null ? null : await _messages.uploadImage(photo);
  await _messages.send(conversationId, text, imagePath: path);
}
```

`WatchMessagesUseCase` sigue retornando el Stream, pero ahora transformado con `asyncMap`, porque pedir la URL es un `Future`:

```dart
Stream<List<Message>> call(String conversationId, {required int limit}) {
  return _messages
      .watchLatest(conversationId, limit: limit)
      .asyncMap(_withImages);
}

Future<List<Message>> _withImages(List<Message> messages) {
  return Future.wait(messages.map(_withImage));
}

Future<Message> _withImage(Message message) async {
  final path = message.imagePath;
  if (path == null) return message;
  return message.copyWith(imageUrl: await _messages.imageUrl(path));
}
```

`LoadOlderMessagesUseCase` necesita lo mismo: copia `_withImage` y aplícalo a la página con `Future.wait`.

## Paso 12 · ChatBloc

```dart
final PickChatImageUseCase _pickImage = sl();

Future<void> _onPhotoRequested(
  ChatPhotoRequested event,
  Emitter<ChatState> emit,
) async {
  try {
    final photo = await _pickImage();
    if (photo != null) emit(state.copyWith(photo: photo));
  } on Exception catch (e) {
    emit(state.copyWith(errorMessage: _message(e)));
  }
}

void _onPhotoRemoved(ChatPhotoRemoved event, Emitter<ChatState> emit) {
  emit(state.copyWith(removePhoto: true));
}
```

En `_onMessageSent`, pasa la foto del estado y quítala cuando el mensaje salió:

```dart
await _sendMessage(conversation.id, event.content, photo: state.photo);
emit(state.copyWith(isSending: false, removePhoto: true));
```

## La prueba de la parte 3

Adjunta una foto, mira la vista previa y envíala con o sin texto. Aparece en las dos cuentas. En el dashboard, `Storage` muestra el archivo en `chat-images`, dentro de la carpeta de tu usuario, y la fila de `messages` tiene su `image_path`.

## Retos

- **El último mensaje en la lista.** Muestra bajo cada usuario de `ContactsScreen` el último mensaje que se cruzaron, con una consulta a `messages` por `conversation_id`.
- **URLs vencidas.** La URL firmada dura una hora. Haz que el mapa del repositorio olvide las que tengan más de 50 minutos.
- **Sin conexión.** Apaga el Wi-Fi con el chat abierto: ¿qué llega a `onError`? Muestra un aviso y vuelve a suscribirte al recuperar la red.
