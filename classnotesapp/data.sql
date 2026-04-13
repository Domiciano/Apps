
-- SQL Migration Script
-- Generated on: 2026-02-24T14:34:32.956Z

-- Drop existing table to ensure a clean slate
DROP TABLE IF EXISTS lessons;

-- Create the lessons table
CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optional: A function to automatically update the updated_at timestamp on record change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_lessons_updated_at
BEFORE UPDATE ON lessons
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Begin data insertion

-- Inserting content for: lab1
INSERT INTO lessons (slug, content) VALUES ('lab1', E'[t] UI Basics con Jetpack Compose
El objetivo del taller es utilizar los elementos básicos de Jetpack Compose para construir Components y Screens. Se usarán los layout convencionales para acomodar los widget convencionales, además se utilizarán los modificadores para definir las dimensiones.
Consulte el siguiente link para descargar los recursos
[link] (Proyecto de Figma) https://www.figma.com/design/p0BC4jwSeRZrAfpxQ7CaJd/Login-Mobile-App-Screens-%7C-Free-(Community)?node-id=6-60&t=NJEheAiP3AIiwfaG-1 


[st] 1. Componente de lista de chats de Whatsapp
La siguiente imagen es una muestra de un contacto en Whatsapp. Intente replicarlo
[icon] Lab1Image1.png

[st] 2. Pantalla de Login Convencional
Defina primero los composables, luego arme las pantallas de login y de registro
Para probar esta segunda pantalla, defina el composable que se mostrará en el método onCreate. En este punto aún no sabemos cómo navegar entre pantallas
[icon] Lab1Image2.png

[st] 3. Card
Las card son elementos importantes de las interfaces hoy en día. Cree esta tarjeta como un composable. Use cualquier imagen de fondo y cualquier imagen de perfil. Para lograr la imagen circular NO use PNG de una vez recortados. En su lugar, busque la manera de usar modificadores para crear el marco requerido.

[icon] Lab1Image3.png
');

-- Inserting content for: lab2
INSERT INTO lessons (slug, content) VALUES ('lab2', E'[t] Laboratorio 2: Componetizando Icesi Music

En este laboratorio, aprenderemos a construir una aplicación Flutter desde cero, enfocándonos en la `componetización`. La componetización es el proceso de dividir una interfaz de usuario compleja en piezas más pequeñas, reutilizables y manejables, llamadas componentes (o Widgets en Flutter).

El objetivo principal es que desarrolles la habilidad de pensar en términos de componentes, diseñándolos y construyéndolos de forma aislada antes de integrarlos en pantallas completas.

[st] Icesi Music: Una Visión General

Construiremos una aplicación de música simplificada llamada `Icesi Music`. Esta aplicación contará con dos pantallas principales:

`Pantalla de Perfil` Donde el usuario podrá ver su información y estadísticas.

`Pantalla de Playlists` Donde se mostrarán las listas de reproducción del usuario.

La navegación entre estas dos pantallas se realizará a través de una barra de navegación inferior (Bottom Navigation Bar), un componente común en muchas aplicaciones móviles.

[st] Enfoque del Laboratorio
Para este laboratorio, adoptaremos un enfoque `component first`. Esto significa que antes de empezar a construir las pantallas, nos centraremos en crear cada uno de los widgets individuales que necesitaremos.

[st] Manos a la obra
Vamos a analizar esta pantalla compuesta por dos `fragmentos` navegables por medio de la `BottomNavBar`.
[icon] lab2image1.png
De acuerdo a esto, desarrolle los siguientes componentes. En cada componente analíce cuáles son las entradas (propiedades)

[st] AppBar
Aqui puede usar la clase `AppBar` para definir el componente.
[icon] lab2image2.png
[st] MusicListItem
En este caso debe usar su conocimiento en `Row` y `Colum` para realizar el componente
[icon] lab2image3.png
[st] FloatingButton
Use la clase `FloatingActionButton`. Esta produce un boton circular. Si lo que quiere es un boton rectangular, para que quepa texto e icono, use el factory method `FloatingActionButton.extended`.
[icon] lab2image4.png
[st] Stat label
Que permita mostrar una estadística del perfil, con un label de entrada
[icon] lab2image5.png
[st] Profile View
Donde se puede ver la foto de perfil acompañada del nombre y correo electrónico
[icon] lab2image6.png
[st] Tabs
Con todas las piezas hechas, genere las dos tabs de la imagen: `ProfileTab` y `PlaylistTab`
[st] Navegación entre Tabs
Para esto requiere hacer una `Screen` que contenga a cada `Tab`. La Screen como lo hemos visto debe tener sí o sí un `Scaffold`.
Luego de esto, programe la navegación para que se pueda visualzar cada Tab.
[st] Navegación entre Screens
Ahora cree rápidamente esta screen a la que llamará `NewPlaylistScreen`
[icon] lab2image7.png
Haga que cuando el usuario le de al boton `Crear`, navegue hasta la nueva Screen
');

-- Inserting content for: lab2components
INSERT INTO lessons (slug, content) VALUES ('lab2components', E'[t] Componentes de UI con Flutter

[st] AppMusicListItem
[code:dart]
import ''package:flutter/material.dart'';

class AppMusicListItem extends StatelessWidget {
  final String imageUrl;
  final String title;
  final String subtitle;

  const AppMusicListItem({
    Key? key,
    this.imageUrl = "https://raw.githubusercontent.com/Domiciano/AppMoviles251/refs/heads/main/res/images/Lab2Cover.png",
    this.title = "Title",
    this.subtitle = "Subtitle",
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Row(
        children: [
          CircleAvatar(
            radius: 28,
            backgroundImage: NetworkImage(imageUrl),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  title,
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Colors.white),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                Text(
                  subtitle,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.white),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
[endcode]

[st] LabeledTextField
[code:dart]
import ''package:flutter/material.dart'';

class LabeledTextField extends StatelessWidget {
  final String label;
  final String hint;
  final String value;
  final ValueChanged<String> onValueChange;

  const LabeledTextField({
    Key? key,
    this.label = "Label",
    this.hint = "Hint",
    required this.value,
    required this.onValueChange,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Colors.white),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: TextEditingController(text: value),
            onChanged: onValueChange,
            decoration: InputDecoration(
              hintText: hint,
              hintStyle: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.grey),
              filled: true,
              fillColor: Colors.white.withOpacity(0.13),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8.0),
                borderSide: BorderSide.none,
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8.0),
                borderSide: BorderSide.none,
              ),
              cursorColor: Colors.white,
            ),
            style: const TextStyle(color: Colors.white),
          ),
        ],
      ),
    );
  }
}
[endcode]

[st] ProfileCard
[code:dart]
import ''package:flutter/material.dart'';

class ProfileCard extends StatelessWidget {
  final String imageUrl;
  final String name;
  final String username;

  const ProfileCard({
    Key? key,
    this.imageUrl = "https://raw.githubusercontent.com/Domiciano/AppMoviles251/refs/heads/main/res/images/Lab2Cover.png",
    this.name = "Name",
    this.username = "Username",
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        CircleAvatar(
          radius: 120,
          backgroundImage: NetworkImage(imageUrl),
        ),
        const SizedBox(height: 8),
        Text(
          name,
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(color: Colors.white),
        ),
        const SizedBox(height: 4),
        Text(
          username,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.grey),
        ),
      ],
    );
  }
}
[endcode]

[st] StatCard
[code:dart]
import ''package:flutter/material.dart'';

class StatCard extends StatelessWidget {
  final String number;
  final String label;

  const StatCard({
    Key? key,
    required this.number,
    required this.label,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          number,
          style: const TextStyle(
            fontSize: 48,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: const TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.normal,
            color: Colors.grey,
          ),
        ),
      ],
    );
  }
}
[endcode]

[st] LabeledTextFieldWithButton
[code:dart]
import ''package:flutter/material.dart'';

class LabeledTextFieldWithButton extends StatelessWidget {
  final String label;
  final String hint;
  final String value;
  final ValueChanged<String> onValueChange;
  final VoidCallback onButtonClick;

  const LabeledTextFieldWithButton({
    Key? key,
    this.label = "Label",
    this.hint = "Hint",
    required this.value,
    required this.onValueChange,
    required this.onButtonClick,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 4.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Colors.white),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: TextEditingController(text: value),
                  onChanged: onValueChange,
                  decoration: InputDecoration(
                    hintText: hint,
                    hintStyle: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.grey),
                    filled: true,
                    fillColor: Colors.white.withOpacity(0.13),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8.0),
                      borderSide: BorderSide.none,
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8.0),
                      borderSide: BorderSide.none,
                    ),
                    cursorColor: Colors.white,
                  ),
                  style: const TextStyle(color: Colors.white),
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                icon: const Icon(Icons.refresh, color: Colors.white),
                onPressed: onButtonClick,
                iconSize: 32,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
[endcode]

[st] TitleWithBackground
[code:dart]
import ''package:flutter/material.dart'';

class TitleWithBackground extends StatelessWidget {
  final String imageUrl;
  final String title;
  final String subtitle;

