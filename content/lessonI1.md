# Datos en Tiempo Real con Supabase

Supabase ofrece una potente funcionalidad de tiempo real que te permite escuchar los cambios en tu base de datos a medida que ocurren. Esto es ideal para construir aplicaciones interactivas como chats, notificaciones o paneles de control en vivo.

## Habilitar Realtime

Por defecto, la funcionalidad de tiempo real está deshabilitada para las nuevas tablas. Para activarla, debes gestionar la replicación en tu proyecto de Supabase.

## El Método `stream()`

El método `stream()` de Supabase te permite obtener datos en tiempo real de tu tabla como un `Stream`.

`stream()` emitirá los datos iniciales, así como cualquier cambio posterior en la base de datos, como un `Stream<List<Map<String, dynamic>>>` combinando Postgrest y Realtime.

Este método toma una lista de nombres de columnas de clave primaria (`primaryKey`) que se utilizarán para actualizar y eliminar los registros adecuados dentro del SDK.

Aquí tienes un ejemplo básico de cómo escuchar cambios en la tabla 'countries':

```dart
supabase.from('countries')
  .stream(primaryKey: ['id'])
  .listen((List<Map<String, dynamic>> data) {
  // Haz algo increíble con los datos
});
```

## Filtrado de Streams en Tiempo Real

Puedes aplicar filtros a tus streams para escuchar solo los cambios que te interesan. Los siguientes filtros están disponibles:

- `eq('column', value)`: Escucha filas donde la columna es igual al valor.
- `neq('column', value)`: Escucha filas donde la columna no es igual al valor.
- `gt('column', value)`: Escucha filas donde la columna es mayor que el valor.
- `gte('column', value)`: Escucha filas donde la columna es mayor o igual que el valor.
- `lt('column', value)`: Escucha filas donde la columna es menor que el valor.
- `lte('column', value)`: Escucha filas donde la columna es menor o igual que el valor.
- `inFilter('column', [val1, val2, val3])`: Escucha filas donde la columna es uno de los valores proporcionados.

Aquí tienes un ejemplo de cómo aplicar filtros, ordenar y limitar los resultados en un stream:

```dart
supabase.from('countries')
  .stream(primaryKey: ['id'])
  .eq('id', 120)
  .order('name')
  .limit(10);
```

## Escuchando Mensajes Individuales con Canales

Además de los streams que devuelven listas completas, puedes usar canales de Supabase para escuchar cambios individuales en tu base de datos, lo cual es útil para escenarios como la recepción de mensajes en un chat.

Este enfoque te permite recibir cada cambio (inserción, actualización, eliminación) de forma individual, en lugar de una lista completa de registros.

```dart
@override
Stream<Message> listenMessagesByConversation(String conversationId) {
  print("Listening messages ...");
  final controller = StreamController<Message>();
  final channel = Supabase.instance.client
      .channel('public:messages')
      .onPostgresChanges(
        event: PostgresChangeEvent.all,
        schema: 'public',
        table: 'messages',
        callback: (payload) {
          controller.add(Message.fromJson(payload.newRecord));
          print(payload.newRecord);
        },
      )
      .subscribe();
  controller.onCancel = () {
    Supabase.instance.client.removeChannel(channel);
  };
  return controller.stream;
}
```

En este ejemplo:

- Se crea un `StreamController` para manejar el flujo de mensajes.
- Se suscribe a un canal de Supabase (`public:messages`) escuchando todos los eventos (`PostgresChangeEvent.all`) en la tabla `messages`.
- Cada vez que hay un cambio, el `callback` se ejecuta, añadiendo el nuevo registro (`payload.newRecord`) al `StreamController` después de convertirlo a un objeto `Message`.
- Cuando el stream se cancela, el canal de Supabase se remueve para evitar fugas de memoria.
