# Enviar datos a base de datos

Vamos a supabase y creamos el modelo de datos. Nos vamosa basar por supuesto en la [Guía de Supabase para Flutter](https://supabase.com/docs/reference/dart/select)

```sql
create table posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  created_at timestamp with time zone default now()
);
```

Luego, podemos crear un modelo de datos correspondiente. Note cómo le podemos valor por defecto a `createdAt`.

```dart
class Post {
  final String id;
  final String title;
  final String content;
  final DateTime createdAt;

  Post({
    required this.id,
    required this.title,
    required this.content,
    required this.createdAt,
  });

  /// Para enviar a Supabase
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'content': content,
      'created_at': createdAt.toIso8601String(),
    };
  }

  /// Para leer desde Supabase
  factory Post.fromJson(Map<String, dynamic> json) {
    return Post(
      id: json['id'] as String,
      title: json['title'] as String,
      content: json['content'] as String,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }
}
```

Se puede enviar asi

```dart
import 'package:supabase_flutter/supabase_flutter.dart';

final supabase = Supabase.instance.client;

Future<void> createPost(Post post) async {
  final response = await supabase.from('posts').insert(post.toJson());

  if (response.error != null) {
    throw Exception('Error insertando post: ${response.error!.message}');
  }
}
```

Y posteriormente se pueden recuperar asi

```dart
Future<List<Post>> getPosts() async {
  final response = await supabase.from('posts').select();

  if (response.error != null) {
    throw Exception('Error consultando posts: ${response.error!.message}');
  }
  
  final data = response.data as List;
  return data.map((e) => Post.fromJson(e)).toList();
}
```

- Definir el modelo Dart con toJson() y fromJson().
- Crear la tabla en Supabase con SQL.
- Usar supabase.from('tabla').insert() para enviar.
- Usar supabase.from('tabla').select() para leer.

## Paginacion

Si quiero los primeros 10 registros

```dart
final response = await supabase
    .from('posts')
    .select()
    .order('created_at', ascending: false)
    .range(0, 9);
```

Si quiero los segundos 10 registros

```dart
final response = await supabase
    .from('posts')
    .select()
    .order('created_at', ascending: false)
    .range(10, 19);
```

## Filtros

```dart
final response = await supabase
    .from('profiles')
    .select()
    .eq('username', 'alfredo123');
```

Así como `eq` (equals), están los de mayor / menor (gt, gte, lt, lte)

```dart
final res = await supabase
    .from('posts')
    .select()
    .gt('likes', 100); // likes > 100
```

También el operador `LIKE`

```dart
final res = await supabase
    .from('profiles')
    .select()
    .like('full_name', '%Rincón%'); // contiene "Rincón"
```

O coincidencia dentro de una lista de valores

```dart
final res = await supabase
    .from('profiles')
    .select()
    .inFilter('username', ['pepe', 'maria', 'juan']);
```

.