  const TitleWithBackground({
    Key? key,
    required this.imageUrl,
    required this.title,
    required this.subtitle,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: const BorderRadius.vertical(bottom: Radius.circular(16.0)),
      child: Container(
        height: 250,
        width: double.infinity,
        decoration: BoxDecoration(
          image: DecorationImage(
            image: NetworkImage(imageUrl),
            fit: BoxFit.cover,
          ),
        ),
        child: Stack(
          children: [
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.black.withOpacity(0.7), Colors.transparent],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(color: Colors.white),
                  ),
                  Text(
                    subtitle,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.white),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
[endcode]

[st] AppBottomNavigationBar
[code:dart]
import ''package:flutter/material.dart'';

class AppBottomNavigationBar extends StatelessWidget {
  final int selectedItem;
  final Function(int) onOptionClick;

  const AppBottomNavigationBar({
    Key? key,
    this.selectedItem = 1,
    required this.onOptionClick,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      currentIndex: selectedItem,
      onTap: onOptionClick,
      backgroundColor: Colors.transparent,
      elevation: 0,
      selectedItemColor: Colors.white,
      unselectedItemColor: const Color(0xFF3A434F),
      selectedLabelStyle: const TextStyle(color: Colors.white),
      unselectedLabelStyle: const TextStyle(color: Color(0xFF3A434F)),
      items: const [
        BottomNavigationBarItem(
          icon: Icon(Icons.person_outline),
          label: ''Profile'',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.menu_outlined),
          label: ''Playlists'',
        ),
      ],
    );
  }
}
[endcode]

[st] AppFloatingButton
[code:dart]
import ''package:flutter/material.dart'';

class AppFloatingButton extends StatelessWidget {
  final VoidCallback onClick;

  const AppFloatingButton({
    Key? key,
    required this.onClick,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return FloatingActionButton.extended(
      onPressed: onClick,
      backgroundColor: const Color(0xFF1ED760),
      icon: const Icon(Icons.add, color: Colors.black),
      label: const Text(
        ''Crear'',
        style: TextStyle(color: Colors.black, fontSize: 16),
      ),
    );
  }
}
[endcode]
.');

-- Inserting content for: lab2concepts
INSERT INTO lessons (slug, content) VALUES ('lab2concepts', E'[t] Conceptos iniciales
[st] Creando Componentes en Flutter
En Flutter, la interfaz de usuario se construye a partir de pequeños bloques de construcción llamados `Widgets`. Piensa en ellos como si fueran piezas de Lego: puedes combinar varios widgets simples para crear interfaces complejas y reutilizables. A este proceso lo llamamos "componetizar".

[st] Definiendo un Componente (Widget)

Un widget es simplemente una clase de Dart que hereda de `StatelessWidget` o `StatefulWidget`. Para empezar, nos enfocaremos en los `StatelessWidget`, que son componentes simples sin estado interno.

Crear un widget es tan fácil como crear una clase y definir su apariencia en el método `build`.

[code:dart]
import ''package:flutter/material.dart'';

// Definimos nuestro nuevo widget llamado SaludoWidget
class SaludoWidget extends StatelessWidget {
  // El constructor
  const SaludoWidget({super.key});

  @override
  Widget build(BuildContext context) {
    // El método build devuelve el widget que se mostrará en pantalla
    return const Text(
      ''¡Hola, desde nuestro primer componente!'',
      style: TextStyle(fontSize: 20, color: Colors.white),
    );
  }
}
[endcode]

[st] ¿Por qué usamos `super.key`?

El parámetro `key` es un identificador que Flutter usa para diferenciar un widget de otro. Al pasarlo con `super.key`, le estamos dando una `Key` (o llave) única a nuestro widget.

Imagina que tienes una lista de widgets idénticos. Si uno de ellos cambia, se elimina o se mueve, Flutter necesita una forma de saber exactamente cuál de ellos fue afectado para poder actualizar la pantalla de manera eficiente. La `Key` le da esa información. Esto ayuda a Flutter a gestionar el rendimiento.

Desde Dart 2.17, la forma más simple de hacerlo es usando `super-parameters`, que nos permite pasar el parámetro `key` directamente al constructor de la superclase (`StatelessWidget` en este caso) usando `super.key`.

[st] Usando Variables como Propiedades (Props)

Un componente no es muy útil si siempre muestra lo mismo. Queremos poder pasarle datos para que sea dinámico. A estos datos los llamamos "propiedades" (o "props", como en otros frameworks).

Para pasar datos, simplemente declaramos variables `final` en nuestro widget y las inicializamos en el constructor.

[code:dart]
import ''package:flutter/material.dart'';

class SaludoPersonalizado extends StatelessWidget {
  // 1. Declaramos la propiedad que queremos recibir
  final String nombre;

  // 2. La añadimos como un parámetro requerido en el constructor
  const SaludoPersonalizado({super.key, required this.nombre});

  @override
  Widget build(BuildContext context) {
    // 3. Usamos la propiedad dentro de nuestro widget
    return Text(
      ''¡Hola, $nombre!'',
      style: const TextStyle(fontSize: 22, color: Colors.white, fontWeight: FontWeight.bold),
    );
  }
}

// Así lo usaríamos en otra parte de la app:
class MiPantalla extends StatelessWidget {
  const MiPantalla({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: SaludoPersonalizado(nombre: "Ana"), // Le pasamos el nombre aquí
      ),
    );
  }
}
[endcode]

[st] Usando Funciones como Propiedades (Callbacks)

Además de datos, también podemos pasar funciones. Esto es fundamental para gestionar interacciones del usuario, como cuando se presiona un botón. A estas funciones las llamamos "callbacks".

Creemos un botón personalizado que nos notifique cuando es presionado.

[code:dart]
import ''package:flutter/material.dart'';

class BotonPersonalizado extends StatelessWidget {
  // 1. Declaramos la propiedad para el texto del botón
  final String texto;
  // 2. Declaramos la función que se ejecutará al presionar (el callback)
  final void Function() onPressed;

  // 3. Las añadimos al constructor
  const BotonPersonalizado({super.key, required this.texto, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      // 4. Usamos la función `onPressed` que recibimos
      onPressed: onPressed,
      child: Text(texto),
    );
  }
}

// Así lo usaríamos:
class MiPantallaConBoton extends StatelessWidget {
  const MiPantallaConBoton({super.key});

  void _miFuncionDeCallback() {
    print("¡El botón fue presionado!");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        // Le pasamos el texto y la función que debe ejecutar
        child: BotonPersonalizado(
          texto: "Presióname",
          onPressed: _miFuncionDeCallback,
        ),
      ),
    );
  }
}
[endcode]

Al componetizar, creamos widgets reutilizables, mantenibles y fáciles de entender. Esta es la base para construir aplicaciones robustas y escalables en Flutter.');

-- Inserting content for: lab3
INSERT INTO lessons (slug, content) VALUES ('lab3', E'[t] Laboratorio 3: Manejo de listas
[st] Introducción
En este corto laboratorio nos enfocaremos en producir elementos de lista usando como base el laboratorio 2.
El objetivo es añadir otra `Page` a la aplicación, de modo que sea un buscador de canciones

[st] `Page` de búsqueda de canciones

Para hacer la búsqueda haga uso de las siguientes URL

[code:plain]
https://api.deezer.com/search?q=eminem
(No tiene los header de CORS)
o
https://i2thub.icesi.edu.co:5443/deezer/search?q=eminem
(Tiene todos los header de CORS)
[endcode]

Donde el Request Param `q` es el término de búsqueda.

Prepare entonces la pantalla para que consista es `Column` > `Expanded` > `ListView` de modo que pueda mostrar las canciones que está buscando el usuario por medio de un TextField y un botón.

De momento, sólo deberán mostrarse las canciones');

-- Inserting content for: lab3concepts
INSERT INTO lessons (slug, content) VALUES ('lab3concepts', E'[t] Laboratorio 3: Utilidades

Para desarrollar este laboratorio necesitará añadir la librería de http a su app, en el `pubspec.yml`
[code:plain]
dependencies:
  http: ^0.13.6
[endcode]

Use 
[code:bash]
flutter pub get
[endcode]
Para obtener la librería

Para un `GET` request convencional, use
[code:dart]
import ''dart:convert'';
import ''package:http/http.dart'' as http;

Future<void> obtenerDato() async {
  final url = Uri.parse("https://www.server.com/alfa/10");

  final response = await http.get(url);

  if (response.statusCode == 200) {
    final data = jsonDecode(response.body);
    print(data["data"][10]["description"]);
  } else {
    print("Error en la petición");
  }
}
[endcode]
La palabra `await` sólo puede ser usada dentro de métodos `Future`.

Note que contamos con el método `jsonDecode` que convierte el `String` de respuesta en un `Map<String,dynamic>`');

-- Inserting content for: lab4
INSERT INTO lessons (slug, content) VALUES ('lab4', E'[t] Laboratorio 4: Deezer ain''t the best option
Todos en nuestro día a día usamos aplicaciones de música que van desde Yotube, Spotify y Apple Music. Pero nunca hemos oído que alguien recomiende `Deezer` como plataforma.
No obstante, poseen una API abierta (las demás exigen autenticación) que permite interactuar con la plataforma. Esto es una buena característica para el curso de aplicaciones móviles ya que podemos usar data actualizada, no un mock. A Deezer nadie lo usa, todos lo programan

El laboratorio consiste en hacer una pantalla de búsqueda de música. Cuando encontremos la canción que nos guste, vamos a agregarla a mis `me gusta`. Posteriormente, podré consultar mis me gusta.

Vamos a hacer usando 2 pantallas: `SearchMusicScreen` y `LikedSongsScreen`.

El enpoint de Deezer para buscar es
[code:plain]
https://api.deezer.com/search?q=bohemian%20rhapsody
[endcode]
Sólo vamos a usar los datos de id, título, artista y albumCover.
De modo que vamos a usar este modelo de datos
[st] Modelo de datos
[code:dart]
class Track {
  final int id;
  final String title;
  final String artist;
  final String albumCover;

  Track({
    required this.id,
    required this.title,
    required this.artist,
    required this.albumCover,
  });
}
[endcode]
Y no menos importante, debemos crear un factory para poder hacer deserializaciones
[code:dart]
factory Track.fromJson(Map<String, dynamic> json) {
    return Track(
      ?,
      title: json[''title''],
      artist: json[''artist''][''name''],
      ?,
    );
}
[endcode]
Donde `?` es para que usted analice el JSON y luego de analizar, sepa qué debe poner allí.
[st] NetworkProvider
Ya teniendo todos los elementos, vamos a crear entonces el `NetworkProvider`
[code:dart]
class DeezerNetworkProvider {
  String _baseUrl = "https://api.deezer.com";

  /// Busca canciones en Deezer por nombre, artista, etc.
  Future<List<Track>> searchTracks(String query) async {
    final url = Uri.parse("$_baseUrl/search?q=$query");

    final response = await http.get(url);

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);

      final List results = data[''data''];
      return results.map((json) => Track.fromJson(json)).toList();
    } else {
      throw Exception("Error al buscar canciones: ${response.statusCode}");
    }
  }
}
[endcode]
Para esto necesitas agregar `http: ^1.5.0` a tu `pubspec.yml`

[st] Capa de Repository
En proyectos que aún están jóvenes o pequeños puede llegar a pensar "¿todo esto sí es necesario?" y aunque parezca que inicialmente el repositorio no tiene sentido y sólo es un bypass hacía BloC, recuerde que este punto es vital porque desde esta capa decidimos si hacemos uso de una fuente externa o de una base de datos local.

Desde este punto, podemos hacer transformaciones para emitir sólo la información necesario al resto de la aplicación, podemos filtrar, mezclar, transformar y demás de acuerdo a las features que dispongamos.

[code:dart]
/// Repository: abstrae los providers y expone una API limpia al Bloc
class DeezerRepository {
  final DeezerNetworkProvider _networkProvider;

  DeezerRepository(this._networkProvider);

  /// Busca canciones y devuelve una lista de modelos Track
  Future<List<Track>> searchSongs(String query) async {
    try {
      final tracks = await _networkProvider.searchTracks(query);

      // Aquí podríamos aplicar transformaciones, filtrado,
      // cacheo en base de datos local, etc.
      return tracks;
    } catch (e) {
      throw Exception("Error en Repository al buscar canciones: $e");
    }
  }
}
[endcode]

[st] BloC
Recuerde que el BloC recibe eventos de la UI y emite estados. Para emitir esos estados, el BloC debe consultar a fuentes de información por medio de Repository.

Debemos usar la libreria de flutter_bloc. Así que use `flutter_bloc: ^9.1.1` en su `pubspec.yml`

Pero vamos en orden, primero hay que definir los eventos. Debemos usar estratégicamente la herencia.

[code:dart]
/// Eventos que el Bloc puede recibir
abstract class SearchEvent {}

/// Cuando el usuario busca canciones con un query
class SearchSongsEvent extends SearchEvent {
  final String query;

  SearchSongsEvent(this.query);
}
[endcode]

Vamos ahora a definir los estados
[code:dart]
/// Estados posibles del Bloc
abstract class SearchState {}

/// Estado inicial
class SearchInitial extends SearchState {}

/// Estado mientras se buscan canciones
class SearchLoading extends SearchState {}

/// Estado cuando hay resultados
class SearchSuccess extends SearchState {
  final List<Track> tracks;

  SearchSuccess(this.tracks);
}

/// Estado cuando ocurre un error
class SearchFailure extends SearchState {
  final String message;

  SearchFailure(this.message);
}
[endcode]
Finalmente el BloC
[code:dart]
class SearchBloc extends Bloc<SearchEvent, SearchState> {
  final DeezerRepository repository;
  ...
}
[endcode]
Aquí vamos a usar el estado inicial por medio del constructor
[code:dart]
SearchBloc() : super(SearchInitial()) {
}
[endcode]
A partir de este BloC, debemos usar los método `on()` para registrar los eventos y emitir respuesta.
[code:dart]
on<SearchSongsEvent>(_onSearchSongs);
...
Future<void> _onSearchSongs(
        SearchSongsEvent event,
        Emitter<SearchState> emit,
    ) async {
    emit(SearchLoading());
    try {
      final results = await repository.searchSongs(event.query);
      if (results.isEmpty) {
        emit(SearchFailure("No se encontraron canciones"));
      } else {
        emit(SearchSuccess(results));
      }
    } catch (e) {
      emit(SearchFailure("Error al buscar canciones: $e"));
    }
}
[endcode]

[st] Capa UI
Finalmente vamos con la capa de UI. Luego de todo este periplo por capas, finalmente aterrizamos todo a un arbolde componentes.
[code:dart]
BlocBuilder<SearchBloc, SearchState>(
  builder: (context, state) {
    if (state is SearchInitial) {
      return const Text("Escribe algo para buscar");
    } else if (state is SearchLoading) {
      return const CircularProgressIndicator();
    } else if (state is SearchSuccess) {
      return ListView.builder(
        itemCount: state.tracks.length,
        itemBuilder: (context, index) {
          final track = state.tracks[index];
          return ListTile(
            title: Text(track.title),
            subtitle: Text(track.artist),
            leading: Image.network(track.albumCover),
          );
        },
      );
    } else if (state is SearchFailure) {
      return Text("Error: ${state.message}");
    } else {
      return const SizedBox.shrink(); //Box de 0x0
    }
  },
)
[endcode]

Este trozo de pantalla deberá ir dentro de un `BlocProvider` que provea los elementos de BloC. Genere lo necesario para que quede OK

[st] Haciendo POST
Use este endpoint para hacer POST de sus canciones
[code:plain]
https://facelogprueba.firebaseio.com/playlist/miusername.json
[endcode]
Si en lugar de hacer POST hace GET, puede comprobar con su navegador o con Postman si efectivamente se guardan las canciones o no

Para hacer post puede usar este bloque de código de guía
[code:dart]
Future<void> postTrack(Track track) async {
    final url = Uri.parse("$_baseUrl/tracks");

    final response = await http.post(
      url,
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonEncode({
        "id": track.id,
        "title": track.title,
        "artist": track.artist,
        "albumCover": track.albumCover,
      }),
    );
    print(response.statusCode);
}
[endcode]
.');

-- Inserting content for: lab4concepts
INSERT INTO lessons (slug, content) VALUES ('lab4concepts', E'[t] Conceptos inciales

En este laboratorio, daremos un paso fundamental en el desarrollo de aplicaciones robustas y escalables. Aprenderemos a consumir una API REST externa, en este caso la API de Deezer, para obtener datos y mostrarlos en nuestra aplicación Flutter. Para gestionar el estado y la lógica de negocio de una manera organizada y eficiente, implementaremos el patrón de arquitectura BLoC (Business Logic Component).

[i] https://bloclibrary.dev/_astro/bloc_architecture_full.CYn-T9Ox_emLFv.webp

[st] Arquitectura BLoC: Separación de Responsabilidades
Antes de escribir código, es crucial entender la arquitectura que vamos a implementar. El patrón BLoC promueve una clara separación de responsabilidades, lo que hace que la aplicación sea más fácil de probar, mantener y escalar.
[i] https://bloclibrary.dev/_astro/architecture.DXhmDgKF_Z1jU9hW.webp

[st] UI (Capa de Presentación)
Es la parte visible de la aplicación: lo que el usuario ve e interactúa.

`Responsabilidad`
Renderizar el estado que recibe desde el BLoC.
Notificar eventos de usuario (ejemplo: presionar un botón, introducir texto).

`No debe saber`
No conoce de dónde vienen los datos ni cómo se procesan.

[st] BLoC 
Es el "cerebro" de la funcionalidad. Actúa como intermediario entre la UI y el repositorio.

`Responsabilidad`
Recibir eventos de la UI.
Ejecutar la lógica de negocio (validaciones, reglas, etc.).
Solicitar datos al Repository.
Emitir nuevos estados que la UI usará para renderizarse.

`No debe saber`
No sabe cómo ni desde dónde se obtienen los datos (API, base de datos, caché, etc.).
Solo conoce la interfaz del Repository.

[st] Repository
Es una fachada que abstrae el origen de los datos y expone una API limpia al BLoC. Puede conectarse a múltiples fuentes de datos para obtener la información que expone a BloC

`Responsabilidad`
Centralizar el acceso a datos.
Decidir si los obtiene de la red (Data Provider) o de almacenamiento local (base de datos, caché).
Aplicar transformaciones antes de entregarlos al BLoC.
Ser la fuente única de verdad (SSoT) para la aplicación.

`No debe saber`
No conoce nada de la UI.
No maneja reglas de negocio específicas del BLoC.
Su única tarea es proveer datos confiables.

[st] Data Provider
Es la capa más externa y específica. Aquí ocurre la comunicación cruda con fuentes externas.

`Responsabilidad`
Ejecutar operaciones de bajo nivel:
Peticiones HTTP y manejo de respuestas.
Parseo de JSON.
Acceso a base de datos local.
Exponer APIs simples para operaciones CRUD.

`No debe saber`
No conoce reglas de negocio.
No interactúa con la UI ni con la lógica de presentación
');

-- Inserting content for: lessonA1
INSERT INTO lessons (slug, content) VALUES ('lessonA1', E'[t] Primeros pasos con Dart
Todo programa en Dart comienza con la función `main`. Es el punto de entrada de la aplicación y donde se ejecuta el código por primera vez.

[st] ¿Cómo luce el método main?
[code:dart]
void main() {
  print(''Hello, Dart!'');
}
[endcode]
[trycode] 70ea035e72b031116992afc88dfb63ae
El código anterior imprime en consola el texto `Hola, Dart!`. Puedes ejecutar este programa en cualquier entorno que soporte Dart, como DartPad o tu terminal si tienes Dart instalado.

[st] Declaración de variables y tipos básicos
Dart es un lenguaje tipado, pero permite declarar variables de forma explícita o usando `var` y `dynamic`.
[code:dart]
void main() {
  int age = 25;
  double height = 1.75;
  String name = ''Ana'';
  bool isStudent = true;
  var city = ''Cali''; // Type is inferred
  
  print(''Name: $name'');
  print(''Age: $age'');
  print(''Height: $height'');
  print(''Is student: $isStudent'');
  print(''City: $city'');
}
[endcode]
[trycode] 00838af93b7981119311449fbd221205
Usa `int` para números enteros, `double` para decimales, `String` para texto y `bool` para valores lógicos.
[list]
`var` deja que Dart infiera el tipo según el valor inicial.
`dynamic` permite cambiar el tipo de la variable, pero se recomienda solo si es necesario.
[endlist]

[st] Ejemplo práctico: main y variables
[code:dart]
void main() {
  String name = ''Ana'';
  int age = 25;
  print(''Hello, my name is $name and I am $age years old.'');
}
[endcode]
[trycode] ae89df20a06833de993721c7223812d0');

-- Inserting content for: lessonA2
INSERT INTO lessons (slug, content) VALUES ('lessonA2', E'[t] Operadores numéricos
Los operadores te permiten realizar cálculos y comparaciones con variables numéricas en Dart. Vamos a ver los más importantes.

[st] Operadores aritméticos básicos
[code:dart]
void main() {
  int a = 10;
  int b = 3;
  
  print(a + b);  // Sum: 13
  print(a - b);  // Subtraction: 7
  print(a * b);  // Multiplication: 30
  print(a / b);  // Division: 3.333...
  print(a % b);  // Modulo (remainder): 1
  print(a ~/ b); // Integer division: 3
}
[endcode]
[trycode] 0b724266b8c3b41729324393b1770bf3
`+` suma, `-` resta, `*` multiplica, `/` divide (resultado decimal)

`%` obtiene el resto de la división

`~/` divide y devuelve solo la parte entera

[st] Operadores de asignación
[code:dart]
void main() {
  int x = 5;
  x += 3;  // Equivalent to: x = x + 3
  print(x); // 8
  
  x *= 2;  // Equivalent to: x = x * 2
  print(x); // 16
}
[endcode]
[trycode] e6c00b23687660a44f959f591dff34a4
Los operadores `+=`, `-=`, `*=`, `/=` son atajos para modificar una variable.

[st] Operadores de comparación
[code:dart]
void main() {
  int age = 18;
  
  print(age > 16);   // Greater than: true
  print(age < 21);   // Less than: true
  print(age >= 18);  // Greater or equal: true
  print(age <= 20);  // Less or equal: true
  print(age == 18);  // Equal: true
  print(age != 20);  // Not equal: true
}
[endcode]
[trycode] a501a06d10cb1e0a852d138191943569
Estos operadores devuelven `true` o `false` y son fundamentales para las estructuras de control.

[st] Operadores de incremento y decremento
[code:dart]
void main() {
  int counter = 5;
  
  counter++;  // Increments by 1
  print(counter); // 6
  
  counter--;  // Decrements by 1
  print(counter); // 5
}
[endcode]
[trycode] 9d90271cdc58be19cac8482d9581e22a');

-- Inserting content for: lessonA3
INSERT INTO lessons (slug, content) VALUES ('lessonA3', E'[t] Trabajando con Strings
Los strings en Dart son secuencias de caracteres que puedes manipular de varias formas. Vamos a ver las más comunes: concatenación e interpolación.

[st] Concatenación de strings
[code:dart]
void main() {
  String firstName = ''Ana'';
  String lastName = ''García'';
  
  // Concatenation with +
  String fullName = firstName + '' '' + lastName;
  print(fullName); // Ana García
  
  // Concatenation with +
  String greeting = ''Hello '' + firstName;
  print(greeting); // Hello Ana
}
[endcode]
[trycode] 9ea5113dcc307145e4f26950b3770012
La concatenación con `+` es la forma más simple de unir strings.
También puedes usar interpolación para unir strings.

[st] Interpolación de strings
[code:dart]
void main() {
  String name = ''Carlos'';
  int age = 25;
  
  // Simple interpolation with $
  String message = ''Hello, my name is $name'';
  print(message); // Hello, my name is Carlos
  
  // Interpolation with expressions
  String introduction = ''I am $age years old and next year I will be ${age + 1}'';
  print(introduction); // I am 25 years old and next year I will be 26
  
  // Interpolation with properties
  String list = ''Shopping list: ${[''apples'', ''milk'', ''bread'']}'';
  print(list); // Shopping list: [apples, milk, bread]
}
[endcode]
[trycode] 9375d5f2e5afb0049c2deabf728a2102
La interpolación con `$` es más legible y eficiente que la concatenación.
Puedes usar `${}` para expresiones más complejas.

[st] Strings multilínea
[code:dart]
void main() {
  // Multiline string with triple quotes
  String poem = ''''''
  The wind blows
  The leaves fall
  It''s autumn
  '''''';
  print(poem);
  
  // Multiline string with double quotes
  String letter = """
  Dear Sir:
  
  I am writing to inform you...
  
  Best regards.
  """;
  print(letter);
}
[endcode]
[trycode] fb3770f6687957ed296000cfe5a6e483
Usa comillas triples `''''''` o `"""` para strings que ocupan múltiples líneas.

[st] Métodos útiles de strings
[code:dart]
void main() {
  String text = ''  Hello World  '';
  
  print(text.toUpperCase()); //   HELLO WORLD  
  print(text.toLowerCase()); //   hello world  
  print(text.trim()); // Hello World
  print(text.length); // 13
  print(text.contains(''World'')); // true
  print(text.startsWith(''  '')); // true
  print(text.endsWith(''  '')); // true
}
[endcode]
[trycode] 4c4d6995aece9660c1b65839437c4c03
`toUpperCase()` y `toLowerCase()` cambian el caso.

`trim()` elimina espacios al inicio y final.

`contains()`, `startsWith()` y `endsWith()` verifican contenido.


');

-- Inserting content for: lessonA4
INSERT INTO lessons (slug, content) VALUES ('lessonA4', E'[t] Condicionales
Las estructuras de control te permiten tomar decisiones en tu código. En Dart, las principales son `if`, `else` y `switch`.
[st] Estructura if básica
[code:dart]
void main() {
  int age = 18;
  
  if (age >= 18) {
    print(''You are an adult'');
  }
  
  // if with else
  if (age >= 18) {
    print(''You are an adult'');
  } else {
    print(''You are a minor'');
  }
}
[endcode]
[trycode] 56fccc30e3b1cff9300b6df7b413f012
El `if` evalúa una condición y ejecuta el código si es verdadera.

El `else` ejecuta código alternativo cuando la condición es falsa.

[st] if-else if-else
[code:dart]
void main() {
  int grade = 85;
  
  if (grade >= 90) {
    print(''Excellent'');
  } else if (grade >= 80) {
    print(''Very good'');
  } else if (grade >= 70) {
    print(''Good'');
  } else if (grade >= 60) {
    print(''Passed'');
  } else {
    print(''Failed'');
  }
}
[endcode]
[trycode] 0b3b037f5ba9cb2d0dcc6143a32183f6
Usa `else if` para evaluar múltiples condiciones en orden. Solo se ejecuta el primer bloque cuya condición sea verdadera.

[st] Operadores lógicos
[code:dart]
void main() {
  int age = 25;
  bool hasLicense = true;
  
  // AND (&&)
  if (age >= 18 && hasLicense) {
    print(''You can drive'');
  }
  
  // OR (||)
  if (age < 18 || !hasLicense) {
    print(''You cannot drive'');
  }
  
  // NOT (!)
  if (!hasLicense) {
    print(''You need to get a license'');
  }
}
[endcode]
[trycode] 2f601504e024daf02cca4f7fc7d37e48
`&&` (AND): ambas condiciones deben ser verdaderas.

`||` (OR): al menos una condición debe ser verdadera.

`!` (NOT): invierte el valor booleano.

[st] Estructura switch
[code:dart]
void main() {
  String day = ''Monday'';
  
  switch (day) {
    case ''Monday'':
      print(''Start of the week'');
      break;
    case ''Tuesday'':
    case ''Wednesday'':
    case ''Thursday'':
      print(''Workday'');
      break;
    case ''Friday'':
      print(''Friday!'');
      break;
    case ''Saturday'':
    case ''Sunday'':
      print(''Weekend'');
      break;
    default:
      print(''Invalid day'');
  }
}
[endcode]
[trycode] ed8a90a9d9800d1aa15f421b3558450c
El `switch` evalúa una variable contra múltiples valores.

Usa `break` para salir del switch después de cada caso.

El `default` se ejecuta si ningún caso coincide.

[st] Switch con expresiones (Dart 3.0+)
[code:dart]
void main() {
  int number = 5;
  
  String result = switch (number) {
    1 => ''One'',
    2 => ''Two'',
    3 => ''Three'',
    _ => ''Other number''
  };
  
  print(result); // Other number
}
[endcode]
[trycode] de38d5d1ed991997ce2fef292fb3e57b
El switch con expresiones es más conciso y devuelve un valor. El `_` es el caso por defecto en switch expressions.

');

-- Inserting content for: lessonA5
INSERT INTO lessons (slug, content) VALUES ('lessonA5', E'[t] Tipos opcionales y null safety
En Dart, los tipos opcionales te permiten manejar valores que pueden ser `null`. El sistema de null safety ayuda a prevenir errores comunes.
[st] Tipos opcionales básicos
[code:dart]
void main() {
  // Variable that can be null
  String? name = null;
  print(name); // null
  
  // Assign a value
  name = ''Ana'';
  print(name); // Ana
  
  // Variable that cannot be null
  String lastName = ''García''; // Error if you try to assign null
  print(lastName);
}
[endcode]
[trycode] f0fd4d9f795c46529176e86bc4287aaf
Usa `?` después del tipo para indicar que puede ser null. Sin `?`, la variable nunca puede ser null.

[st] Verificar si es null
[code:dart]
void main() {
  String? email = null;
  
  // Check if it is null
  if (email != null) {
    print(''Email: $email'');
  } else {
    print(''No email'');
  }
  
  // Assign email
  email = ''ana@example.com'';
  
  if (email != null) {
    print(''Email: $email'');
  } else {
    print(''No email'');
  }
}
[endcode]
[trycode] 66405bd35f0f6d4afe60328ba63e2da9
Usa `!= null` para verificar si una variable tiene valor. Solo después de verificar puedes usar la variable sin `?`.

[st] Operador de acceso seguro (?. )
[code:dart]
void main() {
  String? text = null;
  
  // Safe access - does not cause error if null
  print(text?.length); // null
  
  text = ''Hello'';
  print(text?.length); // 4
  
  // Without safe access would cause error
  // print(text.length); // Error if text is null
}
[endcode]
[trycode] 778d63184ff6c07404bdaecf4171b330
El operador `?.` accede a propiedades solo si el valor no es null. Si es null, retorna null en lugar de causar error.

[st] Operador de coalescencia nula (??)
[code:dart]
void main() {
  String? name = null;
  String? lastName = ''García'';
  
  // Use default value if null
  String fullName = name ?? ''Anonymous'';
  print(fullName); // Anonymous
  
  String fullLastName = lastName ?? ''No last name'';
  print(fullLastName); // García
  
  // Also works with expressions
  String message = name ?? lastName ?? ''No name'';
  print(message); // García
}
[endcode]
[trycode] cebc63befd4e7eb207bb23b20187e7f2
El operador `??` proporciona un valor por defecto si la variable es null. Puedes encadenar múltiples `??` para fallbacks.

[st] Asignación de coalescencia nula (??=)
[code:dart]
void main() {
  String? name = null;
  
  // Only assigns if the variable is null
  name ??= ''Juan'';
  print(name); // Juan
  
  // Does not change if it already has a value
  name ??= ''Pedro'';
  print(name); // Juan (did not change)
  
  String? age = null;
  age ??= ''25'';
  print(age); // 25
}
[endcode]
[trycode] 3aee48062336caac7725347bcd0bf2c4
El operador `??=` asigna un valor solo si la variable es null. Es útil para inicializar variables opcionales. ');

-- Inserting content for: lessonA6
INSERT INTO lessons (slug, content) VALUES ('lessonA6', E'[t] Listas y mapas
Las listas y mapas son estructuras de datos fundamentales en Dart. Aprenderás a crearlas y recorrerlas de diferentes formas.
[st] Listas (Arrays)
[code:dart]
void main() {
  // Create a list
  List<String> fruits = [''apple'', ''banana'', ''orange''];
  
  // Add elements
  fruits.add(''grape'');
  fruits.addAll([''pear'', ''mango'']);
  
  // Access by index
  print(fruits[0]); // apple
  print(fruits.length); // 6
}
[endcode]
[trycode] 861f536e05b1f549f3477bbec1af1296
Las listas almacenan elementos ordenados y accesibles por índice.
Usa `add()` para un elemento y `addAll()` para múltiples.
[st] Recorrer listas con for
[code:dart]
void main() {
  List<int> numbers = [1, 2, 3, 4, 5];
  
  // Traditional for with index
  for (int i = 0; i < numbers.length; i++) {
    print(''Index $i:  numbers[i]}'');
  }
  
  // for-in (foreach)
  for (int number in numbers) {
    print(''Number: $number'');
  }
  
  // forEach with function
  numbers.forEach((number) {
    print(''Value: $number'');
  });
}
[endcode]
[trycode] b35f2f1791d67b9d6dd65360f8cdf620
[list]
El `for` tradicional te da control del índice.
El `for-in` es más simple para recorrer valores.
`forEach()` ejecuta una función para cada elemento.
[endlist]
[st] Mapas (Dictionaries)
[code:dart]
void main() {
  // Create a map
  Map<String, int> ages = {
    ''Ana'': 25,
    ''Carlos'': 30,
    ''María'': 28,
  };
  
  // Add elements
  ages[''Juan''] = 35;
  
  // Access by key
  print(ages[''Ana'']); // 25
  print(ages.length); // 4
}
[endcode]
[trycode] ed87a5e54b7b469aa862ec9b4bb7ed36
Los mapas almacenan pares clave-valor. Accede a valores usando la clave como índice.
[st] Recorrer mapas
[code:dart]
void main() {
  Map<String, String> countries = {
    ''Colombia'': ''Bogotá'',
    ''Argentina'': ''Buenos Aires'',
    ''México'': ''Ciudad de México'',
  };
  
  // Iterate keys
  for (String country in countries.keys) {
    print(''Country: $country'');
  }
  
  // Iterate values
  for (String capital in countries.values) {
    print(''Capital: $capital'');
  }
  
  // Iterate keys and values
  countries.forEach((country, capital) {
    print(''$country - $capital'');
  });
}
[endcode]
[trycode] 6d5ee941076ea161b3880ac8ef888664
[list]
Usa `.keys` para recorrer solo las claves.
Usa `.values` para recorrer solo los valores.
`forEach()` te da acceso a clave y valor.
[endlist]

[st] Métodos funcionales: map y filter
[code:dart]
void main() {
  List<int> numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  // map: transform each element
  List<String> numbersText = numbers.map((n) => ''Number $n'').toList();
  print(numbersText);
  
  // filter: filter elements
  List<int> evens = numbers.where((n) => n % 2 == 0).toList();
  print(evens); // [2, 4, 6, 8, 10]
  
  // Combine map and filter
  List<String> evensText = numbers
      .where((n) => n % 2 == 0)
      .map((n) => ''Even: $n'')
      .toList();
  print(evensText);
}
[endcode]
[trycode] 81d33660c5e44ead08be3a817cc33122
[list]
`map()` transforma cada elemento de la lista.
`where()` (filter) selecciona elementos que cumplan una condición.
Puedes encadenar estos métodos para operaciones complejas. 
[endlist]');

-- Inserting content for: lessonA7
INSERT INTO lessons (slug, content) VALUES ('lessonA7', E'[t] Métodos en Dart
Los métodos son bloques de código reutilizables. En Dart, puedes crear funciones tradicionales, lambdas (arrow functions) y usar funciones de orden superior.

[st] Funciones básicas
[code:dart]
void main() {
  greet(''Ana'');
  int result = add(5, 3);
  print(''Result: $result'');
}
// Function that does not return a value
void greet(String name) {
  print(''Hello, $name!'');
}
// Function that returns a value
int add(int a, int b) {
  return a + b;
}
[endcode]
[trycode] 68338a515c29a0e4aeace145b03f7b56
Las funciones pueden retornar valores o no (void). Define el tipo de retorno y los tipos de los parámetros.

[st] Parámetros opcionales
[code:dart]
void main() {
  greetPerson(''Carlos'');
  greetPerson(''María'', ''Good morning'');
  greetPerson(''Juan'', ''Hello'', ''friend'');
}
// Optional parameters with []
void greetPerson(String name, [String? greeting, String? lastName]) {
  String message = greeting ?? ''Hello'';
  String fullName = lastName != null ? ''$name $lastName'' : name;
  print(''$message, $fullName!'');
}
[endcode]
[trycode] 5d5ab9f43ddc1bdeeedff7b1b8621318
Usa `[]` para parámetros opcionales. El operador `??` proporciona un valor por defecto.

[st] Arrow functions (lambdas)
[code:dart]
void main() {
  // Simple arrow function
  int square(int x) => x * x;
  
  // Arrow function with multiple lines
  String formatName(String name, String lastName) => 
    ''${name.toUpperCase()} ${lastName.toUpperCase()}'';
  
  print(square(5)); // 25
  print(formatName(''ana'', ''garcía'')); // ANA GARCÍA
}
[endcode]
[trycode] 434d65b18c81965a6b9b9a97d4c52157
Las arrow functions usan `=>` para retornar un valor. Son más concisas que las funciones tradicionales.

[st] Funciones como parámetros
[code:dart]
void main() {
  List<int> numbers = [1, 2, 3, 4, 5];
  
  // Pass function as parameter
  processList(numbers, (n) => n * 2);
  processList(numbers, (n) => n + 10);
}
void processList(List<int> list, int Function(int) operation) {
  for (int number in list) {
    int result = operation(number);
    print(''$number -> $result'');
  }
}
[endcode]
[trycode] 4936efe856a80d0df046d0584523b8c1
Las funciones pueden recibir otras funciones como parámetros. `int Function(int)` es el tipo de una función que recibe y retorna int.

[st] High order functions
[code:dart]
void main() {
  List<int> numbers = [1, 2, 3, 4, 5, 6];
  
  // forEach: execute function on each element
  numbers.forEach((n) => print(''Number: $n''));
  
  // map: transform each element
  List<String> texts = numbers.map((n) => ''Value $n'').toList();
  print(texts);
  
  // where: filter elements
  List<int> evens = numbers.where((n) => n % 2 == 0).toList();
  print(evens);
  
  // reduce: combine elements
  int sum = numbers.reduce((a, b) => a + b);
  print(''Total sum: $sum'');
}
[endcode]
[trycode] bc57d9043c1423e18fcb0a34399ae8cd
[list]
`forEach` ejecuta una función en cada elemento.
`map` transforma cada elemento y retorna una nueva lista.
`where` filtra elementos según una condición.
`reduce` combina todos los elementos en un solo valor. 
[endlist]');

-- Inserting content for: lessonA8
INSERT INTO lessons (slug, content) VALUES ('lessonA8', E'[t] Clases y objetos en Dart
Las clases son plantillas para crear objetos. En Dart, todo es un objeto, y las clases te permiten definir propiedades y comportamientos.

[st] Crear una clase básica
[code:dart]
void main() {
  // Create an instance of the class
  Person person1 = Person(''Ana'', 25);
  person1.greet();
  
  Person person2 = Person(''Carlos'', 30);
  person2.greet();
}

class Person {
  String name;
  int age;
  
  // Constructor
  Person(this.name, this.age);
  
  // Method
  void greet() {
    print(''Hi, I am $name and I am $age years old'');
  }
}
[endcode]
[trycode] e930ec503d90ef658887d57ace23df94
Las clases definen propiedades (variables) y métodos (funciones). El constructor `Persona(this.nombre, this.edad)` inicializa las propiedades.

[st] Getters y setters
[code:dart]
void main() {
  Product product = Product(''Laptop'', 1200.0);
  
  print(product.name); // Laptop
  print(product.price); // 1200.0
  print(product.priceWithVAT); // 1428.0
  
  product.price = 1000.0; // Use setter
  print(product.priceWithVAT); // 1190.0
}

class Product {
  String name;
  double _price; // Private property
  
  Product(this.name, this._price);
  
  // Getter
  double get price => _price;
  double get priceWithVAT => _price * 1.19;
  
  // Setter
  set price(double value) {
    if (value > 0) {
      _price = value;
    }
  }
}
[endcode]
[trycode] bc1e77ba3975bc12df21b88f17af0ac3
Los getters permiten acceder a propiedades calculadas. Los setters permiten validar datos antes de asignarlos. Las propiedades privadas empiezan con `_`.

[st] Herencia
[code:dart]
void main() {
  Student student = Student(''María'', 20, ''Engineering'');
  student.greet();
  student.study();
  
  Teacher teacher = Teacher(''Dr. García'', 45, ''Mathematics'');
  teacher.greet();
  teacher.teach();
}

class Person {
  String name;
  int age;
  
  Person(this.name, this.age);
  
  void greet() {
    print(''Hi, I am $name'');
  }
}

class Student extends Person {
  String major;
  
  Student(String name, int age, this.major) : super(name, age);
  
  void study() {
    print(''$name is studying $major'');
  }
}

class Teacher extends Person {
  String subject;
  
  Teacher(String name, int age, this.subject) : super(name, age);
  
  void teach() {
    print(''$name teaches $subject'');
  }
}
[endcode]
[trycode] 20a0a0bdf3a2f03a8aa519536fe40af2
[list]
`extends` permite heredar de otra clase.
`super()` llama al constructor de la clase padre.
[endlist]
Cada clase puede tener métodos específicos.

[st] Constructores nombrados
[code:dart]
void main() {
  // Default constructor
  Vehicle car1 = Vehicle(''Toyota'', ''Corolla'');
  
  // Named constructor
  Vehicle car2 = Vehicle.electric(''Tesla'', ''Model 3'');
  Vehicle car3 = Vehicle.used(''Ford'', ''Focus'', 2018);
  
  car1.showInfo();
  car2.showInfo();
  car3.showInfo();
}

class Vehicle {
  String brand;
  String model;
  String? type;
  int? year;
  
  // Default constructor
  Vehicle(this.brand, this.model);
  
  // Named constructor for electric vehicles
  Vehicle.electric(this.brand, this.model) {
    type = ''Electric'';
  }
  
  // Named constructor for used vehicles
  Vehicle.used(this.brand, this.model, this.year);
  
  void showInfo() {
    String info = ''$brand $model'';
    if (type != null) info += '' ($type)'';
    if (year != null) info += '' - Year $year'';
    print(info);
  }
}
[endcode]
[trycode] 85b89338cd1dec1644ef3814e11d0525
Los constructores nombrados permiten diferentes formas de crear objetos. Son útiles para casos de uso específicos con diferentes parámetros. ');

-- Inserting content for: lessonB1
INSERT INTO lessons (slug, content) VALUES ('lessonB1', E'[t] Constructores
En Dart, los constructores permiten inicializar los objetos de una clase. Puedes definir constructores con parámetros posicionales o nombrados, y usar la palabra `required` para obligar a que se pasen ciertos valores al crear una instancia.

[st] Constructor básico y uso de final

[code:dart]
class Person {
  final String name;
  final int age;

  Person(this.name, this.age);
}

void main() {
  var person = Person(''Ana'', 30);
  print(person.name); // Ana
}
[endcode]
[trycode] 1d4a3fe97b9141abd8f292c68644d573
La palabra `final` indica que el valor solo puede ser asignado una vez, normalmente en el constructor.

[st] Parámetros nombrados y required

[code:dart]
class Person {
  final String name;
  final int age;

  Person({required this.name, required this.age});
}

void main() {
  var person = Person(name: ''Luis'', age: 25);
  print(person.name); // Luis
}
[endcode]
[trycode] e0a448441e7b821d4bcd7cbba36d037b

Los parámetros nombrados (entre `{}`) permiten mayor claridad y flexibilidad al crear objetos. La palabra `required` obliga a que se pasen esos valores.

[st] Parámetros opcionales y valores por defecto

[code:dart]
class Person {
  final String name;
  final int age;

  Person({required this.name, this.age = 18});
}

void main() {
  var person = Person(name: ''Sofía'');
  print(person.age); // 18
}
[endcode]
[trycode] f3d26c9e77675dbf1c2e654b759cf8ad

Si no usas `{}`, los parámetros son posicionales y deben pasarse en orden. Si usas `{}`, puedes pasarlos en cualquier orden y hacerlos opcionales o requeridos. ');

-- Inserting content for: lessonB2
INSERT INTO lessons (slug, content) VALUES ('lessonB2', E'[t] Factory constructors
Un factory constructor en Dart permite devolver una instancia de la clase, pero no necesariamente una nueva. Es útil para patrones como singleton, caché, o lógica de inicialización condicional.

[st] Ejemplo de factory constructor
[code:dart]
class Logger {
  static final Logger _instance = Logger._internal();

  factory Logger() {
    return _instance;
  }

  Logger._internal();

  void log(String message) {
    print(''LOG: $message'');
  }
}

void main() {
  var logger1 = Logger();
  var logger2 = Logger();
  print(logger1 == logger2); // true
}
[endcode]
[trycode] f8d21d462a74cbc07647642ff564cf30

El factory constructor puede devolver una instancia existente o crear una nueva según la lógica que definas.

[st] Factory para parsear objetos
[code:dart]
class Person {
  final String name;
  final int age;

  Person({required this.name, required this.age});

  factory Person.fromJson(Map<String, dynamic> json) {
    return Person(
      name: json[''nombre''],
      age: json[''edad''],
    );
  }
}

void main() {
  var data = {''nombre'': ''Ana'', ''edad'': 30};
  var person = Person.fromJson(data);
  print(person.name); // Ana
}
[endcode]
[trycode] 2ab3293d832ed38e1fc2b6afa1447689
El factory constructor es ideal para crear objetos a partir de datos externos, como JSON. ');

-- Inserting content for: lessonB3
INSERT INTO lessons (slug, content) VALUES ('lessonB3', E'[t] Herencia y polimorfismo
Dart permite crear jerarquías de clases usando herencia y polimorfismo. Puedes definir clases abstractas para establecer contratos que otras clases deben implementar.

[st] Herencia básica
[code:dart]
class Animal {
  void makeSound() {
    print(''Generic sound'');
  }
}

class Dog extends Animal {
  @override
  void makeSound() {
    print(''Woof!'');
  }
}

void main() {
  var dog = Dog();
  dog.makeSound(); // Woof!
}
[endcode]
[trycode] 4869e28df4f8a68e8c078114a9ac4daa
La herencia permite que una clase derive de otra y sobreescriba sus métodos.

[st] Clases abstractas y métodos abstractos
[code:dart]
abstract class Shape {
  double area();
}

class Circle extends Shape {
  final double radius;
  Circle(this.radius);

  @override
  double area() => 3.14 * radius * radius;
}

void main() {
  Shape shape = Circle(2);
  print(shape.area()); // 12.56
}
[endcode]
[trycode] a7c6ec93deee1c700cac841ac9f82e19
Una clase abstracta puede definir métodos sin implementación. Las clases que la extienden deben implementar esos métodos.

[st] Polimorfismo
[code:dart]
void printArea(Shape shape) {
  print(''Area:  {shape.area()}'');
}

void main() {
  var circle = Circle(3);
  printArea(circle); // Area: 28.26
}
[endcode]
[trycode] 7000c65bf56e4b4690cdcbb567a70d0b
El polimorfismo permite usar una referencia de tipo abstracto para trabajar con cualquier clase que lo implemente. ');

-- Inserting content for: lessonB4
INSERT INTO lessons (slug, content) VALUES ('lessonB4', E'[t] Futures y funciones async
Un `Future` representa un valor que estará disponible en el futuro, normalmente como resultado de una operación asíncrona (por ejemplo, una petición a internet).

[st] Función que retorna un Future
[code:dart]
Future<String> getMessage() async {
  await Future.delayed(Duration(seconds: 2));
  return ''Hello from the future!'';
}

void main() async {
  print(''Waiting...'');
  String message = await getMessage();
  print(message);
}
[endcode]
[trycode] 9ac0073d9828ba3ec7dcd93478b7b98a
La palabra clave `async` permite usar `await` dentro de la función para esperar el resultado de operaciones asíncronas.

[st] Manejo de errores con Future
[code:dart]
Future<int> divide(int a, int b) async {
  if (b == 0) throw Exception(''Cannot divide by zero'');
  return a ~/ b;
}

void main() async {
  try {
    int result = await divide(10, 2);
    print(result);
  } catch (e) {
    print(''Error: $e'');
  }
}
[endcode]
[trycode] f31c9df7ce0bbdac540547a9f08506a0
Puedes usar `try-catch` para manejar errores en funciones asíncronas. ');

-- Inserting content for: lessonB5
INSERT INTO lessons (slug, content) VALUES ('lessonB5', E'[t] Streams y funciones async*
Un `Stream` es una secuencia de valores que llegan en el tiempo. Es útil para manejar eventos, datos en tiempo real o flujos continuos.

[st] Crear un Stream con async*

[code:dart]
Stream<int> countTo(int max) async* {
  for (int i = 1; i <= max; i++) {
    await Future.delayed(Duration(seconds: 1));
    yield i;
  }
}

void main() async {
  await for (int value in countTo(3)) {
    print(value);
  }
}
[endcode]
[trycode] f46f338431a59e088e7f637a2f82201e

La función `async*` permite usar `yield` para emitir valores al stream.

[st] Escuchar un Stream con listen
[code:dart]
Stream<String> messages() async* {
  yield ''Hello'';
  await Future.delayed(Duration(seconds: 1));
  yield ''How are you?'';
}

void main() {
  messages().listen((message) {
    print(message);
  });
}
[endcode]
[trycode] 3cb0f5348a515f52e2eb1b696fa9b005
Puedes escuchar un stream usando `await for` o el método `listen`. ');

-- Inserting content for: lessonB6
INSERT INTO lessons (slug, content) VALUES ('lessonB6', E'[t] El Operador de Cascada (..)

El operador de cascada (``..) es una característica única de Dart que te permite realizar una secuencia de operaciones en el mismo objeto. Es una forma concisa y legible de encadenar llamadas a métodos o asignaciones de propiedades sin tener que repetir el nombre del objeto.

[st] ¿Qué es y para qué sirve?

Imagina que tienes un objeto y quieres llamar a varios de sus métodos o establecer varias de sus propiedades. Normalmente, tendrías que referenciar el objeto en cada línea:

[code:dart]
// Sin operador de cascada
var persona = Persona();
persona.nombre = ''Ana'';
persona.edad = 30;
persona.saludar();
persona.despedirse();
[endcode]

Con el operador de cascada, puedes hacer todo esto en una sola "cascada" de operaciones:

[code:dart]
// Con operador de cascada
var persona = Persona()
  ..nombre = ''Ana''
  ..edad = 30;
  ..saludar();
  ..despedirse();
[endcode]

El operador `..` te permite realizar operaciones en el objeto que resulta de la expresión anterior, pero la expresión en sí misma (en este caso, Persona()) sigue evaluándose a su valor original. Esto significa que persona sigue siendo la instancia de Persona creada, no el resultado de la última operación en la cascada.

[st] Beneficios
[list]
Legibilidad. Hace que el código sea más fácil de leer y entender, ya que agrupa las operaciones relacionadas con un mismo objeto.
Concisión. Reduce la cantidad de código al evitar la repetición del nombre del objeto.
Fluidez. Permite construir objetos y configurarlos de manera más fluida.
[endlist]

[st] Ejemplo Completo

Aquí tienes un ejemplo completo y funcional que puedes pegar directamente en DartPad para ver el operador de cascada en acción. Demuestra cómo inicializar y configurar objetos utilizando este operador en un entorno de consola.

[code:dart]
class Persona {
  String nombre = '''';
  int edad = 0;
  String ciudad = '''';

  void saludar() {
    print(''Hola, soy $nombre y tengo $edad años.'');
  }

  void presentarse() {
    print(''Vivo en $ciudad.'');
  }
}

class Coche {
  String marca = '''';
  String modelo = '''';
  int anio = 0;

  void encender() {
    print(''El $marca $modelo ($anio) ha encendido.'');
  }

  void apagar() {
    print(''El $marca $modelo ($anio) se ha apagado.'');
  }
}

void main() {
  // Ejemplo con Persona
  var ana = Persona()
    ..nombre = ''Ana''
    ..edad = 25
    ..ciudad = ''Madrid''
    ..saludar()
    ..presentarse();

  print(''\n--- Objeto Persona ---'');
  print(''Nombre de Ana: ${ana.nombre}'');

  // Ejemplo con Coche
  var miCoche = Coche()
    ..marca = ''Toyota''
    ..modelo = ''Corolla''
    ..anio = 2020
    ..encender()
    ..apagar();

  print(''\n--- Objeto Coche ---'');
  print(''Marca de mi coche: ${miCoche.marca}'');
}
[endcode]
.');

-- Inserting content for: lessonC1
INSERT INTO lessons (slug, content) VALUES ('lessonC1', E'[t] Instalación de Flutter
En esta lección aprenderás a instalar Flutter en tu sistema operativo (Windows, macOS o Linux) y a dejarlo listo para comenzar a desarrollar aplicaciones móviles.
[v] dUMqg_JQsEc

[st] Descargar Flutter
Para comenzar, ve a la página oficial de instalación de Flutter en [link] (la página oficial de instalación de Flutter) https://docs.flutter.dev/get-started/install

[list]
Elige tu sistema operativo (Windows, macOS o Linux) en la página de instalación.

Descarga el archivo ZIP de Flutter, que tiene un tamaño aproximado de 900 MB.

Descomprime el archivo ZIP en una carpeta de tu preferencia. Se recomienda usar un disco local, pero también puedes elegir las carpetas Descargas o Documentos.
[endlist]

[st] Agregar Flutter al PATH del sistema
Para poder ejecutar el comando `flutter` desde cualquier terminal, debes agregar la carpeta `bin` de Flutter a la variable de entorno PATH.

[st] En Windows
[list]
Busca "Editar las variables de entorno del sistema" en el menú de inicio y ábrelo.

Haz clic en "Variables de entorno".

En la sección "Variables del sistema", busca y selecciona la variable `Path` y haz clic en "Editar".

Haz clic en "Nuevo" y agrega la ruta completa a la carpeta `bin` de Flutter (por ejemplo, `C:\flutter\bin`).

Haz clic en "Aceptar" para guardar los cambios.
[endlist]

[st] En macOS/Linux:
[list]
Abre tu terminal.

Edita el archivo de configuración de tu shell (por ejemplo, `~/.zshrc` o `~/.bashrc`).

Agrega la siguiente línea al final del archivo:
[endlist]

[code:shell]
export PATH="$PATH:/ruta/a/flutter/bin"
[endcode]

[list]
Guarda el archivo y ejecuta `source ~/.zshrc` (o el archivo correspondiente) para aplicar los cambios.
[endlist]

[st] Verificar la instalación
Abre una nueva terminal y ejecuta:

[code:shell]
flutter --version
[endcode]

Si ves la versión de Flutter, la instalación fue exitosa. Ahora puedes ejecutar el comando `flutter` desde cualquier carpeta.

[st] Usar flutter doctor
Ejecuta el siguiente comando para verificar que todo esté correctamente instalado y ver qué dependencias adicionales necesitas:

[code:shell]
flutter doctor
[endcode]

`flutter doctor` te indicará si necesitas instalar Android Studio, Xcode (en Mac), o aceptar licencias. Sigue las instrucciones que aparecen en la terminal.

[st] Instalar Android Studio y Xcode (si aplica)
Descarga e instala Android Studio desde [link] (Android Studio) https://developer.android.com/studio

Abre Android Studio al menos una vez y crea un proyecto para que se configuren las herramientas.

En Android Studio, abre el "SDK Manager" y asegúrate de instalar el "Android SDK Command-line Tools (latest)".

Si usas Mac, instala Xcode desde la App Store y ábrelo al menos una vez.

[st] Instalar extensiones en Visual Studio Code
Si usas VS Code, instala las extensiones "Flutter" y "Dart" desde el marketplace de extensiones para tener soporte completo de desarrollo.

[st] Probar la instalación
Abre una terminal en cualquier carpeta y ejecuta:

[code:shell]
flutter doctor
[endcode]

Si ves todos los checks en verde, ¡ya puedes comenzar a crear proyectos Flutter!');

-- Inserting content for: lessonC2
INSERT INTO lessons (slug, content) VALUES ('lessonC2', E'[t] Tu primera app Flutter
En esta lección aprenderás a crear tu primer proyecto Flutter desde cero usando el comando `flutter create` y a entender la estructura básica del proyecto.
[v] 44JrbFEeMrE

[st] Crear el proyecto con flutter create
Para crear tu primer proyecto, abre una terminal en la carpeta donde quieras guardar tus proyectos y ejecuta:

[code:shell]
flutter create --org com.tuempresa mi_primera_app
[endcode]

Este comando crea una nueva app Flutter en la carpeta `mi_primera_app` y configura el identificador de paquete (package name) con el dominio de tu organización (`com.tuempresa`).
[list]
Cambia `com.tuempresa` por el dominio de tu organización o tu nombre invertido (ejemplo: `com.ejemplo`).
Cambia `mi_primera_app` por el nombre que quieras para tu proyecto.
El nombre del proyecto y la carpeta debe estar en minúsculas y usar guión bajo para separar palabras (snake_case). Ejemplo: `first_app` o `mi_primera_app`.
[endlist]

[st] Path del proyecto
Por nada del mundo permitas que el path de tu proyecto tenga non-ASCII characters o espacios. El nombre del proyecto debe ir en minúsculas usando `snake_case`

[st] Abrir el proyecto en Visual Studio Code
Abre Visual Studio Code y selecciona la carpeta de tu nuevo proyecto para comenzar a trabajar en él.
[list]
Ve a "File > Open Folder" y selecciona la carpeta creada.
Confirma que confías en los archivos del proyecto.
No te preocupes si ves muchas carpetas y archivos, lo importante es la carpeta `lib` donde está el código principal.
[endlist]

[st] Estructura del proyecto Flutter
El proyecto generado tiene varias carpetas
[list]
`android` y `ios`: aquí puedes editar configuraciones específicas de cada plataforma, como permisos o integraciones nativas.
`lib`: aquí va el código principal de tu app (por defecto, el archivo `main.dart`).
`linux`, `web`, `windows`: carpetas para soporte multiplataforma (enfoque principal: Android/iOS).
[endlist]

[st] El archivo pubspec.yaml
El archivo `pubspec.yaml` es donde se gestionan las dependencias de tu proyecto Flutter, similar a `package.json` en Node.js.
[list]
Aquí puedes añadir paquetes y plugins que tu app necesite.
Cada vez que modifiques este archivo, ejecuta `flutter pub get` para instalar las dependencias.
¡Listo! Ahora tienes tu primer proyecto Flutter creado, abierto en VS Code y listo para comenzar a desarrollar. 
[endlist]');

-- Inserting content for: lessonC3
INSERT INTO lessons (slug, content) VALUES ('lessonC3', E'[t] Ejecutar las apps
En esta lección aprenderás a ejecutar tu app Flutter en emuladores Android/iOS y en dispositivos físicos, tanto desde Android Studio como desde la línea de comandos.
[v] RINBqyRgAAU

[st] Crear y lanzar un emulador Android desde Android Studio
Abre Android Studio y ve a "Virtual Device Manager"

[list]
Haz clic en "Create Device" y elige un modelo (por ejemplo, Pixel XL).
Selecciona una versión de Android (recomendado: la más reciente, por ejemplo API 33, API 34, API 35).
Sigue los pasos y haz clic en "Finish" para crear el emulador.
Puedes lanzar el emulador desde el botón de Play en Device Manager.
[endlist]

[st] Consideraciones de hardware

[list]
Los emuladores requieren buena memoria RAM y CPU. Si tu computador es limitado, es mejor usar un dispositivo Android físico conectado por USB.
En Windows, solo puedes emular Android. Para emular iOS necesitas una Mac.
[endlist]

[st] Ejecutar un emulador Android desde la línea de comandos
Asegúrate de que la carpeta `platform-tools` de Android esté en tu variable de entorno PATH.
Para listar los emuladores disponibles:

[code:shell]
emulator -list-avds
[endcode]

Para lanzar un emulador específico:

[code:shell]
emulator -avd Pixel_2_API_33
[endcode]

Puedes dedicar una consola aparte para ver los logs del emulador.

[st] Abrir un simulador iOS desde la línea de comandos (solo en Mac)

[code:shell]
open -a simulator
[endcode]

[st] Ejecutar la app en un dispositivo o emulador
Para ver los dispositivos disponibles:

[code:shell]
flutter devices
[endcode]

Un output típico de este comando es
[code:bash]
Domi ➤ flutter devices
Found 3 connected devices:
  Domi iPhone (mobile) • 00008130-001610E03E60001C • ios            • iOS 18.5 22F76
  macOS (desktop)      • macos                     • darwin-arm64   • macOS 15.5 24F74 darwin-arm64
  Chrome (web)         • chrome                    • web-javascript • Google Chrome 138.0.7204.158

No wireless devices were found.
[endcode]

Para ejecutar la app en el dispositivo por defecto:

[code:shell]
flutter run
[endcode]

Para ejecutar la app en un dispositivo específico, usa el ID mostrado por `flutter devices`:

[code:shell]
flutter run -d emulator-5554
[endcode]

Por ejemplo, para iOS:

[code:shell]
flutter run -d 833FEF07-C34F-4BE9-944C-DE01BF091C7C
[endcode]

[st] Recomendaciones
[list]
Siempre usa nombres de proyecto y carpetas en minúsculas y con guión bajo (snake_case).
Si tu computador no puede emular Android, conecta un dispositivo físico.
Para iOS, solo puedes emular en Mac.
[endlist]

¡Listo! Ahora sabes cómo ejecutar tu app Flutter en emuladores y dispositivos físicos, tanto desde Android Studio como desde la terminal. ');

-- Inserting content for: lessonC4
INSERT INTO lessons (slug, content) VALUES ('lessonC4', E'[t] Configurando dispositivos virtuales
En esta lección aprenderás a configurar y lanzar emuladores Android e iOS, añadir rutas importantes a tu variable de entorno PATH y recomendaciones clave para tu entorno de desarrollo Flutter.
[v] VbKg1s24mEM

[st] Acceder al SDK Manager en Android Studio
Abre Android Studio y haz clic en el icono del cubo con flecha hacia abajo (SDK Manager). Puedes acceder desde la pantalla principal o desde cualquier proyecto abierto.
La ruta que aparece en el SDK Manager es importante: allí se encuentran las herramientas necesarias para emular dispositivos.

[st] Añadir rutas a la variable PATH
Debes añadir la carpeta `emulator` (y opcionalmente `tools`, `platform-tools`, `bin`) de tu instalación de Android SDK a la variable de entorno PATH de tu sistema.
[list]
En Windows, puedes hacerlo desde las variables de entorno del sistema.
En Mac/Linux, edita tu archivo de configuración de shell (por ejemplo, `~/.zshrc` o `~/.bashrc`).
Después de modificar el PATH, cierra y vuelve a abrir la terminal para que los cambios tengan efecto.
[endlist]

[st] Lanzar emuladores desde la terminal
Los siguientes comandos solo tienen sentido si ya tienes las variables de entorno coniguradas. Si tenías la terminal abierta al momento de añadir las variables de entorno, ciérrala y vuelvela a abrir. Esto es porque al inicio, el shell carga todas la variables de entorno

Para listar los emuladores disponibles

[code:shell]
emulator -list-avds
[endcode]

Para lanzar un emulador específico

[code:shell]
emulator -avd NOMBRE_DEL_EMULADOR
[endcode]

Puedes tener una terminal dedicada para los logs del emulador.

[st] Consideraciones importantes
[list]
Los emuladores requieren buena memoria RAM y CPU. Si tu computador es limitado, usa un dispositivo físico.
No puedes usar el mismo emulador desde Android Studio y la terminal al mismo tiempo: ciérralo en uno antes de abrirlo en el otro.
En Windows solo puedes emular Android. Para iOS necesitas una Mac.
[endlist]

[st] Lanzar el simulador de iOS (solo en Mac)
Asegúrate de haber abierto Xcode al menos una vez. Para abrir el simulador de iOS

[code:shell]
open -a simulator
[endcode]

Esto abrirá la última versión de simulador disponible (por ejemplo, iPhone 14 Pro Max).

[st] Recorderis
Usa el comando

[code:shell]
flutter devices
[endcode]

El segundo parámetro de cada línea es el ID del dispositivo, que puedes usar con

[code:shell]
flutter run -d ID_DEL_DISPOSITIVO
[endcode]

Con esto, puede ejecutar la app en cualquier devices disponible');

-- Inserting content for: lessonD1
INSERT INTO lessons (slug, content) VALUES ('lessonD1', E'[t] Estructura básica de una app Flutter
En esta lección aprenderás cómo funciona el archivo principal de una app Flutter (`main.dart`), cómo crear el widget principal de la aplicación y cómo organizar tu código en carpetas y archivos.

[v] nb5Iqoy073E

Vamos a borrar el contenido de ese archivos con el propósito de entender la función de cada elemento.

[st] El archivo `main.dart` y el método `main()`

El archivo `main.dart` en la carpeta `lib` es el punto de entrada de toda app Flutter. El método `main()` es el primero que se ejecuta y debe llamar a `runApp()` pasando el widget principal de la app.

[code:dart]
import ''package:flutter/material.dart'';

void main() {
  runApp(const App());
}
[endcode]

[list]
`runApp` recibe el widget raíz de la aplicación.
El widget raíz suele llamarse `App` y debe ser un widget especial (puede ser StatelessWidget o StatefulWidget).
[endlist]

[st] Crear el widget principal App
Crea una carpeta `src` dentro de `lib` y dentro de `src` un archivo `app.dart` (usa siempre snake_case para los nombres de archivos).

[code:dart]
import ''package:flutter/material.dart'';

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: ''First app'',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.purple),
        useMaterial3: true,
      ),
      home: const MainScreen(),
    );
  }
}
[endcode]


[list]
`MaterialApp` es el widget que configura el tema, el título y la pantalla inicial (`home`).
Usa `const` en los constructores siempre que sea posible para mejor performance.
[endlist]

[st] Crear la pantalla principal
Crea una carpeta `screens` dentro de `src` y dentro de ella un archivo `main_screen.dart` (usa snake_case).

[code:dart]
import ''package:flutter/material.dart'';

class MainScreen extends StatelessWidget {
  const MainScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text(''Pantalla principal'')),
      body: const Center(child: Text(''¡Bienvenido a tu primera app Flutter!'')),
    );
  }
}
[endcode]

[list]
Todos los widgets visibles en pantalla deben tener un método `build`.
Usa `Scaffold` para la estructura básica de una pantalla.
[endlist]

[st] Importar y conectar los widgets
En `app.dart`, importa el archivo de la pantalla principal

[code:dart]
import ''src/screens/main_screen.dart'';
[endcode]

Asegúrate de que el widget `App` use `home: const MainScreen()`. Así, al ejecutar la app, verás la pantalla principal.
[st] Buenas prácticas
[list]
Usa snake_case para los nombres de archivos y carpetas.
Usa camelCase o PascalCase para los nombres de clases y widgets.
Aprovecha los autocompletadores de tu editor para importar archivos y clases.
Pon `const` en los constructores siempre que sea posible.
[endlist]

[st] Ejemplo completo

[code:dart]
import ''package:flutter/material.dart'';

void main() {
  runApp(const App());
}

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: ''First app'',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.purple),
        useMaterial3: true,
      ),
      home: const MainScreen(),
    );
  }
}

class MainScreen extends StatelessWidget {
  const MainScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text(''Pantalla principal'')),
      body: const Center(child: Text(''¡Bienvenido a tu primera app Flutter!'')),
    );
  }
}
[endcode]
[trycode] 66917ca2b1fdffc1c76f134f47348f67');

-- Inserting content for: lessonD1code
INSERT INTO lessons (slug, content) VALUES ('lessonD1code', E'[code:dart]
import ''package:flutter/material.dart'';

void main() {
  runApp(const App());
}

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: ''First app'',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.purple),
        useMaterial3: true,
      ),
      home: const MainScreen(),
    );
  }
}

class MainScreen extends StatelessWidget {
  const MainScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text(''Pantalla principal'')),
      body: const Center(child: Text(''¡Bienvenido a tu primera app Flutter!'')),
    );
  }
}
[endcode]
[trycode] d95a0b5b9c85b828c94b237be21b1bb9');

