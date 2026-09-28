# Laboratorio 4: Deezer ain't the best option

<!-- tags: SearchBloc, copyWith, entrega y recibe entre capas, SearchStatus, Track.fromJson, DeezerDataSource, SearchTracksUseCase, MusicRepositoryImpl, BlocProvider, Uri.encodeComponent, POST a Firebase, 'String' is not a subtype of 'int' -->

Todos en nuestro día a día usamos aplicaciones de música como YouTube, Spotify y Apple Music, pero nunca hemos oído que alguien recomiende `Deezer`. Aun así, tiene una API abierta —las demás exigen autenticación— que nos deja trabajar con datos reales en lugar de un mock. A Deezer nadie lo usa, todos lo programan.

En este laboratorio construyes un buscador de canciones con Clean Architecture y Bloc, capa por capa. La **Parte 1** es guiada: cada paso trae un gráfico con lo que esa capa **entrega** a la de abajo y lo que **recibe** de vuelta, una descripción de su trabajo y el código mínimo. La **Parte 2** —guardar canciones en *me gusta* y consultarlas— la construyes tú con las mismas piezas.

El estado de cada `Bloc` usa la estrategia de estado único con `copyWith` de *State Management Strategies*, y las capas son las de *Clean Architecture con BLoC*.

## Preparación

Crea un proyecto y agrega las dependencias:

```yaml
dependencies:
  flutter_bloc: ^9.1.1
  http: ^1.5.0
```

Si corres la app en web, la API de Deezer no envía los encabezados de CORS. Usa `https://i2thub.icesi.edu.co:5443/deezer` como base en lugar de `https://api.deezer.com`.

```plain
lib/
├── main.dart
└── features/search/
    ├── domain/  track.dart · music_repository.dart · search_tracks_usecase.dart
    ├── data/    deezer_data_source.dart · music_repository_impl.dart
    └── ui/      search_bloc.dart · search_screen.dart
```

En los bloques de código se omiten los `import`: el editor los sugiere.

## El mapa

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="615" viewBox="0 0 640 615" font-family="Roboto, Arial, sans-serif" style="display:block;margin:0 auto;max-width:100%;height:auto;">
  <defs>
    <marker id="l4map-e" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#FF7043"/></marker>
    <marker id="l4map-r" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#26A69A"/></marker>
    <marker id="l4map-g" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#9E9E9E"/></marker>
    <marker id="l4map-i" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#66BB6A"/></marker>
  </defs>
  <rect x="220" y="20" width="200" height="44" rx="8" fill="#FFA726"/>
  <text x="320" y="40" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">SearchScreen</text>
  <text x="320" y="55" text-anchor="middle" fill="#FFFFFF" font-size="10">Vista</text>
  <rect x="220" y="104" width="200" height="44" rx="8" fill="#42A5F5"/>
  <text x="320" y="124" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">SearchBloc</text>
  <text x="320" y="139" text-anchor="middle" fill="#FFFFFF" font-size="10">Bloc</text>
  <rect x="220" y="188" width="200" height="44" rx="8" fill="#66BB6A"/>
  <text x="320" y="208" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">SearchTracksUseCase</text>
  <text x="320" y="223" text-anchor="middle" fill="#FFFFFF" font-size="10">UseCase</text>
  <rect x="220" y="272" width="200" height="44" rx="8" fill="#66BB6A"/>
  <text x="320" y="292" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">MusicRepository</text>
  <text x="320" y="307" text-anchor="middle" fill="#FFFFFF" font-size="10">contrato</text>
  <rect x="220" y="356" width="200" height="44" rx="8" fill="#FFA726"/>
  <text x="320" y="376" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">MusicRepositoryImpl</text>
  <text x="320" y="391" text-anchor="middle" fill="#FFFFFF" font-size="10">implementación</text>
  <rect x="220" y="440" width="200" height="44" rx="8" fill="#FFA726"/>
  <text x="320" y="460" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">DeezerDataSource</text>
  <text x="320" y="475" text-anchor="middle" fill="#FFFFFF" font-size="10">DataSource</text>
  <ellipse cx="320" cy="546" rx="100" ry="22" fill="#AB47BC"/>
  <text x="320" y="551" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">api.deezer.com</text>
  <line x1="300" y1="67" x2="300" y2="101" stroke="#FF7043" stroke-width="2" marker-end="url(#l4map-e)"/>
  <line x1="340" y1="101" x2="340" y2="67" stroke="#26A69A" stroke-width="2" marker-end="url(#l4map-r)"/>
  <text x="292" y="88.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">SearchSubmitted(query)</tspan></text>
  <text x="348" y="88.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">SearchState</tspan></text>
  <line x1="300" y1="151" x2="300" y2="185" stroke="#FF7043" stroke-width="2" marker-end="url(#l4map-e)"/>
  <line x1="340" y1="185" x2="340" y2="151" stroke="#26A69A" stroke-width="2" marker-end="url(#l4map-r)"/>
  <text x="292" y="172.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">query</tspan></text>
  <text x="348" y="172.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">List&lt;Track&gt;</tspan></text>
  <line x1="300" y1="235" x2="300" y2="269" stroke="#FF7043" stroke-width="2" marker-end="url(#l4map-e)"/>
  <line x1="340" y1="269" x2="340" y2="235" stroke="#26A69A" stroke-width="2" marker-end="url(#l4map-r)"/>
  <text x="292" y="256.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">query</tspan></text>
  <text x="348" y="256.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">List&lt;Track&gt;</tspan></text>
  <line x1="320" y1="318" x2="320" y2="353" stroke="#66BB6A" stroke-width="2" stroke-dasharray="5,3" marker-end="url(#l4map-i)"/>
  <text x="330" y="340.0" fill="#66BB6A" font-size="10">implementado por</text>
  <line x1="300" y1="403" x2="300" y2="437" stroke="#FF7043" stroke-width="2" marker-end="url(#l4map-e)"/>
  <line x1="340" y1="437" x2="340" y2="403" stroke="#26A69A" stroke-width="2" marker-end="url(#l4map-r)"/>
  <text x="292" y="424.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">query</tspan></text>
  <text x="348" y="424.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">List&lt;Track&gt;</tspan></text>
  <line x1="300" y1="487" x2="300" y2="521" stroke="#FF7043" stroke-width="2" marker-end="url(#l4map-e)"/>
  <line x1="340" y1="521" x2="340" y2="487" stroke="#26A69A" stroke-width="2" marker-end="url(#l4map-r)"/>
  <text x="292" y="508.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">GET /search?q=…</tspan></text>
  <text x="348" y="508.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">JSON</tspan></text>
  <line x1="150" y1="597" x2="176" y2="597" stroke="#FF7043" stroke-width="2" marker-end="url(#l4map-e)"/>
  <text x="182" y="601" fill="#888" font-size="10">entrega a la capa de abajo</text>
  <line x1="350" y1="597" x2="376" y2="597" stroke="#26A69A" stroke-width="2" marker-end="url(#l4map-r)"/>
  <text x="382" y="601" fill="#888" font-size="10">recibe de la capa de abajo</text>
