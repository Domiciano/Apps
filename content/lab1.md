# UI Basics con Flutter

El objetivo del taller es utilizar los elementos básicos de Flutter para construir Components y Screens. Se usarán los layout convencionales para acomodar los widgets convencionales, además se utilizarán las propiedades de tamaño y los widgets de decoración para definir las dimensiones.
Consulte el siguiente link para descargar los recursos

[Proyecto de Figma](https://www.figma.com/design/cn5cLhBPnuJC4tvewTtVmq/Aplicaciones-M%C3%B3viles?node-id=2014-421&t=oULdr2bxOVE437ux-1)

## 1. Piezas base de una pantalla de perfil

Una interfaz rara vez se construye de una sola vez: se arma a partir de componentes pequeños que luego se combinan. En Flutter, la forma más simple de componente es un widget sin estado propio (stateless widget): una clase que extiende `StatelessWidget`, recibe datos por parámetros en su constructor y únicamente se encarga de mostrarlos en su método `build`, sin manejar ninguna variable interna.

En este punto construirá, uno por uno, los componentes más pequeños que luego usará para armar la pantalla de perfil. Empiece por estas tres piezas base:

### Elemento de conversación

Una fila que representa un chat: foto de contacto, nombre, hora del último mensaje, texto de la vista previa y el ícono de estado de lectura.

![Imagen](Lab1Item1.png "frame60")

### Bloque de información de perfil

Foto de perfil, nombre, usuario/rol y una breve descripción, junto con el correo y la ubicación.

![Imagen](Lab1Item2.png "frame60")

### Indicador numérico

Un componente pequeño que muestra un número junto a su etiqueta, como en un contador de publicaciones o seguidores.

![Imagen](Lab1Item3.png "frame60")

Con estas tres piezas listas, combínelas para construir componentes más grandes:

### Fila de estadísticas

Reutilice el indicador numérico tres veces para formar una fila con publicaciones, seguidores y seguidos.

![Imagen](Lab1Block1.png "frame60")

### Tarjeta de perfil

Reutilice el bloque de información de perfil dentro de una tarjeta, agregando un botón de edición.

![Imagen](Lab1Block2.png "frame60")

### Lista de últimas conversaciones

Reutilice el elemento de conversación varias veces debajo de un encabezado con un enlace de "Ver todas".

![Imagen](Lab1Block3.png "frame60")

## 2. Ensamblando la pantalla de perfil

Ya tiene todas las piezas construidas. Ahora ensámblelas para completar la pantalla: coloque la fila de estadísticas dentro de la tarjeta de perfil y luego apile esta tarjeta junto con la lista de últimas conversaciones.

Para lograr la imagen de perfil circular NO use un PNG ya recortado. En su lugar, use widgets como `CircleAvatar`, `ClipOval` o una decoración con forma circular para crear el marco requerido.

![Imagen](Lab1Screen1.png "frame60")

## 3. Pantalla de Login Convencional

Defina primero los widgets, luego arme las pantallas de login y de registro
Para probar esta segunda pantalla, defina el widget que se mostrará como `home` de la `MaterialApp` dentro de la función `main`. En este punto aún no sabemos cómo navegar entre pantallas

![Imagen](Lab1Image2.png "icon")