-- Inserting content for: lessonD2
INSERT INTO lessons (slug, content) VALUES ('lessonD2', E'[t] Árbol de widgets y Scaffold
En esta lección aprenderás cómo se estructura el árbol de widgets en una app Flutter y el papel fundamental del widget `Scaffold` como base de cualquier pantalla.
[v] M5ZQR5ab8IY

[st] ¿Qué es el árbol de widgets?
En Flutter, toda la interfaz de usuario se construye como un árbol de widgets. Cada widget puede tener hijos y propiedades, y juntos forman la jerarquía visual y funcional de la app.

[st] ¿Qué es Scaffold?
`Scaffold` es un widget que provee la estructura visual básica para una pantalla. Sus dos propiedades principales son:
[list]
AppBar: la barra superior de la pantalla.
Body: el contenido principal de la pantalla.
[endlist]

[st] Ejemplo de árbol de widgets y Scaffold
Supongamos que tenemos una app básica con un `MaterialApp`, un `Scaffold` con `AppBar` y un `body` centrado:

[code:dart]
import ''package:flutter/material.dart'';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: ''Árbol de widgets'',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(''Home''),
        backgroundColor: Theme.of(context).colorScheme.primary,
      ),
      body: const Center(
        child: Text(''Hola mundo''),
      ),
    );
  }
}
[endcode]
[trycode] 884ff75d3d31d4b644ef359c07b23504

[st] Diagrama del árbol de widgets
[v] L84ly8Ef62w
[code:plain]
MaterialApp
 └── home: HomeScreen
      └── Scaffold
           ├── appBar: AppBar
           │     └── title: Text(''Home'')
           └── body: Center
                 └── Text(''Hola mundo'')
[endcode]

[list]
AppBar se crea con la clase `AppBar` y puede tener un título (usualmente un widget `Text`).
Puedes personalizar el color de fondo de la barra usando `backgroundColor` y el tema de la app.
El contenido principal se pone en `body`. Puedes usar `Center` para centrar widgets como `Text`.
Scaffold es la base de cualquier pantalla en Flutter.
Cada widget puede tener hijos y propiedades (por ejemplo, `home`, `appBar`, `body`).
El árbol de widgets es dinámico: Flutter lo reconstruye cuando cambian los datos o el estado.
Dividir la app en widgets pequeños y reutilizables facilita el mantenimiento y la escalabilidad.
El identificador `key` ayuda a Flutter a rastrear y actualizar widgets de manera eficiente.
[endlist]

¡Listo! Ahora comprendes cómo se compone y por qué es importante el árbol de widgets y el widget Scaffold en Flutter. ');

-- Inserting content for: lessonD3
INSERT INTO lessons (slug, content) VALUES ('lessonD3', E'[t] Layout
En esta lección aprenderás a organizar y personalizar la disposición de los widgets en Flutter usando `Container`, `Row` y `Column`.
[v] 75xXoz6JvdY  
[st] El Widget Container
`Container` es un widget versátil que funciona como un "div" en web. Permite personalizar el ancho, alto, color y otros estilos de un área de la pantalla. Solo puede tener un hijo, pero puedes anidar varios containers para lograr diseños complejos.

[code:dart]
import ''package:flutter/material.dart'';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: ''Ejemplo Container'',
      home: Scaffold(
        appBar: AppBar(title: const Text(''Ejemplo Container'')),
        body: Center(
          child: Container(
            width: 200,
            height: 100,
            color: Colors.blueAccent,
            child: const Center(
              child: Text(
                ''¡Hola Container!'',
                style: TextStyle(color: Colors.white, fontSize: 20),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
[endcode]
[trycode] e4cb71b3491e80ceb16a40beea6c10c7

[st] El Widget Column
`Column` es un widget que permite organizar varios widgets hijos en una disposición vertical (de arriba a abajo). Es muy parecido a una columna en Flexbox en web.
[code:dart]
import ''package:flutter/material.dart'';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: ''Ejemplo Column'',
      home: Scaffold(
        appBar: AppBar(title: const Text(''Ejemplo Column'')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center, // Centra los hijos verticalmente
            crossAxisAlignment: CrossAxisAlignment.center, // Centra los hijos horizontalmente
            children: const [
              Text(''Primer Elemento''),
              SizedBox(height: 10), // Espacio entre elementos
              ElevatedButton(onPressed: null, child: Text(''Botón'')),
              SizedBox(height: 10),
              Text(''Tercer Elemento''),
            ],
          ),
        ),
      ),
    );
  }
}
[endcode]
[trycode] 29b05a170041f34fa042190dfbe58b5e

[st] El Widget Row
`Row` es un widget que permite organizar varios widgets hijos en una disposición horizontal (de izquierda a derecha). Es muy parecido a una fila en Flexbox en web.

[code:dart]
import ''package:flutter/material.dart'';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: ''Ejemplo Row'',
      home: Scaffold(
        appBar: AppBar(title: const Text(''Ejemplo Row'')),
        body: Center(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround, // Distribuye el espacio uniformemente alrededor de los hijos
            crossAxisAlignment: CrossAxisAlignment.center, // Centra los hijos verticalmente
            children: const [
              Text(''Elemento A''),
              ElevatedButton(onPressed: null, child: Text(''Botón'')),
              Text(''Elemento B''),
            ],
          ),
        ),
      ),
    );
  }
}
[endcode]
[trycode] 24cbe0dae7df7765d2fbf4eac5896056

[st] Propiedades de Alineación

Los widgets `Row` y `Column` comparten propiedades clave para controlar la disposición y alineación de sus hijos:

Un ejemplo práctico de cómo combinar `Row` y `Column` es la creación de una barra de iconos y texto, como las que se encuentran comúnmente en las aplicaciones móviles.

[code:dart]
import ''package:flutter/material.dart'';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text(''Barra de Iconos'')),
        body: Container(
          color: Colors.black,
          height: double.infinity,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildButtonColumn(Icons.call, ''Llamar''),
              _buildButtonColumn(Icons.near_me, ''Ruta''),
              _buildButtonColumn(Icons.share, ''Compartir''),
            ],
          ),
        ),
      ),
    );
  }

  Column _buildButtonColumn(IconData icon, String label) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(icon, color: Colors.blue),
        SizedBox(height: 8), // Espacio entre icono y texto
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w400,
            color: Colors.blue,
          ),
        ),
      ],
    );
  }
}
[endcode]
[trycode] 2bd3986b5a5872e9941399469b4b89e6
Intenta cambiar las propiedades en el código de ejemplo para que veas los diferentes efectos.

`mainAxisAlignment`
Controla la alineación de los hijos a lo largo del eje principal (horizontal para `Row`, vertical para `Column`).
`MainAxisAlignment.start`, `MainAxisAlignment.end`, `MainAxisAlignment.center`, `MainAxisAlignment.spaceBetween`, `MainAxisAlignment.spaceAround`, `MainAxisAlignment.spaceEvenly`.

`crossAxisAlignment`
Controla la alineación de los hijos a lo largo del eje secundario (vertical para `Row`, horizontal para `Column`).
`CrossAxisAlignment.start`, `CrossAxisAlignment.end`, `CrossAxisAlignment.center`, `CrossAxisAlignment.stretch`.
');

-- Inserting content for: lessonD4A
INSERT INTO lessons (slug, content) VALUES ('lessonD4A', E'[t] Text

El widget `Text` es uno de los más fundamentales en Flutter, utilizado para mostrar una cadena de texto en la pantalla. Permite una gran personalización a través de su propiedad `style`.

[st] Uso Básico

Para mostrar texto, simplemente pasas una cadena al constructor de `Text`.

[code:dart]
Text(''Hola, Flutter!'')
[endcode]

Pruébalo por ti mismo
[code:dart]
import ''package:flutter/material.dart'';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        body: Center(
          child: Text(''Hola, Flutter!'')
        ),
      ),
    );
  }
}
[endcode]
[trycode] 74982acbc364f84b7004d0d5a7718f43

[st] Estilizando el Texto

La propiedad `style` del widget `Text` acepta un objeto `TextStyle`, que te permite controlar una amplia gama de propiedades visuales del texto, como el color, el tamaño de la fuente, el peso (negrita), y más.

[st] Color del Texto

Para cambiar el color del texto, usa la propiedad `color` dentro de `TextStyle`.

[code:dart]
Text(
  ''Texto Rojo'',
  style: TextStyle(color: Colors.red),
)
[endcode]
Pruébalo por ti mismo
[code:dart]
import ''package:flutter/material.dart'';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        body: Center(
          child: Text(
            ''Texto Rojo'',
            style: TextStyle(color: Colors.red),
          )
        ),
      ),
    );
  }
}
[endcode]
[trycode] 09f602401b9ec4bf8c1b0c0ab93ced95

[st] Tamaño de la Fuente

La propiedad `fontSize` controla el tamaño del texto.

[code:dart]
Text(
  ''Texto Grande'',
  style: TextStyle(fontSize: 24.0),
)
[endcode]

Pruébalo por ti mismo
[code:dart]
import ''package:flutter/material.dart'';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        body: Center(
          child: Text(
            ''Texto Grande'',
            style: TextStyle(fontSize: 24.0),
          )
        ),
      ),
    );
  }
}
[endcode]
[trycode] b0247e8702b421da747b8153b55aae8c

[st] Negrita y Otros Pesos de Fuente

Usa la propiedad `fontWeight` para aplicar negrita u otros pesos de fuente. `FontWeight.bold` es para negrita.

[code:dart]
Text(
  ''Texto en Negrita'',
  style: TextStyle(fontWeight: FontWeight.bold),
)
[endcode]

Pruébalo por ti mismo
[code:dart]
import ''package:flutter/material.dart'';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        body: Center(
          child: Text(
            ''Texto en Negrita'',
            style: TextStyle(fontWeight: FontWeight.bold),
          )
        ),
      ),
    );
  }
}
[endcode]
[trycode] 6d10a5b938b99ac69f2cc55deb4bad01

[st] Combinando Estilos

Puedes combinar múltiples propiedades de estilo en un solo `TextStyle`.

[code:dart]
Text(
  ''Texto Azul y Grande'',
  style: TextStyle(
    color: Colors.blue,
    fontSize: 22.0,
    fontWeight: FontWeight.w500, // Un peso intermedio
  ),
)
[endcode]

Pruébalo por tu mismo
[code:dart]
import ''package:flutter/material.dart'';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        body: Center(
          child: Text(
              ''Texto Azul y Grande'',
              style: TextStyle(
              color: Colors.blue,
              fontSize: 22.0,
              fontWeight: FontWeight.w500, // Un peso intermedio
            ),
          )
        ),
      ),
    );
  }
}
[endcode]
[trycode] 99e8e614431f0a06bfd66ec04ba09295

[st] Ejemplo Completo

Aquí tienes un ejemplo completo y funcional que demuestra cómo usar el widget `Text` con diferentes estilos.

[code:dart]
import ''package:flutter/material.dart'';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: ''Ejemplo Text Widget'',
      home: Scaffold(
        appBar: AppBar(title: const Text(''Widget Text'')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: const [
              Text(
                ''Texto por defecto'',
              ),
              SizedBox(height: 20),
              Text(
                ''Texto de color verde'',
                style: TextStyle(color: Colors.green),
              ),
              SizedBox(height: 20),
              Text(
                ''Texto con tamaño 30'',
                style: TextStyle(fontSize: 30.0),
              ),
              SizedBox(height: 20),
              Text(
                ''Texto en negrita'',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 20),
              Text(
                ''Texto morado, grande y en negrita'',
                style: TextStyle(
                  color: Colors.purple,
                  fontSize: 25.0,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
[endcode]
[trycode] 407020861ee8301495bb36973b9edc74

.');

-- Inserting content for: lessonD4B
INSERT INTO lessons (slug, content) VALUES ('lessonD4B', E'[t] TextField

El widget `TextField` es fundamental para permitir a los usuarios introducir texto en tu aplicación. Es altamente personalizable y soporta diversas configuraciones para la entrada de datos.

[st] Uso Básico

El uso más simple de un `TextField` es sin ninguna configuración adicional. Esto creará un campo de texto básico.

[code:dart]
TextField()
[endcode]

[st] Controladores de Texto (TextEditingController)

Para obtener el texto introducido por el usuario o para establecer el texto programáticamente, se utiliza un `TextEditingController`. Es una buena práctica asociar un controlador a cada `TextField`.

[code:dart]
TextEditingController _controller = TextEditingController();
...
TextField(
  controller: _controller,
)
[endcode]

El lugar adecuado para declarar el `TextEditingController` es en una clase `State` de un `StatefulWidget`.

[code:dart]
import ''package:flutter/material.dart'';

class FormScreen extends StatefulWidget {
  const FormScreen({super.key});
  @override
  State<FormScreen> createState() => FormScreenState();
}

class FormScreenState extends State<FormScreen> {
  final _controller = TextEditingController();
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: TextField(
          controller: _controller,
          decoration: const InputDecoration(
            labelText: "Escribe algo"
          ),
          onChanged: (text) {
            print(''Texto actual: $text'');
          },
        ),
      ),
    );
  }
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: const FormScreen()
    );
  }
}

void main() {
  runApp(const MyApp());
}
[endcode]
[trycode] 8d35af6ef04e6ef7045b2ce842028bd4

[st] Extracción de texto
Simplemente usando `_controller.text` se puede acceder al texto escrito en el `TextField`. Observa este ejemplo.

En el ejemplo se extrae el texto para ser usado como una variable de estado. Ten en cuenta que la variable `_controller.text` es en sí misma un estado también, pero no es de solo lectura. Por lo tanto, evita usar la variable de forma directa como si fuera una variable de estado, ya que cuando lo quieras cambiar, no podrías usar el método `setState`.

[code:dart]
import ''package:flutter/material.dart'';

class FormScreen extends StatefulWidget {
  const FormScreen({super.key});
  @override
  State<FormScreen> createState() => FormScreenState();
}

class FormScreenState extends State<FormScreen> {
  final _controller = TextEditingController();
  String _textoMostrado = "";

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Formulario con Label")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextField(
              controller: _controller,
              decoration: const InputDecoration(labelText: "Escribe algo"),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                setState(() {
                  _textoMostrado = _controller.text; // 🔹 Guardamos el texto al presionar el botón
                });
              },
              child: const Text("Mostrar texto"),
            ),
            const SizedBox(height: 20),
            Text(
              _textoMostrado,
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(home: FormScreen());
  }
}

void main() {
  runApp(const MyApp());
}
[endcode]
[trycode] f5c5c94135b2d27e13bd5f50a011288d
[st] InputDecoration

La propiedad `decoration` de `TextField` acepta un objeto `InputDecoration`, que permite añadir etiquetas, texto de ayuda, iconos, bordes y más, para mejorar la experiencia de usuario.

[st] LabelText

`labelText` muestra una etiqueta flotante que se anima cuando el campo está en foco.

[code:dart]
TextField(
  decoration: InputDecoration(
    labelText: ''Nombre de Usuario'',
  ),
)
[endcode]

[st] Borde 
Puedes añadir diferentes tipos de bordes, como `OutlineInputBorder` para un borde rectangular.

[code:dart]
TextField(
  decoration: InputDecoration(
    labelText: ''Contraseña'',
    border: OutlineInputBorder(),
  ),
  obscureText: true, // Para campos de contraseña
)
[endcode]

[st] Iconos

`prefixIcon` y `suffixIcon` permiten añadir iconos al inicio o al final del campo de texto.

[code:dart]
TextField(
  decoration: InputDecoration(
    labelText: ''Buscar'',
    prefixIcon: Icon(Icons.search),
    suffixIcon: Icon(Icons.clear),
  ),
)
[endcode]

[st] Texto de Ayuda (helperText, hintText)

[list]
`helperText`: Texto que aparece debajo del campo de texto.
`hintText`: Texto que aparece dentro del campo cuando está vacío.
[endlist]

[code:dart]
TextField(
  decoration: InputDecoration(
    hintText: ''Introduce tu email'',
    helperText: ''Nunca compartiremos tu email.'',
  ),
)
[endcode]

[st] Ejemplo Completo

Aquí tienes un ejemplo completo y funcional que demuestra cómo usar el widget `TextField` con controladores y diversas decoraciones.

[code:dart]
import ''package:flutter/material.dart'';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: ''Ejemplo TextField Widget'',
      home: MyTextFieldScreen(),
    );
  }
}

class MyTextFieldScreen extends StatefulWidget {
  const MyTextFieldScreen({super.key});

  @override
  State<MyTextFieldScreen> createState() => _MyTextFieldScreenState();
}

class _MyTextFieldScreenState extends State<MyTextFieldScreen> {
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text(''Widget TextField'')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextField(
              controller: _nameController,
              decoration: const InputDecoration(
                labelText: ''Nombre Completo'',
                hintText: ''Escribe tu nombre aquí'',
                prefixIcon: Icon(Icons.person),
                border: OutlineInputBorder(),
              ),
              onChanged: (text) {
                print(''Nombre: $text'');
              },
            ),
            const SizedBox(height: 20),
            TextField(
              controller: _emailController,
              keyboardType: TextInputType.emailAddress,
              decoration: const InputDecoration(
                labelText: ''Correo Electrónico'',
                hintText: ''ejemplo@dominio.com'',
                suffixIcon: Icon(Icons.email),
                helperText: ''Introduce un correo válido'',
                border: UnderlineInputBorder(),
              ),
              onChanged: (text) {
                print(''Email: $text'');
              },
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (context) => AlertDialog(
                    title: const Text(''Datos Ingresados''),
                    content: Text(
                      ''Nombre: ${_nameController.text}\nEmail: ${_emailController.text}'',
                    ),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text(''OK''),
                      ),
                    ],
                  ),
                );
              },
              child: const Text(''Mostrar Datos''),
            ),
          ],
        ),
      ),
    );
  }
}
[endcode]
[trycode] f9ea28d713db887153bb4fc11d755377
.');

