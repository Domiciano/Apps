# El Stream viaja por las capas

<!-- tags: listen en el Bloc, StreamSubscription, cancel en close(), retornar un Stream,
     add(MessagesUpdated), asyncMap en el caso de uso, Stream en Clean Architecture,
     emit was called after an event handler completed, setState() called after dispose() -->

En Clean Architecture una consulta baja por las capas y la respuesta sube una sola vez. Con un `Stream` la llamada también baja una sola vez, pero lo que sube son **muchas** respuestas, por la misma tubería, mientras alguien escuche.

## La convención

```svg
<svg id="rtCapas" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 520" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="rtCapas-ttl rtCapas-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="rtCapas-ttl">Todas las capas retornan el Stream. Solo el Bloc lo escucha.</title>
  <desc id="rtCapas-dsc">Seis columnas de izquierda a derecha: ChatScreen, ChatBloc, UseCase, RepositoryImpl, DataSource y Supabase. Arriba, una fila de flechas que van hacia la derecha: la llamada watch baja una sola vez. En el medio, una tubería verde azulada que nace en Supabase y llega hasta ChatBloc: es el Stream que cada capa retorna. En ChatBloc la tubería termina en un listen, y de ahí sale una flecha emit hacia ChatScreen. Debajo de cada columna, la línea de código que le toca a esa capa.</desc>
  <defs>
    <style>
      #rtCapas .title{fill:#161A26;font-size:22px;font-weight:700}
      #rtCapas .sub{fill:#79809A;font-size:13.5px}
      #rtCapas .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #rtCapas .foot{fill:#79809A;font-size:12px}
      #rtCapas .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #rtCapas .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #rtCapas .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#rtCapas-arrow)}
      #rtCapas .ar-indigo{fill:none;stroke:#4453C9;stroke-width:1.75;marker-end:url(#rtCapas-ar-indigo)}
      #rtCapas .ar-teal{fill:none;stroke:#0F8478;stroke-width:1.75;marker-end:url(#rtCapas-ar-teal)}
      #rtCapas .ar-violet{fill:none;stroke:#7439B8;stroke-width:1.75;marker-end:url(#rtCapas-ar-violet)}
    </style>
    <marker id="rtCapas-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="rtCapas-ar-indigo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#4453C9"/></marker>
    <marker id="rtCapas-ar-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#0F8478"/></marker>
    <marker id="rtCapas-ar-violet" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#7439B8"/></marker>
  </defs>
  <rect width="960" height="520" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Todas las capas retornan el Stream. Solo el Bloc lo escucha.</text>
  <text class="sub" x="48" y="80" data-fit="860">Las llamadas bajan hacia Supabase una sola vez. Los mensajes suben por la tubería todas las veces que haya cambios.</text>
  <rect x="48.0" y="112" width="128" height="330" rx="12" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5" opacity=".55"/>
  <text class="mono" x="112.0" y="134" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#7439B8" data-fit="116">ChatScreen</text>
  <text class="mono" x="112.0" y="414" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="400" fill="#7439B8" data-fit="116">BlocBuilder</text>
  <text x="112.0" y="432" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="400" fill="#454C61" data-fit="116">solo ve estados</text>
  <rect x="195.2" y="112" width="128" height="330" rx="12" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.5" opacity=".55"/>
  <text class="mono" x="259.2" y="134" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#4453C9" data-fit="116">ChatBloc</text>
  <text class="mono" x="259.2" y="414" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="400" fill="#4453C9" data-fit="116">stream.listen(…)</text>
  <text x="259.2" y="432" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="400" fill="#454C61" data-fit="116">el único que escucha</text>
  <rect x="342.4" y="112" width="128" height="330" rx="12" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.5" opacity=".55"/>
  <text class="mono" x="406.4" y="134" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#3A8235" data-fit="116">UseCase</text>
  <text class="mono" x="406.4" y="414" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="400" fill="#3A8235" data-fit="116">.asyncMap(…)</text>
  <text x="406.4" y="432" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="400" fill="#454C61" data-fit="116">retorna el Stream</text>
  <rect x="489.6" y="112" width="128" height="330" rx="12" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5" opacity=".55"/>
  <text class="mono" x="553.5999999999999" y="134" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#0F8478" data-fit="116">RepositoryImpl</text>
  <text class="mono" x="553.5999999999999" y="414" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="400" fill="#0F8478" data-fit="116">return …</text>
  <text x="553.5999999999999" y="432" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="400" fill="#454C61" data-fit="116">retorna el Stream</text>
  <rect x="636.8" y="112" width="128" height="330" rx="12" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5" opacity=".55"/>
  <text class="mono" x="700.8" y="134" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#0F8478" data-fit="116">DataSource</text>
  <text class="mono" x="700.8" y="414" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="400" fill="#0F8478" data-fit="116">.stream().map(…)</text>
  <text x="700.8" y="432" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="400" fill="#454C61" data-fit="116">crea el Stream</text>
  <rect x="784.0" y="112" width="128" height="330" rx="12" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5" opacity=".55"/>
  <text class="mono" x="848.0" y="134" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="#556074" data-fit="116">Supabase</text>
  <text class="mono" x="848.0" y="414" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="400" fill="#556074" data-fit="116">websocket</text>
  <text x="848.0" y="432" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="400" fill="#454C61" data-fit="116">empuja cada cambio</text>
  <path class="ar-indigo" d="M130.0,184 H241.2"/>
  <text class="mono" x="185.6" y="170" dy="0.35em" text-anchor="middle" font-size="11" font-weight="400" fill="#4453C9" data-fit="134">add(ChatStarted)</text>
  <path class="ar-indigo" d="M277.2,184 H388.4"/>
  <text class="mono" x="332.79999999999995" y="170" dy="0.35em" text-anchor="middle" font-size="11" font-weight="400" fill="#4453C9" data-fit="134">call(limit: 15)</text>
  <path class="ar-indigo" d="M424.4,184 H535.6"/>
  <text class="mono" x="479.99999999999994" y="170" dy="0.35em" text-anchor="middle" font-size="11" font-weight="400" fill="#4453C9" data-fit="134">watchLatest()</text>
  <path class="ar-indigo" d="M571.6,184 H682.8"/>
  <text class="mono" x="627.1999999999999" y="170" dy="0.35em" text-anchor="middle" font-size="11" font-weight="400" fill="#4453C9" data-fit="134">watchLatest()</text>
  <path class="ar-indigo" d="M718.8,184 H830.0"/>
  <text class="mono" x="774.4" y="170" dy="0.35em" text-anchor="middle" font-size="11" font-weight="400" fill="#4453C9" data-fit="134">.stream()</text>
  <text x="480" y="210" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4453C9" data-fit="600">1 · la llamada baja una sola vez, al abrir el chat</text>
  <path d="M848.0,278 H259.2" stroke="#E3F6F3" stroke-width="22" stroke-linecap="round"/>
  <path class="ar-teal" d="M842.0,278 H289.2"/>
  <text class="mono" x="774.4" y="254" dy="0.35em" text-anchor="middle" font-size="11" font-weight="400" fill="#0F8478" data-fit="134">List&lt;Map&gt;</text>
  <text class="mono" x="627.1999999999999" y="254" dy="0.35em" text-anchor="middle" font-size="11" font-weight="400" fill="#0F8478" data-fit="134">List&lt;Message&gt;</text>
  <text class="mono" x="479.99999999999994" y="254" dy="0.35em" text-anchor="middle" font-size="11" font-weight="400" fill="#0F8478" data-fit="134">List&lt;Message&gt;</text>
  <text class="mono" x="332.79999999999995" y="254" dy="0.35em" text-anchor="middle" font-size="11" font-weight="400" fill="#0F8478" data-fit="134">List&lt;Message&gt;</text>
  <circle cx="259.2" cy="278" r="26" fill="#FFFFFF" stroke="#4453C9" stroke-width="2.5"/>
  <text class="mono" x="259.2" y="278" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#4453C9">listen</text>
  <text class="mono" x="259.2" y="318" dy="0.35em" text-anchor="middle" font-size="11" font-weight="400" fill="#4453C9" data-fit="128">cancel() en close()</text>
  <text x="560" y="318" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478" data-fit="500">2 · cada cambio sube por la tubería que quedó armada</text>
  <path class="ar-violet" d="M245.2,372 H126.0"/>
  <text class="mono" x="185.6" y="358" dy="0.35em" text-anchor="middle" font-size="11.5" font-weight="700" fill="#7439B8">emit(state)</text>
  <text x="350.4" y="372" dy="0.35em" text-anchor="start" font-size="12.5" font-weight="700" fill="#7439B8" data-fit="560">3 · la pantalla solo ve estados, nunca el Stream</text>
  <text class="foot" x="48" y="492" data-fit="860">Si alguien más hiciera listen en el camino, el Bloc ya no sería el único dueño de la suscripción, ni quien la cancela.</text>
</svg>
```

