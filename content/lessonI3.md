# Consultas Anidadas

## Combinando Condiciones con `.or()`

El método `.or()` en el SDK de Supabase para Flutter te permite combinar múltiples condiciones de filtro con una lógica OR. Esto es extremadamente útil para construir consultas complejas donde un registro puede coincidir con cualquiera de varias expresiones.

La sintaxis de `.or()` espera una cadena de texto que define las condiciones, separadas por comas para la lógica OR. Puedes anidar condiciones usando `and(...)` para agrupar múltiples filtros con lógica AND dentro de una de las ramas del OR.

Nota Importante sobre `.or()`: Solo debes usar un método `.or()` por instrucción (consulta). Todas las condiciones OR que necesites deben ir dentro de esa única llamada, ya sea como un string separado por comas o como una lista de filtros. Encadenar múltiples `.or()` en la misma consulta podría sobrescribir las condiciones anteriores.

## Ejemplo: Encontrar una Conversación entre Dos Usuarios

Considera el escenario de buscar una conversación existente entre dos usuarios específicos, `profile1Id` y `profile2Id`. La conversación podría estar registrada de dos maneras: `profile1_id` es el primer usuario y `profile2_id` el segundo, o viceversa.

Aquí es donde `.or()` brilla:

```dart
final response = await Supabase.instance.client
          .from('conversations')
          .select()
          .or(
            'and(profile1_id.eq.$profile1Id,profile2_id.eq.$profile2Id),and(profile1_id.eq.$profile2Id,profile2_id.eq.$profile1Id)',
          )
          .maybeSingle();
      print(response);
```

- `from('conversations').select()`: Selecciona todos los campos de la tabla `conversations`.
- `.or(...)`: Aplica la lógica OR a las dos condiciones principales:
- *   `and(profile1_id.eq.$profile1Id,profile2_id.eq.$profile2Id)`: Busca una conversación donde el `profile1_id` coincida con el primer usuario Y el `profile2_id` coincida con el segundo usuario.
- *   `and(profile1_id.eq.$profile2Id,profile2_id.eq.$profile1Id)`: Busca una conversación donde el `profile1_id` coincida con el segundo usuario Y el `profile2_id` coincida con el primer usuario.
- `.maybeSingle()`: Intenta obtener un único registro. Si no se encuentra ningún registro o se encuentran múltiples, devuelve `null` o lanza un error si se encuentran múltiples y no se espera. Es útil cuando esperas cero o un resultado.

Este patrón es muy potente para manejar la flexibilidad en la forma en que los datos pueden estar almacenados o para construir búsquedas con múltiples criterios alternativos.

## Sintaxis con Lista de Filtros para `.or()`

Para una mayor claridad y control programático, especialmente cuando las condiciones se construyen dinámicamente, puedes pasar una lista de strings al método `.or()`. Cada string en la lista representa una cláusula OR, y dentro de cada string, puedes usar la sintaxis `and(...)` para agrupar condiciones AND.

```dart
final response = await Supabase.instance.client
    .from('conversations')
    .select()
    .or([
      // Primera cláusula OR: profile1_id = X AND profile2_id = Y
      'and(profile1_id.eq.$profile1Id,profile2_id.eq.$profile2Id)',
      // Segunda cláusula OR: profile1_id = Y AND profile2_id = X
      'and(profile1_id.eq.$profile2Id,profile2_id.eq.$profile1Id)',
    ])
    .maybeSingle();
print(response);
```

Esta forma es equivalente a la sintaxis de string única con comas, pero puede ser más legible y fácil de manejar cuando tienes muchas condiciones o cuando las construyes en tiempo de ejecución.

## `AND` con Múltiples `OR` Anidados

Puedes construir condiciones aún más complejas anidando múltiples cláusulas `OR` dentro de una condición `AND`. Esto te permite especificar que un registro debe cumplir con *varios grupos* de criterios, donde cada grupo es una opción entre varias.

La sintaxis general sería `and(or(cond1,cond2),or(cond3,cond4))`. 

```dart
final response = await Supabase.instance.client
    .from('users')
    .select()
    .or(
      'and(or(status.eq.active,plan.eq.premium),or(country.eq.USA,country.eq.Canada))',
    )
    .execute(); // Usamos .execute() para obtener una lista de resultados
print(response.data);
```

En este ejemplo, la consulta busca usuarios que cumplan ambas condiciones:

- Que su `status` sea 'active' O su `plan` sea 'premium'.
- Y
- Que su `country` sea 'USA' O 'Canada'.

Esta estructura es muy potente para filtrar datos con requisitos complejos y combinatorios.
