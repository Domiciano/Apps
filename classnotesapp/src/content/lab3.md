# Laboratorio 3: Manejo de listas

## Introducción

En este corto laboratorio nos enfocaremos en producir elementos de lista usando como base el laboratorio 2.
El objetivo es añadir otra `Page` a la aplicación, de modo que sea un buscador de canciones

## `Page` de búsqueda de canciones

Para hacer la búsqueda haga uso de las siguientes URL

```plain
https://api.deezer.com/search?q=eminem
(No tiene los header de CORS)
o
https://i2thub.icesi.edu.co:5443/deezer/search?q=eminem
(Tiene todos los header de CORS)
```

Donde el Request Param `q` es el término de búsqueda.

Prepare entonces la pantalla para que consista es `Column` > `Expanded` > `ListView` de modo que pueda mostrar las canciones que está buscando el usuario por medio de un TextField y un botón.

De momento, sólo deberán mostrarse las canciones