El data source **crea** el Stream. El repositorio y el caso de uso lo **retornan**, quizá transformado con `map` o `asyncMap`. El Bloc es el **único** que hace `listen`, guarda la suscripción y la cancela al cerrarse. La pantalla nunca ve el Stream: ve estados, como siempre.

Así la suscripción tiene un solo dueño, y ese dueño tiene un momento claro para soltarla: `close()`.

## Capa por capa

Ninguna de estas capas escucha. Cada una retorna el Stream que recibió:

```dart
// DataSource: crea el Stream
Stream<List<Message>> watchLatest({required int limit}) {
  return _client
      .from('messages')
      .stream(primaryKey: ['id'])
      .order('created_at', ascending: false)
      .limit(limit)
      .map((rows) => rows.map(_toMessage).toList());
}

// RepositoryImpl: lo retorna igual
Stream<List<Message>> watchLatest({required int limit}) {
  return _messages.watchLatest(limit: limit);
}

// UseCase: lo retorna, y si hace falta lo transforma
Stream<List<Message>> call({required int limit}) {
  return _messages.watchLatest(limit: limit);
}
```

Fíjate que ninguna es `async`, ni usa `await`: retornar un Stream es inmediato. Los datos llegan después, cuando alguien escuche.

## En el Bloc: listen, add y cancel