-- Inserting content for: lessonD4C
INSERT INTO lessons (slug, content) VALUES ('lessonD4C', E'[t] Button

Los botones son elementos esenciales para la interacción del usuario en cualquier aplicación. Flutter ofrece varios tipos de botones, cada uno diseñado para un propósito y estilo visual específico. En esta lección, exploraremos los botones más comunes y cómo utilizarlos.

[st] ElevatedButton: Botón Elevado

El `ElevatedButton` es un botón con una elevación que lo hace parecer que sobresale de la superficie. Es ideal para acciones primarias o destacadas en tu interfaz.

[code:dart]
ElevatedButton(
  onPressed: () {
    // Acción a realizar cuando se presiona el botón
    print(''ElevatedButton presionado!'');
  },
  child: const Text(''Presióname''),
)
[endcode]

[st] TextButton: Botón de Texto

El `TextButton` es un botón de texto plano, sin elevación. Es adecuado para acciones menos prominentes, como opciones en un diálogo o enlaces.

[code:dart]
TextButton(
  onPressed: () {
    print(''TextButton presionado!'');
  },
  child: const Text(''Más Información''),
)
[endcode]

[st] OutlinedButton: Botón con Borde

El `OutlinedButton` es un botón con un borde delgado y sin relleno. Es útil para acciones secundarias que necesitan ser visibles pero no tan prominentes como un `ElevatedButton`.

[code:dart]
OutlinedButton(
  onPressed: () {
    print(''OutlinedButton presionado!'');
  },
  child: const Text(''Ver Detalles''),
)
[endcode]

[st] IconButton: Botón de Icono

El `IconButton` es un botón que solo muestra un icono. Es perfecto para acciones que pueden representarse visualmente, como un botón de "me gusta" o un icono de configuración.

[code:dart]
IconButton(
  icon: const Icon(Icons.favorite),
  onPressed: () {
    print(''IconButton presionado!'');
  },
  color: Colors.red, // Color del icono
  iconSize: 30.0, // Tamaño del icono
)
[endcode]

[st] Ejemplo Completo

Aquí tienes un ejemplo completo y funcional que demuestra el uso de los diferentes tipos de botones en Flutter.

[code:dart]
import ''package:flutter/material.dart'';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: ''Ejemplo Botones'',
      home: Scaffold(
        appBar: AppBar(title: const Text(''Widgets Button'')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              ElevatedButton(
                onPressed: () {
                  print(''ElevatedButton presionado!'');
                },
                child: const Text(''Botón Elevado''),
              ),
              const SizedBox(height: 20),
              TextButton(
                onPressed: () {
                  print(''TextButton presionado!'');
                },
                child: const Text(''Botón de Texto''),
              ),
              const SizedBox(height: 20),
              OutlinedButton(
                onPressed: () {
                  print(''OutlinedButton presionado!'');
                },
                child: const Text(''Botón con Borde''),
              ),
              const SizedBox(height: 20),
              IconButton(
                icon: const Icon(Icons.settings),
                onPressed: () {
                  print(''IconButton presionado!'');
                },
                color: Colors.blue,
                iconSize: 40.0,
              ),
              const SizedBox(height: 20),
              ElevatedButton.icon(
                onPressed: () {
                  print(''ElevatedButton.icon presionado!'');
                },
                icon: const Icon(Icons.add),
                label: const Text(''Añadir''),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
[endcode]
[trycode] 34399fb97053ae4160c3d796847add65
.');

-- Inserting content for: lessonD4D
INSERT INTO lessons (slug, content) VALUES ('lessonD4D', E'[t] Image

El widget `Image` es esencial para mostrar elementos visuales en tu aplicación. Flutter te permite cargar imágenes tanto desde los assets de tu proyecto como directamente desde una URL en internet.

[st] Agregar Imágenes desde Assets

Para usar imágenes que vienen con tu aplicación (assets), necesitas configurarlas en el archivo `pubspec.yaml` y luego referenciarlas en tu código.

1.  Abre el archivo `pubspec.yaml` (ubicado en la raíz de tu proyecto).
2.  Busca la sección `flutter:` (no la de `dependencies`).
3.  Añade la clave `assets:` y especifica la carpeta donde guardarás tus imágenes. Por ejemplo, si tus imágenes están en una carpeta llamada `assets` en la raíz de tu proyecto:

[code:yaml]
flutter:
  assets:
    - assets/
[endcode]

4.  Crea la carpeta `assets` en la raíz de tu proyecto y coloca allí tus imágenes (por ejemplo, `logo.png`).
5.  Ejecuta `flutter pub get` en tu terminal para que Flutter reconozca los nuevos assets.

[st] Mostrar una Imagen Local (desde Assets)

Una vez configurados los assets, puedes mostrar una imagen local usando `Image.asset`.

[code:dart]
Image.asset(
  ''assets/logo.png'', // Ruta relativa a la carpeta assets
  width: 200,
  height: 100,
  fit: BoxFit.contain, // Ajusta la imagen dentro de sus límites
)
[endcode]

[st] Mostrar una Imagen desde Internet

Para mostrar imágenes alojadas en una URL, utiliza `Image.network`. Flutter las descargará y mostrará automáticamente.

[code:dart]
Image.network(
  ''https://flutter.dev/images/flutter-logo-sharing.png'', // URL de la imagen
  width: 300,
  fit: BoxFit.cover, // Cubre el área disponible, recortando si es necesario
)
[endcode]

[st] Ejemplo Completo

Aquí tienes un ejemplo completo y funcional que demuestra cómo mostrar imágenes desde la red y desde assets (simulando un asset con un `Container` de color si no tienes uno real).

[code:dart]
import ''package:flutter/material.dart'';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: ''Ejemplo Image Widget'',
      home: Scaffold(
        appBar: AppBar(title: const Text(''Widget Image'')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              const Text(''Imagen desde Internet:''),
              const SizedBox(height: 10),
              Image.network(
                ''https://yt3.googleusercontent.com/2__G-ckA66-4JgXPlHTGZvg8CoUIgDU6qYFnJqW-AsVeJvBRT4hCjXz4XMOjIqm4m7v431lT=s900-c-k-c0x00ffffff-no-rj'',
                width: 250,
                height: 250,
                fit: BoxFit.cover,
              ),
              const SizedBox(height: 30),
              const Text(''Imagen desde Assets (simulada):''),
              const SizedBox(height: 10),
              // Para un ejemplo real con assets, necesitarías:
              // Image.asset(''assets/my_local_image.png'', width: 200, height: 200),
              Container(
                width: 200,
                height: 200,
                color: Colors.grey[300],
                child: const Center(child: Text(''Asset Image Placeholder'')),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
[endcode]
[trycode] ccb80513dd8e632aadd3a499337b055b
.');

-- Inserting content for: lessonD4E
INSERT INTO lessons (slug, content) VALUES ('lessonD4E', E'[t] SingleChildScrollView

Cuando el contenido de tu aplicación excede el espacio disponible en la pantalla, Flutter necesita un mecanismo para permitir al usuario desplazarse y ver todo el contenido. El widget `SingleChildScrollView` es la solución más sencilla para habilitar el scroll en una única dirección.

[st] ¿Por qué usar SingleChildScrollView?

Si colocas muchos widgets en una `Column` o `Row` y su tamaño combinado supera el espacio disponible, Flutter generará un error de "overflow" (desbordamiento). `SingleChildScrollView` resuelve esto al hacer que su contenido sea desplazable, evitando el error y permitiendo que todo el contenido sea visible.

[st] Uso Básico

Simplemente envuelve el widget que contiene tu contenido (comúnmente una `Column`) con un `SingleChildScrollView`.

[code:dart]
SingleChildScrollView(
  child: Column(
    children: [
      // Tus widgets aquí
      Text(''Contenido muy largo...''),
      // ...
    ],
  ),
)
[endcode]

[st] Dirección del Scroll

Por defecto, `SingleChildScrollView` permite el scroll vertical. Puedes cambiar la dirección del scroll usando la propiedad `scrollDirection`.

[code:dart]
SingleChildScrollView(
  scrollDirection: Axis.horizontal, // Habilita el scroll horizontal
  child: Row(
    children: [
      // Tus widgets aquí
      Container(width: 200, height: 100, color: Colors.red),
      Container(width: 200, height: 100, color: Colors.green),
      Container(width: 200, height: 100, color: Colors.blue),
    ],
  ),
)
[endcode]

[st] Consideraciones de Rendimiento

`SingleChildScrollView` vs `ListView`: Si tienes una lista muy larga de elementos similares (como una lista de productos, mensajes de chat, etc.), `ListView` es generalmente más eficiente que `SingleChildScrollView`. `ListView` construye solo los elementos que son visibles en la pantalla, mientras que `SingleChildScrollView` construye todos sus hijos a la vez, lo que puede afectar el rendimiento con mucho contenido.

Anidamiento: Evita anidar múltiples widgets de scroll (por ejemplo, un `SingleChildScrollView` dentro de otro `SingleChildScrollView` o un `ListView`) ya que esto puede causar problemas de interacción y rendimiento.

[st] Ejemplo Completo

En el siguiente ejemplo, prueba con diferentes orientaciones del `SingleChildScrollView`

[code:dart]
import ''package:flutter/material.dart'';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: ''Ejemplo SingleChildScrollView'',
      home: Scaffold(
          appBar: AppBar(title: const Text(''Widget SingleChildScrollView'')),
          body: SingleChildScrollView(
          scrollDirection: Axis.horizontal, // Habilita el scroll horizontal
          child: Row(
            children: [
              // Tus widgets aquí
              Container(width: 200, height: 100, color: Colors.red),
              Container(width: 200, height: 100, color: Colors.green),
              Container(width: 200, height: 100, color: Colors.blue),
              Container(width: 200, height: 100, color: Colors.black),
            ],
          ),
        )
      ),
    );
  }
}
[endcode]
[trycode] f2b6f19f634bcc8a293f38838c1e491e
.');

-- Inserting content for: lessonD5
INSERT INTO lessons (slug, content) VALUES ('lessonD5', E'[t] Estado en Flutter

En Flutter, la interfaz de usuario se construye a partir de widgets. Hasta ahora, hemos trabajado principalmente con `StatelessWidget`, que son widgets que no cambian con el tiempo una vez que se construyen. Pero, ¿qué pasa cuando necesitamos que nuestra interfaz reaccione a la interacción del usuario o a cambios en los datos? Aquí es donde entran en juego los `StatefulWidget` y el concepto de "estado".

[st] ¿Qué es el Estado en Flutter?

El "estado" de un widget es la información que puede cambiar durante la vida útil del widget. Cuando el estado de un `StatefulWidget` cambia, Flutter reconstruye (redibuja) solo la parte de la interfaz de usuario que depende de ese estado, haciendo que la UI sea dinámica y reactiva.

[st] StatelessWidget vs. StatefulWidget

[list]
`StatelessWidget` Son widgets que no tienen estado interno que pueda cambiar. Su apariencia depende únicamente de los argumentos que se les pasan durante su construcción. Son ideales para elementos estáticos como textos, iconos o imágenes que no necesitan actualizarse.

`StatefulWidget` Son widgets que pueden mantener un estado que cambia con el tiempo. Cuando su estado cambia, Flutter llama al método `build` nuevamente para redibujar el widget y reflejar los cambios. Son necesarios para elementos interactivos como botones, campos de texto, o cualquier componente que necesite actualizarse visualmente.
[endlist]

[st] Anatomía de un StatefulWidget

Un Widget con estado se compone de dos clases

El `StatefulWidget` es la clase pública que hereda de `StatefulWidget`. Su principal responsabilidad es crear una instancia de la clase `State`.

[code:dart]
class MyStatefulWidget extends StatefulWidget {
  const MyStatefulWidget({super.key});
  @override
  State<MyStatefulWidget> createState() => MyStatefulWidgetState();
}
[endcode]

La clase `State` es la clase privada que hereda de `State<TuWidget>`. Aquí es donde se mantiene el estado mutable del widget y donde se define el método `build` que describe la interfaz de usuario.

[code:dart]
class MyStatefulWidgetState extends State<MyStatefulWidget> {
  @override
  Widget build(BuildContext context) {
    return ...;
  }
  @override
  void dispose() {
    super.dispose();
  }
}
[endcode]

También tiene un método `dispose` que se ejecuta cuando se desmonta el componente. Útil para liberar recursos que se hayan instanciado para el funcionamiento del componente

[st] Actualizando el Estado con `setState()`

Para que Flutter sepa que el estado de un `StatefulWidget` ha cambiado y que necesita redibujar la interfaz de usuario, debes llamar al método `setState()`. Cualquier cambio de estado que ocurra dentro de una llamada a `setState()` provocará que Flutter reconstruya el widget.

[code:dart]
class MyCounterState extends State<MyCounter> {
  int _counter = 0; // El estado del widget

  void _incrementCounter() {
    setState(() {
      _counter++; // Cambiamos el estado
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(''Contador: $_counter''),
        ElevatedButton(
          onPressed: _incrementCounter,
          child: Text(''Incrementar''),
        ),
      ],
    );
  }
}
[endcode]

[st] Ejemplo Completo: Un Contador Simple

Aquí tienes un ejemplo completo y funcional de un contador simple que puedes pegar directamente en DartPad. Cada vez que presiones el botón, el contador se incrementará y la interfaz de usuario se actualizará.

[code:dart]
import ''package:flutter/material.dart'';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: const CounterScreen(),
    );
  }
}

class CounterScreen extends StatefulWidget {
  const CounterScreen({super.key});

  @override
  State<CounterScreen> createState() => _CounterScreenState();
}

class _CounterScreenState extends State<CounterScreen> {
  int _counter = 0; // El estado mutable de este widget

  void _incrementCounter() {
    setState(() {
      _counter++; // Incrementa el contador
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          children: <Widget>[
            Text(
              ''$_counter''
            ),
            ElevatedButton(
              onPressed: _incrementCounter,
              child: const Text(''Incrementar''),
            ),
          ],
        ),
      ),
    );
  }
}
[endcode]
[trycode] 38fb3f8f0af6f1a2d2bbcc37467f1b6e
.');

-- Inserting content for: lessonD6
INSERT INTO lessons (slug, content) VALUES ('lessonD6', E'[t] ScaffoldMessenger

El `ScaffoldMessenger` es un widget crucial en Flutter que permite mostrar `SnackBar`, `BottomSheet` y otros mensajes temporales de manera consistente, incluso cuando el `Scaffold` subyacente cambia o se reconstruye. Resuelve problemas comunes relacionados con la gestión de `SnackBar` en el árbol de widgets.

[st] ¿Por qué necesitamos ScaffoldMessenger?
`ScaffoldMessenger` introduce un `ScaffoldMessengerState` que persiste a través de los cambios de `Scaffold`, proporcionando un `context` estable para mostrar mensajes. Esto evita que el contexto se rompa, por ejemplo, cuando hacemos una transición entre pantallas.

[st] Uso Básico de SnackBar con ScaffoldMessenger

La forma más común de usar `ScaffoldMessenger` es para mostrar `SnackBar`. Puedes acceder a él a través de `ScaffoldMessenger.of(context)`.

[code:dart]
// Mostrar un SnackBar simple
ElevatedButton(
  onPressed: () {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text(''¡Hola desde un SnackBar!''),
      ),
    );
  },
  child: const Text(''Mostrar SnackBar''),
)
[endcode]

[st] SnackBar con Acción

Los `SnackBar` pueden incluir una acción, como un botón para deshacer una operación.

[code:dart]
// Mostrar un SnackBar con una acción
ElevatedButton(
  onPressed: () {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text(''Elemento eliminado.''),
        action: SnackBarAction(
          label: ''Deshacer'',
          onPressed: () {
            // Código para deshacer la acción
            print(''Acción deshecha!'');
          },
        ),
      ),
    );
  },
  child: const Text(''Mostrar SnackBar con Acción''),
)
[endcode]

[st] Gestionar Múltiples SnackBar

Si intentas mostrar varios `SnackBar`s rápidamente, por defecto se pondrán en cola. A menudo, querrás que un nuevo `SnackBar` reemplace al anterior. Para esto, puedes usar `removeCurrentSnackBar()` antes de mostrar el nuevo.

El operador de cascada (`..`) es muy útil aquí para encadenar estas operaciones:

[code:dart]
// Reemplazar el SnackBar actual con uno nuevo
ElevatedButton(
  onPressed: () {
    ScaffoldMessenger.of(context)
      ..removeCurrentSnackBar() // Elimina cualquier SnackBar visible
      ..showSnackBar(
        const SnackBar(content: Text(''Este es un nuevo mensaje!'')),
      );
  },
  child: const Text(''Reemplazar SnackBar''),
)
[endcode]

[st] Ejemplo Completo

Aquí tienes un ejemplo completo y funcional para DartPad que demuestra el uso de `ScaffoldMessenger` para mostrar diferentes tipos de `SnackBar`s.

[code:dart]
import ''package:flutter/material.dart'';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: ''ScaffoldMessenger Demo'',
      home: Builder(
        // Builder es necesario para obtener un contexto que tenga un Scaffold
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text(''ScaffoldMessenger Demo'')),
          body: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                ElevatedButton(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text(''¡SnackBar simple!''),
                      ),
                    );
                  },
                  child: const Text(''Mostrar SnackBar Simple''),
                ),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: const Text(''Elemento eliminado.''),
                        action: SnackBarAction(
                          label: ''Deshacer'',
                          onPressed: () {
                            print(''Acción deshecha!'');
                          },
                        ),
                      ),
                    );
                  },
                  child: const Text(''Mostrar SnackBar con Acción''),
                ),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: () {
                    ScaffoldMessenger.of(context)
                      ..removeCurrentSnackBar()
                      ..showSnackBar(
                        const SnackBar(content: Text(''¡Este es un nuevo mensaje!'')),
                      );
                  },
                  child: const Text(''Reemplazar SnackBar''),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
[endcode]
[trycode] b84dcf85c28f01a6b3304bd19693944b
.');

-- Inserting content for: lessonE1
INSERT INTO lessons (slug, content) VALUES ('lessonE1', E'[t] Navegación entre Pantallas

Ya sabemos cómo crear pantallas y los componentes que las componen. El próximo paso es saber cómo navegar entre ellas. Para aprenderlo, necesitamos mínimo dos pantallas. En este ejemplo, usaremos una pantalla de `LoginScreen` y una `MainScreen`.

[st] Método 1: `Navigator.push`

La forma más directa de navegar es usando el widget `Navigator`. Este componente nativo del framework nos permite hacer "push" (empujar) una nueva pantalla sobre la actual, creando una pila de navegación.

Para lograrlo, nos ubicamos en el botón de login y usamos el método `Navigator.push`. Este método requiere dos parámetros: el `context` (que nos indica dónde estamos en el árbol de widgets) y una `Route` (la ruta a la nueva pantalla).

[code:dart]
// En el onPressed de un botón, por ejemplo:

onPressed: () {
  Navigator.push(
    context,
    MaterialPageRoute(builder: (context) => MainScreen()),
  );
}
[endcode]
[trycode] 3a7334ba4042e7a960d94bb3b2d2589a

El `MaterialPageRoute` es un objeto que construye la nueva pantalla. Su propiedad `builder` recibe una función que devuelve una instancia de la pantalla a la que queremos navegar, en este caso, `MainScreen`. Al ejecutar esto, Flutter automáticamente añade un botón de "atrás" en la `AppBar` para volver a la pantalla anterior.

[st] Método 2: Rutas Nombradas

Una forma más organizada y desacoplada de manejar la navegación es mediante rutas nombradas. En lugar de crear una instancia de la pantalla directamente, le asignamos un identificador (un `String`) a cada pantalla y la llamamos usando ese nombre.

Primero, debemos registrar nuestras rutas en el widget `MaterialApp` en el archivo `main.dart`.

[code:dart]
// En main.dart

MaterialApp(
  // La ruta inicial de la app será la que tenga ''/''
  initialRoute: ''/'',
  routes: {
    ''/'': (context) => LoginScreen(),
    ''/main'': (context) => MainScreen(),
  },
);
[endcode]
[trycode] e4328eaa9aadd0ed884801212ed51b7d

Al usar la propiedad `routes`, no debemos declarar la propiedad `home`. La ruta con el `String` `''/''` se considera la pantalla principal.

Luego, para navegar, usamos el método `Navigator.pushNamed`.

[code:dart]
// En el onPressed del botón de login:

onPressed: () {
  Navigator.pushNamed(context, ''/main'');
}
[endcode]
[trycode] 4917fff087935b28ff1c4d989cfadb7b

Este enfoque es muy útil porque nos permite reutilizar las rutas en cualquier parte de la aplicación sin necesidad de importar los archivos de las pantallas.

[st] Reemplazar la pantalla actual

A veces, no queremos que el usuario pueda volver a la pantalla anterior, como en el caso de un login. Una vez que el usuario se autentica, la pantalla de login debería desaparecer de la pila de navegación.

Para esto, usamos el método `pushNamedAndRemoveUntil`.

[code:dart]
// En el onPressed del botón de login:

onPressed: () {
  Navigator.pushNamedAndRemoveUntil(
    context,
    ''/main'',
    (Route<dynamic> route) => false, // Esta función elimina todas las rutas anteriores
  );
}
[endcode]
[trycode] bcf8748ee2a473c9f647a3cfedb7b92f

Este método navega a la ruta `/main` y luego elimina todas las pantallas anteriores de la pila. El tercer parámetro es una función que determina qué rutas conservar. Al devolver siempre `false`, nos aseguramos de que todas las rutas anteriores sean eliminadas. Como resultado, la nueva pantalla no tendrá el botón de "atrás", ya que no hay a dónde regresar.

[st] Ejemplo completo

Aquí tienes un ejemplo completo y funcional que puedes pegar directamente en DartPad. Este código demuestra la navegación entre una pantalla de inicio y una pantalla principal usando rutas nombradas.

[code:dart]
import ''package:flutter/material.dart'';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: ''Ejemplo de Navegación'',
      initialRoute: ''/'',
      routes: {
        ''/'': (context) => const HomeScreen(),
        ''/details'': (context) => const DetailsScreen(),
      },
    );
  }
}

// Pantalla de Inicio
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(''Pantalla de Inicio''),
      ),
      body: Center(
        child: ElevatedButton(
          onPressed: () {
            // Navegar a la pantalla de detalles
            Navigator.pushNamed(context, ''/details'');
          },
          child: const Text(''Ir a Detalles''),
        ),
      ),
    );
  }
}

// Pantalla de Detalles
class DetailsScreen extends StatelessWidget {
  const DetailsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(''Pantalla de Detalles''),
      ),
      body: Center(
        child: ElevatedButton(
          onPressed: () {
            // Regresar a la pantalla de inicio
            Navigator.pop(context);
          },
          child: const Text(''Volver al Inicio''),
        ),
      ),
    );
  }
}
[endcode]
[trycode] 56b20c1f38c194fde8c2db1c35bbfcb6
.');

-- Inserting content for: lessonE2
INSERT INTO lessons (slug, content) VALUES ('lessonE2', E'[t] Navegación Avanzada
En la lección anterior, aprendimos los fundamentos de la navegación. Ahora, exploraremos técnicas más avanzadas que son cruciales para construir aplicaciones complejas: la gestión del historial de navegación y el paso de argumentos entre pantallas.

[st] Limpiar el Historial de Navegación (Backstack)

Como vimos brevemente, hay escenarios donde no queremos que el usuario pueda regresar a la pantalla anterior. El caso más común es después de un inicio de sesión exitoso o al pasar una pantalla de bienvenida (splash screen). En estos casos, la pantalla anterior debe ser eliminada del historial (o "backstack").

Para lograr esto, usamos el método `Navigator.pushNamedAndRemoveUntil`. Este método no solo nos lleva a una nueva pantalla, sino que también elimina las anteriores según una condición que nosotros definimos.

[code:dart]
// Ejemplo: Navegar desde Login a Home, eliminando la pantalla de Login del historial.
onPressed: () {
  Navigator.pushNamedAndRemoveUntil(
    context,
    ''/home'', // La nueva ruta a la que navegamos
    (Route<dynamic> route) => false, // Condición para eliminar las rutas anteriores
  );
}
[endcode]


La clave está en el tercer parámetro. Es una función que se ejecuta para cada una de las rutas en el historial. Si la función devuelve `false`, la ruta es eliminada. Al usar `(route) => false`, le decimos a Flutter que elimine **todas** las rutas anteriores, dejando únicamente la nueva (`/home`) en el historial. Como resultado, el usuario no verá un botón para regresar.

[st] Pasar Argumentos a una Ruta

Es muy común necesitar enviar datos de una pantalla a otra. Por ejemplo, una lista de productos que, al tocar uno, nos lleva a una pantalla de detalles para ese producto específico. Necesitamos pasar el ID o el objeto completo del producto.

El método `Navigator.pushNamed` tiene un parámetro opcional llamado `arguments` para este propósito.

`Paso 1` Enviar los datos

Al llamar a `pushNamed`, pasamos los datos que queremos enviar en el parámetro `arguments`.

[code:dart]
// Enviando un String simple como argumento
onPressed: () {
  Navigator.pushNamed(
    context,
    ''/details'',
    arguments: ''Hola desde la pantalla de inicio'',
  );
}
[endcode]


`Paso 2` Recibir los datos

En la pantalla de destino, podemos acceder a estos argumentos usando `ModalRoute`.

[code:dart]
// En el método build de la pantalla de detalles (DetailsScreen)

@override
Widget build(BuildContext context) {
  // Extraemos los argumentos
  final String message = ModalRoute.of(context)!.settings.arguments as String;

  return Scaffold(
    appBar: AppBar(
      title: const Text(''Pantalla de Detalles''),
    ),
    body: Center(
      child: Text(message), // Mostramos el mensaje recibido
    ),
  );
}
[endcode]

Es importante hacer un casting (`as String`) porque los argumentos son de tipo `Object?`. Debemos asegurarnos de que el tipo que recibimos es el que esperamos.

[st] Pasar Argumentos con un Objeto Personalizado

Enviar un `String` es útil, pero a menudo necesitamos enviar objetos más complejos. Podemos crear una clase para encapsular los argumentos y asegurar la consistencia y la seguridad de tipos.

`Paso 1` Crear la clase de argumentos

[code:dart]
// Un objeto simple para pasar como argumento
class ScreenArguments {
  final String title;
  final String message;

  ScreenArguments(this.title, this.message);
}
[endcode]
[trycode] fcaedf11986a08bea7c2ae9cc4223875

`Paso 2` Enviar el objeto

[code:dart]
// Navegar y pasar el objeto ScreenArguments
onPressed: () {
  Navigator.pushNamed(
    context,
    ''/details'',
    arguments: ScreenArguments(
      ''Título Personalizado'',
      ''Este es un mensaje desde un objeto.'',
    ),
  );
}
[endcode]
[trycode] 7a0d89245b3093d02e7c0627779fea37

`Paso 3` Recibir y usar el objeto

[code:dart]
// En la pantalla de detalles
@override
Widget build(BuildContext context) {
  final args = ModalRoute.of(context)!.settings.arguments as ScreenArguments;

  return Scaffold(
    appBar: AppBar(
      title: Text(args.title), // Usamos el título del objeto
    ),
    body: Center(
      child: Text(args.message), // Usamos el mensaje del objeto
    ),
  );
}
[endcode]
[trycode] ca6dcc63fd3d67474cc0c1e229ab2d2c

Este método es mucho más robusto y es el recomendado para pasar datos complejos entre pantallas.

[st] Devolver Datos de una Pantalla

Así como enviamos datos hacia adelante, a menudo necesitamos que una pantalla devuelva un resultado a la pantalla que la abrió. Por ejemplo, una pantalla que pide al usuario que elija entre "Sí" o "No" y devuelve esa elección.

Esto se logra combinando `Navigator.pop()` en la pantalla secundaria con `await` en la llamada de `Navigator.push()` en la pantalla principal.

`Paso 1` Esperar el resultado

En la pantalla principal, cuando navegamos a la pantalla de selección, usamos `await` para pausar la ejecución y esperar a que la pantalla de selección se cierre y devuelva un valor.

[code:dart]
// En la pantalla principal, dentro de un método async

Future<void> _navigateAndDisplaySelection(BuildContext context) async {
  // Esperamos el resultado de la pantalla de selección.
  final result = await Navigator.push(
    context,
    MaterialPageRoute(builder: (context) => const SelectionScreen()),
  );

  // Después de que la pantalla de selección devuelve un resultado,
  // ¡actualizamos la UI!
  if (context.mounted && result != null) {
    ScaffoldMessenger.of(context)
      ..removeCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text(''$result'')));
  }
}
[endcode]


`Paso 2` Devolver el resultado

En la pantalla de selección, cuando el usuario toma una decisión, usamos `Navigator.pop()` para cerrar la pantalla y pasar el resultado de vuelta.

[code:dart]
// En la pantalla de selección, dentro de los botones

// Botón "Sí"
ElevatedButton(
  onPressed: () {
    // Cierra la pantalla y devuelve "¡Sí!" como resultado.
    Navigator.pop(context, ''¡Sí!'');
  },
  child: const Text(''¡Sí!''),
)

// Botón "No"
ElevatedButton(
  onPressed: () {
    // Cierra la pantalla y devuelve "¡No!" como resultado.
    Navigator.pop(context, ''¡No!'');
  },
  child: const Text(''¡No!''),
)
[endcode]


Al presionar un botón, la `SelectionScreen` se cierra y el `String` correspondiente se devuelve al `Future` que estaba esperando en la pantalla principal.

[st] Ejemplo Completo

Aquí tienes un ejemplo completo y funcional para DartPad que demuestra cómo pasar un objeto personalizado de una pantalla a otra y cómo la segunda pantalla puede devolver un dato a la primera.

[code:dart]
import ''package:flutter/material.dart'';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      title: ''Navegación Avanzada'',
      home: HomeScreen(),
    );
  }
}

// --- Pantalla Principal ---
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String _selection = "Aún no has elegido.";

  // Método para navegar y esperar un resultado
  Future<void> _navigateToSelectionScreen(BuildContext context) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const SelectionScreen()),
    );

    // Si hay un resultado, actualizamos el estado
    if (result != null) {
      setState(() {
        _selection = result;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(''Pantalla Principal''),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(_selection, style: const TextStyle(fontSize: 20)),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () => _navigateToSelectionScreen(context),
              child: const Text(''Abrir pantalla de selección''),
            ),
          ],
        ),
      ),
    );
  }
}

// --- Pantalla de Selección ---
class SelectionScreen extends StatelessWidget {
  const SelectionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(''Elige una opción''),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            ElevatedButton(
              onPressed: () {
                // Devolver ''Opción A'' como resultado
                Navigator.pop(context, ''Has elegido la Opción A'');
              },
              child: const Text(''Opción A''),
            ),
            ElevatedButton(
              onPressed: () {
                // Devolver ''Opción B'' como resultado
                Navigator.pop(context, ''Has elegido la Opción B'');
              },
              child: const Text(''Opción B''),
            ),
          ],
        ),
      ),
    );
  }
}
[endcode]
[trycode] 09ce64cecc2c69e03a226e109e55b139
.');

-- Inserting content for: lessonE3
INSERT INTO lessons (slug, content) VALUES ('lessonE3', E'[t] Navegación con BottomNavigationBar

Una de las formas más comunes de organizar la navegación en una aplicación móvil es mediante una barra de navegación inferior. El widget `BottomNavigationBar` de Flutter nos permite implementar esta funcionalidad de manera sencilla, ofreciendo al usuario acceso rápido a un número reducido de vistas principales.

[st] Estructura Básica

Para implementar una `BottomNavigationBar`, necesitamos un `StatefulWidget` que gestione el estado de la pestaña seleccionada. La barra de navegación se coloca dentro de la propiedad `bottomNavigationBar` de un `Scaffold`.

La propiedad `items` de la `BottomNavigationBar` recibe una lista de widgets `BottomNavigationBarItem`, donde cada uno representa una pestaña con su propio ícono y etiqueta.

[code:dart]
Scaffold(
  appBar: AppBar(
    title: const Text(''BottomNavBar Demo''),
  ),
  body: // Aquí irá la pantalla seleccionada,
  bottomNavigationBar: BottomNavigationBar(
    items: const <BottomNavigationBarItem>[
      BottomNavigationBarItem(
        icon: Icon(Icons.home),
        label: ''Inicio'',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.business),
        label: ''Negocios'',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.school),
        label: ''Escuela'',
      ),
    ],
  ),
);
[endcode]


[st] Manejo del Estado y la Interacción

Para que la barra de navegación sea interactiva, necesitamos tres elementos clave en nuestro `StatefulWidget`:

1.  Una variable que almacene el índice de la pestaña actualmente seleccionada. Por convención, la llamaremos `_selectedIndex`.
2.  Una lista de los widgets (pantallas) que se mostrarán.
3.  Una función que se ejecute cuando el usuario toque una pestaña. Esta función recibirá el nuevo índice y actualizará `_selectedIndex` dentro de una llamada a `setState`.

[code:dart]
int _selectedIndex = 0; // Índice de la pestaña activa

// Lista de pantallas que se mostrarán
static const List<Widget> _widgetOptions = <Widget>[
  Text(''Index 0: Inicio''),
  Text(''Index 1: Negocios''),
  Text(''Index 2: Escuela''),
];

// Función para cambio de pestaña
void _onItemTapped(int index) {
  setState(() {
    _selectedIndex = index;
  });
}
[endcode]

[st] Conectando Todo

Ahora, conectamos estas partes al `Scaffold`. El `body` del `Scaffold` mostrará el widget de nuestra lista `_widgetOptions` correspondiente al `_selectedIndex`. La `BottomNavigationBar` usará `_selectedIndex` para resaltar la pestaña activa y `_onItemTapped` para manejar los clicks.

[code:dart]
Scaffold(
  appBar: AppBar(
    title: const Text(''BottomNavBar Demo''),
  ),
  body: Center(
    child: _widgetOptions.elementAt(_selectedIndex), // Muestra la pantalla seleccionada
  ),
  bottomNavigationBar: BottomNavigationBar(
    items: const <BottomNavigationBarItem>[
      BottomNavigationBarItem(
        icon: Icon(Icons.home),
        label: ''Inicio'',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.business),
        label: ''Negocios'',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.school),
        label: ''Escuela'',
      ),
    ],
    currentIndex: _selectedIndex, // Resalta la pestaña activa
    selectedItemColor: Colors.amber[800], // Color del ítem seleccionado
    onTap: _onItemTapped, // Llama a la función al dar click
  ),
);
[endcode]

[st] Ejemplo Completo

Este código crea una aplicación con tres pestañas. Cada pestaña muestra un texto simple, pero en una aplicación real, reemplazarías esos `Text` con tus propios widgets de pantalla (por ejemplo, `HomeScreen()`, `ProfileScreen()`, etc.).

[code:dart]
import ''package:flutter/material.dart'';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: MyStatefulWidget(),
    );
  }
}

class MyStatefulWidget extends StatefulWidget {
  const MyStatefulWidget({super.key});

  @override
  State<MyStatefulWidget> createState() => _MyStatefulWidgetState();
}

class _MyStatefulWidgetState extends State<MyStatefulWidget> {
  int _selectedIndex = 0;
  static const List<Widget> _widgetOptions = <Widget>[
    Text(
      ''Index 0: Inicio'',
    ),
    Text(
      ''Index 1: Negocios'',
    ),
    Text(
      ''Index 2: Escuela'',
    ),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(''Ejemplo de BottomNavigationBar''),
      ),
      body: Center(
        child: _widgetOptions.elementAt(_selectedIndex),
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: ''Inicio'',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.business),
            label: ''Negocios'',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.school),
            label: ''Escuela'',
          ),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.blue,
        onTap: _onItemTapped,
      ),
    );
  }
}
[endcode]
[trycode] e891cd454997b1e12f8c2410052cf6cf
');

-- Inserting content for: lessonF1
INSERT INTO lessons (slug, content) VALUES ('lessonF1', E'[t] Introducción a las Listas y ListView

Las listas son uno de los elementos de interfaz de usuario más comunes en las aplicaciones móviles. Nos permiten mostrar colecciones de elementos de forma organizada, como una lista de correos electrónicos, contactos, productos o canciones. En Flutter, el widget principal para mostrar listas es `ListView`.

[st] ¿Qué es `ListView`?

`ListView` es un widget que organiza sus hijos en una lista desplazable en una dirección determinada (por defecto, verticalmente). Es ideal para mostrar un número pequeño y fijo de elementos, o cuando todos los elementos de la lista caben en la pantalla sin necesidad de desplazamiento.

[st] Creando una Lista Simple

Para crear una lista básica con `ListView`, simplemente le pasamos una lista de widgets como sus hijos (`children`). Cada widget en la lista se convierte en un elemento de la lista.

[code:dart]
import ''package:flutter/material.dart'';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text(''Lista Simple'')),
        body: ListView(
          children: const <Widget>[
            ListTile(
              leading: Icon(Icons.star),
              title: Text(''Elemento 1''),
              subtitle: Text(''Descripción del elemento 1''),
            ),
            ListTile(
              leading: Icon(Icons.favorite),
              title: Text(''Elemento 2''),
              subtitle: Text(''Descripción del elemento 2''),
            ),
            ListTile(
              leading: Icon(Icons.thumb_up),
              title: Text(''Elemento 3''),
              subtitle: Text(''Descripción del elemento 3''),
            ),
            // Puedes añadir más ListTile o cualquier otro widget aquí
          ],
        ),
      ),
    );
  }
}
[endcode]
[trycode] 7b684d12d00f344c7f52c73c1ce6d6e4

[st] `ListTile` Un Widget Común para Elementos de Lista

Como puedes ver en el ejemplo anterior, `ListTile` es un widget muy útil para crear elementos de lista. Proporciona una estructura predefinida para:

[list]
`leading`: Un widget al inicio del elemento (a menudo un `Icon` o `CircleAvatar`).
`title`: El contenido principal del elemento (generalmente un `Text`).
`subtitle`: Un texto secundario debajo del título.
`trailing`: Un widget al final del elemento (como un `Icon` para acciones o navegación).
[endlist]

`ListTile` maneja automáticamente el espaciado y la alineación, lo que facilita la creación de listas con un aspecto consistente.

[st] Listas Horizontales: Simulando Contactos

Además de las listas verticales, Flutter también permite crear listas que se desplazan horizontalmente. Esto es útil para mostrar una fila de elementos, como una galería de imágenes o una lista de contactos destacados.

Para hacer un `ListView` horizontal, simplemente cambiamos su propiedad `scrollDirection` a `Axis.horizontal`.

[code:dart]
import ''package:flutter/material.dart'';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    final List<String> contactos = [''Ana'', ''Juan'', ''María'', ''Pedro'', ''Sofía'', ''Luis'', ''Elena'', ''Carlos''];

    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text(''Contactos Horizontales'')),
        body: Column(
          children: [
            const Padding(
              padding: EdgeInsets.all(16.0),
              child: Text(
                ''Contactos Destacados'',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
            ),
            SizedBox(
              height: 120, // Altura fija para la lista horizontal
              child: ListView.builder(
                scrollDirection: Axis.horizontal, // ¡Aquí está la clave!
                itemCount: contactos.length,
                itemBuilder: (context, index) {
                  return Card(
                    margin: const EdgeInsets.symmetric(horizontal: 8.0),
                    child: SizedBox(
                      width: 100, // Ancho fijo para cada tarjeta de contacto
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          CircleAvatar(
                            radius: 30,
                            backgroundColor: Colors.blueAccent,
                            child: Text(
                              contactos[index][0], // Primera letra del nombre
                              style: const TextStyle(color: Colors.white, fontSize: 24),
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            contactos[index],
                            style: const TextStyle(fontSize: 14),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                  );}
              ),
            ),
          ],
        ),
      ),
    );
  }
}
[endcode]
[trycode] 5a51eacc433227a743cbeb4186f8869c');

-- Inserting content for: lessonF2
INSERT INTO lessons (slug, content) VALUES ('lessonF2', E'[t] Listas Dinámicas y ListView.builder

En la lección anterior, vimos cómo usar `ListView` para mostrar listas simples y estáticas. Sin embargo, cuando trabajamos con listas muy largas o con datos que cambian dinámicamente (como una lista de publicaciones de redes sociales o resultados de búsqueda), usar `ListView` directamente con todos los `children` puede ser ineficiente y consumir mucha memoria.

Aquí es donde entra `ListView.builder`.

[st] `ListView.builder`: La Clave para Listas Eficientes

`ListView.builder` es un constructor de `ListView` que construye los elementos de la lista "a demanda" (lazy loading). Esto significa que solo renderiza los elementos que son visibles en la pantalla y unos pocos más que están a punto de ser visibles. Cuando un elemento sale de la pantalla, sus recursos pueden ser liberados, y cuando uno entra, se construye.

Esto lo hace extremadamente eficiente para listas con un gran número de elementos o un número desconocido de elementos.

[st] ¿Cómo funciona `ListView.builder`?

`ListView.builder` requiere dos parámetros principales:

1.  `itemCount`: El número total de elementos en la lista. Flutter lo usa para saber cuántos elementos potenciales hay y cuándo dejar de construir.
2.  `itemBuilder`: Una función que se llama para construir cada elemento de la lista. Recibe dos argumentos: el `BuildContext` y el `index` (la posición del elemento en la lista).

[code:dart]
import ''package:flutter/material.dart'';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    final List<String> items = List<String>.generate(10000, (i) => ''Elemento $i'');

    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text(''Lista Dinámica'')),
        body: ListView.builder(
          itemCount: items.length,
          itemBuilder: (BuildContext context, int index) {
            return ListTile(
              title: Text(items[index]),
              subtitle: Text(''Este es el elemento número ${index + 1}''),
              leading: Icon(Icons.list),
            );
          },
        ),
      ),
    );
  }
}
[endcode]
[trycode] f62169dbb31fb4c6c75bf5dfa4148ed8

En este ejemplo, estamos creando una lista de 10,000 elementos. Si hubiéramos usado `ListView` con `children`, la aplicación probablemente se habría ralentizado o incluso colgado. Con `ListView.builder`, la experiencia es fluida porque solo se construyen los elementos necesarios.

