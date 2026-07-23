# Laboratorio 2: Componetizando Icesi Music

En este laboratorio, aprenderemos a construir una aplicación Flutter desde cero, enfocándonos en la `componetización`. La componetización es el proceso de dividir una interfaz de usuario compleja en piezas más pequeñas, reutilizables y manejables, llamadas componentes (o Widgets en Flutter).

El objetivo principal es que desarrolles la habilidad de pensar en términos de componentes, diseñándolos y construyéndolos de forma aislada antes de integrarlos en pantallas completas.

## Icesi Music: Una Visión General

Construiremos una aplicación de música simplificada llamada `Icesi Music`. Esta aplicación contará con dos pantallas principales:

`Pantalla de Perfil` Donde el usuario podrá ver su información y estadísticas.

`Pantalla de Playlists` Donde se mostrarán las listas de reproducción del usuario.

La navegación entre estas dos pantallas se realizará a través de una barra de navegación inferior (Bottom Navigation Bar), un componente común en muchas aplicaciones móviles.

## Enfoque del Laboratorio

Para este laboratorio, adoptaremos un enfoque `component first`. Esto significa que antes de empezar a construir las pantallas, nos centraremos en crear cada uno de los widgets individuales que necesitaremos.

## Manos a la obra

Vamos a analizar esta pantalla compuesta por dos `fragmentos` navegables por medio de la `BottomNavBar`.

![Imagen](lab2image1.png "icon")

De acuerdo a esto, desarrolle los siguientes componentes. En cada componente analíce cuáles son las entradas (propiedades)

## AppBar

Aqui puede usar la clase `AppBar` para definir el componente.

![Imagen](lab2image2.png "icon")

## MusicListItem

En este caso debe usar su conocimiento en `Row` y `Colum` para realizar el componente

![Imagen](lab2image3.png "icon")

## FloatingButton

Use la clase `FloatingActionButton`. Esta produce un boton circular. Si lo que quiere es un boton rectangular, para que quepa texto e icono, use el factory method `FloatingActionButton.extended`.

![Imagen](lab2image4.png "icon")

## Stat label

Que permita mostrar una estadística del perfil, con un label de entrada

![Imagen](lab2image5.png "icon")

## Profile View

Donde se puede ver la foto de perfil acompañada del nombre y correo electrónico

![Imagen](lab2image6.png "icon")

## Tabs

Con todas las piezas hechas, genere las dos tabs de la imagen: `ProfileTab` y `PlaylistTab`

## Navegación entre Tabs

Para esto requiere hacer una `Screen` que contenga a cada `Tab`. La Screen como lo hemos visto debe tener sí o sí un `Scaffold`.
Luego de esto, programe la navegación para que se pueda visualzar cada Tab.

## Navegación entre Screens

Ahora cree rápidamente esta screen a la que llamará `NewPlaylistScreen`

![Imagen](lab2image7.png "icon")

Haga que cuando el usuario le de al boton `Crear`, navegue hasta la nueva Screen
