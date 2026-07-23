# Registro de Usuarios con Supabase

Ahora, vamos a utilizar el procedimiento de registro usando el siguiente método

```dart
Future<void> _signUp() async {
  try {
    final AuthResponse res = await Supabase.instance.client.auth.signUp(
        email: _emailController.text.trim(),
        password: _passwordController.text.trim(),
    );
    print(res.user);
    print(res.session);
  } on AuthException catch (e) {
    print(e);
  } catch (e){
    print(e);
  }
}
```

## ¿Cómo funciona el registro?

El método `supabase.auth.signUp()` es el encargado de crear un nuevo usuario. Recibe un `email` y un `password`.
Por defecto, Supabase envía un correo de confirmación, aunque probemos en este laboratorio qué sucede con el flujo si lo desactivamos

Es importante usar un bloque `try-catch` para manejar errores, como cuando un usuario con el mismo correo ya existe.
En la etapa de registro, las siguientes condiciones son importantes

`res.user != null` 
El usuario existe (se creó o ya estaba).

`res.session != null` 
El usuario ya está autenticado en este momento.

`res.session == null && res.user != null`
El usuario fue creado, pero necesita confirmar su correo antes de loggearse.
