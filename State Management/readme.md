# Clase: Implementación de Chat en Tiempo Real (Clean Architecture + Supabase)

## Objetivo de la clase

Esta guía está pensada para el profesor. Indica exactamente qué decir, qué mostrar y en qué orden reconstruir el sistema de chat.

---

# FASE 0: Contexto inicial (5 minutos)

## Qué decir

"Hoy vamos a construir un chat en tiempo real. Pero no lo vamos a hacer desde cero... lo vamos a reconstruir.

Yo ya lo tenía funcionando, pero eliminé partes clave para que entendamos cómo se arma correctamente usando Clean Architecture."

"Vamos a trabajar sobre tres ideas clave:
1. Separación de responsabilidades
2. Flujo de datos
3. Realtime con streams"

---

# FASE 1: Mostrar el estado roto (5 minutos)

## Qué hacer

Mostrar:

- UsersBloc vacío
- ChatBloc vacío
- No hay usecases

## Qué decir

"En este momento la app tiene UI, pero no tiene lógica."

"Pregunta: ¿qué falta aquí?"

Esperar respuestas: lógica, backend, datos, etc.

---

# FASE 2: Cargar usuarios (15 minutos)

## Paso 1: Pregunta guiada

"¿Quién debería encargarse de traer los usuarios?"

Guiar a: BLoC → UseCase → Repository

---

## Paso 2: Crear UseCase

## Qué hacer (crear archivo)

Crear:

lib/features/chat/domain/usecases/get_profiles_usecase.dart

## Qué decir

"Vamos a crear nuestro primer caso de uso. Este representa una acción del sistema."

```dart
class GetProfilesUsecase {
  Future<List<Profile>> execute(String currentUserId) {
    // delega al repository
  }
}
```

---

## Paso 3: Conectar en UsersBloc

## Qué hacer

Agregar:

```dart
final GetProfilesUsecase _profilesUsecase = GetProfilesUsecase();
```

Registrar evento:

```dart
on<LoadUsersEvent>(_load);
```

Implementar:

```dart
Future<void> _load(LoadUsersEvent event, Emitter<UsersState> emit) async {
  emit(UsersLoadingState());
  try {
    final users = await _profilesUsecase.execute(event.currentUserId);
    emit(UsersLoadedState(users));
  } catch (e) {
    emit(UsersErrorState(e.toString()));
  }
}
```

---

## Paso 4: Disparar desde UI

## Qué hacer

En ConversationsPage:

```dart
create: (_) => UsersBloc()..add(LoadUsersEvent(currentUserId)),
```

## Qué decir

"La UI no trae datos. Solo dispara eventos."

---

# FASE 3: Crear o recuperar conversación (20 minutos)

## Paso 1: Pregunta

"Cuando hago click en un usuario, ¿qué debería pasar?"

Guiar a:
- Buscar conversación
- Si no existe → crearla

---

## Paso 2: Crear UseCase

## Qué hacer (crear archivo)

lib/features/chat/domain/usecases/get_or_create_conversation_usecase.dart

```dart
class GetOrCreateConversationUsecase {
  final ChatRepository _repository = ChatRepositoryImpl();

  Future<Conversation> execute(String currentUserId, String otherUserId) {
    return _repository.getOrCreateConversation(currentUserId, otherUserId);
  }
}
```

---

## Paso 3: Implementar en UsersBloc

```dart
final GetOrCreateConversationUsecase _conversationUsecase =
    GetOrCreateConversationUsecase();
```

```dart
on<SelectUserEvent>(_selectUser);
```

```dart
Future<void> _selectUser(
  SelectUserEvent event,
  Emitter<UsersState> emit,
) async {
  try {
    final conversation = await _conversationUsecase.execute(
      event.currentUserId,
      event.otherUser.id,
    );

    emit(NavigateToChatState(conversation.id, event.otherUser.name));
  } catch (e) {
    emit(UsersErrorState(e.toString()));
  }
}
```

---

## Qué decir

"Esto es lógica de negocio. No puede vivir en la UI."

---

# FASE 4: Navegación (5 minutos)

## Qué hacer

Mostrar BlocListener

```dart
if (state is NavigateToChatState) {
  Navigator.push(...);
}
```

## Qué decir

"La UI reacciona a estados, no toma decisiones."

---

# FASE 5: Realtime - escuchar mensajes (25 minutos)

## Paso 1: Pregunta

"¿Cómo hacemos que el chat se actualice solo?"

---

## Paso 2: Crear UseCase

Crear archivo:

lib/features/chat/domain/usecases/watch_messages_usecase.dart

```dart
class WatchMessagesUsecase {
  final ChatRepository _repository = ChatRepositoryImpl();

  Stream<List<Message>> execute(String conversationId) {
    return _repository.watchMessages(conversationId);
  }
}
```

---

## Paso 3: Implementar en ChatBloc

Agregar:

```dart
final _watchUsecase = WatchMessagesUsecase();
StreamSubscription<List<Message>>? _subscription;
```

Registrar eventos:

```dart
on<SubscribeToMessagesEvent>(_subscribe);
on<_MessagesUpdatedEvent>(_onUpdated);
```

---

## Paso 4: Suscripción

```dart
void _subscribe(
  SubscribeToMessagesEvent event,
  Emitter<ChatState> emit,
) {
  emit(ChatLoadingState());
  _subscription?.cancel();

  _subscription = _watchUsecase.execute(event.conversationId).listen(
    (messages) => add(_MessagesUpdatedEvent(messages)),
    onError: (e) => add(_MessagesUpdatedEvent([])),
  );
}
```

---

## Paso 5: Actualización

```dart
void _onUpdated(
  _MessagesUpdatedEvent event,
  Emitter<ChatState> emit,
) {
  emit(ChatLoadedState(event.messages));
}
```

---

## Qué decir

"Supabase emite cambios. Nosotros escuchamos esos cambios con un Stream."

---

# FASE 6: Enviar mensajes (15 minutos)

## Paso 1: Crear UseCase

Archivo:

lib/features/chat/domain/usecases/send_message_usecase.dart

```dart
class SendMessageUsecase {
  final ChatRepository _repository = ChatRepositoryImpl();

  Future<void> execute(Message message) {
    return _repository.sendMessage(message);
  }
}
```

---

## Paso 2: Implementar en BLoC

```dart
final _sendUsecase = SendMessageUsecase();
```

```dart
on<SendMessageEvent>(_send);
```

```dart
Future<void> _send(
  SendMessageEvent event,
  Emitter<ChatState> emit,
) async {
  try {
    final msg = Message(
      id: '',
      conversationId: event.conversationId,
      senderId: event.senderId,
      content: event.content,
      createdAt: DateTime.now(),
    );

    await _sendUsecase.execute(msg);
  } catch (e) {
    emit(ChatErrorState(e.toString()));
  }
}
```

---

## Qué decir

"No actualizamos la UI manualmente. El realtime lo hace por nosotros."

---

# FASE 7: Limpieza (5 minutos)

```dart
@override
Future<void> close() {
  _subscription?.cancel();
  return super.close();
}
```

## Qué decir

"Si no cancelamos esto, tenemos memory leaks."

---

# Cierre (5 minutos)

## Qué decir

"El valor de esto no es el chat. Es el flujo."

Repasar:

UI → BLoC → UseCase → Repository → Supabase → Stream → BLoC → UI

---

# Ejercicio sugerido

Agregar:
- indicador de escritura
- mensajes leídos
