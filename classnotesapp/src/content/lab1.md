# UI Basics con Jetpack Compose

El objetivo del taller es utilizar los elementos básicos de Jetpack Compose para construir Components y Screens. Se usarán los layout convencionales para acomodar los widget convencionales, además se utilizarán los modificadores para definir las dimensiones.
Consulte el siguiente link para descargar los recursos

[Proyecto de Figma](https://www.figma.com/design/p0BC4jwSeRZrAfpxQ7CaJd/Login-Mobile-App-Screens-%7C-Free-(Community)?node-id=6-60&t=NJEheAiP3AIiwfaG-1)

## 1. Piezas base de una pantalla de perfil

Una interfaz rara vez se construye de una sola vez: se arma a partir de componentes pequeños que luego se combinan. En Jetpack Compose, la forma más simple de componente es un widget sin estado propio (stateless widget): una función `@Composable` que recibe datos por parámetros y únicamente se encarga de mostrarlos, sin manejar ninguna variable interna.

En este punto construirá, uno por uno, los componentes más pequeños que luego usará para armar la pantalla de perfil. Empiece por estas tres piezas base:

### Elemento de conversación

Una fila que representa un chat: foto de contacto, nombre, hora del último mensaje, texto de la vista previa y el ícono de estado de lectura.

![Imagen](Lab1Item1.png "icon")

### Bloque de información de perfil

Foto de perfil, nombre, usuario/rol y una breve descripción, junto con el correo y la ubicación.

![Imagen](Lab1Item2.png "icon")

### Indicador numérico

Un componente pequeño que muestra un número junto a su etiqueta, como en un contador de publicaciones o seguidores.

![Imagen](Lab1Item3.png "icon")

Con estas tres piezas listas, combínelas para construir componentes más grandes:

### Fila de estadísticas

Reutilice el indicador numérico tres veces para formar una fila con publicaciones, seguidores y seguidos.

![Imagen](Lab1Block1.png "icon")

### Tarjeta de perfil

Reutilice el bloque de información de perfil dentro de una tarjeta, agregando un botón de edición.

![Imagen](Lab1Block2.png "icon")

### Lista de últimas conversaciones

Reutilice el elemento de conversación varias veces debajo de un encabezado con un enlace de "Ver todas".

![Imagen](Lab1Block3.png "icon")

## 2. Pantalla de Login Convencional

Defina primero los composables, luego arme las pantallas de login y de registro
Para probar esta segunda pantalla, defina el composable que se mostrará en el método onCreate. En este punto aún no sabemos cómo navegar entre pantallas

![Imagen](Lab1Image2.png "icon")

## 3. Ensamblando la pantalla de perfil

Ya tiene todas las piezas construidas. Ahora ensámblelas para completar la pantalla: coloque la fila de estadísticas dentro de la tarjeta de perfil y luego apile esta tarjeta junto con la lista de últimas conversaciones.

Para lograr la imagen de perfil circular NO use un PNG ya recortado. En su lugar, use modificadores para crear el marco requerido.

![Imagen](Lab1Screen1.png "icon")
