# Laboratorio 5 a nivel conceptual

<!-- tags: SignUpUseCase, arquitectura limpia, quién llama a createProfile, AuthRepository, ProfileRepository,
     data source, cuenta creada sin perfil, capa de dominio, excepción en el registro, BlocListener,
     Supabase.instance.client en el Bloc, permission denied for table profiles -->

El Laboratorio 5 pide registrar un usuario: crear su cuenta y guardar su perfil. Eso son dos operaciones contra Supabase. Esta lección compara cómo quedó el registro con cómo se ve aplicando arquitectura limpia, y muestra qué capa decide el orden entre las dos.

## Review del laboratorio 5

Antes de mover nada, así funciona hoy el registro de `262App3`. A la izquierda está la pantalla; a la derecha, las capas por las que pasa la petición: la vista, el `Bloc` y el SDK de Supabase, que es el único que sale del teléfono.

```interactive
register-layers
```

Pulsa **Registrarme** y sigue los mensajes entre capas. Después prueba tres cosas:

- **Registra dos veces el mismo correo.** Supabase Auth rechaza el segundo `signUp` y el `Bloc` termina en el `catch`.
- **Activa «Falta el grant en profiles».** La cuenta se crea, el `insert` falla y queda una cuenta sin perfil.
- **Pon contraseñas distintas.** La vista detiene el registro y el `Bloc` ni se entera.

Fíjate en que el `Bloc` llama directo a `Supabase.instance.client`. El resto de la lección muestra a dónde se va esa responsabilidad.

## Aplicando arquitectura limpia

El mismo formulario y el mismo Supabase, pero ahora la petición pasa por tres capas: **presentación**, **dominio** y **datos**. Cada servicio de Supabase tiene su propia rama, con su contrato, su implementación y su data source.

```interactive
register-clean
```

Pulsa **Registrarme** y fíjate en qué pieza se ilumina en cada paso:

- **El `Bloc` hace una sola llamada.** Llama a `SignUpUseCase` y espera un `Profile`. No sabe que son dos pasos ni que existe Supabase.
- **`SignUpUseCase` pone el orden.** Primero la cuenta y después el perfil, porque el `Profile` se arma con el `id` que devolvió Auth. Solo conoce los contratos `AuthRepository` y `ProfileRepository`.
- **Solo los data sources usan el SDK.** Convierten la respuesta de Supabase en `AuthUser`, así que de ahí para arriba nadie ve una clase de Supabase.

Después repite los escenarios del review:

- **Con un correo repetido**, `signUp` lanza la excepción y el perfil ni se intenta. Esta vez el formulario vuelve, con el mensaje debajo.
- **Con «Falta el grant en profiles»**, el `UseCase` atrapa el error, cierra la sesión que abrió `signUp` y lanza `SignUpException`. El `Bloc` solo lo convierte en el estado `failure`.