</svg>
```

Cada caja es una clase y cada paso construye una. Las flechas de la izquierda bajan: lo que una capa **entrega** a la de abajo. Las de la derecha suben: lo que **recibe** de vuelta. Los colores son los de *Clean Architecture con BLoC*: azul la aplicación, verde el dominio y naranja lo que toca el mundo exterior.

## Paso 1 · Track

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="150" viewBox="0 0 720 150" font-family="Roboto, Arial, sans-serif" style="display:block;margin:0 auto;max-width:100%;height:auto;">
  <defs><marker id="l4tr-a" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#888"/></marker></defs>
  <text x="115" y="32" text-anchor="middle" fill="#AB47BC" font-size="11" font-weight="bold">JSON de Deezer</text>
  <rect x="30" y="40" width="170" height="70" rx="8" fill="#AB47BC" fill-opacity="0.12" stroke="#AB47BC" stroke-opacity="0.6"/>
  <text x="38" y="64" fill="#888" font-size="9.5" font-family="monospace" style="white-space:pre">{ id, title,</text>
  <text x="38" y="80" fill="#888" font-size="9.5" font-family="monospace" style="white-space:pre">  artist: { name },</text>
  <text x="38" y="96" fill="#888" font-size="9.5" font-family="monospace" style="white-space:pre">  album: { cover_medium } }</text>
  <text x="229" y="66" text-anchor="middle" fill="#888" font-size="10" font-family="monospace">fromJson</text>
  <line x1="203" y1="75" x2="255" y2="75" stroke="#888" stroke-width="1.5" marker-end="url(#l4tr-a)"/>
  <rect x="260" y="15" width="200" height="120" rx="10" fill="#66BB6A" fill-opacity="0.10" stroke="#66BB6A"/>
  <rect x="260" y="15" width="200" height="30" rx="10" fill="#66BB6A"/>
  <rect x="260" y="35" width="200" height="10" fill="#66BB6A"/>
  <text x="360" y="35" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">Track</text>
  <text x="280" y="66" fill="#888" font-size="11" font-family="monospace">int id</text>
  <text x="280" y="84" fill="#888" font-size="11" font-family="monospace">String title</text>
  <text x="280" y="102" fill="#888" font-size="11" font-family="monospace">String artist</text>
  <text x="280" y="120" fill="#888" font-size="11" font-family="monospace">String albumCover</text>
  <text x="480" y="70" fill="#66BB6A" font-size="12" font-weight="bold">viaja entre capas</text>
  <text x="480" y="87" fill="#888" font-size="11">dentro de cada List&lt;Track&gt;</text>
</svg>
```

Es la entidad que viaja por todas las capas: cada `List<Track>` de las flechas es una lista de estos. `fromJson` convierte un resultado de Deezer en un `Track`, sacando el nombre del artista y la carátula de sus objetos anidados.

```dart
class Track {
  final int id;
  final String title;
  final String artist;
  final String albumCover;

  Track({required this.id, required this.title, required this.artist, required this.albumCover});

  factory Track.fromJson(Map<String, dynamic> json) => Track(
        id: json['id'],
        title: json['title'],
        artist: json['artist']['name'],
        albumCover: json['album']['cover_medium'],
      );
}
```

## Paso 2 · La vista

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="420" viewBox="0 0 720 420" font-family="Roboto, Arial, sans-serif" style="display:block;margin:0 auto;max-width:100%;height:auto;">
  <defs><clipPath id="l4v-screen"><rect x="0" y="0" width="240" height="380" rx="20"/></clipPath></defs>
  <g transform="translate(40,20)">
    <g clip-path="url(#l4v-screen)">
      <rect x="0" y="0" width="240" height="380" fill="#FFFFFF"/>
      <rect x="0" y="0" width="240" height="44" fill="#1976D2"/>
      <text x="16" y="28" fill="#FFFFFF" font-size="13" font-weight="bold">Buscar en Deezer</text>
      <rect x="12" y="56" width="216" height="36" rx="6" fill="#FFFFFF" stroke="#9E9E9E"/>
      <text x="22" y="79" fill="#9E9E9E" font-size="11">Artista o canción</text>
      <rect x="0" y="100" width="240" height="3" fill="#BBDEFB"/>
      <rect x="0" y="100" width="90" height="3" fill="#1976D2"/>
      <rect x="12" y="118" width="40" height="40" rx="4" fill="#8D6E63"/>
      <text x="62" y="136" fill="#212121" font-size="12">Bohemian Rhapsody</text>
      <text x="62" y="152" fill="#757575" font-size="10">Queen</text>
      <text x="214" y="144" fill="#EF5350" font-size="20">♡</text>
      <line x1="62" y1="163" x2="240" y2="163" stroke="#EEEEEE"/>
      <rect x="12" y="170" width="40" height="40" rx="4" fill="#EF5350"/>
      <text x="62" y="188" fill="#212121" font-size="12">Don&#x27;t Stop Me Now</text>
      <text x="62" y="204" fill="#757575" font-size="10">Queen</text>
      <text x="214" y="196" fill="#EF5350" font-size="20">♡</text>
      <line x1="62" y1="215" x2="240" y2="215" stroke="#EEEEEE"/>
      <rect x="12" y="222" width="40" height="40" rx="4" fill="#5C6BC0"/>
      <text x="62" y="240" fill="#212121" font-size="12">Under Pressure</text>
      <text x="62" y="256" fill="#757575" font-size="10">Queen</text>
      <text x="214" y="248" fill="#EF5350" font-size="20">♡</text>
      <line x1="62" y1="267" x2="240" y2="267" stroke="#EEEEEE"/>
      <rect x="12" y="274" width="40" height="40" rx="4" fill="#FFA726"/>
      <text x="62" y="292" fill="#212121" font-size="12">Somebody to Love</text>
      <text x="62" y="308" fill="#757575" font-size="10">Queen</text>
      <text x="214" y="300" fill="#EF5350" font-size="20">♡</text>
      <line x1="62" y1="319" x2="240" y2="319" stroke="#EEEEEE"/>
      <rect x="12" y="326" width="40" height="40" rx="4" fill="#26A69A"/>
      <text x="62" y="344" fill="#212121" font-size="12">Radio Ga Ga</text>
      <text x="62" y="360" fill="#757575" font-size="10">Queen</text>
      <text x="214" y="352" fill="#EF5350" font-size="20">♡</text>
    </g>
    <rect x="0" y="0" width="240" height="380" rx="20" fill="none" stroke="#9E9E9E"/>
  </g>
  <path d="M284,134 H292 V390 H284" fill="none" stroke="#888"/>
  <circle cx="286" cy="94" r="3" fill="#FFA726"/>
  <line x1="286" y1="94" x2="318" y2="94" stroke="#888" stroke-dasharray="3,3"/>
  <text x="326" y="90" fill="#FFA726" font-size="12" font-weight="bold">TextField</text>
  <text x="326" y="106" fill="#888" font-size="11">al enviar, lanza SearchSubmitted(query)</text>
  <circle cx="286" cy="121" r="3" fill="#FFA726"/>
  <line x1="286" y1="121" x2="318" y2="152" stroke="#888" stroke-dasharray="3,3"/>
  <text x="326" y="148" fill="#FFA726" font-size="12" font-weight="bold">LinearProgressIndicator</text>
  <text x="326" y="164" fill="#888" font-size="11">solo si status == loading</text>
  <circle cx="292" cy="230" r="3" fill="#FFA726"/>
  <line x1="292" y1="230" x2="318" y2="230" stroke="#888" stroke-dasharray="3,3"/>
  <text x="326" y="226" fill="#FFA726" font-size="12" font-weight="bold">ListView</text>
  <text x="326" y="242" fill="#888" font-size="11">dibuja state.tracks: carátula, título y artista</text>
  <circle cx="263" cy="313" r="3" fill="#FFA726"/>
  <line x1="263" y1="313" x2="318" y2="318" stroke="#888" stroke-dasharray="3,3"/>
  <text x="326" y="314" fill="#FFA726" font-size="12" font-weight="bold">♡ Me gusta</text>
  <text x="326" y="330" fill="#888" font-size="11">Parte 2: guarda la canción con POST</text>
