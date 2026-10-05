# Inicio de Sesión con Supabase y Flutter

<!-- tags: signInWithPassword, signUp, signOut, AuthException, currentUser, onAuthStateChange, AuthResponse, Invalid login credentials, Email not confirmed, User already registered -->

En esta lección autenticamos usuarios con `Supabase Auth` desde Flutter: registro, inicio de sesión, cierre de sesión y cómo saber quién está autenticado. Todos los ejemplos usan el cliente de Supabase ya inicializado, que en el código se escribe `supabase` (`final supabase = Supabase.instance.client;`).

## Registro

Crear un usuario nuevo se hace con `signUp`, que recibe un `email` y un `password`.

```dart
Future<void> _signUp() async {
  try {
    final AuthResponse res = await supabase.auth.signUp(
      email: _emailController.text.trim(),
      password: _passwordController.text.trim(),
    );
    print(res.user);
    print(res.session);
  } on AuthException catch (error) {
    print(error.message);
  } catch (error) {
    print(error);
  }
}
```

La respuesta trae un `user` y una `session`, y su combinación dice qué pasó:

- `res.user != null` y `res.session != null`: el usuario se creó y ya está autenticado.
- `res.user != null` y `res.session == null`: el usuario se creó, pero debe confirmar su correo antes de iniciar sesión. Es el comportamiento por defecto de Supabase.
- Si la contraseña es débil o el correo es inválido, se lanza una `AuthException`. Por eso el `try/catch`. Con la confirmación de correo desactivada, un correo ya registrado lanza `User already registered`; con ella activada, Supabase no revela si el correo ya existía y responde como si fuera nuevo.

En *Configurando los servicios* desactivaste la confirmación de correo, así que `signUp` devuelve la sesión de inmediato. También se puede cambiar en el panel de Supabase, en `Authentication > Providers > Email`.

## Pantalla de login

La pantalla de inicio de sesión es muy similar a la de registro. Necesita:

- Dos `TextEditingController` (email y password), declarados en el `State` y liberados en `dispose()`.
- Dos `TextField`, el de la contraseña con `obscureText: true`.
- Un botón que llame a la función `_signIn`.

Realiza esta pantalla de una forma sencilla.

## Inicio de sesión

El método `signInWithPassword` del cliente de Supabase autentica a un usuario con su correo y contraseña.

```dart
Future<void> _signIn() async {
  try {
    final AuthResponse res = await supabase.auth.signInWithPassword(
      email: _emailController.text.trim(),
      password: _passwordController.text.trim(),
    );
    print(res.user);
    print(res.session);
  } on AuthException catch (error) {
    print(error.message);
  } catch (error) {
    print(error);
  }
}
```

Los errores más comunes llegan como `AuthException`:

- `Invalid login credentials`: correo o contraseña incorrectos.
- `Email not confirmed`: el usuario se registró pero no confirmó su correo.

## Cerrar sesión

Para cerrar la sesión de un usuario, llama al método `signOut`.

```dart
await supabase.auth.signOut();
```

## Usuario actual

Si ya estás autenticado, siempre puedes acceder al usuario con:

```dart
final user = supabase.auth.currentUser;
```

Si es diferente de `null`, hay un usuario con la sesión iniciada, y su id está en `user.id`. La sesión se guarda en el dispositivo, así que `currentUser` sigue disponible cuando se cierra y se abre la app.

## Escuchar cambios de sesión

`onAuthStateChange` es un `Stream` que emite cada vez que cambia la sesión: al iniciar sesión, al cerrarla y cuando se renueva el token. Sirve para redirigir al usuario sin depender de quién llamó a `signIn` o `signOut`. Suscríbete en `initState` y cancela la suscripción en `dispose()`.

```dart
supabase.auth.onAuthStateChange.listen((data) {
  if (data.event == AuthChangeEvent.signedIn) {
    Navigator.pushReplacementNamed(context, '/home');
  } else if (data.event == AuthChangeEvent.signedOut) {
    Navigator.pushReplacementNamed(context, '/login');
  }
});
```
