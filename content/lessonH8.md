# Laboratorio 6 · Muro

Retomemos el laboratorio anterior para añadir una funcionalidad de muro. La idea es que diferentes usuarios puedan publicar en el muro de la aplicación. Este muro consiste en una tabla de `Post`.

Primero edite la navegación de la app para que tenga 2 `Pages` y 1 `Screen`. Por medio de `BottomNavigationBar` puede navegar entre las 2 `Pages` que son `ProfilePage` y `PostPage`

Los usuarios podrán publicar `Post` usando `titulo`, `contenido`, `fecha de creación` y `url de imagen`

Los usuarios podrán ver los post desde el más reciente al más antiguo. La vista esperada es una `Card` con la `imagen` en la parte superior y en la parte inferior debe estar el `titulo`, el `contenido` y el `nombre de autor`.

Los usuarios podrán ir a su perfil y ver sus últimas 3 publicaciones.

## Reto

Usar la lista completa `Post` puede implicar descargar demasiada información. Su tarea es paginar esta lista de modo que la aplicación muestre progresivamente las publicaciones.

Puede usar eventos para lograrlo

- Un botón al final de la lista que sea de `Mostrar más`
- Al llegar al final de la ListView se hace un nuevo request