</svg>
```

`SearchScreen` hace dos cosas y nada más: **entrega** el evento `SearchSubmitted` cuando el usuario envía el texto, y dibuja el `SearchState` que **recibe**. No decide nada: si hay barra de progreso, error o lista, es porque el estado lo dice.

- Un `TextField` que, al enviar, lanza `SearchSubmitted(query)`.
- Una `LinearProgressIndicator`, solo si `status` es `loading`.
- El mensaje de error, solo si `status` es `failure`.
- Un `ListView` con `state.tracks`: carátula, título y artista.

```dart
class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Buscar en Deezer')),
      body: Column(
        children: [
          TextField(
            controller: _controller,
            decoration: const InputDecoration(hintText: 'Artista o canción'),
            onSubmitted: (query) => context.read<SearchBloc>().add(SearchSubmitted(query)),
          ),
          Expanded(
            child: BlocBuilder<SearchBloc, SearchState>(
              builder: (context, state) => Column(
                children: [
                  if (state.status == SearchStatus.loading) const LinearProgressIndicator(),
                  if (state.status == SearchStatus.failure) Text(state.errorMessage ?? ''),
                  Expanded(
                    child: ListView(
                      children: [
                        for (final track in state.tracks)
                          ListTile(
                            leading: Image.network(track.albumCover),
                            title: Text(track.title),
                            subtitle: Text(track.artist),
                          ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
```

## Paso 3 · El Bloc

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="420" viewBox="0 0 720 420" font-family="Roboto, Arial, sans-serif" style="display:block;margin:0 auto;max-width:100%;height:auto;">
  <defs>
    <marker id="l4b-e" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#FF7043"/></marker>
    <marker id="l4b-r" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#26A69A"/></marker>
    <marker id="l4b-g" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#888"/></marker>
  </defs>
  <rect x="20" y="70" width="170" height="230" rx="14" fill="#FFA726" fill-opacity="0.08" stroke="#FFA726"/>
  <text x="105" y="96" text-anchor="middle" fill="#FFA726" font-size="14" font-weight="bold">SearchScreen</text>
  <text x="105" y="112" text-anchor="middle" fill="#888" font-size="10">Vista</text>
  <rect x="35" y="135" width="140" height="40" rx="8" fill="#FFA726" fill-opacity="0.18"/>
  <text x="105" y="160" text-anchor="middle" fill="#888" font-size="12">TextField</text>
  <rect x="35" y="230" width="140" height="40" rx="8" fill="#FFA726" fill-opacity="0.18"/>
  <text x="105" y="255" text-anchor="middle" fill="#888" font-size="12">BlocBuilder</text>

  <rect x="300" y="40" width="400" height="280" rx="16" fill="#42A5F5" fill-opacity="0.08" stroke="#42A5F5"/>
  <text x="500" y="66" text-anchor="middle" fill="#42A5F5" font-size="15" font-weight="bold">SearchBloc</text>

  <rect x="318" y="100" width="170" height="70" rx="10" fill="#FF7043" fill-opacity="0.12" stroke="#FF7043" stroke-opacity="0.6"/>
  <text x="403" y="122" text-anchor="middle" fill="#FF7043" font-size="12" font-weight="bold">Eventos</text>
  <text x="403" y="148" text-anchor="middle" fill="#888" font-size="10" font-family="monospace">SearchSubmitted(query)</text>

  <rect x="318" y="195" width="170" height="110" rx="10" fill="#26A69A" fill-opacity="0.12" stroke="#26A69A" stroke-opacity="0.6"/>
  <text x="403" y="217" text-anchor="middle" fill="#26A69A" font-size="12" font-weight="bold">Estado · SearchState</text>
  <text x="403" y="240" text-anchor="middle" fill="#888" font-size="10" font-family="monospace">status</text>
  <text x="403" y="256" text-anchor="middle" fill="#888" font-size="10" font-family="monospace">tracks</text>
  <text x="403" y="272" text-anchor="middle" fill="#888" font-size="10" font-family="monospace">errorMessage</text>
  <text x="403" y="292" text-anchor="middle" fill="#888" font-size="10" font-family="monospace">copyWith()</text>

  <rect x="510" y="100" width="175" height="205" rx="10" fill="#42A5F5" fill-opacity="0.15"/>
  <text x="597" y="122" text-anchor="middle" fill="#42A5F5" font-size="12" font-weight="bold" font-family="monospace">_onSubmitted</text>
  <text x="524" y="152" fill="#888" font-size="11">1 · emite loading</text>
  <text x="524" y="176" fill="#888" font-size="11">2 · pide al UseCase</text>
  <text x="524" y="200" fill="#888" font-size="11">3 · emite success</text>
  <text x="538" y="218" fill="#888" font-size="11">o failure</text>

  <line x1="490" y1="135" x2="507" y2="135" stroke="#888" stroke-width="1.5" marker-end="url(#l4b-g)"/>
  <line x1="508" y1="250" x2="491" y2="250" stroke="#888" stroke-width="1.5" marker-end="url(#l4b-g)"/>

  <line x1="177" y1="155" x2="315" y2="135" stroke="#FF7043" stroke-width="2.5" marker-end="url(#l4b-e)"/>
  <text x="245" y="128" text-anchor="middle" fill="#FF7043" font-size="10" font-weight="bold">entrega el evento</text>
  <line x1="316" y1="250" x2="179" y2="250" stroke="#26A69A" stroke-width="2.5" marker-end="url(#l4b-r)"/>
  <text x="245" y="270" text-anchor="middle" fill="#26A69A" font-size="10" font-weight="bold">recibe el estado</text>

  <line x1="580" y1="307" x2="580" y2="355" stroke="#FF7043" stroke-width="2" marker-end="url(#l4b-e)"/>
  <line x1="610" y1="356" x2="610" y2="309" stroke="#26A69A" stroke-width="2" marker-end="url(#l4b-r)"/>
  <text x="572" y="336" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-weight="bold">query</tspan></text>
  <text x="572" y="351" text-anchor="end" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-weight="bold">List&lt;Track&gt;</tspan></text>
  <rect x="505" y="360" width="180" height="44" rx="8" fill="#66BB6A" fill-opacity="0.15" stroke="#66BB6A"/>
  <text x="595" y="387" text-anchor="middle" fill="#66BB6A" font-size="12" font-weight="bold">SearchTracksUseCase</text>
</svg>
```

El `Bloc` es el único que decide. **Recibe** el evento de la vista, le **entrega** el `query` al `UseCase`, **recibe** la lista y le **entrega** estados a la vista: primero `loading`, después `success` con las canciones o `failure` con el mensaje. Como el estado es una sola clase con `copyWith`, la lista anterior sigue en pantalla mientras carga la nueva.

```dart
abstract class SearchEvent {}

class SearchSubmitted extends SearchEvent {
  final String query;

  SearchSubmitted(this.query);
}

enum SearchStatus { initial, loading, success, failure }

class SearchState {
  final SearchStatus status;
  final List<Track> tracks;
  final String? errorMessage;

  const SearchState({this.status = SearchStatus.initial, this.tracks = const [], this.errorMessage});

  SearchState copyWith({SearchStatus? status, List<Track>? tracks, String? errorMessage}) {
    return SearchState(
      status: status ?? this.status,
      tracks: tracks ?? this.tracks,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}
```

```dart
class SearchBloc extends Bloc<SearchEvent, SearchState> {
  final SearchTracksUseCase _searchTracks;

  SearchBloc(this._searchTracks) : super(const SearchState()) {
    on<SearchSubmitted>(_onSubmitted);
  }

  Future<void> _onSubmitted(SearchSubmitted event, Emitter<SearchState> emit) async {
    emit(state.copyWith(status: SearchStatus.loading));
    try {
      final tracks = await _searchTracks(event.query);
      emit(state.copyWith(status: SearchStatus.success, tracks: tracks));
    } on Exception catch (e) {
      emit(state.copyWith(status: SearchStatus.failure, errorMessage: e.toString()));
    }
  }
}
```

## Paso 4 · El dominio: contrato y UseCase

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="615" viewBox="0 0 640 615" font-family="Roboto, Arial, sans-serif" style="display:block;margin:0 auto;max-width:100%;height:auto;">
  <defs>
    <marker id="l4dom-e" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#FF7043"/></marker>
    <marker id="l4dom-r" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#26A69A"/></marker>
    <marker id="l4dom-g" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#9E9E9E"/></marker>
    <marker id="l4dom-i" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#66BB6A"/></marker>
  </defs>
  <rect x="220" y="20" width="200" height="44" rx="8" fill="#FFA726" fill-opacity="0.08" stroke="#FFA726" stroke-opacity="0.5"/>
  <text x="320" y="40" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">SearchScreen</text>
  <text x="320" y="55" text-anchor="middle" fill="#888" font-size="10">Vista</text>
  <rect x="220" y="104" width="200" height="44" rx="8" fill="#42A5F5" fill-opacity="0.08" stroke="#42A5F5" stroke-opacity="0.5"/>
  <text x="320" y="124" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">SearchBloc</text>
  <text x="320" y="139" text-anchor="middle" fill="#888" font-size="10">Bloc</text>
  <rect x="220" y="188" width="200" height="44" rx="8" fill="#66BB6A"/>
  <text x="320" y="208" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">SearchTracksUseCase</text>
  <text x="320" y="223" text-anchor="middle" fill="#FFFFFF" font-size="10">UseCase</text>
  <rect x="220" y="272" width="200" height="44" rx="8" fill="#66BB6A"/>
  <text x="320" y="292" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">MusicRepository</text>
  <text x="320" y="307" text-anchor="middle" fill="#FFFFFF" font-size="10">contrato</text>
  <rect x="220" y="356" width="200" height="44" rx="8" fill="#FFA726" fill-opacity="0.08" stroke="#FFA726" stroke-opacity="0.5"/>
  <text x="320" y="376" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">MusicRepositoryImpl</text>
  <text x="320" y="391" text-anchor="middle" fill="#888" font-size="10">implementación</text>
  <rect x="220" y="440" width="200" height="44" rx="8" fill="#FFA726" fill-opacity="0.08" stroke="#FFA726" stroke-opacity="0.5"/>
  <text x="320" y="460" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">DeezerDataSource</text>
  <text x="320" y="475" text-anchor="middle" fill="#888" font-size="10">DataSource</text>
  <ellipse cx="320" cy="546" rx="100" ry="22" fill="#AB47BC" fill-opacity="0.08" stroke="#AB47BC" stroke-opacity="0.5"/>
  <text x="320" y="551" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">api.deezer.com</text>
  <line x1="300" y1="67" x2="300" y2="101" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4dom-g)" opacity="0.6"/>
  <line x1="340" y1="101" x2="340" y2="67" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4dom-g)" opacity="0.6"/>
  <text x="292" y="88.0" text-anchor="end" font-size="10" opacity="0.6"><tspan fill="#888">entrega </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">SearchSubmitted(query)</tspan></text>
  <text x="348" y="88.0" font-size="10" opacity="0.6"><tspan fill="#888">recibe </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">SearchState</tspan></text>
  <line x1="300" y1="151" x2="300" y2="185" stroke="#FF7043" stroke-width="2" marker-end="url(#l4dom-e)"/>
  <line x1="340" y1="185" x2="340" y2="151" stroke="#26A69A" stroke-width="2" marker-end="url(#l4dom-r)"/>
  <text x="292" y="172.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">query</tspan></text>
  <text x="348" y="172.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">List&lt;Track&gt;</tspan></text>
  <line x1="300" y1="235" x2="300" y2="269" stroke="#FF7043" stroke-width="2" marker-end="url(#l4dom-e)"/>
  <line x1="340" y1="269" x2="340" y2="235" stroke="#26A69A" stroke-width="2" marker-end="url(#l4dom-r)"/>
  <text x="292" y="256.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">query</tspan></text>
  <text x="348" y="256.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">List&lt;Track&gt;</tspan></text>
  <line x1="320" y1="318" x2="320" y2="353" stroke="#9E9E9E" stroke-width="2" stroke-dasharray="5,3" marker-end="url(#l4dom-g)"/>
  <text x="330" y="340.0" fill="#888" font-size="10">implementado por</text>
  <line x1="300" y1="403" x2="300" y2="437" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4dom-g)" opacity="0.6"/>
  <line x1="340" y1="437" x2="340" y2="403" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4dom-g)" opacity="0.6"/>
  <text x="292" y="424.0" text-anchor="end" font-size="10" opacity="0.6"><tspan fill="#888">entrega </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">query</tspan></text>
  <text x="348" y="424.0" font-size="10" opacity="0.6"><tspan fill="#888">recibe </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">List&lt;Track&gt;</tspan></text>
  <line x1="300" y1="487" x2="300" y2="521" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4dom-g)" opacity="0.6"/>
  <line x1="340" y1="521" x2="340" y2="487" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4dom-g)" opacity="0.6"/>
  <text x="292" y="508.0" text-anchor="end" font-size="10" opacity="0.6"><tspan fill="#888">entrega </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">GET /search?q=…</tspan></text>
  <text x="348" y="508.0" font-size="10" opacity="0.6"><tspan fill="#888">recibe </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">JSON</tspan></text>
  <line x1="150" y1="597" x2="176" y2="597" stroke="#FF7043" stroke-width="2" marker-end="url(#l4dom-e)"/>
  <text x="182" y="601" fill="#888" font-size="10">entrega a la capa de abajo</text>
  <line x1="350" y1="597" x2="376" y2="597" stroke="#26A69A" stroke-width="2" marker-end="url(#l4dom-r)"/>
  <text x="382" y="601" fill="#888" font-size="10">recibe de la capa de abajo</text>
</svg>
```

El `UseCase` **recibe** el `query` del `Bloc` y se lo **entrega** al contrato `MusicRepository`. El contrato solo dice *qué* se puede pedir: no sabe de dónde salen las canciones. Ninguna de las dos clases importa Flutter ni `http`.

```dart
abstract class MusicRepository {
  Future<List<Track>> searchTracks(String query);
}

class SearchTracksUseCase {
  final MusicRepository _repository;

  SearchTracksUseCase(this._repository);

  Future<List<Track>> call(String query) => _repository.searchTracks(query);
}
```

`call` permite usar el `UseCase` como si fuera una función: por eso el `Bloc` escribe `_searchTracks(event.query)`.

## Paso 5 · El DataSource

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="615" viewBox="0 0 640 615" font-family="Roboto, Arial, sans-serif" style="display:block;margin:0 auto;max-width:100%;height:auto;">
  <defs>
    <marker id="l4ds-e" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#FF7043"/></marker>
    <marker id="l4ds-r" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#26A69A"/></marker>
    <marker id="l4ds-g" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#9E9E9E"/></marker>
    <marker id="l4ds-i" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#66BB6A"/></marker>
  </defs>
  <rect x="220" y="20" width="200" height="44" rx="8" fill="#FFA726" fill-opacity="0.08" stroke="#FFA726" stroke-opacity="0.5"/>
  <text x="320" y="40" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">SearchScreen</text>
  <text x="320" y="55" text-anchor="middle" fill="#888" font-size="10">Vista</text>
  <rect x="220" y="104" width="200" height="44" rx="8" fill="#42A5F5" fill-opacity="0.08" stroke="#42A5F5" stroke-opacity="0.5"/>
  <text x="320" y="124" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">SearchBloc</text>
  <text x="320" y="139" text-anchor="middle" fill="#888" font-size="10">Bloc</text>
  <rect x="220" y="188" width="200" height="44" rx="8" fill="#66BB6A" fill-opacity="0.08" stroke="#66BB6A" stroke-opacity="0.5"/>
  <text x="320" y="208" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">SearchTracksUseCase</text>
  <text x="320" y="223" text-anchor="middle" fill="#888" font-size="10">UseCase</text>
  <rect x="220" y="272" width="200" height="44" rx="8" fill="#66BB6A" fill-opacity="0.08" stroke="#66BB6A" stroke-opacity="0.5"/>
  <text x="320" y="292" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">MusicRepository</text>
  <text x="320" y="307" text-anchor="middle" fill="#888" font-size="10">contrato</text>
  <rect x="220" y="356" width="200" height="44" rx="8" fill="#FFA726" fill-opacity="0.08" stroke="#FFA726" stroke-opacity="0.5"/>
  <text x="320" y="376" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">MusicRepositoryImpl</text>
  <text x="320" y="391" text-anchor="middle" fill="#888" font-size="10">implementación</text>
  <rect x="220" y="440" width="200" height="44" rx="8" fill="#FFA726"/>
  <text x="320" y="460" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">DeezerDataSource</text>
  <text x="320" y="475" text-anchor="middle" fill="#FFFFFF" font-size="10">DataSource</text>
  <ellipse cx="320" cy="546" rx="100" ry="22" fill="#AB47BC"/>
  <text x="320" y="551" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">api.deezer.com</text>
  <line x1="300" y1="67" x2="300" y2="101" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4ds-g)" opacity="0.6"/>
  <line x1="340" y1="101" x2="340" y2="67" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4ds-g)" opacity="0.6"/>
  <text x="292" y="88.0" text-anchor="end" font-size="10" opacity="0.6"><tspan fill="#888">entrega </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">SearchSubmitted(query)</tspan></text>
  <text x="348" y="88.0" font-size="10" opacity="0.6"><tspan fill="#888">recibe </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">SearchState</tspan></text>
  <line x1="300" y1="151" x2="300" y2="185" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4ds-g)" opacity="0.6"/>
  <line x1="340" y1="185" x2="340" y2="151" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4ds-g)" opacity="0.6"/>
  <text x="292" y="172.0" text-anchor="end" font-size="10" opacity="0.6"><tspan fill="#888">entrega </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">query</tspan></text>
  <text x="348" y="172.0" font-size="10" opacity="0.6"><tspan fill="#888">recibe </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">List&lt;Track&gt;</tspan></text>
  <line x1="300" y1="235" x2="300" y2="269" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4ds-g)" opacity="0.6"/>
  <line x1="340" y1="269" x2="340" y2="235" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4ds-g)" opacity="0.6"/>
  <text x="292" y="256.0" text-anchor="end" font-size="10" opacity="0.6"><tspan fill="#888">entrega </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">query</tspan></text>
  <text x="348" y="256.0" font-size="10" opacity="0.6"><tspan fill="#888">recibe </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">List&lt;Track&gt;</tspan></text>
  <line x1="320" y1="318" x2="320" y2="353" stroke="#9E9E9E" stroke-width="2" stroke-dasharray="5,3" marker-end="url(#l4ds-g)"/>
  <text x="330" y="340.0" fill="#888" font-size="10">implementado por</text>
  <line x1="300" y1="403" x2="300" y2="437" stroke="#FF7043" stroke-width="2" marker-end="url(#l4ds-e)"/>
  <line x1="340" y1="437" x2="340" y2="403" stroke="#26A69A" stroke-width="2" marker-end="url(#l4ds-r)"/>
  <text x="292" y="424.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">query</tspan></text>
  <text x="348" y="424.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">List&lt;Track&gt;</tspan></text>
  <line x1="300" y1="487" x2="300" y2="521" stroke="#FF7043" stroke-width="2" marker-end="url(#l4ds-e)"/>
  <line x1="340" y1="521" x2="340" y2="487" stroke="#26A69A" stroke-width="2" marker-end="url(#l4ds-r)"/>
  <text x="292" y="508.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">GET /search?q=…</tspan></text>
  <text x="348" y="508.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">JSON</tspan></text>
  <line x1="150" y1="597" x2="176" y2="597" stroke="#FF7043" stroke-width="2" marker-end="url(#l4ds-e)"/>
  <text x="182" y="601" fill="#888" font-size="10">entrega a la capa de abajo</text>
  <line x1="350" y1="597" x2="376" y2="597" stroke="#26A69A" stroke-width="2" marker-end="url(#l4ds-r)"/>
  <text x="382" y="601" fill="#888" font-size="10">recibe de la capa de abajo</text>
</svg>
```

Es la única clase que sabe que existe HTTP. **Recibe** el `query`, le **entrega** a Deezer un `GET`, **recibe** el JSON y lo convierte en `Track`s. `Uri.encodeComponent` evita que espacios o símbolos como `&` rompan la búsqueda.

```dart
class DeezerDataSource {
  Future<List<Track>> searchTracks(String query) async {
    final url = Uri.parse('https://api.deezer.com/search?q=${Uri.encodeComponent(query)}');
    final response = await http.get(url);
    if (response.statusCode != 200) throw Exception('Error ${response.statusCode}');
    final data = jsonDecode(response.body)['data'] as List;
    return data.map((json) => Track.fromJson(json)).toList();
  }
}
```

## Paso 6 · El RepositoryImpl

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="615" viewBox="0 0 640 615" font-family="Roboto, Arial, sans-serif" style="display:block;margin:0 auto;max-width:100%;height:auto;">
  <defs>
    <marker id="l4imp-e" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#FF7043"/></marker>
    <marker id="l4imp-r" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#26A69A"/></marker>
    <marker id="l4imp-g" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#9E9E9E"/></marker>
    <marker id="l4imp-i" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#66BB6A"/></marker>
  </defs>
  <rect x="220" y="20" width="200" height="44" rx="8" fill="#FFA726" fill-opacity="0.08" stroke="#FFA726" stroke-opacity="0.5"/>
  <text x="320" y="40" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">SearchScreen</text>
  <text x="320" y="55" text-anchor="middle" fill="#888" font-size="10">Vista</text>
  <rect x="220" y="104" width="200" height="44" rx="8" fill="#42A5F5" fill-opacity="0.08" stroke="#42A5F5" stroke-opacity="0.5"/>
  <text x="320" y="124" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">SearchBloc</text>
  <text x="320" y="139" text-anchor="middle" fill="#888" font-size="10">Bloc</text>
  <rect x="220" y="188" width="200" height="44" rx="8" fill="#66BB6A" fill-opacity="0.08" stroke="#66BB6A" stroke-opacity="0.5"/>
  <text x="320" y="208" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">SearchTracksUseCase</text>
  <text x="320" y="223" text-anchor="middle" fill="#888" font-size="10">UseCase</text>
  <rect x="220" y="272" width="200" height="44" rx="8" fill="#66BB6A" fill-opacity="0.08" stroke="#66BB6A" stroke-opacity="0.5"/>
  <text x="320" y="292" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">MusicRepository</text>
  <text x="320" y="307" text-anchor="middle" fill="#888" font-size="10">contrato</text>
  <rect x="220" y="356" width="200" height="44" rx="8" fill="#FFA726"/>
  <text x="320" y="376" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">MusicRepositoryImpl</text>
  <text x="320" y="391" text-anchor="middle" fill="#FFFFFF" font-size="10">implementación</text>
  <rect x="220" y="440" width="200" height="44" rx="8" fill="#FFA726" fill-opacity="0.08" stroke="#FFA726" stroke-opacity="0.5"/>
  <text x="320" y="460" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">DeezerDataSource</text>
  <text x="320" y="475" text-anchor="middle" fill="#888" font-size="10">DataSource</text>
  <ellipse cx="320" cy="546" rx="100" ry="22" fill="#AB47BC" fill-opacity="0.08" stroke="#AB47BC" stroke-opacity="0.5"/>
  <text x="320" y="551" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">api.deezer.com</text>
  <line x1="300" y1="67" x2="300" y2="101" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4imp-g)" opacity="0.6"/>
  <line x1="340" y1="101" x2="340" y2="67" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4imp-g)" opacity="0.6"/>
  <text x="292" y="88.0" text-anchor="end" font-size="10" opacity="0.6"><tspan fill="#888">entrega </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">SearchSubmitted(query)</tspan></text>
  <text x="348" y="88.0" font-size="10" opacity="0.6"><tspan fill="#888">recibe </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">SearchState</tspan></text>
  <line x1="300" y1="151" x2="300" y2="185" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4imp-g)" opacity="0.6"/>
  <line x1="340" y1="185" x2="340" y2="151" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4imp-g)" opacity="0.6"/>
  <text x="292" y="172.0" text-anchor="end" font-size="10" opacity="0.6"><tspan fill="#888">entrega </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">query</tspan></text>
  <text x="348" y="172.0" font-size="10" opacity="0.6"><tspan fill="#888">recibe </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">List&lt;Track&gt;</tspan></text>
  <line x1="300" y1="235" x2="300" y2="269" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4imp-g)" opacity="0.6"/>
  <line x1="340" y1="269" x2="340" y2="235" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4imp-g)" opacity="0.6"/>
  <text x="292" y="256.0" text-anchor="end" font-size="10" opacity="0.6"><tspan fill="#888">entrega </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">query</tspan></text>
  <text x="348" y="256.0" font-size="10" opacity="0.6"><tspan fill="#888">recibe </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">List&lt;Track&gt;</tspan></text>
  <line x1="320" y1="318" x2="320" y2="353" stroke="#66BB6A" stroke-width="2" stroke-dasharray="5,3" marker-end="url(#l4imp-i)"/>
  <text x="330" y="340.0" fill="#66BB6A" font-size="10">implementado por</text>
  <line x1="300" y1="403" x2="300" y2="437" stroke="#FF7043" stroke-width="2" marker-end="url(#l4imp-e)"/>
  <line x1="340" y1="437" x2="340" y2="403" stroke="#26A69A" stroke-width="2" marker-end="url(#l4imp-r)"/>
  <text x="292" y="424.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">query</tspan></text>
  <text x="348" y="424.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">List&lt;Track&gt;</tspan></text>
  <line x1="300" y1="487" x2="300" y2="521" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4imp-g)" opacity="0.6"/>
  <line x1="340" y1="521" x2="340" y2="487" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4imp-g)" opacity="0.6"/>
  <text x="292" y="508.0" text-anchor="end" font-size="10" opacity="0.6"><tspan fill="#888">entrega </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">GET /search?q=…</tspan></text>
  <text x="348" y="508.0" font-size="10" opacity="0.6"><tspan fill="#888">recibe </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">JSON</tspan></text>
  <line x1="150" y1="597" x2="176" y2="597" stroke="#FF7043" stroke-width="2" marker-end="url(#l4imp-e)"/>
  <text x="182" y="601" fill="#888" font-size="10">entrega a la capa de abajo</text>
  <line x1="350" y1="597" x2="376" y2="597" stroke="#26A69A" stroke-width="2" marker-end="url(#l4imp-r)"/>
  <text x="382" y="601" fill="#888" font-size="10">recibe de la capa de abajo</text>
