# Futures y funciones async

Un `Future` representa un valor que estará disponible en el futuro, normalmente como resultado de una operación asíncrona (por ejemplo, una petición a internet).

## Función que retorna un Future

```dart trycode=9ac0073d9828ba3ec7dcd93478b7b98a
Future<String> getMessage() async {
  await Future.delayed(Duration(seconds: 2));
  return 'Hello from the future!';
}

void main() async {
  print('Waiting...');
  String message = await getMessage();
  print(message);
}
```

La palabra clave `async` permite usar `await` dentro de la función para esperar el resultado de operaciones asíncronas.

## Manejo de errores con Future

```dart trycode=f31c9df7ce0bbdac540547a9f08506a0
Future<int> divide(int a, int b) async {
  if (b == 0) throw Exception('Cannot divide by zero');
  return a ~/ b;
}

void main() async {
  try {
    int result = await divide(10, 2);
    print(result);
  } catch (e) {
    print('Error: $e');
  }
}
```

Puedes usar `try-catch` para manejar errores en funciones asíncronas.
