# TextField

El widget `TextField` es fundamental para permitir a los usuarios introducir texto en tu aplicación. Es altamente personalizable y soporta diversas configuraciones para la entrada de datos.

## Uso Básico

El uso más simple de un `TextField` es sin ninguna configuración adicional. Esto creará un campo de texto básico.

```dart
TextField()
```

## Controladores de Texto (TextEditingController)

Para obtener el texto introducido por el usuario o para establecer el texto programáticamente, se utiliza un `TextEditingController`. Es una buena práctica asociar un controlador a cada `TextField`.

```dart
TextEditingController _controller = TextEditingController();
...
TextField(
  controller: _controller,
)
```

El lugar adecuado para declarar el `TextEditingController` es en una clase `State` de un `StatefulWidget`.

```dart trycode=8d35af6ef04e6ef7045b2ce842028bd4
import 'package:flutter/material.dart';

class FormScreen extends StatefulWidget {
  const FormScreen({super.key});
  @override
  State<FormScreen> createState() => FormScreenState();
}

class FormScreenState extends State<FormScreen> {
  final _controller = TextEditingController();
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: TextField(
          controller: _controller,
          decoration: const InputDecoration(
            labelText: "Escribe algo"
          ),
          onChanged: (text) {
            print('Texto actual: $text');
          },
        ),
      ),
    );
  }
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: const FormScreen()
    );
  }
}

void main() {
  runApp(const MyApp());
}
```

## Extracción de texto

Simplemente usando `_controller.text` se puede acceder al texto escrito en el `TextField`. Observa este ejemplo.

En el ejemplo se extrae el texto para ser usado como una variable de estado. Ten en cuenta que la variable `_controller.text` es en sí misma un estado también, pero no es de solo lectura. Por lo tanto, evita usar la variable de forma directa como si fuera una variable de estado, ya que cuando lo quieras cambiar, no podrías usar el método `setState`.

```dart trycode=f5c5c94135b2d27e13bd5f50a011288d
import 'package:flutter/material.dart';

class FormScreen extends StatefulWidget {
  const FormScreen({super.key});
  @override
  State<FormScreen> createState() => FormScreenState();
}

class FormScreenState extends State<FormScreen> {
  final _controller = TextEditingController();
  String _textoMostrado = "";

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Formulario con Label")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextField(
              controller: _controller,
              decoration: const InputDecoration(labelText: "Escribe algo"),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                setState(() {
                  _textoMostrado = _controller.text; // 🔹 Guardamos el texto al presionar el botón
                });
              },
              child: const Text("Mostrar texto"),
            ),
            const SizedBox(height: 20),
            Text(
              _textoMostrado,
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(home: FormScreen());
  }
}

void main() {
  runApp(const MyApp());
}
```

## InputDecoration

La propiedad `decoration` de `TextField` acepta un objeto `InputDecoration`, que permite añadir etiquetas, texto de ayuda, iconos, bordes y más, para mejorar la experiencia de usuario.

## LabelText

`labelText` muestra una etiqueta flotante que se anima cuando el campo está en foco.

```dart
TextField(
  decoration: InputDecoration(
    labelText: 'Nombre de Usuario',
  ),
)
```

## Borde

Puedes añadir diferentes tipos de bordes, como `OutlineInputBorder` para un borde rectangular.

```dart
TextField(
  decoration: InputDecoration(
    labelText: 'Contraseña',
    border: OutlineInputBorder(),
  ),
  obscureText: true, // Para campos de contraseña
)
```

## Iconos

`prefixIcon` y `suffixIcon` permiten añadir iconos al inicio o al final del campo de texto.

```dart
TextField(
  decoration: InputDecoration(
    labelText: 'Buscar',
    prefixIcon: Icon(Icons.search),
    suffixIcon: Icon(Icons.clear),
  ),
)
```

## Texto de Ayuda (helperText, hintText)

- `helperText`: Texto que aparece debajo del campo de texto.
- `hintText`: Texto que aparece dentro del campo cuando está vacío.

```dart
TextField(
  decoration: InputDecoration(
    hintText: 'Introduce tu email',
    helperText: 'Nunca compartiremos tu email.',
  ),
)
```

## Ejemplo Completo

Aquí tienes un ejemplo completo y funcional que demuestra cómo usar el widget `TextField` con controladores y diversas decoraciones.

```dart trycode=f9ea28d713db887153bb4fc11d755377
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Ejemplo TextField Widget',
      home: MyTextFieldScreen(),
    );
  }
}

class MyTextFieldScreen extends StatefulWidget {
  const MyTextFieldScreen({super.key});

  @override
  State<MyTextFieldScreen> createState() => _MyTextFieldScreenState();
}

class _MyTextFieldScreenState extends State<MyTextFieldScreen> {
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Widget TextField')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextField(
              controller: _nameController,
              decoration: const InputDecoration(
                labelText: 'Nombre Completo',
                hintText: 'Escribe tu nombre aquí',
                prefixIcon: Icon(Icons.person),
                border: OutlineInputBorder(),
              ),
              onChanged: (text) {
                print('Nombre: $text');
              },
            ),
            const SizedBox(height: 20),
            TextField(
              controller: _emailController,
              keyboardType: TextInputType.emailAddress,
              decoration: const InputDecoration(
                labelText: 'Correo Electrónico',
                hintText: 'ejemplo@dominio.com',
                suffixIcon: Icon(Icons.email),
                helperText: 'Introduce un correo válido',
                border: UnderlineInputBorder(),
              ),
              onChanged: (text) {
                print('Email: $text');
              },
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (context) => AlertDialog(
                    title: const Text('Datos Ingresados'),
                    content: Text(
                      'Nombre: ${_nameController.text}\nEmail: ${_emailController.text}',
                    ),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text('OK'),
                      ),
                    ],
                  ),
                );
              },
              child: const Text('Mostrar Datos'),
            ),
          ],
        ),
      ),
    );
  }
}
```

.