</svg>
```

Cumple el contrato del dominio delegando en el `DataSource`. Es el lugar donde, más adelante, se podría combinar Deezer con una caché sin que el `UseCase` se entere.

```dart
class MusicRepositoryImpl implements MusicRepository {
  final DeezerDataSource _dataSource;

  MusicRepositoryImpl(this._dataSource);

  @override
  Future<List<Track>> searchTracks(String query) => _dataSource.searchTracks(query);
}
```

## Paso 7 · Ensamblar

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="250" viewBox="0 0 720 250" font-family="Roboto, Arial, sans-serif" style="display:block;margin:0 auto;max-width:100%;height:auto;">
  <rect x="100" y="10" width="520" height="230" rx="14" fill="#9E9E9E" fill-opacity="0.08" stroke="#9E9E9E"/>
  <text x="116" y="32" fill="#888" font-size="12" font-weight="bold" font-family="monospace">BlocProvider(create: …)</text>
  <rect x="122" y="44" width="476" height="184" rx="12" fill="#42A5F5" fill-opacity="0.10" stroke="#42A5F5"/>
  <text x="138" y="66" fill="#42A5F5" font-size="12" font-weight="bold" font-family="monospace">SearchBloc(</text>
  <rect x="144" y="78" width="432" height="138" rx="10" fill="#66BB6A" fill-opacity="0.10" stroke="#66BB6A"/>
  <text x="160" y="100" fill="#66BB6A" font-size="12" font-weight="bold" font-family="monospace">SearchTracksUseCase(</text>
  <rect x="166" y="112" width="388" height="92" rx="8" fill="#FFA726" fill-opacity="0.10" stroke="#FFA726"/>
  <text x="182" y="134" fill="#FFA726" font-size="12" font-weight="bold" font-family="monospace">MusicRepositoryImpl(</text>
  <rect x="188" y="146" width="344" height="46" rx="6" fill="#FFA726" fill-opacity="0.22" stroke="#FFA726"/>
  <text x="360" y="174" text-anchor="middle" fill="#FFA726" font-size="12" font-weight="bold" font-family="monospace">DeezerDataSource()</text>
</svg>
```

