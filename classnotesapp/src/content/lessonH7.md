[t] Relaciones y obtención de datos anidados
Vamos a extender nuestro ejemplo para trabajar con relaciones entre tablas.
Crearemos una tabla profiles que tendrá varios posts. Así podremos obtener datos anidados (por ejemplo, traer un post junto con la información del profile que lo creó).
[code:sql]
create table profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  created_at timestamp with time zone default now()
);
create table posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  created_at timestamp with time zone default now(),
  profile_id uuid references profiles(id) on delete cascade
);
[endcode]

[st] Lectura de datos anidados
Cuando existen llaves foráneas, Supabase puede resolver joins automáticos sin necesidad de escribir SQL manual.
Por ejemplo, para obtener todos los posts junto con su autor:
[code:dart]
final supabase = Supabase.instance.client;

Future<List<Post>> getPostsWithProfile() async {
  final response = await supabase
    .from('posts')
    .select('id, title, content, created_at, profiles(name, email)')
    .order('created_at', ascending: false)
    .limit(10);

  final data = response as List;
  return data.map((e) => Post.fromJson(e)).toList();
}
[endcode]
El resultado trae cada post con su perfil anidado
[code:js]
[
  {
    "id": "1",
    "title": "Hola mundo",
    "content": "Mi primer post",
    "created_at": "2025-10-06T10:00:00Z",
    "profiles": {
      "name": "Domiciano Rincón",
      "email": "domi@example.com"
    }
  }
]
[endcode]
[list]
Supabase usa automáticamente las llaves foráneas para resolver relaciones.
El nombre entre paréntesis (profiles(...)) indica los campos que quiero traer.
El join es automático: no se necesita escribir SQL.
[endlist]

[st] Relaciones más profundas
Si tenemos una tercera tabla, por ejemplo comments, podemos anidar aún más:
[code:sql]
create table comments (
  id uuid primary key default gen_random_uuid(),
  body text not null,
  post_id uuid references posts(id),
  created_at timestamp with time zone default now()
);
[endcode]
Y podemos traer todo en una sola query
[code:dart]
final response = await supabase
  .from('comments')
  .select('id, body, created_at, posts(title, profiles(name))')
  .order('created_at', ascending: false);
[endcode]
Esto devuelve comentarios con el post al que pertenecen y el perfil del autor de ese post.
[st] Inserción anidada
Supabase también permite inserciones anidadas siempre que las relaciones estén definidas.
Por ejemplo, crear un profile con varios posts de una sola vez:
[code:dart]
final response = await supabase
  .from('profiles')
  .insert({
    'name': 'Gabriel García Márquez',
    'email': 'ggm@example.com',
    'posts': [
      {'title': 'Cien años de soledad', 'content': 'Realismo mágico'},
      {'title': 'El coronel no tiene quien le escriba', 'content': 'Clásico'}
    ]
  })
  .select('*, posts(*)'); // También devuelve los posts creados
[endcode]

[list]
El campo posts debe tener una relación declarada en la base de datos (foreign key).
Supabase infiere el join y hace la inserción anidada automáticamente.
Puedes usar `.select('*, posts(*)')` para recibir todo el árbol creado.
[endlist]

[st] Post que pertenece al usuario autenticado
En una app real, los posts deben pertenecer al usuario que los crea. Supabase Auth nos da acceso al usuario activo a través de `supabase.auth.currentUser`, y podemos usar su `id` directamente como `profile_id` al insertar.
[code:dart]
Future<void> createPostForCurrentUser({
  required String title,
  required String content,
}) async {
  final supabase = Supabase.instance.client;

  final user = supabase.auth.currentUser;
  if (user == null) throw Exception('No hay usuario autenticado');

  final response = await supabase
    .from('posts')
    .insert({
      'title': title,
      'content': content,
      'profile_id': user.id,
    })
    .select()
    .single();

  print('Post creado: $response');
}
[endcode]
El `user.id` corresponde al `id` del usuario en Supabase Auth, que debe coincidir con el `id` del perfil en la tabla `profiles`.
[list]
`supabase.auth.currentUser` devuelve el usuario de la sesión activa, o `null` si no hay sesión.
El `profile_id` se asigna con `user.id` — no hay que pedírselo al usuario ni calcularlo.
`.select().single()` devuelve el registro recién insertado como un `Map`.
Si usas RLS (Row Level Security), puedes configurar políticas para que solo el dueño pueda crear o ver sus posts.
[endlist]