[st] Creando Widgets Personalizados para Elementos de Lista

Aunque `ListTile` es útil, a menudo querrás que tus elementos de lista tengan un diseño más complejo y personalizado. Puedes crear tus propios `StatelessWidget` o `StatefulWidget` para representar cada elemento de la lista y pasarlos al `itemBuilder`.

[code:dart]
import ''package:flutter/material.dart'';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    final List<String> canciones = [
      ''Bohemian Rhapsody'', ''Stairway to Heaven'', ''Hotel California'',
      ''Smells Like Teen Spirit'', ''Billie Jean'', ''Like a Rolling Stone'',
      ''Imagine'', ''One'', ''Hallelujah'', ''''
    ];

    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text(''Lista de Canciones'')),
        body: ListView.builder(
          itemCount: canciones.length,
          itemBuilder: (context, index) {
            return CancionTile(titulo: canciones[index], artista: ''Artista Desconocido'');
          },
        ),
      ),
    );
  }
}

class CancionTile extends StatelessWidget {
  final String titulo;
  final String artista;

  const CancionTile({Key? key, required this.titulo, required this.artista}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              titulo,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 4),
            Text(
              artista,
              style: TextStyle(fontSize: 14, color: Colors.grey[600]),
            ),
          ],
        ),
      ),
    );
  }
}
[endcode]
[trycode] 170d1153830e0cad1ccefec6db787992
.
');

-- Inserting content for: lessonF3
INSERT INTO lessons (slug, content) VALUES ('lessonF3', E'[t] Interacción en Listas y Modelos de Datos Simples

Ahora que sabemos cómo mostrar listas estáticas y dinámicas de manera eficiente, el siguiente paso es hacer que nuestros elementos de lista sean interactivos. En la mayoría de las aplicaciones, al tocar un elemento de una lista, se realiza alguna acción, como navegar a una pantalla de detalles o mostrar más información.

También exploraremos cómo manejar datos más complejos que simples cadenas de texto, utilizando modelos de datos.

[st] Haciendo los Elementos de Lista Interactivos

Para que un elemento de lista responda a toques, podemos envolverlo en un widget que detecte gestos, como `GestureDetector` o `InkWell`. `ListTile` ya tiene una propiedad `onTap` incorporada, lo que lo hace muy conveniente.

[code:dart]
import ''package:flutter/material.dart'';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    final List<String> frutas = [''Manzana'', ''Banana'', ''Cereza'', ''Durazno'', ''Fresa''];

    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text(''Lista Interactiva'')),
        body: ListView.builder(
          itemCount: frutas.length,
          itemBuilder: (context, index) {
            return ListTile(
              title: Text(frutas[index]),
              onTap: () {
                // Acción al tocar el elemento
                 ScaffoldMessenger.of(context)
                  ..removeCurrentSnackBar() // Elimina cualquier SnackBar visible
                  ..showSnackBar(
                    SnackBar(content: Text(''Tocaste: ${frutas[index]}'')
                  ),
                );
                // Aquí podrías navegar a otra pantalla, por ejemplo:
                // Navigator.push(context, MaterialPageRoute(builder: (context) => DetallePantalla(fruta: frutas[index])));
              },
            );
          },
        ),
      ),
    );
  }
}
[endcode]
[trycode] fc9c31cc40446404f7e52ff735de0068

En este ejemplo, cada vez que se toca un elemento de la lista, aparece un `SnackBar` en la parte inferior de la pantalla mostrando qué fruta fue tocada. La función `onTap` de `ListTile` es un `VoidCallback`, lo que significa que espera una función que no toma argumentos y no devuelve nada.

[st] Modelos de Datos Simples

Hasta ahora, hemos trabajado con listas de `String`. Sin embargo, en aplicaciones reales, los datos suelen ser más complejos y estructurados. Por ejemplo, una canción no es solo un título, sino que también tiene un artista, una duración, un género, etc.

Podemos representar estos datos complejos creando clases de Dart que actúen como modelos de datos. Esto mejora la organización, la legibilidad y la seguridad de tipos de nuestro código.

[code:dart]
import ''package:flutter/material.dart'';

// 1. Definimos nuestro modelo de datos para una Canción
class Cancion {
  final String titulo;
  final String artista;
  final Duration duracion;

  const Cancion({
    required this.titulo,
    required this.artista,
    required this.duracion,
  });
}

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    // 2. Creamos una lista de objetos Cancion
    final List<Cancion> canciones = [
      const Cancion(titulo: ''Bohemian Rhapsody'', artista: ''Queen'', duracion: Duration(minutes: 5, seconds: 55)),
      const Cancion(titulo: ''Stairway to Heaven'', artista: ''Led Zeppelin'', duracion: Duration(minutes: 8, seconds: 2)),
      const Cancion(titulo: ''Hotel California'', artista: ''Eagles'', duracion: Duration(minutes: 6, seconds: 30)),
    ];

    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text(''Lista con Modelos'')),
        body: ListView.builder(
          itemCount: canciones.length,
          itemBuilder: (context, index) {
            final cancion = canciones[index]; // Obtenemos el objeto Cancion
            return ListTile(
              title: Text(cancion.titulo),
              subtitle: Text(''${cancion.artista} - ${cancion.duracion.inMinutes} min''),
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text(''Reproduciendo: ${cancion.titulo}'')),
                );
              },
            );
          },
        ),
      ),
    );
  }
}
[endcode]
[trycode] 04ef26c393591b291d1ed78770dc1efb

Al usar modelos de datos, nuestro código se vuelve más organizado y fácil de entender. Cada elemento de la lista es un objeto con propiedades bien definidas, lo que facilita el acceso y la manipulación de la información.
');

-- Inserting content for: lessonF4
INSERT INTO lessons (slug, content) VALUES ('lessonF4', E'[t] Listas y estados

En las lecciones anteriores, hemos trabajado principalmente con `StatelessWidget`, que son widgets que no cambian una vez que se construyen. Sin embargo, la mayoría de las aplicaciones necesitan interactuar con el usuario y mostrar datos que cambian con el tiempo. Para esto, necesitamos `StatefulWidget`.

[st] Usemos el `StatefulWidget`

Como hemos visto, un `StatefulWidget` es un widget que puede cambiar su apariencia. Puede hacerlo, entre otros, ante eventos del usuario. 

[st] El Modelo de Datos: `Reminder`

Para nuestra aplicación de recordatorios, definiremos una clase simple `Reminder` que contendrá la descripción de cada recordatorio.

[code:dart]
class Reminder {
  final String description;

  const Reminder({required this.description});
}
[endcode]
[trycode] 008afc2e841bfb8d9c31964290b4b97a

[st] Construyendo la Aplicación de Recordatorios

Nuestra aplicación tendrá un `TextField` para ingresar nuevos recordatorios y un `ElevatedButton` para agregarlos a una lista. La lista de recordatorios se mostrará en un `ListView`.

La clave aquí es que la lista de `Reminder`s y el texto del `TextField` serán parte del estado de nuestro `StatefulWidget`.

[code:dart]
import ''package:flutter/material.dart'';

// Modelo de datos para un recordatorio
class Reminder {
  final String description;

  const Reminder({required this.description});
}

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: ''Aplicación de Recordatorios'',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: const ReminderScreen(),
    );
  }
}

// StatefulWidget para la pantalla de recordatorios
class ReminderScreen extends StatefulWidget {
  const ReminderScreen({super.key});

  @override
  State<ReminderScreen> createState() => _ReminderScreenState();
}

class _ReminderScreenState extends State<ReminderScreen> {
  // Lista de recordatorios que es parte del estado
  final List<Reminder> _reminders = [];
  // Controlador para el TextField
  final TextEditingController _textController = TextEditingController();

  // Método para agregar un nuevo recordatorio
  void _addReminder() {
    // Verificamos que el TextField no esté vacío
    if (_textController.text.isNotEmpty) {
      // setState notifica a Flutter que el estado ha cambiado
      // y que el widget debe reconstruirse.
      setState(() {
        _reminders.add(Reminder(description: _textController.text));
        _textController.clear(); // Limpiamos el TextField
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text(''Mis Recordatorios'')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _textController,
                    decoration: const InputDecoration(
                      labelText: ''Nuevo Recordatorio'',
                      border: OutlineInputBorder(),
                    ),
                    onSubmitted: (_) => _addReminder(), // Agrega al presionar Enter
                  ),
                ),
                const SizedBox(width: 8),
                ElevatedButton(
                  onPressed: _addReminder,
                  child: const Text(''Agregar''),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              itemCount: _reminders.length,
              itemBuilder: (context, index) {
                return Card(
                  margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  child: ListTile(
                    title: Text(_reminders[index].description),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _textController.dispose(); // Liberar recursos del controlador
    super.dispose();
  }
}
[endcode]
[trycode] 857175190ca4a1f809f78a6ba695e01a

[st] Explicación del Estado

*   **`_reminders`**: Esta lista se declara dentro de la clase `_ReminderScreenState`. Esto significa que su valor se mantiene mientras el `State` del `ReminderScreen` exista. Cuando agregamos un nuevo recordatorio, modificamos esta lista.
*   **`_textController`**: Similarmente, el controlador del `TextField` se mantiene en el estado para poder acceder y limpiar el texto.
*   **`setState(() { ... });`**: Este es el método mágico. Cuando llamas a `setState`, le estás diciendo a Flutter: "¡Oye, algo en mi estado ha cambiado y necesito que reconstruyas mi widget para reflejar esos cambios!". Flutter entonces ejecuta el método `build` de nuevo, y la interfaz de usuario se actualiza para mostrar la lista de recordatorios con el nuevo elemento.
*   **`dispose()`**: Es importante liberar los recursos de los `TextEditingController` cuando el widget ya no se necesita para evitar fugas de memoria.

Esta lección te da una base sólida para entender cómo los `StatefulWidget` te permiten crear interfaces de usuario dinámicas y reactivas en Flutter.
');

-- Inserting content for: lessonG1
INSERT INTO lessons (slug, content) VALUES ('lessonG1', E'[t] Cubit y estados
En esta lección, exploraremos cómo manejar el estado en una aplicación de Flutter utilizando `Cubit`, una solución ligera y predecible para la gestión de estado que forma parte del ecosistema `flutter_bloc`.

[st] ¿Qué es un Cubit?
Un `Cubit` es una clase que se encarga de almacenar y exponer un estado observable.
A diferencia de otras soluciones más complejas, un Cubit ofrece una API sencilla: expone funciones que pueden ser llamadas para actualizar y emitir nuevos estados.

Su principal ventaja es que centraliza el estado en un único punto, separándolo del árbol de componentes.
De esta forma, evitamos el problema del prop-drilling (pasar estados y funciones manualmente a través de múltiples niveles de widgets) y logramos una gestión de estado más limpia y desacoplada.

[st] Paso 1: Configuración del Proyecto
Primero, creamos un nuevo proyecto de Flutter y agregamos la dependencia `flutter_bloc`.

[st] Crear el Proyecto
[code:bash]
flutter create --org icesi.edu.co cubitexample
[endcode]

[st] Agregar Dependencia
Abre tu archivo `pubspec.yaml` y agrega `flutter_bloc` a las dependencias:
[code:yaml]
dependencies:
  flutter:
    sdk: flutter
  flutter_bloc: ^9.1.1
[endcode]
Luego, ejecuta `flutter pub get` en tu terminal para instalar el paquete.

[st] Paso 2: Definiendo el Estado
El estado es la información que nuestra UI mostrará. En este caso, queremos manejar una lista de contactos.

[st] Modelo de Datos
Primero, definimos un modelo `Contact` para representar cada contacto.
[code:dart]
class Contact {
  final String id;
  final String name;
  final String email;
  final String phone;

  Contact({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
  });
}
[endcode]

[st] Clase de Estado
Luego, creamos una clase `ContactState` que contendrá la lista de contactos. Es una buena práctica hacer que el estado sea inmutable.
[code:dart]
class ContactState {
  final List<Contact> contacts;

  ContactState({this.contacts = const []});
}
[endcode]

[st] Paso 3: Creando el Cubit
El `Cubit` será responsable de manejar la lógica de negocio y emitir nuevos estados.
[code:dart]
import ''package:cubitexample/state/ContactState.dart'';
import ''package:flutter_bloc/flutter_bloc.dart'';

class ContactCubit extends Cubit<ContactState> {
  // El estado inicial se pasa al constructor de la superclase.
  ContactCubit() : super(ContactState());

  // Función para agregar un nuevo contacto
  void addProfile(Contact contact) {
    // Creamos una nueva lista con el contacto agregado
    final updatedContacts = [...state.contacts, contact];
    // Emitimos un nuevo estado con la lista actualizada
    emit(ContactState(contacts: updatedContacts));
  }

  // Función para eliminar un contacto por su ID
  void removeProfile(String id) {
    // Filtramos la lista para excluir el contacto a eliminar
    final updatedContacts = state.contacts.where((c) => c.id != id).toList();
    // Emitimos un nuevo estado
    emit(ContactState(contacts: updatedContacts));
  }
}
[endcode]
[list]
`ContactCubit` extiende `Cubit<ContactState>`, lo que significa que manejará estados de tipo `ContactState`.
El estado inicial se establece en el constructor (`super(ContactState())`).
Las funciones `addProfile` y `removeProfile` emiten nuevos estados usando `emit()`. Es crucial crear una nueva instancia del estado en lugar de mutar la existente.
[endlist]

[st] Paso 4: Integrando el Cubit en la UI
Ahora, conectaremos nuestro `Cubit` a la interfaz de usuario de Flutter.

[st] BlocProvider
Para que un `Cubit` esté disponible en el árbol de widgets, usamos `BlocProvider`. Este widget crea e inyecta una instancia del `Cubit`.
[code:dart]
class ContactScreen extends StatelessWidget {
  const ContactScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // BlocProvider crea y provee el ContactCubit al árbol de widgets.
    return BlocProvider(
      create: (_) => ContactCubit(),
      child: Scaffold(
        // ... el resto de la UI
      ),
    );
  }
}
[endcode]

[st] BlocBuilder
Para escuchar los cambios de estado y reconstruir la UI, usamos `BlocBuilder`.
[code:dart]
// ... dentro del Scaffold
body: BlocBuilder<ContactCubit, ContactState>(
  builder: (context, state) {
    // El builder se ejecuta cada vez que el estado cambia.
    return SafeArea(
      child: Column(
        children: [
          ElevatedButton(
            onPressed: () {
              // Accedemos al Cubit y llamamos a la función para agregar un contacto.
              context.read<ContactCubit>().addProfile(
                Contact(
                  id: "Alfa",
                  name: "Señor Kevin",
                  email: "senorkevin@gmail.com",
                  phone: "3117182279",
                ),
              );
            },
            child: Text("Agregar datos"),
          ),
          Expanded(
            child: ListView(
              // Usamos la lista de contactos del estado actual.
              children: state.contacts.map((c) {
                return ListTile(title: Text(c.name));
              }).toList(),
            ),
          ),
        ],
      ),
    );
  },
),
[endcode]
[list]
`BlocBuilder<ContactCubit, ContactState>` se suscribe a `ContactCubit` y reconstruye su `builder` en respuesta a nuevos `ContactState`.
`context.read<ContactCubit>()` nos da acceso a la instancia del `Cubit` sin suscribirnos a los cambios. Es ideal para llamar funciones en eventos como `onPressed`.
[endlist]

[st] Ejemplo completo en un sólo script
Finalmente, aquí está el código completo para `main.dart` que une todo.
[code:dart]
import ''package:flutter/material.dart'';
import ''package:flutter_bloc/flutter_bloc.dart'';

// --- Clases de Estado y Modelo ---
class Contact {
  final String id;
  final String name;
  final String email;
  final String phone;
  Contact({required this.id, required this.name, required this.email, required this.phone});
}

class ContactState {
  final List<Contact> contacts;
  ContactState({this.contacts = const []});
}

// --- Cubit ---
class ContactCubit extends Cubit<ContactState> {
  ContactCubit() : super(ContactState());

  void addProfile(Contact contact) {
    emit(ContactState(contacts: [...state.contacts, contact]));
  }

  void removeProfile(String id) {
    emit(ContactState(contacts: [...state.contacts.where((c) => c.id != id)]));
  }
}

// --- Aplicación Principal ---
void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: ''Cubit Example'',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const ContactScreen(),
    );
  }
}

// --- Pantalla de Contactos ---
class ContactScreen extends StatelessWidget {
  const ContactScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => ContactCubit(),
      child: Scaffold(
        appBar: AppBar(title: const Text(''Contactos con Cubit'')),
        body: BlocBuilder<ContactCubit, ContactState>(
          builder: (context, state) {
            return Column(
              children: [
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: ElevatedButton(
                    onPressed: () {
                      final newContact = Contact(
                        id: DateTime.now().toString(), // ID único
                        name: "Nuevo Contacto",
                        email: "nuevo@example.com",
                        phone: "123456789",
                      );
                      context.read<ContactCubit>().addProfile(newContact);
                    },
                    child: const Text("Agregar Contacto"),
                  ),
                ),
                Expanded(
                  child: ListView.builder(
                    itemCount: state.contacts.length,
                    itemBuilder: (context, index) {
                      final contact = state.contacts[index];
                      return ListTile(
                        title: Text(contact.name),
                        subtitle: Text(contact.email),
                        trailing: IconButton(
                          icon: const Icon(Icons.delete, color: Colors.red),
                          onPressed: () {
                            context.read<ContactCubit>().removeProfile(contact.id);
                          },
                        ),
                      );
                    },
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}
[endcode]
¿Qué tal si requiero un objeto como estado?
');

-- Inserting content for: lessonG2
INSERT INTO lessons (slug, content) VALUES ('lessonG2', E'
[t] Objeto como estado en Cubit
Ya hemos visto como tener un estado como lista. Pero qué pasa si quiero representar un sólo objeto y no una lista. Estilo un objeto profile sobre una pantalla de Profile?

El principio es exactamente el mismo. En lugar de que nuestra clase de estado contenga una lista, contendrá una única instancia de nuestro objeto. También es común incluir un estado para representar cuándo el perfil se está cargando o si ha ocurrido un error.

Veamos un ejemplo para un perfil de usuario.

[st] 1. Definir el Estado del Perfil

Primero, definimos la clase `ProfileState` que manejará los diferentes estados posibles: inicial, carga, éxito (con los datos del perfil) y error.

[code:dart]
// Se puede usar una clase abstracta o una clase con estados enumerados

abstract class ProfileState {}

class ProfileInitial extends ProfileState {}

class ProfileLoading extends ProfileState {}

class ProfileSuccess extends ProfileState {
  final UserProfile profile;
  ProfileSuccess(this.profile);
}

class ProfileError extends ProfileState {
  final String message;
  ProfileError(this.message);
}

// Modelo para el perfil de usuario
class UserProfile {
  final String name;
  final String email;
  UserProfile({required this.name, required this.email});
}
[endcode]

[st] 2. Crear el Cubit del Perfil

El `ProfileCubit` manejará la lógica para cargar el perfil.

[code:dart]
class ProfileCubit extends Cubit<ProfileState> {
  ProfileCubit() : super(ProfileInitial());

  Future<void> fetchProfile() async {
    try {
      emit(ProfileLoading());
      // Simula una llamada a una API
      await Future.delayed(const Duration(seconds: 2));
      final profile = UserProfile(name: ''Juan Perez'', email: ''juan.perez@example.com'');
      emit(ProfileSuccess(profile));
    } catch (e) {
      emit(ProfileError(''No se pudo cargar el perfil.''));
    }
  }
}
[endcode]

[st] 3. Usar el Cubit en la UI

Finalmente, en la UI, usamos `BlocBuilder` para reaccionar a los diferentes estados del perfil y mostrar la información correspondiente.

[code:dart]
class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => ProfileCubit()..fetchProfile(), // Carga el perfil al iniciar
      child: Scaffold(
        appBar: AppBar(title: const Text(''Perfil de Usuario'')),
        body: BlocBuilder<ProfileCubit, ProfileState>(
          builder: (context, state) {
            if (state is ProfileLoading) {
              return const Center(child: CircularProgressIndicator());
            } else if (state is ProfileSuccess) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(''Nombre: ${state.profile.name}'', style: const TextStyle(fontSize: 24)),
                    Text(''Email: ${state.profile.email}'', style: const TextStyle(fontSize: 24)),
                  ],
                ),
              );
            } else if (state is ProfileError) {
              return Center(child: Text(state.message, style: const TextStyle(color: Colors.red)));
            } else {
              return const Center(child: Text(''Presiona el botón para cargar el perfil''));
            }
          },
        ),
      ),
    );
  }
}
[endcode]

Este enfoque nos da un control muy granular sobre la UI, permitiéndote mostrar diferentes widgets para cada estado posible de nuestro objeto.');

-- Inserting content for: lessonG3
INSERT INTO lessons (slug, content) VALUES ('lessonG3', E'[t] Introducción a Bloc
Después de aprender a manejar el estado con `Cubit`, el siguiente paso natural en el ecosistema de `flutter_bloc` es entender `Bloc`. Mientras que `Cubit` es ideal por su simplicidad, `Bloc` ofrece más potencia y trazabilidad al costo de un poco más de código (verboso, si. Pero poderoso).

[st] ¿Qué es un Bloc?
Un `Bloc` (Business Logic Component) es similar a un `Cubit` en que ambos manejan un estado y lo exponen a la UI. La diferencia fundamental radica en cómo se procesan los cambios de estado.

[list]
`Cubit`: Expones funciones públicas que la UI puede llamar directamente para emitir nuevos estados. Es directo y simple.
`Bloc`: En lugar de funciones, despachas `eventos`. El `Bloc` recibe estos eventos, procesa la lógica correspondiente y luego emite nuevos estados.
[endlist]

Este enfoque basado en eventos hace que `Bloc` sea más explícito sobre las interacciones que pueden ocurrir. Cada interacción es un evento, lo que facilita el seguimiento, el registro de logs y las pruebas.

[st] Componentes Clave de un Bloc
Un `Bloc` se compone de tres partes principales: Eventos, Estados y el propio Bloc.

[st] 1. Eventos (Events)
Los eventos son las entradas del `Bloc`. Representan una acción del usuario o un suceso del sistema que requiere un cambio de estado. Se definen como clases.

[code:dart]
// Archivo: counter_event.dart
abstract class CounterEvent {}

// Evento para incrementar el contador
class CounterIncrementPressed extends CounterEvent {}

// Evento para decrementar el contador
class CounterDecrementPressed extends CounterEvent {}
[endcode]

[st] 2. Estados (States)
El estado es la salida del `Bloc`, similar a como funciona en `Cubit`. Representa una parte de la UI de tu aplicación.

[code:dart]
// Archivo: counter_state.dart
class CounterState {
  final int count;
  const CounterState(this.count);
}
[endcode]

[st] 3. El Bloc (Bloc)
El `Bloc` es donde reside la lógica de negocio. Escucha los eventos entrantes y los transforma en estados salientes.

[code:dart]
// Archivo: counter_bloc.dart
import ''package:flutter_bloc/flutter_bloc.dart'';
import ''counter_event.dart'';
import ''counter_state.dart'';

class CounterBloc extends Bloc<CounterEvent, CounterState> {
  // Define el estado inicial
  CounterBloc() : super(const CounterState(0)) {
    // Registra manejadores de eventos
    on<CounterIncrementPressed>((event, emit) {
      // Emite un nuevo estado con el contador incrementado
      emit(CounterState(state.count + 1));
    });

    on<CounterDecrementPressed>((event, emit) {
      // Emite un nuevo estado con el contador decrementado
      if (state.count > 0) {
        emit(CounterState(state.count - 1));
      }
    });
  }
}
[endcode]
[list]
`CounterBloc` extiende `Bloc<CounterEvent, CounterState>`.
El constructor define el estado inicial.
El método `on<EventType>` registra un manejador para un tipo de evento específico. Dentro de este manejador, se emiten nuevos estados con `emit()`.
[endlist]

[st] Usando el Bloc en la UI
La integración con la UI es muy parecida a la de `Cubit`, pero en lugar de llamar a una función, se añade un evento al `Bloc`.
Lo primero es usar nuestro amigo el BlocProvider para proveer de la instancia de `BloC` necesaria.
[code:dart]
class CounterPage extends StatelessWidget {
  const CounterPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text(''Bloc Counter'')),
      body: BlocProvider(
        create: (_) => CounterBloc(),
        child: const CounterView(),
      ),
    );
  }
}
[endcode]
Luego, usamos la lectura de contexto para agregar el evento. Note que le pasamos el evento por medio del método `add`. 
[code:dart]
//Estamos en la capa UI
FloatingActionButton(
  onPressed: () => context.read<CounterBloc>().add(CounterIncrementPressed()),
  child: const Icon(Icons.add),
)
[endcode]
El `BloC` entonces recibe la nueva instancia del evento lo que activa este método `on` definido para el evento
[code:dart]
//Estamos en la capa BloC
on<CounterIncrementPressed>((event, emit) {
  emit(CounterState(state.count + 1));
});
[endcode]
Esto emite un nuevo estado a la vista y la vista lo puede cargar por medio de nuestro otro amigo el `BlocBuilder`
[code:dart]
//Estamos en la capa UI
BlocBuilder<CounterBloc, CounterState>(
  builder: (context, state) {
    return Text(''${state.count}'');
  },
)
[endcode]

La principal diferencia de `Cubit` y `BloC` es el uso de `context.read<CounterBloc>().add(MyEvent())` para despachar un evento, en lugar de `context.read<MyCubit>().myFunction()`.

[st] ¿Cuándo usar Bloc en lugar de Cubit?
Usa `Cubit` para lógica de estado simple. Es más rápido de escribir y más fácil de entender.
Usa `Bloc` cuando tengas una lógica de estado compleja, con múltiples eventos que pueden ocurrir y necesitas una clara trazabilidad de los cambios de estado. Es ideal para flujos de trabajo paso a paso o máquinas de estado complejas.
');

-- Inserting content for: lessonH1
INSERT INTO lessons (slug, content) VALUES ('lessonH1', E'[t] Instalación de supabase
Supabase es una alternativa de código abierto a Firebase que ofrece una base de datos Postgres, autenticación, almacenamiento y mucho más. 

[st] 1. Configuración del Proyecto en Supabase
Antes de empezar, necesitas una cuenta en Supabase y un proyecto nuevo.
[list]
Ve a [link] (Supabase) https://supabase.com/
Crea una organización
Crea un proyecto
En el panel de tu proyecto, ve a `Authentication` y asegúrate de que el proveedor de `email` esté habilitado.
[endlist]

[st] 2. Instalación de Dependencias
Agrega el paquete `supabase_flutter` a tu archivo `pubspec.yaml` para poder interactuar con Supabase.
[code:yaml]
dependencies:
  flutter:
    sdk: flutter
  supabase_flutter: ^2.10.1 
[endcode]
Luego, ejecuta `flutter pub get` en tu terminal para instalar el paquete.

[st] 3. Inicialización de Supabase en Flutter
Debes inicializar el cliente de Supabase en tu archivo `main.dart` antes de ejecutar la aplicación. Esto permite que el cliente de Supabase esté disponible en toda tu app.
[code:dart]
import ''package:flutter/material.dart'';
import ''package:supabase_flutter/supabase_flutter.dart'';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Supabase.initialize(
    url: ''TU_SUPABASE_URL'',
    anonKey: ''TU_PUBLISHABLE_KEY'',
  );
  runApp(MyApp());
}

// Obtén una referencia al cliente de Supabase
final supabase = Supabase.instance.client;
[endcode]

Recuerda reemplazar `TU_SUPABASE_URL` y `TU_PUBLISHABLE_KEY` con las credenciales de tu proyecto.

[st] Objetos

User → te da información de la identidad del usuario en Supabase Auth.
Ejemplo: id, email, estado de confirmación, metadatos.
Sirve para saber quién es ese usuario aunque aún no esté loggeado.

Session → representa una sesión activa (autenticación vigente).
Incluye los tokens (access_token, refresh_token), tiempo de expiración y referencia al User.
Es lo que te dice “este usuario ya está autenticado y puede hacer peticiones a la API”.');

-- Inserting content for: lessonH10
INSERT INTO lessons (slug, content) VALUES ('lessonH10', E'[t] Laboratorio 7: Chat App

Lo han contratado porque la empresa Not Too Far ha sabido que usted y su equipo saben de aplicaciones móviles. Su tarea es implementar la funcionalidad de chat en una aplicación existente.

Primero, clónese este repositorio: [link] (AppMóvil252) https://github.com/Domiciano/AppMovil252

[st] Modelo de Base de Datos
A continuación se presenta el modelo de base de datos que se utilizará para la funcionalidad de chat. Asegúrese de que estas tablas existan en su base de datos de Supabase.

[i] dblab7.png

Tabla de perfiles (ya debería estar creada)
[code:sql]
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  created_at timestamp with time zone default now()
);
[endcode]

Tabla de conversaciones (entre 2 perfiles)
[code:sql]
create table conversations (
  id uuid primary key default gen_random_uuid(),
  profile1_id uuid references profiles(id) on delete cascade,
  profile2_id uuid references profiles(id) on delete cascade,
  created_at timestamp with time zone default now()
);
[endcode]

Tabla de mensajes
[code:sql]
create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  sender_id uuid references profiles(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default now()
);
[endcode]

[st] Flujos de lista de usuarios
Revise el flujo de la aplicación y desarrolle lo necesario para
[list]
Resolver `getAllProfiles()`
[endlist]
Para poder obtener la lista de usuarios y listarla en la pantalla correspondiente.

[list]
Al dar clic en un usuario, navegar hacia la pantalla de chat correspondiente, verifique cómo sucede la navegación
[endlist]



[st] Flujos del chat

[st] DataSource
Implemente los siguientes métodos en su capa de DataSource para manejar las conversaciones y los mensajes.

[list]
Implementar `findConversation(String profile1Id, String profile2Id)`
[endlist]
Debemos consultar si existe un registro en el que 2 usuarios ya esten conversando. El método devuelve la conversación o nulo si no existe el registro.

[list]
Implementar `createConversation(String profile1Id, String profile2Id)`
[endlist]
Debemos crear un registro de conversación dados 2 ID de dos perfiles. Este registro representa que hay una conversación entre el usuario con `Id1` y el usuario con el `Id2`

[list]
Implementar `sendMessage(String conversationId, String senderId, String content)`
[endlist]
Enviar mensaje a la tabla de messages usando el `conversationId`, `senderId` y `content`. Esto genera nuevos registro para una conversación entre 2 usuarios

[list]
Implementar `getMessagesByConversation(String conversationId)`
[endlist]
Obtener todos los mensajes de una conversación

[list]
Implementar `listenMessagesByConversation(String conversationId)`
[endlist]
Escuchar nuevos mensajes de una conversación especifica. Déjelo para el final

[st] Repository
Implemente los siguientes métodos en su capa de Repository.

[list]
Implementar `findOrCreateConversation(String profile1Id, String profile2Id)`
[endlist]
El método consiste en buscar la conversación entre dos usuarios y de no existir, crearla

[list]
Implementar `sendMessage(String conversationId, String senderId, String content)`
[endlist]
Enviar el mensaje usando el DataSource apropiado

[list]
Implementar `getMessagesByConversation(String conversationId)`
[endlist]
Hacer GET de los mensajes usando el datasource apropiado

[list]
Implementar `listenMessages(String conversationId)`
[endlist]
Escuchar los mensajes en tiempo real. Solo tiene que devolver el `Stream`

[st] BLoC
Resuelva la lógica del BLoC para el chat, manejando los siguientes eventos

[list]
`on<InitializeChatEvent>(_onInitializeChat)` 
[endlist]
Debe cargar los mensajes existentes entre los interlocutores al abrir la pantalla

[list]
`on<SendMessageEvent>(_onSendMessage)`
[endlist]
Debe enviar un nuevo mensaje a la conversación por medio del botón de envío

[list]
`on<ChatNewMessageArriveEvent>(_onMessageArrived)`
[endlist]
Debe manejar la llegada de un nuevo mensaje y actualizar la UI.

Revise los eventos existentes para acomodarlos en la UI y asegurar que el flujo de chat funcione correctamente.');

-- Inserting content for: lessonH15
INSERT INTO lessons (slug, content) VALUES ('lessonH15', E'[t] Registro de Usuarios con Supabase
Ahora, vamos a utilizar el procedimiento de registro usando el siguiente método

[code:dart]
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
[endcode]

[st] ¿Cómo funciona el registro?
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

');

-- Inserting content for: lessonH2
INSERT INTO lessons (slug, content) VALUES ('lessonH2', E'[t] Inicio de Sesión con Supabase y Flutter
Ahora que ya sabemos cómo registrar usuarios, es momento de aprender a autenticarlos en nuestra aplicación Flutter utilizando Supabase.

[st] Creación de la Pantalla de Login
La pantalla de inicio de sesión es muy similar a la de registro. Necesitaremos dos campos de texto (email y contraseña) y un botón para enviar la información.

Para este punto, realiza esta pantalla de una forma sencilla

[st] Inicio de Sesión
El método `signInWithPassword` del cliente de Supabase es el que nos permite autenticar a un usuario con su correo y contraseña.

[code:dart]
Future<void> _signIn() async {
  try {
    final AuthResponse res = await supabase.auth.signInWithPassword(
      email: _emailController.text.trim(),
      password: _passwordController.text.trim(),
    );
    print(res.user);
    print(res.session);
  } on AuthException catch (error) {
    print(error);
  } catch (error) {
    print(error);
  }
}
[endcode]

[st] Cerrar Sesión
Para cerrar la sesión de un usuario, simplemente llama al método `signOut`.

[code:dart]
await supabase.auth.signOut();
[endcode]

Al llamar a `signOut`, el listener `onAuthStateChange` detectará el cambio y podrás redirigir al usuario a la pantalla de inicio de sesión.

[st] Current user
Si ya estás autenticado, siempre puedes acceder al ID usando
[code:dart]
final user = supabase.auth.currentUser;
[endcode]
Si ese usuario es diferente de null, es porque hay un usuario con la sesión iniciada cuyo id se encuentra en `user.id`');

-- Inserting content for: lessonH3
INSERT INTO lessons (slug, content) VALUES ('lessonH3', E'[t] Enviar datos a base de datos
Vamos a supabase y creamos el modelo de datos. Nos vamosa basar por supuesto en la [link] (Guía de Supabase para Flutter) https://supabase.com/docs/reference/dart/select

[code:sql]
create table posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  created_at timestamp with time zone default now()
);
[endcode]

Luego, podemos crear un modelo de datos correspondiente. Note cómo le podemos valor por defecto a `createdAt`.
[code:dart]
class Post {
  final String id;
  final String title;
  final String content;
  final DateTime createdAt;

  Post({
    required this.id,
    required this.title,
    required this.content,
    required this.createdAt,
  });

  /// Para enviar a Supabase
  Map<String, dynamic> toJson() {
    return {
      ''id'': id,
      ''title'': title,
      ''content'': content,
      ''created_at'': createdAt.toIso8601String(),
    };
  }

  /// Para leer desde Supabase
  factory Post.fromJson(Map<String, dynamic> json) {
    return Post(
      id: json[''id''] as String,
      title: json[''title''] as String,
      content: json[''content''] as String,
      createdAt: DateTime.parse(json[''created_at''] as String),
    );
  }
}
[endcode]


Se puede enviar asi
[code:dart]
import ''package:supabase_flutter/supabase_flutter.dart'';

final supabase = Supabase.instance.client;

Future<void> createPost(Post post) async {
  final response = await supabase.from(''posts'').insert(post.toJson());

  if (response.error != null) {
    throw Exception(''Error insertando post: ${response.error!.message}'');
  }
}
[endcode]

Y posteriormente se pueden recuperar asi

[code:dart]
Future<List<Post>> getPosts() async {
  final response = await supabase.from(''posts'').select();

  if (response.error != null) {
    throw Exception(''Error consultando posts: ${response.error!.message}'');
  }
  
  final data = response.data as List;
  return data.map((e) => Post.fromJson(e)).toList();
}
[endcode]

[list]
Definir el modelo Dart con toJson() y fromJson().
Crear la tabla en Supabase con SQL.
Usar supabase.from(''tabla'').insert() para enviar.
Usar supabase.from(''tabla'').select() para leer.
[endlist]

[st] Paginacion
Si quiero los primeros 10 registros
[code:dart]
final response = await supabase
    .from(''posts'')
    .select()
    .order(''created_at'', ascending: false)
    .range(0, 9);
[endcode]
Si quiero los segundos 10 registros
[code:dart]
final response = await supabase
    .from(''posts'')
    .select()
    .order(''created_at'', ascending: false)
    .range(10, 19);
[endcode]

[st] Filtros
[code:dart]
final response = await supabase
    .from(''profiles'')
    .select()
    .eq(''username'', ''alfredo123'');
[endcode]

Así como `eq` (equals), están los de mayor / menor (gt, gte, lt, lte)
[code:dart]
final res = await supabase
    .from(''posts'')
    .select()
    .gt(''likes'', 100); // likes > 100
[endcode]

También el operador `LIKE`
[code:dart]
final res = await supabase
    .from(''profiles'')
    .select()
    .like(''full_name'', ''%Rincón%''); // contiene "Rincón"
[endcode]

O coincidencia dentro de una lista de valores
[code:dart]
final res = await supabase
    .from(''profiles'')
    .select()
    .inFilter(''username'', [''pepe'', ''maria'', ''juan'']);
[endcode]
.');

-- Inserting content for: lessonH4
INSERT INTO lessons (slug, content) VALUES ('lessonH4', E'[t] Auth y DB
Lo que debemos hacer es que los usuarios que registramos, deben estar realmente en dos registros de los servicios de supabase.

El primero es `Auth` que ya lo vimos.

Ahora, vamos a ver qué debemos hacer para enviar el resto de datos que levantamos en el proceso de registro.

[st] Tabla Profile
Es una tabla como cualquier otra, pero lleva una referencia al UID de la tabla de Authentitcation

[code:sql]
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  created_at timestamp with time zone default now()
);
[endcode]
De esta manera, si se elimina un usuario de Auth, se elimina su registro dentro de nuestra nueva tabla

[st] Modelo de Profile
Luego, puede modelar la clase Profile para que tenga la forma de tranformarse en Json y vice versa.
[code:dart]
class Profile {
  final String id; // UID de Supabase Auth
  final String name;
  final DateTime createdAt;

  Profile({
    required this.id,
    required this.name,
    required this.createdAt,
  });

  /// Para enviar a Supabase (ej: insert)
  Map<String, dynamic> toJson() {
    return {
      ''id'': id,
      ''name'': name,
      ''created_at'': createdAt.toIso8601String(),
    };
  }

  /// Para leer desde Supabase (ej: select)
  factory Profile.fromJson(Map<String, dynamic> json) {
    return Profile(
      id: json[''id''] as String,
      name: json[''name''] as String,
      createdAt: DateTime.parse(json[''created_at''] as String),
    );
  }
}
[endcode]

[st] Row lever security policy
Si su interés es hacer una tabla muy segura donde sólo el usuario dueño del registro sea quien puede ver su información, puede anexar esta RLS policy.
[list]
Sólo añada esto hasta probar que funciona el laboratorio
[endlist]
[code:sql]
-- Activa Row Level Security en la tabla
alter table profiles enable row level security;

-- Permitir SELECT solo al dueño de la fila
create policy "Users can view their own profile"
on profiles for select
using (auth.uid() = id);

-- Permitir UPDATE solo al dueño de la fila
create policy "Users can update their own profile"
on profiles for update
using (auth.uid() = id);

-- Permitir INSERT solo al dueño de la fila (cuando coincide con su UID)
create policy "Users can insert their own profile"
on profiles for insert
with check (auth.uid() = id);
[endcode]


.');

-- Inserting content for: lessonH5
INSERT INTO lessons (slug, content) VALUES ('lessonH5', E'[t] Clean Architecure
Hasta ahora, ya hemos trabajado con BLoC para separar la lógica de presentación, y con repositorios y datasources para estructurar cómo accedemos a la información. La Clean Architecture, propuesta por Robert C. Martin (Uncle Bob), lo que hace es darle un marco más completo a esta idea: dividir la app en capas bien definidas que reducen la dependencia entre UI, lógica de negocio y fuentes de datos.

En Flutter, estas capas suelen verse así

`Domain Layer`
El corazón de la app. Contiene entidades (nuestros modelos puros), use cases (la lógica de negocio) y contratos de repositorios.

`Data Layer`
Implementa los repositorios y conecta con las fuentes de datos (API, base de datos local, etc.).

`Presentation Layer`
 Maneja la UI y el estado con BLoC, consumiendo los use cases del dominio.
[icon] blocclean.png
[link] (Fuente) https://dev.to/princetomarappdev/clean-code-architecture-and-bloc-in-flutter-a-comprehensive-guide-for-beginners-and-experts-33k8

La idea clave es que:

`1` El dominio no depende de nada externo.

`2` El data layer depende del dominio (porque implementa sus contratos).

`3` El presentation layer depende del dominio (porque usa los casos de uso) pero no sabe nada de cómo llegan los datos realmente.

Esto hace que el código sea más mantenible, escalable y testeable.

Vamos a seguir la siguiente estructura de carpetas
[code:plain]
lib/
├── features/
│   ├── auth/
│   │   ├── data/
│   │   │   ├── models/
│   │   │   ├── datasources/
│   │   │   └── repositories/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   └── usecases/
│   │   │   └── repositories/
│   │   └── presentation/
│   │       ├── bloc/
│   │       └── screens/
│   │
│   ├── user/
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   │
│   └── tasks/
│       ├── data/
│       ├── domain/
│       └── presentation/
│
└── core/
[endcode]

Vamos a hacer concesiones. En nuestros proyectos, al estar usando un BaaS (Backend as a service) podríamos entender el modelo de dominio, como el modelo de toda la aplicación. Para aplicaciones de mayor escala, hay una diferencia entre los datos recibidos y el modelo de dominio. Los primeros tienen que ver más con los DTO y los segundos más con el modelo puro de la app.

De forma general, para las capas de UseCases, Repository y DataSource debemos usar el principio de inversión de control de SOLID. De modo que tenemos que crear clases abstractas para las definiciones y clases concretas para las implementaciones.

[t] Flujo de Registro

[st] Capa de Data Source
Aca solo vamos a hacer operaciones de CRUD simples
[code:dart]
// data/datasources/auth_datasource.dart
abstract class AuthDataSource {
  Future<String> signUp(String email, String password);
  //Deveulva el userId, que será necesario para crear el registro el Profile
}

// data/datasources/profile_datasource.dart
abstract class ProfileDataSource {
  Future<void> createProfile(String userId, String name);
}
[endcode]
Implemente las clases abstractas donde debe usar el acceso porporcionado por el SDK de Supabase.

[st] Abstract Repository
Aca debemos tener en cuenta que las clases abstractas deben ir en el dominio y que las clases concretas que extiendan de estas deben ir en la capa de `data`.
[code:dart]
// domain/repositories/user_repository.dart
abstract class UserRepository {
  Future<void> registerUser(String email, String password, String name);
}
[endcode]

[st] Implementación de Repository
La implementación de repository, ya fuera del dominio puede tener dependencias, en este caso la de los diferentes datasources. Aquí es donde se orquesta la lógica.
[code:dart]
// data/repositories/user_repository_impl.dart
class UserRepositoryImpl implements UserRepository {
  final AuthDataSource authDataSource = AuthDataSourceImpl();
  final ProfileDataSource profileDataSource = ProfileDataSourceImpl();

  UserRepositoryImpl(this.authDataSource, this.profileDataSource);

  @override
  Future<void> registerUser(String email, String password, String name) async {
    final userId = await authDataSource.signUp(email, password);
    await profileDataSource.createProfile(userId, name);
  }
}
[endcode]
Como se evidencia, se hace la operación de registro en el servicio de GoTrue y posteriormente se usa PostgREST para enviar el user.

[st] Capa Use Case
La capa de UseCases modela los flujos de la aplicación, donde cada clase se enfoca en una tarea del dominio. En lugar de tener lógica repartida entre BLoCs o Repositorios, cada flujo (registro, login, búsqueda, etc.) se centraliza en un caso de uso, que orquesta la interacción con los repositorios de datos.

En esta capa, al tratarse de lógica de dominio específica, no es necesario definir una combinación de interfaz e implementación. La razón es que un caso de uso no suele tener múltiples variantes: su responsabilidad es única y concreta. En cambio, lo que sí hace el caso de uso es apoyarse en repositorios definidos como interfaces para acceder a los datos, manteniendo así la independencia de la capa de dominio frente a los detalles de infraestructura.
[code:dart]
// domain/usecases/register_user_usecase.dart
class RegisterUserUseCase {
  final UserRepository repository = UserRepositoryImpl();

  Future<void> execute(String email, String password, String name) {
    return repository.registerUser(email, password, name);
  }
}
[endcode]
Lo que sigue de aquí en adelante es la estructura de BloC, es decir, modelar eventos, estados y las funciones que reciben eventos para emitir estados.

[st] BloC
Finalmente el BLoC lo que utiliza es el UseCase para realizar su operación.
[code:dart]
import ''package:flutter_bloc/flutter_bloc.dart'';

class RegisterBloc extends Bloc<RegisterEvent, RegisterState> {
  final RegisterUserUseCase registerUserUseCase = RegisterUserUseCase();

  RegisterBloc() : super(RegisterIdle()) {
    on<SubmitRegisterEvent>(_onSubmitRegister);
  }

  Future<void> _onSubmitRegister(
    SubmitRegisterEvent event,
    Emitter<RegisterState> emit,
  ) async {
    emit(RegisterLoading());
    try {
      await registerUserUseCase.execute(
        event.email,
        event.password,
        event.name,
      );
      emit(RegisterSuccess());
    } catch (e) {
      emit(RegisterError("No se pudo registrar el usuario"));
    }
  }
}
[endcode]
Modele usted los estados y eventos. No olvide que debe crear un evento y un estado abstracto generales para luego extender los eventos y estados específicos.');

-- Inserting content for: lessonH6
INSERT INTO lessons (slug, content) VALUES ('lessonH6', E'[t] Laboratorio 5 · Flujo de Registro
Vamos a aplicar lo que hemos aprendido de momento: patrón BloC, el añadido de Clean Architecture y el uso de servicios simples como Auth y DB de Supabase.

Su tarea va a ser construir el flujo de registro que consiste en el siguiente flujo.

`1` El usuario abre la aplicación y accede a la pantalla de registro

`2` El usuario completa el formulario de registro que tiene más datos adicionales a `emial` y `password`. Para este laboratorio tenga al menos en cuenta `name`, aunque usted lo puede modificar de modo que concuerde con su proyecto final.

`3` El sistema usa los datos insertados por el usuario y primero intenta hacer el `signUp`

`4` Una vez autenticado, el sistema intenta hacer el `insert` del `Profile`

`5` Si todo resulta existoso, la aplicacion navega hasta ProfileScreen. Aquí necesitará
[code:dart]
WidgetsBinding.instance.addPostFrameCallback((_) {
  Navigator.pushReplacementNamed(context, ''/profile'');
});
[endcode]
Yo se por qué se lo digo

[st] Capa de Data Source
Aca solo vamos a hacer operaciones de CRUD simples
[code:dart]
// data/datasources/auth_datasource.dart
abstract class AuthDataSource {
  Future<String> signUp(String email, String password);
  //Deveulva el userId, que será necesario para crear el registro el Profile
}

// data/datasources/profile_datasource.dart
abstract class ProfileDataSource {
  Future<void> createProfile(String userId, String name);
}
[endcode]
Implemente las clases abstractas donde debe usar el acceso porporcionado por el SDK de Supabase.

[st] Abstract Repository
Aca debemos tener en cuenta que las clases abstractas deben ir en el dominio y que las clases concretas que extiendan de estas deben ir en la capa de `data`.
[code:dart]
// domain/repositories/user_repository.dart
abstract class UserRepository {
  Future<void> registerUser(String email, String password, String name);
}
[endcode]

[st] Implementación de Repository
La implementación de repository, ya fuera del dominio puede tener dependencias, en este caso la de los diferentes datasources. Aquí es donde se orquesta la lógica.
[code:dart]
// data/repositories/user_repository_impl.dart
class UserRepositoryImpl implements UserRepository {
  final AuthDataSource authDataSource = AuthDataSourceImpl();
  final ProfileDataSource profileDataSource = ProfileDataSourceImpl();

  UserRepositoryImpl(this.authDataSource, this.profileDataSource);

  @override
  Future<void> registerUser(String email, String password, String name) async {
    final userId = await authDataSource.signUp(email, password);
    await profileDataSource.createProfile(userId, name);
  }
}
[endcode]
Como se evidencia, se hace la operación de registro en el servicio de GoTrue y posteriormente se usa PostgREST para enviar el user.

[st] Capa Use Case
La capa de UseCases modela los flujos de la aplicación, donde cada clase se enfoca en una tarea del dominio. En lugar de tener lógica repartida entre BLoCs o Repositorios, cada flujo (registro, login, búsqueda, etc.) se centraliza en un caso de uso, que orquesta la interacción con los repositorios de datos.

En esta capa, al tratarse de lógica de dominio específica, no es necesario definir una combinación de interfaz e implementación. La razón es que un caso de uso no suele tener múltiples variantes: su responsabilidad es única y concreta. En cambio, lo que sí hace el caso de uso es apoyarse en repositorios definidos como interfaces para acceder a los datos, manteniendo así la independencia de la capa de dominio frente a los detalles de infraestructura.
[code:dart]
// domain/usecases/register_user_usecase.dart
class RegisterUserUseCase {
  final UserRepository repository = UserRepositoryImpl();

  Future<void> execute(String email, String password, String name) {
    return repository.registerUser(email, password, name);
  }
}
[endcode]
Lo que sigue de aquí en adelante es la estructura de BloC, es decir, modelar eventos, estados y las funciones que reciben eventos para emitir estados.

[st] BloC
Finalmente el BLoC lo que utiliza es el UseCase para realizar su operación.
[code:dart]
import ''package:flutter_bloc/flutter_bloc.dart'';

class RegisterBloc extends Bloc<RegisterEvent, RegisterState> {
  final RegisterUserUseCase registerUserUseCase = RegisterUserUseCase();

  RegisterBloc() : super(RegisterIdle()) {
    on<SubmitRegisterEvent>(_onSubmitRegister);
  }

  Future<void> _onSubmitRegister(
    SubmitRegisterEvent event,
    Emitter<RegisterState> emit,
  ) async {
    emit(RegisterLoading());
    try {
      await registerUserUseCase.execute(
        event.email,
        event.password,
        event.name,
      );
      emit(RegisterSuccess());
    } catch (e) {
      emit(RegisterError("No se pudo registrar el usuario"));
    }
  }
}
[endcode]
Modele usted los estados y eventos. No olvide que debe crear un evento y un estado abstracto generales para luego extender los eventos y estados específicos.');

-- Inserting content for: lessonH7
INSERT INTO lessons (slug, content) VALUES ('lessonH7', E'[t] Relaciones y obtención de datos anidados
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
    .from(''posts'')
    .select(''id, title, content, created_at, profiles(name, email)'')
    .order(''created_at'', ascending: false)
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
  .from(''comments'')
  .select(''id, body, created_at, posts(title, profiles(name))'')
  .order(''created_at'', ascending: false);
[endcode]
Esto devuelve comentarios con el post al que pertenecen y el perfil del autor de ese post.
[st] Inserción anidada
Supabase también permite inserciones anidadas siempre que las relaciones estén definidas.
Por ejemplo, crear un profile con varios posts de una sola vez:
[code:dart]
final response = await supabase
  .from(''profiles'')
  .insert({
    ''name'': ''Gabriel García Márquez'',
    ''email'': ''ggm@example.com'',
    ''posts'': [
      {''title'': ''Cien años de soledad'', ''content'': ''Realismo mágico''},
      {''title'': ''El coronel no tiene quien le escriba'', ''content'': ''Clásico''}
    ]
  })
  .select(''*, posts(*)''); // También devuelve los posts creados
[endcode]

[list]
El campo posts debe tener una relación declarada en la base de datos (foreign key).
Supabase infiere el join y hace la inserción anidada automáticamente.
Puedes usar `.select(''*, posts(*)'')` para recibir todo el árbol creado.
[endlist]
');

-- Inserting content for: lessonH8
INSERT INTO lessons (slug, content) VALUES ('lessonH8', E'[t] Laboratorio 6 · Muro
Retomemos el laboratorio anterior para añadir una funcionalidad de muro. La idea es que diferentes usuarios puedan publicar en el muro de la aplicación. Este muro consiste en una tabla de `Post`.

Primero edite la navegación de la app para que tenga 2 `Pages` y 1 `Screen`. Por medio de `BottomNavigationBar` puede navegar entre las 2 `Pages` que son `ProfilePage` y `PostPage`

Los usuarios podrán publicar `Post` usando `titulo`, `contenido`, `fecha de creación` y `url de imagen`

Los usuarios podrán ver los post desde el más reciente al más antiguo. La vista esperada es una `Card` con la `imagen` en la parte superior y en la parte inferior debe estar el `titulo`, el `contenido` y el `nombre de autor`.

Los usuarios podrán ir a su perfil y ver sus últimas 3 publicaciones.

[st] Reto
Usar la lista completa `Post` puede implicar descargar demasiada información. Su tarea es paginar esta lista de modo que la aplicación muestre progresivamente las publicaciones.

Puede usar eventos para lograrlo
[list]
Un botón al final de la lista que sea de `Mostrar más`
Al llegar al final de la ListView se hace un nuevo request
[endlist]

');

-- Inserting content for: lessonH9
INSERT INTO lessons (slug, content) VALUES ('lessonH9', E'[t] Realtime con Supabase

');

-- Inserting content for: lessonI1
INSERT INTO lessons (slug, content) VALUES ('lessonI1', E'[t] Datos en Tiempo Real con Supabase

Supabase ofrece una potente funcionalidad de tiempo real que te permite escuchar los cambios en tu base de datos a medida que ocurren. Esto es ideal para construir aplicaciones interactivas como chats, notificaciones o paneles de control en vivo.

[st] Habilitar Realtime

Por defecto, la funcionalidad de tiempo real está deshabilitada para las nuevas tablas. Para activarla, debes gestionar la replicación en tu proyecto de Supabase.

[st] El Método `stream()`

El método `stream()` de Supabase te permite obtener datos en tiempo real de tu tabla como un `Stream`.

`stream()` emitirá los datos iniciales, así como cualquier cambio posterior en la base de datos, como un `Stream<List<Map<String, dynamic>>>` combinando Postgrest y Realtime.

Este método toma una lista de nombres de columnas de clave primaria (`primaryKey`) que se utilizarán para actualizar y eliminar los registros adecuados dentro del SDK.

Aquí tienes un ejemplo básico de cómo escuchar cambios en la tabla ''countries'':
[code:dart]
supabase.from(''countries'')
  .stream(primaryKey: [''id''])
  .listen((List<Map<String, dynamic>> data) {
  // Haz algo increíble con los datos
});
[endcode]

[st] Filtrado de Streams en Tiempo Real

Puedes aplicar filtros a tus streams para escuchar solo los cambios que te interesan. Los siguientes filtros están disponibles:

[list]
`eq(''column'', value)`: Escucha filas donde la columna es igual al valor.
`neq(''column'', value)`: Escucha filas donde la columna no es igual al valor.
`gt(''column'', value)`: Escucha filas donde la columna es mayor que el valor.
`gte(''column'', value)`: Escucha filas donde la columna es mayor o igual que el valor.
`lt(''column'', value)`: Escucha filas donde la columna es menor que el valor.
`lte(''column'', value)`: Escucha filas donde la columna es menor o igual que el valor.
`inFilter(''column'', [val1, val2, val3])`: Escucha filas donde la columna es uno de los valores proporcionados.
[endlist]

Aquí tienes un ejemplo de cómo aplicar filtros, ordenar y limitar los resultados en un stream:
[code:dart]
supabase.from(''countries'')
  .stream(primaryKey: [''id''])
  .eq(''id'', 120)
  .order(''name'')
  .limit(10);
[endcode]

[st] Escuchando Mensajes Individuales con Canales

Además de los streams que devuelven listas completas, puedes usar canales de Supabase para escuchar cambios individuales en tu base de datos, lo cual es útil para escenarios como la recepción de mensajes en un chat.

Este enfoque te permite recibir cada cambio (inserción, actualización, eliminación) de forma individual, en lugar de una lista completa de registros.

[code:dart]
@override
Stream<Message> listenMessagesByConversation(String conversationId) {
  print("Listening messages ...");
  final controller = StreamController<Message>();
  final channel = Supabase.instance.client
      .channel(''public:messages'')
      .onPostgresChanges(
        event: PostgresChangeEvent.all,
        schema: ''public'',
        table: ''messages'',
        callback: (payload) {
          controller.add(Message.fromJson(payload.newRecord));
          print(payload.newRecord);
        },
      )
      .subscribe();
  controller.onCancel = () {
    Supabase.instance.client.removeChannel(channel);
  };
  return controller.stream;
}
[endcode]

En este ejemplo:
[list]
Se crea un `StreamController` para manejar el flujo de mensajes.
Se suscribe a un canal de Supabase (`public:messages`) escuchando todos los eventos (`PostgresChangeEvent.all`) en la tabla `messages`.
Cada vez que hay un cambio, el `callback` se ejecuta, añadiendo el nuevo registro (`payload.newRecord`) al `StreamController` después de convertirlo a un objeto `Message`.
Cuando el stream se cancela, el canal de Supabase se remueve para evitar fugas de memoria.
[endlist]
');

-- Inserting content for: lessonI2
INSERT INTO lessons (slug, content) VALUES ('lessonI2', E'[t] Programación Reactiva y Supabase Streams

[st] ¿Qué es la Programación Reactiva?

La Programación Reactiva es un paradigma de programación que se centra en la propagación de cambios y el manejo de flujos de datos asíncronos. En lugar de llamar a funciones para obtener datos cuando los necesitas, te "suscribes" a flujos de datos y reaccionas a los eventos a medida que ocurren. Piensa en una hoja de cálculo: cuando cambias un valor en una celda, todas las celdas que dependen de ella se actualizan automáticamente. Esa es la esencia de la reactividad.

Este enfoque es particularmente útil en aplicaciones modernas que manejan:
[list]
Eventos de interfaz de usuario (clics, entradas de texto).
Solicitudes de red asíncronas.
Datos en tiempo real que cambian constantemente.
[endlist]

[st] Conceptos Clave de la Programación Reactiva

[list]
`Streams (Flujos):` Son secuencias de eventos asíncronos que pueden emitir datos, errores o una señal de completado a lo largo del tiempo. En Dart, la clase `Stream` es la representación de estos flujos.
`Observables/Productores:` Son las fuentes de los streams. Producen los datos que los suscriptores consumen.
`Suscriptores/Consumidores:` Son las entidades que "escuchan" los streams y reaccionan a los datos que se emiten. En Dart, esto se hace a menudo con el método `.listen()`.
`Operadores:` Son funciones que permiten transformar, combinar, filtrar o manipular streams de diversas maneras. Por ejemplo, puedes tener un operador para filtrar solo los datos que cumplen una condición, o para combinar datos de dos streams diferentes.
[endlist]

[st] Programación Reactiva con Supabase Streams en Flutter

El SDK de Supabase para Flutter se integra de manera natural con los principios de la programación reactiva, especialmente a través de su método `stream()` y la gestión de canales.

Cuando utilizas `supabase.from(''tu_tabla'').stream(primaryKey: [''id''])`, Supabase te devuelve un `Stream<List<Map<String, dynamic>>>`. Este `Stream` es un "observable" en el sentido reactivo:
[list]
Emite una lista inicial de datos de tu tabla.
Luego, emite nuevas listas cada vez que hay un cambio (inserción, actualización, eliminación) en los datos de esa tabla en Supabase.
[endlist]

Tu aplicación se convierte en un "suscriptor" a este `Stream` utilizando el método `.listen()`:
[code:dart]
supabase.from(''countries'')
  .stream(primaryKey: [''id''])
  .listen((List<Map<String, dynamic>> data) {
  // Aquí reaccionas a los cambios: actualizas la UI, procesas los datos, etc.
  print(''Datos de países actualizados: $data'');
});
[endcode]

De manera similar, cuando utilizas los canales de Supabase para escuchar cambios individuales (`onPostgresChanges`), también estás aplicando principios reactivos:
[code:dart]
final channel = Supabase.instance.client
    .channel(''public:messages'')
    .onPostgresChanges(
      event: PostgresChangeEvent.all,
      schema: ''public'',
      table: ''messages'',
      callback: (payload) {
        // Reaccionas a cada mensaje individual que llega
        print(''Nuevo mensaje: ${payload.newRecord}'');
      },
    )
    .subscribe();
[endcode]
En este caso, el `callback` es tu forma de "reaccionar" a cada evento de cambio de base de datos que el canal emite.

[st] Beneficios en el Contexto de Supabase

La combinación de la programación reactiva y los streams de Supabase ofrece ventajas significativas:
[list]
`Manejo Simplificado de Datos en Tiempo Real:` No necesitas polling manual ni lógica compleja para detectar cambios. Los datos fluyen hacia ti.
`Actualizaciones de UI Automáticas:` Al integrar estos streams con soluciones de gestión de estado reactivas (como `Provider`, `Bloc`, `Riverpod` o `setState` en `StatefulWidget`), tu interfaz de usuario puede actualizarse automáticamente cada vez que llegan nuevos datos.
`Código Más Limpio y Declarativo:` Te permite expresar la lógica de tu aplicación en términos de cómo reacciona a los flujos de datos, lo que a menudo resulta en un código más legible y fácil de mantener.
[endlist]
');

-- Inserting content for: lessonI3
INSERT INTO lessons (slug, content) VALUES ('lessonI3', E'[t] Consultas Anidadas

[st] Combinando Condiciones con `.or()`

El método `.or()` en el SDK de Supabase para Flutter te permite combinar múltiples condiciones de filtro con una lógica OR. Esto es extremadamente útil para construir consultas complejas donde un registro puede coincidir con cualquiera de varias expresiones.

La sintaxis de `.or()` espera una cadena de texto que define las condiciones, separadas por comas para la lógica OR. Puedes anidar condiciones usando `and(...)` para agrupar múltiples filtros con lógica AND dentro de una de las ramas del OR.

Nota Importante sobre `.or()`: Solo debes usar un método `.or()` por instrucción (consulta). Todas las condiciones OR que necesites deben ir dentro de esa única llamada, ya sea como un string separado por comas o como una lista de filtros. Encadenar múltiples `.or()` en la misma consulta podría sobrescribir las condiciones anteriores.

[st] Ejemplo: Encontrar una Conversación entre Dos Usuarios

Considera el escenario de buscar una conversación existente entre dos usuarios específicos, `profile1Id` y `profile2Id`. La conversación podría estar registrada de dos maneras: `profile1_id` es el primer usuario y `profile2_id` el segundo, o viceversa.

Aquí es donde `.or()` brilla:

[code:dart]
final response = await Supabase.instance.client
          .from(''conversations'')
          .select()
          .or(
            ''and(profile1_id.eq.$profile1Id,profile2_id.eq.$profile2Id),and(profile1_id.eq.$profile2Id,profile2_id.eq.$profile1Id)'',
          )
          .maybeSingle();
      print(response);
[endcode]

[list]
`from(''conversations'').select()`: Selecciona todos los campos de la tabla `conversations`.
`.or(...)`: Aplica la lógica OR a las dos condiciones principales:
    *   `and(profile1_id.eq.$profile1Id,profile2_id.eq.$profile2Id)`: Busca una conversación donde el `profile1_id` coincida con el primer usuario Y el `profile2_id` coincida con el segundo usuario.
    *   `and(profile1_id.eq.$profile2Id,profile2_id.eq.$profile1Id)`: Busca una conversación donde el `profile1_id` coincida con el segundo usuario Y el `profile2_id` coincida con el primer usuario.
`.maybeSingle()`: Intenta obtener un único registro. Si no se encuentra ningún registro o se encuentran múltiples, devuelve `null` o lanza un error si se encuentran múltiples y no se espera. Es útil cuando esperas cero o un resultado.
[endlist]

Este patrón es muy potente para manejar la flexibilidad en la forma en que los datos pueden estar almacenados o para construir búsquedas con múltiples criterios alternativos.

[st] Sintaxis con Lista de Filtros para `.or()`

Para una mayor claridad y control programático, especialmente cuando las condiciones se construyen dinámicamente, puedes pasar una lista de strings al método `.or()`. Cada string en la lista representa una cláusula OR, y dentro de cada string, puedes usar la sintaxis `and(...)` para agrupar condiciones AND.

[code:dart]
final response = await Supabase.instance.client
    .from(''conversations'')
    .select()
    .or([
      // Primera cláusula OR: profile1_id = X AND profile2_id = Y
      ''and(profile1_id.eq.$profile1Id,profile2_id.eq.$profile2Id)'',
      // Segunda cláusula OR: profile1_id = Y AND profile2_id = X
      ''and(profile1_id.eq.$profile2Id,profile2_id.eq.$profile1Id)'',
    ])
    .maybeSingle();
print(response);
[endcode]

Esta forma es equivalente a la sintaxis de string única con comas, pero puede ser más legible y fácil de manejar cuando tienes muchas condiciones o cuando las construyes en tiempo de ejecución.

[st] `AND` con Múltiples `OR` Anidados

Puedes construir condiciones aún más complejas anidando múltiples cláusulas `OR` dentro de una condición `AND`. Esto te permite especificar que un registro debe cumplir con *varios grupos* de criterios, donde cada grupo es una opción entre varias.

La sintaxis general sería `and(or(cond1,cond2),or(cond3,cond4))`. 

[code:dart]
final response = await Supabase.instance.client
    .from(''users'')
    .select()
    .or(
      ''and(or(status.eq.active,plan.eq.premium),or(country.eq.USA,country.eq.Canada))'',
    )
    .execute(); // Usamos .execute() para obtener una lista de resultados
print(response.data);
[endcode]

En este ejemplo, la consulta busca usuarios que cumplan ambas condiciones:
[list]
Que su `status` sea ''active'' O su `plan` sea ''premium''.
Y
Que su `country` sea ''USA'' O ''Canada''.
[endlist]

Esta estructura es muy potente para filtrar datos con requisitos complejos y combinatorios.');

-- Inserting content for: lessonJ1
INSERT INTO lessons (slug, content) VALUES ('lessonJ1', E'[t] Acceso a Galería y Cámara

Esta lección te enseñará cómo permitir que tu aplicación Flutter acceda a la cámara del dispositivo para tomar fotos o a la galería para seleccionar imágenes existentes.

[st] 1. Instalación de dependencias

Para empezar, necesitas añadir la librería `image_picker` a tu proyecto, la cual gestiona el acceso a la cámara y galería.

Abre tu terminal y ejecuta el siguiente comando en la raíz de tu proyecto Flutter:

[code:bash]
flutter pub add image_picker
[endcode]

Esto añadirá la dependencia a tu archivo `pubspec.yaml`.

[st] 2. Uso de ImagePicker

El widget `ImagePicker` nos provee de los métodos necesarios para abrir la cámara o la galería del dispositivo.

[st] Seleccionar imagen desde la galería

Para permitir al usuario seleccionar una foto de su galería, puedes usar el método `pickImage` con `ImageSource.gallery`.

[code:dart]
import ''package:image_picker/image_picker.dart'';
import ''dart:io'';

// ... dentro de tu widget

final picker = ImagePicker();

Future<void> _pickImageFromGallery() async {
  final pickedFile = await picker.pickImage(source: ImageSource.gallery);

  if (pickedFile == null) {
    // El usuario no seleccionó una imagen.
    return;
  }

  final file = File(pickedFile.path);
  // Ahora tienes el archivo de la imagen y puedes usarlo.
  // Por ejemplo, mostrarlo en un widget Image.file(file)
}
[endcode]

[st] Tomar una foto con la cámara

De forma similar, para abrir la cámara y permitir al usuario tomar una foto, usa `ImageSource.camera`.

[code:dart]
import ''package:image_picker/image_picker.dart'';
import ''dart:io'';

// ... dentro de tu widget

final picker = ImagePicker();

Future<void> _takePhotoWithCamera() async {
  final pickedFile = await picker.pickImage(source: ImageSource.camera);

  if (pickedFile == null) {
    // El usuario canceló la captura.
    return;
  }

  final file = File(pickedFile.path);
  // Ahora tienes el archivo de la imagen capturada.
}
[endcode]

[st] Integración en un Widget

El siguiente es un fragmento de cómo integrarías estos métodos en botones dentro de un widget.

[code:dart]
// ... dentro de tu StateFulWidget

ElevatedButton.icon(
  onPressed: () => _pickImageFromGallery(),
  icon: const Icon(Icons.photo_library),
  label: const Text(''Seleccionar desde galería''),
),

ElevatedButton.icon(
  onPressed: () => _takePhotoWithCamera(),
  icon: const Icon(Icons.camera_alt),
  label: const Text(''Tomar foto con cámara''),
),
[endcode]
.');

-- Inserting content for: lessonJ2
INSERT INTO lessons (slug, content) VALUES ('lessonJ2', E'[t] Subir Archivos a Supabase Storage

En la lección anterior, aprendiste a seleccionar imágenes de la galería y a tomar fotos con la cámara. Ahora, ¿cómo guardamos esos archivos de forma permanente? En esta lección, aprenderás a subir las imágenes a un servicio de almacenamiento en la nube llamado Supabase Storage.

[st] 1. Requisito: Cliente de Supabase

Asegúrate de tener la dependencia de `supabase_flutter` en tu `pubspec.yaml` y de haberla instalado.

[code:bash]
flutter pub add supabase_flutter
[endcode]

Además, tu aplicación necesita inicializar Supabase para poder comunicarte con sus servicios. Generalmente, esto se hace en tu archivo `main.dart` antes de `runApp()`.

[code:dart]
import ''package:flutter/material.dart'';
import ''package:supabase_flutter/supabase_flutter.dart'';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Supabase.initialize(
    url: ''TU_SUPABASE_URL'',
    anonKey: ''TU_SUPABASE_ANON_KEY'',
  );

  runApp(const MyApp());
}
[endcode]

No olvides reemplazar `TU_SUPABASE_URL` y `TU_SUPABASE_ANON_KEY` con tus credenciales reales de Supabase.

[st] 2. Lógica para subir la imagen

Una vez que tienes el `File` de la imagen (obtenido con `image_picker`), puedes usar el cliente de Supabase para subirlo a un "bucket" de almacenamiento.

El proceso es el siguiente:
1.  Obtener la instancia del cliente de Supabase.
2.  Crear un nombre de archivo único para evitar sobreescribir archivos.
3.  Llamar al método `upload()` del bucket de storage.
4.  (Opcional) Obtener la URL pública para poder ver la imagen.

[st] Ejemplo completo: Uniendo ImagePicker y Supabase

Aquí tienes una función que combina la selección de imagen y la subida a Supabase. Esta función fue la que inspiró la lección anterior.

[code:dart]
import ''dart:io'';
import ''package:flutter/material.dart'';
import ''package:image_picker/image_picker.dart'';
import ''package:supabase_flutter/supabase_flutter.dart'';

// ... dentro de tu StatefulWidget

final supabase = Supabase.instance.client;
final picker = ImagePicker();
File? _imageFile;
String? _publicUrl;

Future<void> _pickAndUploadImage(ImageSource source) async {
  try {
    final picked = await picker.pickImage(source: source);
    if (picked == null) return;

    final file = File(picked.path);
    // Crear un nombre de archivo único basado en la fecha y hora
    final fileName = ''img_${DateTime.now().millisecondsSinceEpoch.toString()}.jpg'';

    // Subir imagen al bucket ''alfa''
    await supabase.storage.from(''alfa'').upload(fileName, file);

    // Obtener URL pública
    final url = supabase.storage.from(''alfa'').getPublicUrl(fileName);

    // Actualizar el estado para mostrar la imagen
    // setState(() {
    //   _imageFile = file;
    //   _publicUrl = url;
    // });

  } catch (e) {
    // Manejar el error
    print(''Error al subir la imagen: $e'');
  }
}
[endcode]
En este código, `alfa` es el nombre del bucket en Supabase Storage. Asegúrate de que exista y tenga los permisos correctos para la subida de archivos.

[st] 3. Acceder a los Archivos Subidos

Una vez que el archivo está en tu bucket de Supabase, necesitas una forma de acceder a él para mostrarlo en tu aplicación. Hay dos maneras principales de obtener la URL de un archivo.

[st] a) URL Pública (`getPublicUrl`)

Este método genera una URL permanente y pública para tu archivo. Cualquiera con el enlace podrá acceder al archivo, siempre y cuando las políticas de tu bucket lo permitan (por ejemplo, una política de lectura pública).

[code:dart]
// Obtener URL pública y permanente
final String publicUrl = supabase.storage
    .from(''beta'') // Asegúrate de usar el nombre de tu bucket
    .getPublicUrl(fileName);
[endcode]
Usa este método para archivos que no son sensibles, como avatares públicos, imágenes de productos, etc.

[st] b) URL Firmada (`createSignedUrl`)

Este método genera una URL temporal y segura. La URL contiene una firma única que le da acceso al archivo por un tiempo limitado que tú defines. Es la forma más segura de dar acceso a archivos privados.

[code:dart]
// Crear una URL firmada que expira en 1 hora (3600 segundos)
final String signedUrl = await supabase.storage
    .from(''beta'') // Asegúrate de usar el nombre de tu bucket
    .createSignedUrl(fileName, 60 * 60);
[endcode]
Esta URL es ideal para contenido sensible o de pago, asegurando que el enlace no pueda ser compartido y usado indefinidamente.

[st] Mostrando la imagen en Flutter

Independientemente del método que uses para obtener la URL, puedes usar el widget `Image.network()` para mostrar la imagen en tu aplicación.

[code:dart]
// ... en tu widget
if (_publicUrl != null)
  Image.network(
    _publicUrl!,
    height: 200, // Ejemplo de tamaño
    fit: BoxFit.cover, // Ejemplo de ajuste
  )
[endcode]
.');

-- Inserting content for: lessonJ3
INSERT INTO lessons (slug, content) VALUES ('lessonJ3', E'[t] Políticas de Seguridad en Supabase Storage

Cuando trabajas con Supabase Storage, no basta con subir archivos. Es crucial definir quién puede acceder a ellos y qué pueden hacer. Esto se gestiona a través de "Policies" (Políticas), que son reglas de seguridad a nivel de base de datos.

[st] ¿Qué son las Políticas?

Las políticas son conjuntos de reglas SQL que se ejecutan antes de cada operación (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) en tus buckets de Storage. Si no hay una política que permita la acción, la solicitud será denegada.

Por defecto, todos los buckets son privados y ninguna acción está permitida hasta que crees una política. Para crear una, ve a `Storage` -> `Policies` en tu dashboard de Supabase.

[st] 1. Política para subidas públicas (sin autenticación)

Esta configuración es útil si necesitas que cualquier persona, incluso sin iniciar sesión, pueda subir archivos a un bucket específico. Sigue estos pasos en tu dashboard de Supabase (`Storage` -> `Policies`).

[st] Configuración paso a paso para permitir subidas sin autenticación
[list]
`Policy name:` Dale un nombre descriptivo, como `Public uploads to bucket alfa`.
`Allowed operation:` Marca únicamente la casilla `INSERT`.
`Target roles:` En el menú desplegable, selecciona el rol `public`.
`Policy definition:` En el editor `WITH CHECK expression`, escribe exactamente: `bucket_id = ''alfa''`
[endlist]

Esto basta para permitir que cualquier persona (sin sesión) pueda hacer `upload()` al bucket `alfa`.

[st] 2. Políticas para Usuarios Autenticados

Este es el escenario más común y seguro: solo los usuarios que han iniciado sesión en tu app pueden acceder al bucket.

[st] Configuración para LECTURA de usuarios autenticados
[list]
`Policy name:` `Authenticated read access to alfa`
`Allowed operation:` Marca `SELECT`.
`Target roles:` Selecciona `authenticated`.
`Policy definition (`USING expression`):` `bucket_id = ''alfa''`
[endlist]
Esta regla permite que cualquier usuario logueado pueda leer (descargar/ver) cualquier archivo del bucket `alfa`.

[st] Configuración para ESCRITURA de usuarios autenticados
[list]
`Policy name:` `Authenticated write access to alfa`
`Allowed operation:` Marca `INSERT`.
`Target roles:` Selecciona `authenticated`.
`Policy definition (`WITH CHECK expression`):` `bucket_id = ''alfa''`
[endlist]
Esta regla permite que cualquier usuario logueado pueda subir archivos al bucket `alfa`.

Puedes combinar estas reglas o hacerlas más específicas. Por ejemplo, podrías crear una política para que un usuario solo pueda ver los archivos que él mismo ha subido, usando una condición como `auth.uid() = owner_id` en la definición de la política.');

-- Inserting content for: lessonJ4
INSERT INTO lessons (slug, content) VALUES ('lessonJ4', E'[t] Laboratorio 8

En este laboratorio, integre las funcionalidades de selección de imágenes, subida a Supabase Storage y gestión de políticas para crear una característica común en muchas aplicaciones: la foto de perfil de usuario.

[st] Objetivo

Implementar una funcionalidad que permita a los usuarios:
1.  Seleccionar una imagen desde su galería o tomar una foto con la cámara.
2.  Subir esa imagen a Supabase Storage.
3.  Mostrar la imagen como su foto de perfil.
4.  Asegurar que cada usuario solo pueda gestionar su propia foto de perfil utilizando las políticas de Supabase Storage.

[st] Guía de Implementación

[st] 1. Preparación del Entorno
[list]
Asegúrate de que tu proyecto Flutter tenga las dependencias `image_picker` y `supabase_flutter` instaladas.
Verifica que Supabase esté inicializado correctamente en tu `main.dart`.
[endlist]

[st] 2. Interfaz de Usuario (UI)
[list]
Crea un widget donde el usuario pueda ver su foto de perfil actual (por ejemplo, un `CircleAvatar` o `Image`).
Añade un botón o un gesto que, al ser presionado, permita al usuario cambiar su foto de perfil.
[endlist]

[st] 3. Selección y Subida de la Imagen
[list]
Implementa la lógica para que, al interactuar con el botón/gesto, se abra el selector de imágenes (galería o cámara).
Una vez seleccionada la imagen, utiliza el cliente de Supabase para subirla a un bucket de Storage.
`Importante` Asegúrate de que el nombre del archivo o la ruta en el bucket sea única para cada usuario y esté asociada a su `auth.uid()`. Por ejemplo: `profiles/<user_id>/avatar.jpg`.
Considera guardar la URL o nombre de la foto de perfil en la tabla de `users` de tu base de datos de Supabase.
[endlist]

[st] 4. Mostrar la Foto de Perfil
[list]
Después de subir la imagen, obtén la URL (pública o firmada, según tu necesidad) del archivo subido.
Usa `Image.network()` para mostrar esta URL en tu `Image` o el widget de imagen que hayas elegido.
[endlist]

[st] 5. Configuración de Políticas de Seguridad
[list]
Dirígete al dashboard de Supabase y configura las políticas de Storage para tu bucket de perfiles.
Crea políticas que permitan a los usuarios autenticados:
    *   Leer (`SELECT`) su propia foto de perfil.
    *   Subir (`INSERT`) su propia foto de perfil.
    *   Actualizar (`UPDATE`) o Eliminar (`DELETE`) su propia foto de perfil.
Utiliza `auth.uid()` en tus políticas para asegurar que los usuarios solo puedan interactuar con sus propios archivos.
[endlist]

[st] Reto

Agregue fotos al chat hecho en el laboratorio anterior');

-- Inserting content for: lessonK0
INSERT INTO lessons (slug, content) VALUES ('lessonK0', E'[t] Notificaciones Push
Permiten que el servidor de una app envíe mensajes importantes a tus usuarios, incluso cuando no están usando activamente la aplicación.

[st] El Problema: El Gasto de Batería
¿Por qué las apps no reciben mensajes directamente de internet todo el tiempo? Si cada aplicación en tu teléfono mantuviera una conexión abierta esperando mensajes, la batería de tu dispositivo se agotaría en muy poco tiempo. Sería un caos de conexiones ineficientes.

[st] La Solución: Un Intermediario Confiable
Para solucionar esto, tanto Android como iOS utilizan un sistema centralizado. El sistema operativo (Android o iOS) mantiene una única conexión de bajo consumo con los servidores de Google o Apple. Todas las notificaciones para todas las aplicaciones viajan a través de esta única "tubería" optimizada.

[st] Los Grandes Jugadores: APN y FCM
Estos intermediarios son los servicios de notificaciones push de Apple y Google.

- APN (Apple Push Notification service): Es el servicio exclusivo y obligatorio de Apple para enviar notificaciones a dispositivos iOS (iPhone, iPad) y macOS. Toda notificación destinada a un producto de Apple debe pasar por aquí.
[i] https://peasi.com/hubfs/Blog/understanding-apns-apple-push-notification-service.png

- FCM (Firebase Cloud Messaging): Es la solución de Google. Es el sistema estándar para dispositivos Android. Su gran ventaja es que es multiplataforma: también puede gestionar el envío de notificaciones a aplicaciones de iOS y web.
[i] https://miro.medium.com/v2/resize:fit:1400/1*eJKXDpxooNQWafg5PiyVJQ.png

[st] Protocolo
Aunque el patrón de funcionamiento es similar a un sistema de publicación y suscripción como MQTT, en la práctica no es exactamente así. Tanto APN como FCM utilizan sus propios protocolos binarios, altamente optimizados y propietarios. El de Apple, por ejemplo, está construido sobre HTTP/2. Estos protocolos están diseñados para ser extremadamente eficientes en redes móviles, minimizando el uso de datos y batería, algo que un protocolo estándar como MQTT no garantizaría de la misma forma.

[st] El Viaje de una Notificación en 4 Pasos
El flujo de una notificación es bastante sencillo:
1. Un dispositivo se suscribe a un topic
2. El servidor de tu aplicación envía una notificación al servicio de push (APN o FCM).
3. El servicio de push recibe la petición, identifica tu dispositivo y envía el mensaje a través de su canal optimizado.
4. El sistema operativo de tu teléfono recibe el mensaje.
5. Finalmente, el sistema operativo muestra la notificación en tu pantalla y, si es necesario, "despierta" a la aplicación correspondiente para que procese el mensaje.

[st] El Rol de FCM en el Mundo de Apple
Como se mencionó, puedes usar FCM para enviar notificaciones a usuarios de iOS. En este caso, FCM no reemplaza a APN, sino que actúa como un gestor. Tu servidor solo necesita hablar con FCM, y FCM se encarga de comunicarse con APN para entregar la notificación al dispositivo Apple. Para que esto funcione, es necesario configurar el proyecto de Firebase con las credenciales obtenidas de una cuenta de Apple Developer.
[i] https://miro.medium.com/v2/resize:fit:1400/1*9nTXnD2u-eB-E4HDue9R1A.png

[st] Reflexión
Dada la complejidad de configurar las notificaciones para ambas plataformas y para mantener las cosas simples, las siguientes lecciones se centrarán principalmente en la implementación y configuración de notificaciones push para Android a través de Firebase.
');

-- Inserting content for: lessonK1
INSERT INTO lessons (slug, content) VALUES ('lessonK1', E'[t] Creando y Conectando un Proyecto de Firebase
Esta guía te mostrará cómo iniciar un proyecto en Firebase y conectarlo a tu aplicación de Flutter utilizando las herramientas de línea de comandos de FlutterFire.

[st] Requisitos Previos
Antes de comenzar, asegúrate de tener instalado el siguiente software en tu sistema:
[list]
Flutter SDK: El entorno de desarrollo de Flutter debe estar correctamente instalado y configurado en tu PATH.
Cuenta de Firebase: Necesitas una cuenta de Google para poder crear y administrar proyectos en la Consola de Firebase (https://console.firebase.google.com/)
[endlist]

[st] Instalación de Firebase CLI
Instale la CLI de Firebase para facilitar la configuración de las notificaciones
[code:sh]
npm install -g firebase-tools
[endcode]
Verifique en una nueva consola que tiene el comando `firebase`. Debe logearse con
[code:sh]
firebase login
[endcode]

[st] Instalación de FlutterFire CLI
FlutterFire CLI es una herramienta de línea de comandos que facilita la conexión de tus aplicaciones de Flutter con Firebase. Para instalarla, ejecuta el siguiente comando en tu terminal. Puedes ejecutarlo desde cualquier directorio.

[code:bash]
dart pub global activate flutterfire_cli
[endcode]

Este comando descarga y activa la herramienta, dejándola disponible para ser usada en cualquier proyecto de Flutter.

[st] 2. Conectando tu App de Flutter
Una vez instalada la CLI, navega a la raíz de tu proyecto de Flutter y ejecuta el siguiente comando. Asegúrate de reemplazar `flutterdomibaas` con el ID de tu propio proyecto de Firebase.

[code:bash]
flutterfire configure --project=flutterdomibaas
[endcode]

Este comando realiza dos acciones importantes:
[list]
Registra automáticamente tus apps (Android, iOS, web) en el proyecto de Firebase que especificaste.
Genera un archivo de configuración `lib/firebase_options.dart` en tu proyecto de Flutter.
[endlist]

[st] El Archivo de Configuración Generado
El comando anterior creará un archivo `firebase_options.dart` que contiene todas las credenciales necesarias para que tu app se conecte con Firebase. Lucirá similar a esto:

[code:dart]
import ''package:firebase_core/firebase_core.dart'' show FirebaseOptions;
import ''package:flutter/foundation.dart'' show defaultTargetPlatform, kIsWeb, TargetPlatform;

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      // ... otras plataformas
      default:
        throw UnsupportedError(
          ''DefaultFirebaseOptions are not supported for this platform.'',
        );
    }
  }

  static const FirebaseOptions web = FirebaseOptions(
    // ... credenciales web
  );

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: ''...'',
    appId: ''...'',
    messagingSenderId: ''...'',
    projectId: ''flutterdomibaas'',
    // ...
  );

  static const FirebaseOptions ios = FirebaseOptions(
    // ... credenciales iOS
  );
}
[endcode]

¡Y eso es todo! Con estos pasos, tu aplicación de Flutter ya está configurada para usar los servicios de Firebase.
');

-- Inserting content for: lessonK2
INSERT INTO lessons (slug, content) VALUES ('lessonK2', E'[t] Configurando Firebase para Enviar Notificaciones Push
Para que un backend pueda enviar notificaciones a tu app, necesita una autorización segura. Esta guía explica cómo configurar una "Cuenta de Servicio" en Firebase para obtener las credenciales necesarias.
[st] Requisitos Previos
[list]
Tener un proyecto de Firebase creado.
Haber conectado tu app de Flutter a Firebase, como se explica en la lección K0.
[endlist]

[st] Habilitar la API de Cloud Messaging (v1)
Primero, asegúrate de que la API para enviar mensajes esté activa en tu proyecto.

1. Ve a tu proyecto en la [link](Consola de Firebase) https://console.firebase.google.com/.
2. Haz clic en el ícono de engranaje (⚙️) junto a "Project Overview" y selecciona Configuración del proyecto.
3. Ve a la pestaña Cloud Messaging.
4. Si la "Firebase Cloud Messaging API (V1)" está desactivada, actívala. Generalmente, Firebase proporciona un enlace directo para hacerlo.

[st] Crear una Cuenta de Servicio (Service Account)
Una cuenta de servicio actúa como un "usuario robot" que representa a tu backend.
1. En la Configuración del proyecto, ve a la pestaña Cuentas de servicio.
2. Haz clic en el botón Crear cuenta de servicio.
3. Asigna un nombre descriptivo, como `backend-server` o `notifications-admin`.
4. En el campo Rol, busca `Administrador de Firebase` (o `Firebase Admin`). Este rol le da permisos amplios para gestionar tu proyecto.
5. Haz clic en Listo para crear la cuenta.

[st] Generar la Clave JSON
La clave es un archivo que tu backend usará para autenticarse de forma segura.

1. En Google Cloud Console, entra a la cuenta de servicio que acabas de crear
2. Ve al apartado `Claves`, entra y ve a crear clave
3. Selecciona el tipo de clave JSON y haz clic en CREAR.

El navegador descargará automáticamente un archivo `.json`.

Este archivo contiene credenciales de administrador para tu proyecto de Firebase. Trátalo como una contraseña: guárdalo en un lugar seguro y nunca lo subas a un repositorio público.

Con este archivo JSON, tu backend ahora tiene la autorización para autenticarse con los servidores de Google y enviar notificaciones push a través de FCM a tu aplicación de Flutter.

');

-- Inserting content for: lessonK3
INSERT INTO lessons (slug, content) VALUES ('lessonK3', E'[t] Integración completa de notificaciones con Firebase en Flutter
[st] Objetivo
En esta guía configuramos Firebase Cloud Messaging (FCM) y notificaciones locales para Android en un proyecto Flutter.
Este proceso permite:
[list]
Recibir notificaciones en foreground, background y cuando la app está cerrada.
Mostrar notificaciones locales personalizadas con `flutter_local_notifications`.
[endlist]

[st] Instalación de dependencias
Se agregaron tres nuevas dependencias en `pubspec.yaml`:
[code:yaml]
dependencies:
  firebase_core: ^4.2.1
  firebase_messaging: ^16.0.4
  flutter_local_notifications: ^19.5.0
[endcode]
Estas librerías permiten inicializar Firebase, gestionar los mensajes de FCM y mostrar notificaciones locales en Android/iOS.

[st] Android · Habilitar `google-services`
En el archivo `android/app/build.gradle.kts`
[code:kotlin]
plugins {
  id("com.google.gms.google-services")
}
compileOptions {
  sourceCompatibility = JavaVersion.VERSION_17
  targetCompatibility = JavaVersion.VERSION_17
  isCoreLibraryDesugaringEnabled = true
}

kotlinOptions {
  jvmTarget = JavaVersion.VERSION_17.toString()
}

dependencies {
    coreLibraryDesugaring("com.android.tools:desugar_jdk_libs:2.1.4")
}
[endcode]
Esto permite que Gradle integre la configuración de Firebase y use los servicios de Google

[st] Inicialización de Firebase y configuración de notificaciones
En `lib/main.dart` se hicieron los siguientes pasos:
[st] Importar los paquetes necesarios
[code:dart]
import ''package:firebase_core/firebase_core.dart'';
import ''package:firebase_messaging/firebase_messaging.dart'';
import ''package:flutter_local_notifications/flutter_local_notifications.dart'';
[endcode]

[st] Configurar notificaciones locales
En la raíz del proyecto
[code:dart]
final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
    FlutterLocalNotificationsPlugin();
[endcode]
Esto permite generar notificaciones visuales

[st] Inicialización de la aplicación
En el archivo main.dart debemos inicializar la recepción asincrónica de mensajes. El orden de las líneas importa, de modo que aquí tiene la forma general del archivo 
[code:dart]
void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Firebase.initializeApp();

  // Anclar un método de recepción de mensajes
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

  // Configura canal local de Android
  const AndroidInitializationSettings initSettingsAndroid =
      AndroidInitializationSettings(''@mipmap/ic_launcher'');
  const InitializationSettings initSettings =
      InitializationSettings(android: initSettingsAndroid);
  await flutterLocalNotificationsPlugin.initialize(initSettings);

  await Supabase.initialize(
    url: ''https://yzosfzyewkdpnmlbgbej.supabase.co'',
    anonKey: ''sb_publishable_sVlCTCKFQ9NktJjQTOmahw_QoBUGODX'',
  );

  runApp(const App());
}
[endcode]

[st] Método de rececpción 
En la inicialización usamos `_firebaseMessagingBackgroundHandler`, la definición de ese método es
[code:dart]
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  print(''Mensaje recibido en background: ${message.messageId}'');
}
[endcode]

[st] Suscripción
El Widget `App` debe ser un StatefulWidget para que haya método de inicialización `initState` y poder activar la recepción
[code:dart]
class App extends StatefulWidget{
  const App({super.key});

  @override
  State<StatefulWidget> createState() {
    return MyAppState();
  }
  
}

class MyAppState extends State<App> {
  @override
  void initState() {
    super.initState();
    //Vamos a suscribirnos aquí
  }
}
[endcode]

Ahora sí, en el método `initState` de la aplicación
[code:dart]
@override
void initState() {
  super.initState();
  //Vamos a suscribirnos aquí
  _initNotifications();
}

Future<void> _initNotifications() async {
    FirebaseMessaging messaging = FirebaseMessaging.instance;

    // Solicita permisos para notificaciones
    NotificationSettings settings = await messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );

    print(''Permisos otorgados: ${settings.authorizationStatus}'');

    // Suscripción al topic
    await messaging.subscribeToTopic("mi_topic_general");
    print("Suscrito al topic mi_topic_general");

    // Escuchar mensajes entrantes
    FirebaseMessaging.onMessage.listen(
      (RemoteMessage message) {
        print("Mensaje recibido en foreground: ${message.data}");
      }
    );
}
[endcode]
Dentro del listener se imprimen los mensajes que llegan, pero como queremos mostrarlos como notificación, podemos usar este objeto message la siguiente forma.
[code:dart]
RemoteNotification? notification = message.notification;
AndroidNotification? android = message.notification?.android;
flutterLocalNotificationsPlugin.show(
  id++,
  "Nuevo mensaje",
  "${message.data}",
  const NotificationDetails(
    android: AndroidNotificationDetails(
      ''canal_notif'', // ID único del canal
      ''Notificaciones generales'',
      importance: Importance.max,
      priority: Priority.high,
    ),
  ),
);
[endcode]
Con esto ya está suscrito al topic mi_topic_general.');

-- Inserting content for: lessonK4
INSERT INTO lessons (slug, content) VALUES ('lessonK4', E'[t] El Rol del Backend en las Notificaciones Push
Ya configuramos tanto el cliente de Flutter como el proyecto de Firebase. Ahora, es crucial entender cómo un servidor backend utiliza las credenciales que generamos para enviar notificaciones de forma segura.

[st] La Clave de Cuenta de Servicio: La Identidad de tu Backend
El archivo `.json` que descargaste en la lección K2 es una Clave de Cuenta de Servicio (`Service Account Key`). Esta clave es, en esencia, el nombre de usuario y la contraseña de tu servidor. Su único propósito es vivir en tu backend (por ejemplo, una aplicación Node.js, Python o Java) y nunca, bajo ninguna circunstancia, debe ser incluida en tu aplicación Flutter.

[st] ¿Qué es una Cuenta de Servicio?
Una cuenta de servicio es una cuenta especial de Google que no pertenece a un usuario humano, sino a una aplicación o una máquina virtual. Cuando tu backend usa esta clave para autenticarse, le está diciendo a Google: "Hola, soy el servidor autorizado para gestionar el proyecto de Firebase `flutterdomibaas`".

El permiso que le asignamos, `Administrador de Firebase` (`Firebase Admin`), le otorga un control casi total sobre tu proyecto. Puede leer y escribir en tu base de datos, modificar reglas de seguridad y, por supuesto, enviar notificaciones.

[st] Seguridad Crítica: ¿Por Qué la Clave NO Debe Estar en la App?
Incluir el archivo `.json` en tu aplicación móvil sería un error de seguridad catastrófico. Sería como entregarle las llaves de tu casa a cada persona que pasa por la calle.

[list]
Cualquier persona podría descompilar tu aplicación (APK o IPA) y extraer el archivo de la clave.
Con esa clave, un atacante tendría control total sobre tu proyecto de Firebase, pudiendo robar datos, borrar información o enviar notificaciones maliciosas a todos tus usuarios.
Los costos podrían dispararse si el atacante usa tus servicios de Firebase de forma abusiva.
[endlist]

La aplicación Flutter solo necesita el archivo `firebase_options.dart` para identificarse como un cliente legítimo, pero nunca debe tener los permisos de administrador que otorga la clave de servicio.

[st] Flujo completo
El proceso detallado es el siguiente:
1.  Acción del Usuario: Un usuario en la app móvil realiza una acción que debe disparar una notificación (por ejemplo, enviar un mensaje a otro usuario).
2.  Comunicación con el Backend: La app no intenta enviar la notificación directamente. En su lugar, envía una petición a tu propio servidor backend (por ejemplo, a través de una API REST).
3.  Autenticación del Backend: Tu backend recibe la petición. Usando la clave de la cuenta de servicio (el archivo `.json`), se autentica con los servicios de Google a través del SDK de Firebase Admin.
4.  Publicación del Mensaje: Una vez autenticado, el backend le dice a Firebase Cloud Messaging (FCM): "Por favor, envía este mensaje a este `topic` o a este dispositivo específico".
5.  Entrega de FCM: FCM se encarga de la logística pesada: localiza los dispositivos suscritos y les envía la notificación a través del canal optimizado de Apple (APN) o Google.
6.  Recepción en la App: La aplicación Flutter recibe la notificación y se muestra de acuerdo a lo que se haya programado en la aplicación

[st] Endpoint clave de FCM
Para enviar una notificación a FCM desde tu backend, realizarías una petición HTTP POST a la API de FCM. La estructura básica de esa petición:

[st] URL del Endpoint
[code:http]
https://fcm.googleapis.com/v1/projects/YOUR_PROJECT_ID/messages:send
[endcode]
Reemplaza `YOUR_PROJECT_ID` con el ID de tu proyecto de Firebase (por ejemplo, `flutterdomibaas`).

[st] Headers Necesarios
Necesitarás al menos dos headers:
[code:text]
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN
[endcode]
El `YOUR_ACCESS_TOKEN` se obtiene después de que tu backend se autentica con la clave de cuenta de servicio. El SDK de Firebase Admin se encarga de generar y refrescar este token automáticamente.

[st] Body de la Petición (JSON)
Este es el payload que enviarás a FCM. Contiene la información de la notificación y los datos personalizados.
[code:js]
{
    "message": {
        "topic": "mi_topic_general",
        "notification": {
            "title": "Titulo de notificación",
            "body": "Ejemplo de notificación"
        },
        "data": {
            "example": "Notification data"
        },
        "android": {
            "priority": "high"
        }
    }
}
[endcode]

[list]
`topic`: El nombre del tema al que deseas enviar la notificación. Los dispositivos deben estar suscritos a este tema.
`notification`: Contiene el `title` y `body` que se mostrarán al usuario.
`data`: Un objeto de clave-valor con datos personalizados que tu aplicación puede procesar. No se muestra directamente al usuario.
`android`: Opciones específicas para Android, como la `priority`.
[endlist]

[st] Middleware de Reenvío
Este endpoint no se consume desde la aplicación móvil como se dijo, sino que se hace por medio de un middleware que haga el trabajo de recibir la notificación y que se autentique contra Google para finalmente poder enviar el mensaje a FCM.

Puede usar este endpoint de prueba en el que está programado para recibir el mensaje y la clave JSON y hace el reenvío de mensajes a FCM.

Para usarlo, solo necesitas hacer una petición POST a la siguiente URL:
[code:http]
https://i2thub.icesi.edu.co:5443/fcm/messages
[endcode]

[st] Estructura del Body (JSON)
El cuerpo de la petición debe ser un objeto JSON que contenga dos claves principales: `data` (con el mensaje para FCM) y `key` (con el contenido completo de tu clave de cuenta de servicio).

[code:js]
{
    "data": {
        "message": {
            "topic": "mi_topic_general",
            "notification": {
                "title": "Titulo de notificación",
                "body": "Ejemplo de notificación"
            },
            "data": {
                "example": "Notification data"
            },
            "android": {
                "priority": "high"
            }
        }
    },
    "key": {
        "type": "service_account",
        "project_id": "...",
        "private_key_id": "...",
        "private_key": "...",
        "client_email": "...",
        "client_id": "...",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "...",
        "universe_domain": "googleapis.com"
    }
}
[endcode]
Si toda la configuración ha sido correcta podrá ver los mensajes en la aplicación, incluso cuando esta no está abierta.');

-- Inserting content for: lessonL0
INSERT INTO lessons (slug, content) VALUES ('lessonL0', E'[t] Clase: Introducción a Google Maps en Flutter
Todo conocemos Google Maps, así que no necesita mayor introducción. Salvo que Google ha dispuesto Componentes UI para que los desarrolladores puedan integrar y utilizar mapas dentro de sus propias aplicaciones.

[st] Crear un nuevo proyecto Flutter
El primer paso es crear un nuevo proyecto de Flutter. Puedes hacerlo desde tu IDE (como VS Code o Android Studio) o utilizando la línea de comandos:
[code:bash]
flutter create maps_hello_world
cd maps_hello_world
[endcode]
Esto creará una nueva aplicación de Flutter con la estructura básica.

[st] Agregar dependencias al pubspec.yaml
Abre el archivo `pubspec.yaml` en la raíz de tu proyecto y agrega las siguientes dependencias:
[code:yaml]
dependencies:
  flutter:
    sdk: flutter
  google_maps_flutter: ^2.9.0
[endcode]
Luego, ejecuta el siguiente comando en tu terminal para obtener las nuevas dependencias:
[code:bash]
flutter pub get
[endcode]

[st] Configurar claves de API de Google Maps
Para que Google Maps funcione, necesitas una clave de API y configurarla para Android e iOS.

[st] Obtener una API Key
1. Ve a la Google Cloud Console https://console.cloud.google.com/.
2. Crea un nuevo proyecto (o selecciona uno existente).
3. En el menú de navegación, ve a "APIs y servicios" > "Biblioteca".
4. Busca y habilita las siguientes APIs:
   - `Maps SDK for Android`
   - `Maps SDK for iOS`
5. En el menú de navegación, ve a "APIs y servicios" > "Credenciales".
6. Haz clic en "Crear credenciales" > "Clave de API".
7. Copia la clave generada.

[st] Android
En el archivo `android/app/src/main/AndroidManifest.xml`, agrega la siguiente etiqueta `<meta-data>` dentro de la etiqueta `<application>`:

[code:xml]
<manifest ...>
    <application ...>
        <meta-data
            android:name="com.google.android.geo.API_KEY"
            android:value="TU_API_KEY_AQUI"/>
        <!-- Otras configuraciones de la aplicación -->
    </application>
</manifest>
[endcode]
Reemplaza `TU_API_KEY_AQUI` con la clave de API que obtuviste.

[st] iOS
En el archivo `ios/Runner/AppDelegate.swift`, agrega la siguiente línea dentro del método `application(_:didFinishLaunchingWithOptions:)`:

[code:swift]
import UIKit
import Flutter
import GoogleMaps // Asegúrate de importar GoogleMaps

@UIApplicationMain
@objc class AppDelegate: FlutterAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    GMSServices.provideAPIKey("TU_API_KEY_AQUI") // Agrega esta línea
    GeneratedPluginRegistrant.register(with: self)
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}
[endcode]
Reemplaza `TU_API_KEY_AQUI` con tu clave de API.

[st] Hola Mundo de Google Maps
Ahora, vamos a mostrar un mapa básico en tu aplicación.

[st] Crea un archivo lib/map_screen.dart:
Crea un nuevo archivo llamado `map_screen.dart` dentro de la carpeta `lib` y pega el siguiente código:

[code:dart]
import ''package:flutter/material.dart'';
import ''package:google_maps_flutter/google_maps_flutter.dart'';

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  late GoogleMapController mapController;

  final LatLng _center = const LatLng(37.4219999, -122.0840575); // Google HQ

  void _onMapCreated(GoogleMapController controller) {
    mapController = controller;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text(''Hola Google Maps'')),
      body: GoogleMap(
        onMapCreated: _onMapCreated,
        initialCameraPosition: CameraPosition(
          target: _center,
          zoom: 14.0,
        ),
      ),
    );
  }
}
[endcode]

[st] Y en main.dart:
Modifica tu archivo `lib/main.dart` para que se vea así:

[code:dart]
import ''package:flutter/material.dart'';
import ''map_screen.dart''; // Importa tu nueva pantalla de mapa

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      debugShowCheckedModeBanner: false,
      home: MapScreen(), // Usa MapScreen como la pantalla principal
    );
  }
}
[endcode]

Ejecuta tu app: deberías ver el mapa centrado en Mountain View (la sede de Google).
');

-- Inserting content for: lessonL1
INSERT INTO lessons (slug, content) VALUES ('lessonL1', E'[t] Agregando Marcadores al Mapa

En esta lección, aprenderás a agregar marcadores a tu mapa de Google. Un marcador es un ícono que se coloca en una ubicación específica del mapa, a menudo con una ventana de información.

[st] Almacenando los Marcadores
Dentro de la clase `_MapScreenState`, agrega una nueva variable para guardar la colección de marcadores.

[code:dart]
class _MapScreenState extends State<MapScreen> {
  late GoogleMapController mapController;
  final LatLng _center = const LatLng(37.4219999, -122.0840575);
  
  final Set<Marker> _markers = {};

  // ... resto del código
}
[endcode]

[st] Creando un Marcador al Iniciar el Mapa
Modificaremos el método `_onMapCreated` para que, una vez que el mapa esté listo, agregue un marcador a nuestro `Set`.

[code:dart]
void _onMapCreated(GoogleMapController controller) {
  mapController = controller;
  setState(() { // Notificamos a Flutter que vamos a cambiar el estado
    _markers.add(
      const Marker(
        markerId: MarkerId(''google_hq''),
        position: LatLng(37.4219999, -122.0840575),
        infoWindow: InfoWindow(
          title: ''Google HQ'',
          snippet: ''La sede de Google'',
        ),
      ),
    );
  });
}
[endcode]
Aquí, `Marker` recibe:
- `markerId`: Un identificador único.
- `position`: Las coordenadas `LatLng` donde se ubicará.
- `infoWindow`: El texto que aparece al tocar el marcador.

[st] Mostrando los Marcadores en el Mapa
Finalmente, necesitamos decirle al widget `GoogleMap` que use nuestro `Set` de marcadores. Para ello, asignamos `_markers` a la propiedad `markers` del mapa.

[code:dart]
@override
Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(title: const Text(''Hola Google Maps'')),
    body: GoogleMap(
      onMapCreated: _onMapCreated,
      initialCameraPosition: CameraPosition(
        target: _center,
        zoom: 14.0,
      ),
      markers: _markers, // Nuevo: Pasa el set de marcadores al mapa
    ),
  );
}
[endcode]
Ejecuta tu aplicación. Ahora deberías ver el mismo mapa, pero con un marcador rojo en la ubicación de la sede de Google. Toca el marcador para ver la `InfoWindow` con el título y el texto que definiste.
');

-- Inserting content for: lessonL2
INSERT INTO lessons (slug, content) VALUES ('lessonL2', E'[t] Controlando la Cámara del Mapa

Mostrar un mapa está bien, pero lo realmente útil es **poder mover la cámara** de forma programática, por ejemplo, al hacer clic en un botón para centrarla en una ubicación específica.

[st] Moviendo la Cámara con un Botón

En este ejemplo, agregaremos un botón que moverá la cámara a una coordenada fija (por ejemplo, el Parque Simón Bolívar en Bogotá).

[code:dart]
import ''package:flutter/material.dart'';
import ''package:google_maps_flutter/google_maps_flutter.dart'';

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  late GoogleMapController mapController;
  final LatLng _initialPosition = const LatLng(3.341571, -76.530198); // Posición inicial
  final LatLng _destination = const LatLng(4.658383, -74.093389); // Parque Simón Bolívar
  final Set<Marker> _markers = {};

  void _onMapCreated(GoogleMapController controller) {
    mapController = controller;
    _markers.add(
      Marker(
        markerId: const MarkerId(''inicio''),
        position: _initialPosition,
        infoWindow: const InfoWindow(title: ''Posición inicial''),
      ),
    );
  }

  void _moveCamera() {
    mapController.animateCamera(
      CameraUpdate.newCameraPosition(
        CameraPosition(
          target: _destination,
          zoom: 16.0,
          bearing: 0.0,
          tilt: 0.0,
        ),
      ),
    );

    setState(() {
      _markers.add(
        Marker(
          markerId: const MarkerId(''destino''),
          position: _destination,
          infoWindow: const InfoWindow(title: ''Parque Simón Bolívar''),
        ),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text(''Controlando la Cámara del Mapa'')),
      body: Stack(
        children: [
          GoogleMap(
            onMapCreated: _onMapCreated,
            initialCameraPosition: CameraPosition(target: _initialPosition, zoom: 14.0),
            markers: _markers,
          ),
          Positioned(
            bottom: 20,
            right: 20,
            child: FloatingActionButton(
              onPressed: _moveCamera,
              child: const Icon(Icons.location_searching),
            ),
          ),
        ],
      ),
    );
  }
}
[endcode]

Al presionar el botón flotante, la cámara se moverá suavemente hacia las coordenadas del Parque Simón Bolívar y se agregará un marcador allí.

[st] Ajustando la Vista de la Cámara

Si quieres más control sobre cómo se ve el mapa (por ejemplo, su orientación o inclinación), puedes usar un objeto `CameraPosition` con propiedades como:

- `target`: Coordenadas centrales (`LatLng`) del mapa.  
- `zoom`: Nivel de acercamiento (1 = mundo, 20 = edificios).  
- `bearing`: Dirección hacia la que mira la cámara (0–360°).  
- `tilt`: Inclinación de la vista (0° = vista desde arriba, 45° o más = vista en perspectiva).

Por ejemplo, para una vista inclinada y orientada al Este:

[code:dart]
mapController.animateCamera(
  CameraUpdate.newCameraPosition(
    CameraPosition(
      target: _destination,
      zoom: 17.0,
      bearing: 90.0, // Mira hacia el Este
      tilt: 45.0,    // Vista inclinada
    ),
  ),
);
[endcode]

Con esto puedes crear efectos más dinámicos, como un paneo o una vista en perspectiva.');

-- Inserting content for: lessonL3
INSERT INTO lessons (slug, content) VALUES ('lessonL3', E'[t] Interactuando con el Mapa

Un mapa interactivo es mucho más útil. En esta lección, aprenderemos a responder a las interacciones del usuario con el mapa, como toques (taps) y pulsaciones largas (long presses), tanto en el mapa en general como en marcadores específicos.

[st] Tipos de Listeners Disponibles
El widget `GoogleMap` expone varios callbacks para eventos del usuario. Los más comunes son:

[list]
`onTap`: Se activa al tocar cualquier punto del mapa.
`onLongPress`: Se activa cuando mantienes presionado un punto.
`onTap` (dentro de `Marker`): Se activa cuando se toca un marcador específico.
[endlist]

[st] Escuchar Tap y Long Tap en el Mapa
Para detectar toques y pulsaciones largas en cualquier parte del mapa, simplemente agrega las propiedades `onTap` y `onLongPress` al widget `GoogleMap` y asígnales funciones que manejarán estos eventos.

Modifica tu `GoogleMap` así:
[code:dart]
GoogleMap(
  onMapCreated: _onMapCreated,
  initialCameraPosition: CameraPosition(
    target: _center,
    zoom: 14.0,
  ),
  markers: _markers,
  onTap: _handleTap,        // Nuevo: Manejador para toques
  onLongPress: _handleLongPress, // Nuevo: Manejador para pulsaciones largas
)
[endcode]

Ahora, define los métodos `_handleTap` y `_handleLongPress` dentro de tu clase `_MapScreenState`:

[code:dart]
// Dentro de la clase _MapScreenState

void _handleTap(LatLng tappedPoint) {
  setState(() {
    _markers.add(
      Marker(
        markerId: MarkerId(tappedPoint.toString()), // ID único basado en las coordenadas
        position: tappedPoint,
        infoWindow: const InfoWindow(title: ''Nuevo marcador''),
      ),
    );
  });
}

void _handleLongPress(LatLng pressedPoint) {
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      content: Text(''Manteniendo en ${pressedPoint.latitude}, ${pressedPoint.longitude}''),
      duration: const Duration(seconds: 2),
    ),
  );
}
[endcode]

Resultado:
- Un toque en cualquier parte del mapa agregará un nuevo marcador en esa posición.
- Una pulsación larga mostrará un `SnackBar` en la parte inferior de la pantalla con las coordenadas del punto presionado.

[st] Detectar Clics en un Marcador
El evento de toque para un marcador se maneja directamente dentro de la definición del `Marker`, usando su parámetro `onTap`. Esto te permite definir un comportamiento específico para cada marcador individual.

Ejemplo (modificando el marcador inicial de Google HQ):
[code:dart]
Marker(
  markerId: const MarkerId(''google_hq''),
  position: const LatLng(37.4219999, -122.0840575),
  infoWindow: const InfoWindow(title: ''Google HQ''),
  onTap: () { // Nuevo: Callback al tocar este marcador
    print(''Marcador de Google HQ tocado'');
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text(''Tocaste el marcador de Google HQ'')),
    );
  },
)
[endcode]
Importante: Cada marcador puede tener su propio comportamiento `onTap` definido, lo que permite una gran flexibilidad en la interacción.

[st] Ejemplo Completo
Aquí tienes el código completo de `MapScreen` integrando todos los listeners que hemos visto:

[code:dart]
import ''package:flutter/material.dart'';
import ''package:google_maps_flutter/google_maps_flutter.dart'';

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  late GoogleMapController mapController;
  final LatLng _center = const LatLng(37.4219999, -122.0840575);
  final Set<Marker> _markers = {};

  @override
  void initState() {
    super.initState();
    _addInitialMarker(); // Agrega el marcador inicial al iniciar el estado
  }

  void _onMapCreated(GoogleMapController controller) {
    mapController = controller;
  }

  void _addInitialMarker() {
    _markers.add(
      Marker(
        markerId: const MarkerId(''google_hq''),
        position: _center,
        infoWindow: const InfoWindow(title: ''Google HQ''),
        onTap: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text(''Tocaste el marcador principal'')),
          );
        },
      ),
    );
  }

  void _handleTap(LatLng point) {
    setState(() {
      _markers.add(
        Marker(
          markerId: MarkerId(point.toString()),
          position: point,
          infoWindow: const InfoWindow(title: ''Nuevo marcador''),
        ),
      );
    });
  }

  void _handleLongPress(LatLng point) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(''Manteniendo en ${point.latitude}, ${point.longitude}'')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text(''Interacción con el mapa'')),
      body: GoogleMap(
        onMapCreated: _onMapCreated,
        initialCameraPosition: CameraPosition(target: _center, zoom: 14.0),
        markers: _markers,
        onTap: _handleTap,
        onLongPress: _handleLongPress,
      ),
    );
  }
}
[endcode]
.');

-- Inserting content for: lessonM1
INSERT INTO lessons (slug, content) VALUES ('lessonM1', E'[t] Creando AAB Android
Para comenzar con el proceso de publicación, debe primero crear una `key`
[code:sh]
keytool -genkey -v -keystore ~/appkey.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
[endcode]
El comando pedirá:
[list]
Una contraseña (recuerda guardarla)
Nombre, organización, ciudad, país
Alias
Esto creará un archivo llamado appkey.jks en tu carpeta de usuario.
[endlist]
Al finalizar quedará el path de donde se alamcena el archivo `appkey.jks`.

Ahora, en el archivo `build.gradle.kts`, debe poner esto
[code:java]
import java.util.Properties
import java.io.FileInputStream

// Cargar las propiedades del keystore
val keystoreProperties = Properties()
val keystorePropertiesFile = rootProject.file("key.properties")
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(FileInputStream(keystorePropertiesFile))
}

android {
  signingConfigs {
        create("release") {
            keyAlias = keystoreProperties["keyAlias"] as String?
            keyPassword = keystoreProperties["keyPassword"] as String?
            storeFile = keystoreProperties["storeFile"]?.let { file(it) }
            storePassword = keystoreProperties["storePassword"] as String?
        }
  }

  buildTypes {
        getByName("release") {
            signingConfig = signingConfigs.getByName("release")
            isMinifyEnabled = false
            isShrinkResources = false
            // Usa true si configuras ProGuard
        }
  }

}
[endcode]

En la carpeta `android` cree un archivo `android/key.properties`, el contenido del archivo es
[code:properties]
storePassword=123456
keyPassword=123456
keyAlias=my-key-alias
storeFile=my-key.jks
[endcode]
Reemplazando los valores por los insertados con el `keytool`.

Finalmente escriba el comando
[code:sh]
flutter build appbundle --release
[endcode]
.');

-- Inserting content for: lessonX5
INSERT INTO lessons (slug, content) VALUES ('lessonX5', E'[t] Self-hosted Supabase
En esta lección aprenderás a instalar Supabase en modo self-hosted usando Docker Compose. Esto te permitirá tener una instancia local de Supabase con base de datos, autenticación, almacenamiento y la interfaz web Studio.

[st] Pasos para la instalación

[code:bash]
# Clona el repositorio oficial de Supabase
git clone --depth 1 https://github.com/supabase/supabase

# Crea un directorio para tu proyecto Supabase
mkdir supabase-project

# Copia los archivos de Docker al nuevo proyecto
cp -rf supabase/docker/* supabase-project

# Copia las variables de entorno de ejemplo
cp supabase/docker/.env.example supabase-project/.env

# Entra al directorio de tu proyecto
cd supabase-project

# Descarga las imágenes más recientes
docker compose pull

# Inicia los servicios en segundo plano
docker compose up -d
[endcode]

[st] Acceso a la interfaz web
Puedes ingresar a la interfaz web de Supabase en [link] ( http://localhost:8000) http://localhost:8000

Credenciales por defecto
[code:md]
user:supabase
password:this_password_is_insecure_and_should_be_updated
[endcode]

Por seguridad, cambia la contraseña en producción.

[st] Acceso a las APIs
Cada una de las APIs está disponible a través del mismo API gateway:
[list]
REST:     http://`<your-ip>`:`8000` `/rest/v1/` 
Auth:     http://`<your-domain>`:`8000` `/auth/v1/` 
Storage:  http://`<your-domain>`:`8000` `/storage/v1/`
Realtime: http://`<your-domain>`:`8000` `/realtime/v1/`
[endlist]

Reemplaza `<your-ip>` o `<your-domain>` por la dirección de tu máquina o servidor donde esté corriendo Supabase. 

');

-- Inserting content for: lessonZ1
INSERT INTO lessons (slug, content) VALUES ('lessonZ1', E'[t] Programa del curso

[i] logo.png

Bienvenido a su curso de `Aplicaciones Móviles`. Este curso brinda a los estudiantes la oportunidad de experimentar un entorno multidisciplinario que refleja los desafíos que se encuentran en su vida profesional. A lo largo de este semestre, se recorrerán todas las etapas del desarrollo de aplicaciones móviles, desde el diseño inicial hasta el despliegue final. Los conceptos adquiridos durante su carrera serán aplicados y se utilizarán herramientas relevantes con el fin de lograr un objetivo común: el lanzamiento de una aplicación móvil innovadora. 

En este programa de estudio, se explorarán los procesos de ideación y prototipado, así como la arquitectura y el diseño de aplicaciones móviles. Además, se adquirirán habilidades para la construcción y despliegue de productos mínimos viables. El uso de herramientas de diseño, bases de datos no relacionales, servicios Cloud y servicios web REST será parte integral de este proceso de aprendizaje. Prepárese para enfrentar los desafíos inherentes al desarrollo de aplicaciones móviles y elevar las habilidades a un nivel superior en este apasionante curso.

[st] Información de la Asignatura
[list]
Nombre de la asignatura: Aplicaciones móviles
Código de la asignatura: 09738 - TIC
Periodo Académico: 202520
Nrc: 10193
Intensidad horaria: 4
Intensidad Semanal: 3
Créditos: 3
Docente: Domiciano Rincón Niño
[endlist]

[st] Formación en competencias
[list]
`SO1` Solución de problemas: Identificar, formular y resolver problemas complejos de ingeniería aplicando pensamiento crítico y principios de las ciencias, las matemáticas, la ingeniería y, en particular, de las Ciencias de la Computación y de la Ingeniería de Software.
`SO3` Comunicación efectiva: Comunicarse efectivamente de forma oral y escrita, tanto en español como en inglés.
`SO5` Trabajar de manera efectiva en equipos, cuyos miembros brinden liderazgo de manera colectiva, creen entornos colaborativos e inclusivos, establezcan metas, planifiquen tareas y logren objetivos, mientras se adaptan a situaciones cambiantes.
[endlist]

[st] Objetivo general de aprendizaje
Desarrollar y aplicar habilidades del diseño, construcción, arquitectura y despliegue de aplicaciones móviles, a través de la participación activa en un equipo de trabajo, siguiendo prácticas ágiles de desarrollo y contribuyendo de manera significativa al logro de los objetivos del proyecto.

[st] Unidades de aprendizaje

`Unidad 1` Fundamentos de programación para aplicaciones móviles
[list]
Introducción al curso de Aplicaciones Móviles
Instalación y familiarización con el entorno de desarrollo
Estructura de una aplicación móvil y sus componentes principales
Diseño de la interfaz de usuario para aplicaciones móviles
Uso del kit de Flutter para la diagramación y composición de pantallas
Navegación entre pantallas
Uso de listas
Administración de estados
[endlist]

`Unidad 2` Diseño, Ideación y Prototipado
[list]
Estilos de navegación y técnicas de prototipado en el diseño de aplicaciones móviles
Uso de herramientas como Sketch, Wireframe y Mockup para el diseño de interfaces
Creación de prototipos no funcionales para visualizar y validar la experiencia del usuario
Diseño de la experiencia móvil teniendo en cuenta aspectos multidisciplinarios
[endlist]

`Unidad 3` Arquitectura y servicios
[list]
Exploración de la arquitectura de soluciones móviles.
Uso del patrón de arquitectura de software BloC y Clena Architecture en el desarrollo de aplicaciones móviles.
Utilización de bases de datos no relacionales en el contexto de aplicaciones móviles.
Integración de servicios Cloud utilizando Supabase.
Servicios de bases de datos en nube
Servicios de almacenamiento en nube
Servicios de autenticación en nube
Notificaciones Push
Consumo de Web Services REST y depuración de solicitudes, respuestas y deserialización de datos
[endlist]

`Unidad 4` Construcción y Despliegue
[list]
Desarrollo de un Producto Mínimo Viable (MVP) en el proceso de construcción de una aplicación móvil
Fase de lanzamiento de aplicaciones, considerando aspectos como pruebas, ajustes finales y optimización del rendimiento
Firma digital de aplicaciones para garantizar la autenticidad y seguridad en el despliegue
Preparación de la aplicación previo al lanzamiento en tiendas de aplicaciones como Google Play Store o App Store
[endlist]

[st] Metodologías de aprendizajes
El curso tiene una metodología de trabajo iterativo cuyo eje principal es el proyecto final del curso. Durante el desarrollo de la clase se apropian conceptos que le permitirán trabajar de manera efectiva.
Es responsabilidad del estudiante preparar el material general y el específico por disciplina, porque de eso depende el buen desarrollo de las sesiones con sus coequiperos.
La asistencia es esencial.
El uso de la IA en este curso se define como Uso Colaborativo, lo que implica que la IA participa en la co-creación del aprendizaje junto con el estudiante, respaldada por un proceso de verificación y supervisión activa.

[st] Evaluación de aprendizajes

Pitch
`10%      ` 
Un pitch elevator junto con su grupo en el que proponga sus ideas de proyecto final

DB
`15%            ` 
Modelo de la base de datos que deberá presentar mediante diagramas

Proto
`15%            `
Prototipo no funcional de alta fidelidad que debe mostrar preliminarmente las funciones de la aplicación. Adicionalmente debe declarar todo los módulos de la aplicación.

Sprint 1
`15%            `
De acuerdo al backlog, deberá resolver el módulo de autenticación y autorización de la aplicación. Tenga en cuenta que pueden haber varios roles. Algunas aplicaciones pueden tener un proceso de onboarding más complejo en una app o en otra

Sprint 2
`15%            `
De acuerdo al backlog, deberá escoger qué módulos de la aplicación incluirá en el segundo sprint. Esa declaración debe ser presentada en moodle como Kick off del sprint 2.

Sprint 3
`15%            `
De acuerdo al backlog, deberá escoger qué módulos de la aplicación incluirá en el segundo sprint. Esa declaración debe ser presentada en moodle como Kick off del sprint 3.

Exhibición
`15%            `
La actividad final del curso es exponer su aplicación en una exibición de las funcionalidades alcanzadas

[st] Recursos de apoyo
No es necesario comprar ningún libro para el curso. Todo el material necesario para el curso será suministrado a través de Intu, como los materiales bibliográficos, guías de clases, videos, blogs, cursos en línea y otros.

[st] Enlaces y herramientas relevantes
[link](Documentación oficial de Flutter) https://docs.flutter.dev/get-started/install

[link](Aplicaciones móviles ICESI) https://miro.com/app/board/o9J_I2waJG0=/');

-- Inserting content for: lessonZ2
INSERT INTO lessons (slug, content) VALUES ('lessonZ2', E'[t] Pitch Elevator
`Semana 5`

[st] Consigna
La presentación consiste en hacer un pitch elevator donde usted y su grupo debe presentar tres propuestas de proyecto final para el curso de aplicaciones móviles, de acuerdo a los requerimientos mínimos juntos a este documento en el repositorio de GitHub.
Si su motivación para ver el curso es desarrollar una idea concebida con anterioridad, debe igualmente hacer la exposición.


[st] Contenido
Lea detenidamente las siguientes partes que debe cumplir en la exposición

[st] 1. Propuestas
Usted y su grupo debe presentar al menos tres (3) propuestas que cumplan con los mínimos requeridos en la enunciación del proyecto. Cada propuesta de aplicación móvil debe tener un `nombre`.

[st] 2. Identificación del problema
Por cada propuesta, debe describir cuál es el problema que usted y su grupo identificó, cuya solución requiere el diseño e implementación de la aplicación móvil.
Nota: No hay ningún tipo de restricción acerca del contexto o el entorno

[st] 3. Identificación de los roles
Debe plantear qué roles participan o están involucrados en la problemática planteada.

[st] 4. Justificación
Debe argumentar por qué es pertinente el proyecto, cuál es la importancia de resolver el problema, qué oportunidades está aprovechando y de qué forma una aplicación móvil resuelve el problema planteado. Debe hacer énfasis en por qué una solución móvil es lo más adecuado a diferencia de otras soluciones digitales.

[st] 5. Funciones preliminares
Mencione brevemente en qué consiste la aplicación móvil que construirá como solución al problema planteado.
Exponga qué funciones o servicios tendrá a disposición cada uno de los roles identificados.
Si la aplicación sólo tiene un solo rol, debe dotar a este usuario de mínimo 2 funciones principales
Si la aplicación tiene dos roles, cada rol como mínimo debe tener una sola función principal.

[st] Reglas
[list]
La exposición de cada idea debe hacerse en 2 minutos (pitch elevator). En caso que su idea ya esté definida, puede utilizar 6 minutos en total para exponer su única idea.
El tiempo total de exposición es de 10 minutos, 6 minutos para la exposición y 4 minutos para responder preguntas.
No puede plantear la idea de `Cupos Icesi`.
Debe usar una presentación por diapositivas. Apoye su discurso usando algunas diapósitivas. Una imagen dice más que mil palabras.
[endlist]
.');

-- Inserting content for: lessonZ3
INSERT INTO lessons (slug, content) VALUES ('lessonZ3', E'[t] Planeador

[st] Semana 1 
`2 de febrero`
Presentación del curso
Reglas de juego
Presentación del material de apoyo
[link](Semana 1) https://docs.google.com/presentation/d/1N3-4slLFky8rR_Rg5DJf7-Y_g-xP46O5/edit?usp=sharing&ouid=117897710133227559254&rtpof=true&sd=true
Widgets comunes: Button, Text, TextField e Image
Introducción a los widgets stateless

Los estudiantes deben preparar la siguiente clase. Para eso deben:

[list]
Instalar el entorno de desarrollo de flutter
Hacer la primera aplicación 
Estudiar los Widgets básicos.
[endlist]

Para esto, revise y estudie los temas de la `SEMANA 1` en este material

Adicionalmente quedarán pendientes de buscar compañeros para hacer la creación de los equipos

[st] Semana 2
`9 de febrero`
Conformación de equipos
Reglas básicas de diagramación en Flutter
Stateful y Stateless Widgets
Row, Column, TextField, Button, Text, Scaffold, Images, ScrollView
`Laboratorio de diagramación de pantallas`
Consumir material sobre statefull widgets, estado y navegación

`...`

[st] Semana 5 
`2 de marzo`
Deberá presentar su `Pitch Elevator` para seleccionar la aplicación del semestre');

-- Inserting content for: lessonZ4
INSERT INTO lessons (slug, content) VALUES ('lessonZ4', E'[t] Proyecto final
`Transcurso del semestre`

Debe pensar en un problema de su entorno, que pueda ser solucionado a través de una aplicación móvil.

La solución del problema debe consistir en un servicio que se pueda prestar a través de la aplicación móvil, como por ejemplo un servicio de consultoría, de asesoría, de servicios técnicos, de apoyo emocial, de recreación, etc.

Como la aplicación móvil parte de un problema identificado, encuentre la necesidad que está supliendo y decida qué enfoque tendrá su aplicación.

[st] 1. Modelo Cliente - proveedor
[list]
Número mínimo de roles: 2 roles
Los clientes son quienes necesitan el servicio ofrecido por la aplicación.
Los proveedores son quienes pueden ofrecer el servicio.
Cada uno de los actores debe tener un perfil con paneles distintos que les permita usar funciones principales distintas:
A. El cliente puede enviar solicitudes de un servicio ofrecido por los proveedores inscritos en la aplicación.
B. El proveedor puede ver los servicios y atenderlos a través de la interacción con la publicación del cliente. A través de su interfaz puede enviar al solicitante una respuesta.
[endlist]

Por ejemplo, Uber en donde los proveedores serían los dueños de carros dispuestos a ofrecer un servicio de transporte a los usuarios de la plataforma y los clientes son las personas que necesitan el servicio de transporte.
Entonces el cliente solicita ser transportado a través de la aplicación (solicitud) y los proveedores pueden interactuar con la solicitud a través de la aplicación y atender el servicio (respuesta), de modo que tanto el cliente es retroalimentado sobre el resultado de su solicitud.

[st] 2. Modelo de comunidad
[list]
Número mínimo de roles: 1 rol
Cada integrante de la comunidad es capaz de realizar mínimo dos acciones principales usando una interfaz común para todos los miembros de la comunidad:
A. El usuario puede postear, reportar, alertar, generar contenido. Este contenido debe tener algún alcance mínimo de difusión de modo que otros usuarios pueda ver estas publicaciones. La visibilidad o acceso a las publicaciones se define bajo sus propias políticas.
B. La segunda función es poder ver e interactuar con las publicaciones de los demas usuarios de la comunidad. Al tratarse de una comunidad, estas interacciones deben tener la misma visibilidad que la publicación con la que se interactúa.
[endlist]

Por ejemplo Twitter, donde todos los usuarios pueden tuitear (publicación) y cualquiera ver el tuit e interactuar con él: comentar el tuit, retuitear, darle like. (interacción).

En cualquiera de los dos modelos, las dos funciones principales resumen en:
[list]
A. Hacer una publicación (solicitud, post, reporte, alerta, contenido, etc)
B. Interactuar con esa publicación (respuesta de la solicitud, interacción con la publicación)
[endlist]

[st] Requerimientos generales
[list]
A. La idea de aplicación debe resolver un problema identificado en su entorno, por ustedes, mediante un servicio que preste la aplicación.
B. El sistema puede tener dos roles (cliente y proveedor) o uno sólo (miembro de la comunidad). En ambos casos debe programar distintos procesos teniendo en cuenta que mínimo debe tener 2 funciones principales (publicación e interacción con la publicación).
C. En el caso de los dos roles debe preparar una única aplicación de modo que al momento de hacer Log In, de acuerdo al rol ingrese a las funciones de cada rol respectivamente. Cada rol tiene a disposición 1 función principal.
D. En el caso de la comunidad, la aplicación debe verse igual, pero debe poder ofrecerle al usuario dos funciones principales: una de publicación y una de interacción.
[endlist]

[st] Requerimientos técnicos
[list]
A. Debe usar una base de datos de Google Firebase para almacenar las solicitudes, las respuestas y los usuarios.
B. La aplicación tiene, como mínimo las siguientes pantallas:
1. Splash screen
2. Login
3. Registro
Cliente-proveedor: deben haber dos registros, uno para el cliente y otro para el proveedor
Comunidad: único registro para el usuario
4. Resumen del usuario donde debe aparecer su nombre, rol, descripción y calificación.
5. Pantalla publicación: donde el cliente puede llamar, postear, reportar, alertar, publicar.
Cliente-proveedor: es la pantalla donde el usuario puede solicitar un servicio.
Comunidad: es donde el usuario es capaz de generar una publicación.
6. Pantalla de interacción: donde el usaurio puede ver las publicaciones de los demás usaurios (feed de la aplicación) y le permite interactuar con estas publicaciones.
Cliente-proveedor: le permite ver las solicitudes de un usuario y atenderlas.
7. Sistema de notificaciones para avisar a los usuarios mínimos 2 eventos dentro de la aplicación. Por ejemplo: nueva publicación de un usuario de comunidad, nueva solicitud, nueva interacción, nuevo usuario.
[endlist]

Nota: estas vistas pueden componerse de varias actividades o fragmentos, según la complejidad de su propuesta.

Piense en tres ideas preliminares donde haya una justificación, una identificación de roles y el problema que resuelve. Debe presentar estas ideas en el `Pitch Elevator`. La guía de esta exposición se puede ver en esta misma sección de `Asignaciones`

.');

-- Inserting content for: toc
INSERT INTO lessons (slug, content) VALUES ('toc', E'[t] Curso
[lesson] lessonZ1.md
*[lesson] lessonZ3.md
[t] Asignaciones
[lesson] lessonZ2.md
[lesson] lessonZ4.md
[t] Dart basics
[lesson] lessonA1.md
[lesson] lessonA2.md
[lesson] lessonA3.md
[lesson] lessonA4.md
[lesson] lessonA5.md
[lesson] lessonA6.md
[lesson] lessonA7.md
[lesson] lessonA8.md
[t] Advanced Dart
[lesson] lessonB1.md
[lesson] lessonB2.md
[lesson] lessonB3.md
[lesson] lessonB4.md
[lesson] lessonB5.md
[lesson] lessonB6.md
[t] Flutter · SEMANA 1
[lesson] lessonC1.md
[lesson] lessonC2.md
[lesson] lessonC3.md
[lesson] lessonC4.md
[t] UI · SEMANA 1
[lesson] lessonD1.md
[lesson] lessonD2.md
[lesson] lessonD3.md
[lesson] lessonD5.md
[t] Widgets básicos · SEMANA 1
[lesson] lessonD4A.md
[lesson] lessonD4B.md
[lesson] lessonD4C.md
[lesson] lessonD4D.md
[t] UI Extras
[lesson] lessonD4E.md
[lesson] lessonD6.md
[t] Laboratorio 1
[lesson] lab1.md
[t] Navegación · SEMANA 2
[lesson] lessonE1.md
[lesson] lessonE2.md
[lesson] lessonE3.md
[t] Laboratorio 2
[lesson] lab2concepts.md
[lesson] lab2.md
[t] Render de Listas · SEMANA 3
[lesson] lessonF1.md
[lesson] lessonF2.md
[lesson] lessonF3.md
[lesson] lessonF4.md
[t] Laboratorio 3
[lesson] lab3concepts.md
[lesson] lab3.md
[t] BloC
[lesson] lessonG1.md
[lesson] lessonG2.md
[lesson] lessonG3.md
[t] Laboratorio 4
[lesson] lab4concepts.md
[lesson] lab4.md
[t] Supabase
[lesson] lessonX5.md
[t] Autenticación
[lesson] lessonH1.md
[lesson] lessonH15.md
[lesson] lessonH2.md
[lesson] lessonH5.md
[lesson] lessonH6.md
[t] Database
[lesson] lessonH4.md
[lesson] lessonH3.md
[lesson] lessonH7.md
[lesson] lessonH8.md
[t] Realtime
[lesson] lessonI1.md
[lesson] lessonI2.md
[lesson] lessonI3.md
[lesson] lessonH10.md
[t] Storage
[lesson] lessonJ1.md
[lesson] lessonJ2.md
[lesson] lessonJ3.md
[lesson] lessonJ4.md
[t] Google Maps
[lesson] lessonL0.md
[lesson] lessonL1.md
[lesson] lessonL2.md
[lesson] lessonL3.md
[t] Push notifications
[lesson] lessonK0.md
[lesson] lessonK1.md
[lesson] lessonK2.md
[lesson] lessonK3.md
[lesson] lessonK4.md
[t] Deploy
[lesson] lessonM1.md');