Ninguna capa crea a la de abajo. Se construyen de adentro hacia afuera en un solo lugar, el `create` del `BlocProvider`, y cada una recibe la siguiente por constructor:

```dart
void main() {
  runApp(
    MaterialApp(
      routes: {
        '/': (_) => BlocProvider(
              create: (_) => SearchBloc(SearchTracksUseCase(MusicRepositoryImpl(DeezerDataSource()))),
              child: const SearchScreen(),
            ),
      },
    ),
  );
}
```

Con esto la Parte 1 corre: escribe un artista, envía, y aparecen sus canciones.

## Parte 2 · Me gusta

Ahora es tu turno. Cada canción de la lista lleva un ♡: al tocarlo, la canción se guarda. Una segunda pantalla, `LikedSongsScreen`, muestra las guardadas. Guardar recorre las mismas capas que buscar:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="615" viewBox="0 0 640 615" font-family="Roboto, Arial, sans-serif" style="display:block;margin:0 auto;max-width:100%;height:auto;">
  <defs>
    <marker id="l4like-e" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#FF7043"/></marker>
    <marker id="l4like-r" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#26A69A"/></marker>
    <marker id="l4like-g" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#9E9E9E"/></marker>
    <marker id="l4like-i" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#66BB6A"/></marker>
  </defs>
  <rect x="220" y="20" width="200" height="44" rx="8" fill="#FFA726"/>
  <text x="320" y="40" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">SearchScreen</text>
  <text x="320" y="55" text-anchor="middle" fill="#FFFFFF" font-size="10">Vista · el ♡</text>
  <rect x="220" y="104" width="200" height="44" rx="8" fill="#42A5F5"/>
  <text x="320" y="124" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">SearchBloc</text>
  <text x="320" y="139" text-anchor="middle" fill="#FFFFFF" font-size="10">Bloc</text>
  <rect x="220" y="188" width="200" height="44" rx="8" fill="#66BB6A"/>
  <text x="320" y="208" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">LikeTrackUseCase</text>
  <text x="320" y="223" text-anchor="middle" fill="#FFFFFF" font-size="10">UseCase</text>
  <rect x="220" y="272" width="200" height="44" rx="8" fill="#66BB6A"/>
  <text x="320" y="292" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">MusicRepository</text>
  <text x="320" y="307" text-anchor="middle" fill="#FFFFFF" font-size="10">contrato</text>
  <rect x="220" y="356" width="200" height="44" rx="8" fill="#FFA726"/>
  <text x="320" y="376" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">MusicRepositoryImpl</text>
  <text x="320" y="391" text-anchor="middle" fill="#FFFFFF" font-size="10">implementación</text>
  <rect x="220" y="440" width="200" height="44" rx="8" fill="#FFA726"/>
  <text x="320" y="460" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">LikesDataSource</text>
  <text x="320" y="475" text-anchor="middle" fill="#FFFFFF" font-size="10">DataSource</text>
  <ellipse cx="320" cy="546" rx="100" ry="22" fill="#AB47BC"/>
  <text x="320" y="551" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">firebaseio.com</text>
  <line x1="300" y1="67" x2="300" y2="101" stroke="#FF7043" stroke-width="2" marker-end="url(#l4like-e)"/>
  <line x1="340" y1="101" x2="340" y2="67" stroke="#26A69A" stroke-width="2" marker-end="url(#l4like-r)"/>
  <text x="292" y="88.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">TrackLiked(track)</tspan></text>
  <text x="348" y="88.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">SearchState</tspan></text>
  <line x1="300" y1="151" x2="300" y2="185" stroke="#FF7043" stroke-width="2" marker-end="url(#l4like-e)"/>
  <line x1="340" y1="185" x2="340" y2="151" stroke="#26A69A" stroke-width="2" marker-end="url(#l4like-r)"/>
  <text x="292" y="172.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">track</tspan></text>
  <text x="348" y="172.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">Future&lt;void&gt;</tspan></text>
  <line x1="300" y1="235" x2="300" y2="269" stroke="#FF7043" stroke-width="2" marker-end="url(#l4like-e)"/>
  <line x1="340" y1="269" x2="340" y2="235" stroke="#26A69A" stroke-width="2" marker-end="url(#l4like-r)"/>
  <text x="292" y="256.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">track</tspan></text>
  <text x="348" y="256.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">Future&lt;void&gt;</tspan></text>
  <line x1="320" y1="318" x2="320" y2="353" stroke="#66BB6A" stroke-width="2" stroke-dasharray="5,3" marker-end="url(#l4like-i)"/>
  <text x="330" y="340.0" fill="#66BB6A" font-size="10">implementado por</text>
  <line x1="300" y1="403" x2="300" y2="437" stroke="#FF7043" stroke-width="2" marker-end="url(#l4like-e)"/>
  <line x1="340" y1="437" x2="340" y2="403" stroke="#26A69A" stroke-width="2" marker-end="url(#l4like-r)"/>
  <text x="292" y="424.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">track</tspan></text>
  <text x="348" y="424.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">Future&lt;void&gt;</tspan></text>
  <line x1="300" y1="487" x2="300" y2="521" stroke="#FF7043" stroke-width="2" marker-end="url(#l4like-e)"/>
  <line x1="340" y1="521" x2="340" y2="487" stroke="#26A69A" stroke-width="2" marker-end="url(#l4like-r)"/>
  <text x="292" y="508.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">POST track.toJson()</tspan></text>
  <text x="348" y="508.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">200 OK</tspan></text>
  <line x1="150" y1="597" x2="176" y2="597" stroke="#FF7043" stroke-width="2" marker-end="url(#l4like-e)"/>
  <text x="182" y="601" fill="#888" font-size="10">entrega a la capa de abajo</text>
  <line x1="350" y1="597" x2="376" y2="597" stroke="#26A69A" stroke-width="2" marker-end="url(#l4like-r)"/>
  <text x="382" y="601" fill="#888" font-size="10">recibe de la capa de abajo</text>
