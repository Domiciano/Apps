# Conceptos de programación reactiva

<!-- tags: Stream, listen, cancel, map, debounce, throttle, filter, distinct, broadcast,
     diagrama de canicas, error en un Stream, Bad state: Stream has already been listened to -->

En la programación reactiva, la app no pregunta cada tanto si hay algo nuevo: se suscribe y **reacciona** cuando los datos llegan. Antes de verlo en código, estos son los términos clave. Cada diagrama es una línea de tiempo: lo de la izquierda pasó hace rato y lo de la línea punteada está pasando ahora.

## Datos que llegan con el tiempo

Un **Stream** es una secuencia de datos que llegan uno tras otro, cuando la fuente quiera. Quien escucha no elige el ritmo: puede ser lento, muy rápido o irregular.

```interactive
marble speed
```

## Dato, error y fin

Por un Stream llegan tres cosas: **datos**, **errores** y un **fin**. Un error no cierra el Stream, y después pueden seguir llegando datos. El fin sí lo cierra: ya no llega nada más.

```interactive
marble events
```

## Escuchar y dejar de escuchar

Para recibir hay que hacer **listen**. Quien empieza a escuchar tarde no recibe lo que pasó antes. Con **cancel** deja de recibir, aunque la fuente siga emitiendo. Si nadie cancela, la app sigue escuchando aunque ya no lo necesite.

```interactive
marble listen
```

## Transformar: map

**map** cambia cada dato antes de que llegue al oyente. Llegan los mismos datos, al mismo tiempo, pero transformados: por ejemplo, filas de una tabla convertidas en mensajes.

```interactive
marble map
```

## Descartar: filter y distinct

**filter** solo deja pasar los datos que cumplen una condición. **distinct** descarta un dato igual al anterior. Lo descartado se queda en gris arriba.

```interactive
marble filter
```

```interactive
marble distinct
```

## Cuando llegan demasiado rápido: debounce y throttle

Un buscador que consulta a la base de datos con cada letra haría una petición por tecla. **debounce** espera a que dejes de escribir y solo deja pasar el último dato. **throttle** deja pasar uno y descarta los que lleguen durante un rato.

```interactive
marble debounce
```

```interactive
marble throttle
```

## Un oyente o muchos

Un Stream normal acepta **una sola suscripción**: un segundo `listen` falla con `Bad state: Stream has already been listened to`. Un Stream **broadcast** acepta varios oyentes, y cada uno recibe desde el momento en que empezó a escuchar.

```interactive
marble broadcast
```

Algunos Streams empiezan a emitir cuando alguien escucha, y cada oyente los recibe desde el principio: se llaman **fríos**. Otros ya venían emitiendo y quien llega se une a la mitad: se llaman **calientes**.

En la siguiente lección todo esto aparece en el código del chat.
