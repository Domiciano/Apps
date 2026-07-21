# Introducción a Bloc

Después de aprender a manejar el estado con `Cubit`, el siguiente paso natural en el ecosistema de `flutter_bloc` es entender `Bloc`. Mientras que `Cubit` es ideal por su simplicidad, `Bloc` ofrece más potencia y trazabilidad al costo de un poco más de código (verboso, si. Pero poderoso).

## ¿Qué es un Bloc?

Un `Bloc` (Business Logic Component) es similar a un `Cubit` en que ambos manejan un estado y lo exponen a la UI. La diferencia fundamental radica en cómo se procesan los cambios de estado.

- `Cubit`: Expones funciones públicas que la UI puede llamar directamente para emitir nuevos estados. Es directo y simple.
- `Bloc`: En lugar de funciones, despachas `eventos`. El `Bloc` recibe estos eventos, procesa la lógica correspondiente y luego emite nuevos estados.

Este enfoque basado en eventos hace que `Bloc` sea más explícito sobre las interacciones que pueden ocurrir. Cada interacción es un evento, lo que facilita el seguimiento, el registro de logs y las pruebas.

## Componentes Clave de un Bloc

Un `Bloc` se compone de tres partes principales: Eventos, Estados y el propio Bloc.

## 1. Eventos (Events)

Los eventos son las entradas del `Bloc`. Representan una acción del usuario o un suceso del sistema que requiere un cambio de estado. Se definen como clases.

```dart
// Archivo: counter_event.dart
abstract class CounterEvent {}

// Evento para incrementar el contador
class CounterIncrementPressed extends CounterEvent {}

// Evento para decrementar el contador
class CounterDecrementPressed extends CounterEvent {}
```

## 2. Estados (States)

El estado es la salida del `Bloc`, similar a como funciona en `Cubit`. Representa una parte de la UI de tu aplicación.

```dart
// Archivo: counter_state.dart
class CounterState {
  final int count;
  const CounterState(this.count);
}
```

## 3. El Bloc (Bloc)

El `Bloc` es donde reside la lógica de negocio. Escucha los eventos entrantes y los transforma en estados salientes.

```dart
// Archivo: counter_bloc.dart
import 'package:flutter_bloc/flutter_bloc.dart';
import 'counter_event.dart';
import 'counter_state.dart';

class CounterBloc extends Bloc<CounterEvent, CounterState> {
  // Define el estado inicial
  CounterBloc() : super(const CounterState(0)) {
    // Registra manejadores de eventos
    on<CounterIncrementPressed>((event, emit) {
      // Emite un nuevo estado con el contador incrementado
      emit(CounterState(state.count + 1));
    });

    on<CounterDecrementPressed>((event, emit) {
      // Emite un nuevo estado con el contador decrementado
      if (state.count > 0) {
        emit(CounterState(state.count - 1));
      }
    });
  }
}
```

- `CounterBloc` extiende `Bloc<CounterEvent, CounterState>`.
- El constructor define el estado inicial.
- El método `on<EventType>` registra un manejador para un tipo de evento específico. Dentro de este manejador, se emiten nuevos estados con `emit()`.

## Usando el Bloc en la UI

La integración con la UI es muy parecida a la de `Cubit`, pero en lugar de llamar a una función, se añade un evento al `Bloc`.
Lo primero es usar nuestro amigo el BlocProvider para proveer de la instancia de `BloC` necesaria.

```dart
class CounterPage extends StatelessWidget {
  const CounterPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Bloc Counter')),
      body: BlocProvider(
        create: (_) => CounterBloc(),
        child: const CounterView(),
      ),
    );
  }
}
```

Luego, usamos la lectura de contexto para agregar el evento. Note que le pasamos el evento por medio del método `add`. 

```dart
//Estamos en la capa UI
FloatingActionButton(
  onPressed: () => context.read<CounterBloc>().add(CounterIncrementPressed()),
  child: const Icon(Icons.add),
)
```

El `BloC` entonces recibe la nueva instancia del evento lo que activa este método `on` definido para el evento

```dart
//Estamos en la capa BloC
on<CounterIncrementPressed>((event, emit) {
  emit(CounterState(state.count + 1));
});
```

Esto emite un nuevo estado a la vista y la vista lo puede cargar por medio de nuestro otro amigo el `BlocBuilder`

```dart
//Estamos en la capa UI
BlocBuilder<CounterBloc, CounterState>(
  builder: (context, state) {
    return Text('${state.count}');
  },
)
```

La principal diferencia de `Cubit` y `BloC` es el uso de `context.read<CounterBloc>().add(MyEvent())` para despachar un evento, en lugar de `context.read<MyCubit>().myFunction()`.

## ¿Cuándo usar Bloc en lugar de Cubit?

Usa `Cubit` para lógica de estado simple. Es más rápido de escribir y más fácil de entender.
Usa `Bloc` cuando tengas una lógica de estado compleja, con múltiples eventos que pueden ocurrir y necesitas una clara trazabilidad de los cambios de estado. Es ideal para flujos de trabajo paso a paso o máquinas de estado complejas.