</svg>
```

Qué agregar en cada capa:

| Capa | Qué agregar |
|---|---|
| Vista | Un `IconButton` ♡ en cada `ListTile` que lanza `TrackLiked(track)`. Un botón en el `AppBar` que navega a `/liked`, y la ruta `/liked` con su propio `BlocProvider` y `LikedSongsScreen` |
| Bloc | El evento `TrackLiked` en `SearchBloc`. Un `LikedBloc` con un evento para cargar los me gusta y su estado con `copyWith` |
| Dominio | `likeTrack(Track)` y `getLikedTracks()` en `MusicRepository`, y un `UseCase` para cada uno |
| Datos | Un `LikesDataSource` con el `POST` y el `GET`. `MusicRepositoryImpl` recibe los dos `DataSource` |

Los me gusta se guardan en Firebase, en esta URL. Cambia `miusername` por tu usuario:

```plain
https://facelogprueba.firebaseio.com/playlist/miusername.json
```

Guardar es un `POST` con el `Track` en JSON. Cada `POST` agrega un hijo con una llave generada por Firebase:

```dart
await http.post(Uri.parse(_likesUrl), body: jsonEncode(track.toJson()));
```

Leer es un `GET` a la misma URL. La respuesta no es una lista: es un `Map` cuyas llaves son las de Firebase, o `null` si aún no hay canciones:

```json
{
  "-OaBc123": { "id": 3135556, "title": "Bohemian Rhapsody", "artist": "Queen", "albumCover": "https://..." }
}
```

Lo guardado es plano: `artist` es un texto, no el objeto de Deezer, así que `Track.fromJson` fallaría con `type 'String' is not a subtype of type 'int' of 'index'`. Agrega a `Track` un `toJson` y un segundo factory para lo guardado, y recorre solo los valores del `Map`:

```dart
Map<String, dynamic> toJson() => {'id': id, 'title': title, 'artist': artist, 'albumCover': albumCover};

factory Track.fromLikedJson(Map<String, dynamic> json) => Track(
      id: json['id'],
      title: json['title'],
      artist: json['artist'],
      albumCover: json['albumCover'],
    );
```

```dart
final data = jsonDecode(response.body) as Map<String, dynamic>?;
return (data ?? {}).values.map((json) => Track.fromLikedJson(json)).toList();
```

## Criterios de entrega

- `SearchScreen` busca y muestra carátula, título y artista, con barra de progreso mientras carga y el mensaje si falla.
- El estado de cada `Bloc` es una sola clase con `status` y `copyWith`.
- Cada canción tiene un ♡ que la guarda con `POST`.
- `LikedSongsScreen` consulta con `GET` y muestra las canciones guardadas.
- Las capas están separadas: la vista solo habla con el `Bloc`, el `Bloc` con los `UseCase`, los `UseCase` con el contrato, y solo los `DataSource` usan `http`.
- Todo se ensambla en el `create` de cada `BlocProvider`.
