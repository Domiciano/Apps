# 🧠 Clase: Construcción de un Chat en Tiempo Real con Clean Architecture + Supabase

## 🎯 Objetivo de la clase

Construir paso a paso un sistema de chat en tiempo real usando: - Clean
Architecture - BLoC - Supabase Realtime

------------------------------------------------------------------------

# 🪜 FASE 1: Flujo general del sistema

``` dart
// UI → BLoC → UseCase → Repository → Supabase
```

------------------------------------------------------------------------

# 🪜 FASE 2: UsersBloc

``` dart
UsersBloc() : super(UsersInitialState()) {}
```

``` dart
final GetProfilesUsecase _profilesUsecase = GetProfilesUsecase();
```

``` dart
on<LoadUsersEvent>(_load);
```

``` dart
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

``` dart
create: (_) => UsersBloc()..add(LoadUsersEvent(currentUserId)),
```

------------------------------------------------------------------------

# 🪜 FASE 3: Conversación

``` dart
class GetOrCreateConversationUsecase {
  final ChatRepository _repository = ChatRepositoryImpl();

  Future<Conversation> execute(String currentUserId, String otherUserId) {
    return _repository.getOrCreateConversation(currentUserId, otherUserId);
  }
}
```

``` dart
final GetOrCreateConversationUsecase _conversationUsecase =
    GetOrCreateConversationUsecase();
```

``` dart
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

------------------------------------------------------------------------

# 🪜 FASE 4: Navegación

``` dart
if (state is NavigateToChatState) {
  Navigator.push(...);
}
```

------------------------------------------------------------------------

# 🪜 FASE 5: Realtime

``` dart
class WatchMessagesUsecase {
  final ChatRepository _repository = ChatRepositoryImpl();

  Stream<List<Message>> execute(String conversationId) {
    return _repository.watchMessages(conversationId);
  }
}
```

``` dart
final _watchUsecase = WatchMessagesUsecase();
StreamSubscription<List<Message>>? _subscription;
```

``` dart
on<SubscribeToMessagesEvent>(_subscribe);
on<_MessagesUpdatedEvent>(_onUpdated);
```

``` dart
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

``` dart
void _onUpdated(
  _MessagesUpdatedEvent event,
  Emitter<ChatState> emit,
) {
  emit(ChatLoadedState(event.messages));
}
```

------------------------------------------------------------------------

# 🪜 FASE 6: Enviar mensajes

``` dart
class SendMessageUsecase {
  final ChatRepository _repository = ChatRepositoryImpl();

  Future<void> execute(Message message) {
    return _repository.sendMessage(message);
  }
}
```

``` dart
on<SendMessageEvent>(_send);
```

``` dart
final _sendUsecase = SendMessageUsecase();
```

``` dart
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

------------------------------------------------------------------------

# 🪜 FASE 7: Limpieza

``` dart
@override
Future<void> close() {
  _subscription?.cancel();
  return super.close();
}
```

------------------------------------------------------------------------

# 🧠 Cierre

Flujo: 1. UI → Evento 2. BLoC → UseCase 3. UseCase → Repository 4.
Repository → Supabase 5. Realtime → Stream → UI
