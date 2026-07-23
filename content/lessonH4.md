# Auth y DB

Lo que debemos hacer es que los usuarios que registramos, deben estar realmente en dos registros de los servicios de supabase.

El primero es `Auth` que ya lo vimos.

Ahora, vamos a ver qué debemos hacer para enviar el resto de datos que levantamos en el proceso de registro.

## Tabla Profile

Es una tabla como cualquier otra, pero lleva una referencia al UID de la tabla de Authentitcation

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  created_at timestamp with time zone default now()
);
```

De esta manera, si se elimina un usuario de Auth, se elimina su registro dentro de nuestra nueva tabla

## Modelo de Profile

Luego, puede modelar la clase Profile para que tenga la forma de tranformarse en Json y vice versa.

```dart
class Profile {
  final String id; // UID de Supabase Auth
  final String name;
  final DateTime createdAt;

  Profile({
    required this.id,
    required this.name,
    required this.createdAt,
  });

  /// Para enviar a Supabase (ej: insert)
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'created_at': createdAt.toIso8601String(),
    };
  }

  /// Para leer desde Supabase (ej: select)
  factory Profile.fromJson(Map<String, dynamic> json) {
    return Profile(
      id: json['id'] as String,
      name: json['name'] as String,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }
}
```

## Row lever security policy

Si su interés es hacer una tabla muy segura donde sólo el usuario dueño del registro sea quien puede ver su información, puede anexar esta RLS policy.

- Sólo añada esto hasta probar que funciona el laboratorio

```sql
-- Activa Row Level Security en la tabla
alter table profiles enable row level security;

-- Permitir SELECT solo al dueño de la fila
create policy "Users can view their own profile"
on profiles for select
using (auth.uid() = id);

-- Permitir UPDATE solo al dueño de la fila
create policy "Users can update their own profile"
on profiles for update
using (auth.uid() = id);

-- Permitir INSERT solo al dueño de la fila (cuando coincide con su UID)
create policy "Users can insert their own profile"
on profiles for insert
with check (auth.uid() = id);
```

.