```dart
StreamSubscription<List<Message>>? _subscription;

Future<void> _onStarted(ChatStarted event, Emitter<ChatState> emit) async {
  emit(state.copyWith(status: ChatStatus.loading));
  await _subscription?.cancel();
  _subscription = _watchMessages(limit: liveSize).listen(
    (messages) => add(MessagesUpdated(messages)),
    onError: (Object error) => add(ChatStreamFailed('$error')),
  );
}

void _onMessagesUpdated(MessagesUpdated event, Emitter<ChatState> emit) {
  emit(state.copyWith(
    status: ChatStatus.success,
    messages: event.messages,
  ));
}

@override
Future<void> close() async {
  await _subscription?.cancel();
  return super.close();
}
```

La función de `listen` **no** llama a `emit`. El handler de `ChatStarted` ya terminó cuando llegan los mensajes, y un `emit` fuera de su handler falla con `emit was called after an event handler completed normally`. Por eso la función lanza un evento, `MessagesUpdated`, y es su propio handler el que emite.

El `cancel` en `close()` es lo que evita que el Bloc siga recibiendo mensajes de una pantalla que ya se cerró.

## Pruébalo

```interactive
stream-layers
```

Abre el chat y sigue la llamada hasta Supabase, y el Stream de vuelta hasta el Bloc. Después haz que Ana envíe un mensaje: la lista sube por la tubería que ya estaba armada, sin que nadie vuelva a llamar. Envía uno tú: el insert es un `Future` que baja, y tu mensaje aparece porque el Stream lo trae, no porque el Bloc lo agregue. Al final cierra el chat y mira cómo baja la cancelación.
