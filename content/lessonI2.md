# Programación reactiva y Streams

<!-- tags: Stream, listen, StreamSubscription, cancel(), Future vs Stream, await,
     programación reactiva, onError, map de un Stream, asyncMap,
     emit was called after an event handler completed,
     Bad state: Stream has already been listened to -->

Hasta ahora la app **pregunta**: hace un `select`, espera con `await` y recibe una respuesta. Si después la tabla cambia, la app no se entera hasta que vuelve a preguntar. En un chat eso no sirve: el mensaje de la otra persona tiene que aparecer solo, sin tocar nada.

La programación reactiva le da la vuelta. La app **se suscribe** una vez a un flujo de datos y **reacciona** cada vez que llega algo. En Dart, ese flujo es un `Stream`.

## Preguntar o suscribirse

```interactive
future-stream
```

Con un `Future`, la app lanza la petición y se queda en el `await` hasta que el servidor responde **una sola vez**, con un valor o con un error. Con un `Stream`, la app se suscribe con `listen` y sigue libre: los valores llegan **cuando el servidor los emite**, separados en el tiempo, hasta que cierra el canal. Cambia el tipo en las pestañas: con `List<Message>`, cada evento del Stream trae la lista completa.

A quien escucha le llegan **valores** o **errores**, y un error no cierra el Stream. El Stream de Supabase tampoco termina solo: sigue abierto hasta que la app cancela la suscripción.

## Escuchar en el ChatBloc

En el chat, quien escucha es el `ChatBloc`. Así queda en el Laboratorio 8:

```dart
StreamSubscription<List<Message>>? _subscription;

Future<void> _onStarted(ChatStarted event, Emitter<ChatState> emit) async {
  emit(state.copyWith(status: ChatStatus.loading));
  await _subscription?.cancel();
  _subscription = _watchMessages(limit: liveSize).listen(
    (messages) => add(MessagesUpdated(messages)),
    onError: (Object error) => add(ChatStreamFailed(_message(error))),
  );
}

@override
Future<void> close() async {
  await _subscription?.cancel();
  return super.close();
}
```

`listen` recibe una función que corre **cada vez** que llega una lista, y `onError` para los errores. Un error no cierra el Stream: después pueden seguir llegando listas. Las dos funciones no llaman a `emit`, sino que lanzan un evento con `add`, porque `_onStarted` ya terminó cuando llegan los datos, y un `emit` fuera de su manejador falla con `emit was called after an event handler completed`.

`listen` devuelve una `StreamSubscription`. Se guarda en un campo porque es lo único que permite dejar de escuchar: `cancel()` en `close()`, cuando la pantalla se cierra. Si nadie la cancela, la función sigue corriendo con cada mensaje nuevo, aunque el chat ya no exista.

## Transformar con map

Supabase entrega cada fila como un `Map`. El data source las convierte en `Message` con `map`, sin escuchar nada:

```dart
Stream<List<Message>> watchLatest({required int limit}) {
  return _client
      .from(table)
      .stream(primaryKey: ['id'])
      .order('created_at', ascending: false)
      .limit(limit)
      .map((rows) => rows.map(_toMessage).toList());
}
```

`map` devuelve **otro Stream** que emite cada valor ya transformado. Por eso cada capa puede transformar y retornar, sin suscribirse. Si la transformación tiene que esperar algo, como la URL firmada de una foto en la parte 3 del laboratorio, se usa `asyncMap`, que recibe una función que devuelve un `Future`:

```dart
Stream<List<Message>> call({required int limit}) {
  return _messages.watchLatest(limit: limit).asyncMap(_withImages);
}
```

## Un solo oyente

Un Stream normal acepta **un solo** `listen`. El segundo falla con `Bad state: Stream has already been listened to`. Y aunque el Stream permitiera varios oyentes, cada uno sería una suscripción más que alguien tiene que cancelar.

Por eso en el curso la regla es fija: **a lo largo de las capas el Stream se retorna, y solo el Bloc hace `listen`**. La siguiente lección muestra cómo se ve eso en el chat.
