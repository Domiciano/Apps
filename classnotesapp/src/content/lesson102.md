[t] Ejemplo: Buscador Deezer · Paso a paso

Construimos un buscador de canciones usando la API pública de Deezer. El usuario escribe una query y la app muestra los resultados en un `ListView`. Seguimos exactamente la estructura del proyecto `moviles252`.

[st] Estructura de carpetas

[code:bash]
lib/
└── features/
    └── search/
        ├── domain/
        │   ├── repository/
        │   │   └── music_repository.dart
        │   └── usecases/
        │       └── search_tracks_usecase.dart
        ├── data/
        │   ├── repository/
        │   │   └── music_repository_impl.dart
        │   └── source/
        │       └── music_data_source.dart
        └── ui/
            ├── bloc/
            │   └── search_bloc.dart
            └── screens/
                └── search_screen.dart
[endcode]

[st] Dependencias

Agrega en `pubspec.yaml` y ejecuta `flutter pub get`:

[code:yaml]
dependencies:
  flutter_bloc: ^9.1.1
  http: ^1.2.1
[endcode]

[st] Paso 1 · Entidad Track

La entidad es un objeto Dart puro. No sabe nada de HTTP ni de BLoC.

[svg]
<svg xmlns="http://www.w3.org/2000/svg" width="280" height="118" font-family="Roboto, Arial, sans-serif">
  <rect x="30" y="10" width="220" height="98" rx="10" fill="#1e3326" stroke="#66BB6A" stroke-width="2"/>
  <text x="140" y="35" text-anchor="middle" fill="white" font-size="14" font-weight="bold">Track</text>
  <line x1="30" y1="44" x2="250" y2="44" stroke="#66BB6A" stroke-opacity="0.4" stroke-width="1"/>
  <text x="140" y="63" text-anchor="middle" fill="#a5d6a7" font-size="11">int id · String title</text>
  <text x="140" y="80" text-anchor="middle" fill="#a5d6a7" font-size="11">String artistName</text>
  <text x="140" y="97" text-anchor="middle" fill="#a5d6a7" font-size="11">String albumCover · String previewUrl</text>
</svg>
[endsvg]

`lib/features/search/domain/entities/track.dart`

[code:dart]
class Track {
  final int id;
  final String title;
  final String artistName;
  final String albumCover;
  final String previewUrl;

  Track({
    required this.id,
    required this.title,
    required this.artistName,
    required this.albumCover,
    required this.previewUrl,
  });

  factory Track.fromJson(Map<String, dynamic> json) {
    return Track(
      id: json['id'] as int,
      title: json['title'] as String,
      artistName: (json['artist'] as Map<String, dynamic>)['name'] as String,
      albumCover: (json['album'] as Map<String, dynamic>)['cover_medium'] as String,
      previewUrl: json['preview'] as String,
    );
  }
}
[endcode]

[st] Paso 2 · MusicRepository (Dominio)

Definimos el contrato abstracto. No sabe cómo se obtienen los datos.

[svg]
<svg xmlns="http://www.w3.org/2000/svg" width="280" height="475" font-family="Roboto, Arial, sans-serif">
  <defs>
    <marker id="a" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#888"/></marker>
    <marker id="d" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#2e3545"/></marker>
    <marker id="g" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#66BB6A"/></marker>
  </defs>
  <rect x="34" y="140" width="212" height="122" rx="8" fill="none" stroke="#66BB6A" stroke-width="1.2" stroke-dasharray="6,3" opacity="0.5"/>
  <text x="140" y="134" text-anchor="middle" fill="#66BB6A" font-size="9" font-weight="bold" letter-spacing="1">DOMINIO · PURO</text>
  <!-- Vista -->
  <rect x="42" y="18" width="196" height="42" rx="6" fill="#1e2530" stroke="#2e3545" stroke-width="1.5"/>
  <text x="140" y="43" text-anchor="middle" fill="#3d4a5e" font-size="12" font-weight="bold">SearchScreen</text>
  <line x1="140" y1="60" x2="140" y2="82" stroke="#2e3545" stroke-width="1.5" marker-end="url(#d)"/>
  <!-- BLoC -->
  <rect x="42" y="82" width="196" height="42" rx="6" fill="#1e2530" stroke="#2e3545" stroke-width="1.5"/>
  <text x="140" y="107" text-anchor="middle" fill="#3d4a5e" font-size="12" font-weight="bold">SearchBloc</text>
  <line x1="140" y1="124" x2="140" y2="148" stroke="#2e3545" stroke-width="1.5" marker-end="url(#d)"/>
  <!-- UseCase -->
  <rect x="42" y="148" width="196" height="42" rx="6" fill="#1e2530" stroke="#2e3545" stroke-width="1.5"/>
  <text x="140" y="173" text-anchor="middle" fill="#3d4a5e" font-size="12" font-weight="bold">SearchTracksUsecase</text>
  <line x1="140" y1="190" x2="140" y2="212" stroke="#2e3545" stroke-width="1.5" marker-end="url(#d)"/>
  <!-- RepoAbs ACTIVE -->
  <rect x="42" y="212" width="196" height="42" rx="6" fill="#66BB6A" stroke="#388E3C" stroke-width="1.5"/>
  <text x="140" y="230" text-anchor="middle" fill="white" font-size="12" font-weight="bold">MusicRepository</text>
  <text x="140" y="246" text-anchor="middle" fill="white" font-size="10">abstract</text>
  <!-- dashed -->
  <line x1="140" y1="254" x2="140" y2="288" stroke="#66BB6A" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#g)"/>
  <text x="148" y="274" fill="#66BB6A" font-size="9">implements</text>
  <!-- RepoImpl -->
  <rect x="42" y="288" width="196" height="42" rx="6" fill="#1e2530" stroke="#2e3545" stroke-width="1.5"/>
  <text x="140" y="313" text-anchor="middle" fill="#3d4a5e" font-size="12" font-weight="bold">MusicRepositoryImpl</text>
  <line x1="140" y1="330" x2="140" y2="352" stroke="#2e3545" stroke-width="1.5" marker-end="url(#d)"/>
  <!-- DataSource -->
  <rect x="42" y="352" width="196" height="42" rx="6" fill="#1e2530" stroke="#2e3545" stroke-width="1.5"/>
  <text x="140" y="377" text-anchor="middle" fill="#3d4a5e" font-size="12" font-weight="bold">MusicDataSource</text>
  <line x1="140" y1="394" x2="140" y2="408" stroke="#2e3545" stroke-width="1.5" marker-end="url(#d)"/>
  <!-- API -->
  <ellipse cx="140" cy="432" rx="80" ry="22" fill="#1e2530" stroke="#2e3545" stroke-width="1.5"/>
  <text x="140" y="437" text-anchor="middle" fill="#3d4a5e" font-size="12" font-weight="bold">api.deezer.com</text>
</svg>
[endsvg]

`lib/features/search/domain/repository/music_repository.dart`

[code:dart]
import 'package:moviles252/features/search/domain/entities/track.dart';

abstract class MusicRepository {
  Future<List<Track>> searchTracks(String query);
}
[endcode]

[st] Paso 3 · SearchTracksUsecase (Dominio)

El UseCase encapsula la acción de negocio e instancia el repositorio directamente.

[svg]
<svg xmlns="http://www.w3.org/2000/svg" width="280" height="475" font-family="Roboto, Arial, sans-serif">
  <defs>
    <marker id="a" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#888"/></marker>
    <marker id="d" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#2e3545"/></marker>
    <marker id="g" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#66BB6A"/></marker>
  </defs>
  <rect x="34" y="140" width="212" height="122" rx="8" fill="none" stroke="#66BB6A" stroke-width="1.2" stroke-dasharray="6,3" opacity="0.5"/>
  <text x="140" y="134" text-anchor="middle" fill="#66BB6A" font-size="9" font-weight="bold" letter-spacing="1">DOMINIO · PURO</text>
  <!-- Vista -->
  <rect x="42" y="18" width="196" height="42" rx="6" fill="#1e2530" stroke="#2e3545" stroke-width="1.5"/>
  <text x="140" y="43" text-anchor="middle" fill="#3d4a5e" font-size="12" font-weight="bold">SearchScreen</text>
  <line x1="140" y1="60" x2="140" y2="82" stroke="#2e3545" stroke-width="1.5" marker-end="url(#d)"/>
  <!-- BLoC -->
  <rect x="42" y="82" width="196" height="42" rx="6" fill="#1e2530" stroke="#2e3545" stroke-width="1.5"/>
  <text x="140" y="107" text-anchor="middle" fill="#3d4a5e" font-size="12" font-weight="bold">SearchBloc</text>
  <line x1="140" y1="124" x2="140" y2="148" stroke="#2e3545" stroke-width="1.5" marker-end="url(#d)"/>
  <!-- UseCase ACTIVE -->
  <rect x="42" y="148" width="196" height="42" rx="6" fill="#66BB6A" stroke="#388E3C" stroke-width="1.5"/>
  <text x="140" y="173" text-anchor="middle" fill="white" font-size="12" font-weight="bold">SearchTracksUsecase</text>
  <line x1="140" y1="190" x2="140" y2="212" stroke="#888" stroke-width="1.5" marker-end="url(#a)"/>
  <!-- RepoAbs ACTIVE -->
  <rect x="42" y="212" width="196" height="42" rx="6" fill="#66BB6A" stroke="#388E3C" stroke-width="1.5"/>
  <text x="140" y="230" text-anchor="middle" fill="white" font-size="12" font-weight="bold">MusicRepository</text>
  <text x="140" y="246" text-anchor="middle" fill="white" font-size="10">abstract</text>
  <!-- dashed -->
  <line x1="140" y1="254" x2="140" y2="288" stroke="#66BB6A" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#g)"/>
  <text x="148" y="274" fill="#66BB6A" font-size="9">implements</text>
  <!-- RepoImpl -->
  <rect x="42" y="288" width="196" height="42" rx="6" fill="#1e2530" stroke="#2e3545" stroke-width="1.5"/>
  <text x="140" y="313" text-anchor="middle" fill="#3d4a5e" font-size="12" font-weight="bold">MusicRepositoryImpl</text>
  <line x1="140" y1="330" x2="140" y2="352" stroke="#2e3545" stroke-width="1.5" marker-end="url(#d)"/>
  <!-- DataSource -->
  <rect x="42" y="352" width="196" height="42" rx="6" fill="#1e2530" stroke="#2e3545" stroke-width="1.5"/>
  <text x="140" y="377" text-anchor="middle" fill="#3d4a5e" font-size="12" font-weight="bold">MusicDataSource</text>
  <line x1="140" y1="394" x2="140" y2="408" stroke="#2e3545" stroke-width="1.5" marker-end="url(#d)"/>
  <!-- API -->
  <ellipse cx="140" cy="432" rx="80" ry="22" fill="#1e2530" stroke="#2e3545" stroke-width="1.5"/>
  <text x="140" y="437" text-anchor="middle" fill="#3d4a5e" font-size="12" font-weight="bold">api.deezer.com</text>
</svg>
[endsvg]

`lib/features/search/domain/usecases/search_tracks_usecase.dart`

[code:dart]
import 'package:moviles252/features/search/domain/repository/music_repository.dart';
import 'package:moviles252/features/search/data/repository/music_repository_impl.dart';
import 'package:moviles252/features/search/domain/entities/track.dart';

class SearchTracksUsecase {
  MusicRepository _repository = MusicRepositoryImpl();

  Future<List<Track>> execute(String query) async {
    return await _repository.searchTracks(query);
  }
}
[endcode]

[st] Paso 4 · MusicDataSource (Datos)

El DataSource hace la llamada HTTP cruda. Define la abstracción y su implementación en el mismo archivo.

[svg]
<svg xmlns="http://www.w3.org/2000/svg" width="280" height="475" font-family="Roboto, Arial, sans-serif">
  <defs>
    <marker id="a" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#888"/></marker>
    <marker id="d" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#2e3545"/></marker>
    <marker id="g" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#66BB6A"/></marker>
  </defs>
  <rect x="34" y="140" width="212" height="122" rx="8" fill="none" stroke="#66BB6A" stroke-width="1.2" stroke-dasharray="6,3" opacity="0.5"/>
  <text x="140" y="134" text-anchor="middle" fill="#66BB6A" font-size="9" font-weight="bold" letter-spacing="1">DOMINIO · PURO</text>
  <!-- Vista -->
  <rect x="42" y="18" width="196" height="42" rx="6" fill="#1e2530" stroke="#2e3545" stroke-width="1.5"/>
  <text x="140" y="43" text-anchor="middle" fill="#3d4a5e" font-size="12" font-weight="bold">SearchScreen</text>
  <line x1="140" y1="60" x2="140" y2="82" stroke="#2e3545" stroke-width="1.5" marker-end="url(#d)"/>
  <!-- BLoC -->
  <rect x="42" y="82" width="196" height="42" rx="6" fill="#1e2530" stroke="#2e3545" stroke-width="1.5"/>
  <text x="140" y="107" text-anchor="middle" fill="#3d4a5e" font-size="12" font-weight="bold">SearchBloc</text>
  <line x1="140" y1="124" x2="140" y2="148" stroke="#2e3545" stroke-width="1.5" marker-end="url(#d)"/>
  <!-- UseCase ACTIVE -->
  <rect x="42" y="148" width="196" height="42" rx="6" fill="#66BB6A" stroke="#388E3C" stroke-width="1.5"/>
  <text x="140" y="173" text-anchor="middle" fill="white" font-size="12" font-weight="bold">SearchTracksUsecase</text>
  <line x1="140" y1="190" x2="140" y2="212" stroke="#888" stroke-width="1.5" marker-end="url(#a)"/>
  <!-- RepoAbs ACTIVE -->
  <rect x="42" y="212" width="196" height="42" rx="6" fill="#66BB6A" stroke="#388E3C" stroke-width="1.5"/>
  <text x="140" y="230" text-anchor="middle" fill="white" font-size="12" font-weight="bold">MusicRepository</text>
  <text x="140" y="246" text-anchor="middle" fill="white" font-size="10">abstract</text>
  <!-- dashed -->
  <line x1="140" y1="254" x2="140" y2="288" stroke="#66BB6A" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#g)"/>
  <text x="148" y="274" fill="#66BB6A" font-size="9">implements</text>
  <!-- RepoImpl -->
  <rect x="42" y="288" width="196" height="42" rx="6" fill="#1e2530" stroke="#2e3545" stroke-width="1.5"/>
  <text x="140" y="313" text-anchor="middle" fill="#3d4a5e" font-size="12" font-weight="bold">MusicRepositoryImpl</text>
  <line x1="140" y1="330" x2="140" y2="352" stroke="#2e3545" stroke-width="1.5" marker-end="url(#d)"/>
  <!-- DataSource ACTIVE -->
  <rect x="42" y="352" width="196" height="42" rx="6" fill="#FFA726" stroke="#E65100" stroke-width="1.5"/>
  <text x="140" y="377" text-anchor="middle" fill="white" font-size="12" font-weight="bold">MusicDataSource</text>
  <line x1="140" y1="394" x2="140" y2="408" stroke="#888" stroke-width="1.5" marker-end="url(#a)"/>
  <!-- API ACTIVE -->
  <ellipse cx="140" cy="432" rx="80" ry="22" fill="#AB47BC" stroke="#7B1FA2" stroke-width="1.5"/>
  <text x="140" y="437" text-anchor="middle" fill="white" font-size="12" font-weight="bold">api.deezer.com</text>
</svg>
[endsvg]

`lib/features/search/data/source/music_data_source.dart`

[code:dart]
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:moviles252/features/search/domain/entities/track.dart';

abstract class MusicDataSource {
  Future<List<Track>> fetchTracks(String query);
}

class MusicDataSourceImpl extends MusicDataSource {
  @override
  Future<List<Track>> fetchTracks(String query) async {
    final encoded = Uri.encodeComponent(query);
    final uri = Uri.parse('https://api.deezer.com/search?q=$encoded');
    final response = await http.get(uri);

    if (response.statusCode != 200) {
      throw Exception('Error ${response.statusCode}');
    }

    final body = jsonDecode(response.body) as Map<String, dynamic>;
    final list = body['data'] as List;
    return list.map((e) => Track.fromJson(e as Map<String, dynamic>)).toList();
  }
}
[endcode]

[st] Paso 5 · MusicRepositoryImpl (Datos)

Implementa el contrato del dominio y delega la llamada al DataSource.

[svg]
<svg xmlns="http://www.w3.org/2000/svg" width="280" height="475" font-family="Roboto, Arial, sans-serif">
  <defs>
    <marker id="a" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#888"/></marker>
    <marker id="d" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#2e3545"/></marker>
    <marker id="o" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#FFA726"/></marker>
    <marker id="g" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#66BB6A"/></marker>
  </defs>
  <rect x="34" y="140" width="212" height="122" rx="8" fill="none" stroke="#66BB6A" stroke-width="1.2" stroke-dasharray="6,3" opacity="0.5"/>
  <text x="140" y="134" text-anchor="middle" fill="#66BB6A" font-size="9" font-weight="bold" letter-spacing="1">DOMINIO · PURO</text>
  <!-- Vista -->
  <rect x="42" y="18" width="196" height="42" rx="6" fill="#1e2530" stroke="#2e3545" stroke-width="1.5"/>
  <text x="140" y="43" text-anchor="middle" fill="#3d4a5e" font-size="12" font-weight="bold">SearchScreen</text>
  <line x1="140" y1="60" x2="140" y2="82" stroke="#2e3545" stroke-width="1.5" marker-end="url(#d)"/>
  <!-- BLoC -->
  <rect x="42" y="82" width="196" height="42" rx="6" fill="#1e2530" stroke="#2e3545" stroke-width="1.5"/>
  <text x="140" y="107" text-anchor="middle" fill="#3d4a5e" font-size="12" font-weight="bold">SearchBloc</text>
  <line x1="140" y1="124" x2="140" y2="148" stroke="#2e3545" stroke-width="1.5" marker-end="url(#d)"/>
  <!-- UseCase ACTIVE -->
  <rect x="42" y="148" width="196" height="42" rx="6" fill="#66BB6A" stroke="#388E3C" stroke-width="1.5"/>
  <text x="140" y="173" text-anchor="middle" fill="white" font-size="12" font-weight="bold">SearchTracksUsecase</text>
  <line x1="140" y1="190" x2="140" y2="212" stroke="#888" stroke-width="1.5" marker-end="url(#a)"/>
  <!-- RepoAbs ACTIVE -->
  <rect x="42" y="212" width="196" height="42" rx="6" fill="#66BB6A" stroke="#388E3C" stroke-width="1.5"/>
  <text x="140" y="230" text-anchor="middle" fill="white" font-size="12" font-weight="bold">MusicRepository</text>
  <text x="140" y="246" text-anchor="middle" fill="white" font-size="10">abstract</text>
  <!-- dashed ORANGE (impl active) -->
  <line x1="140" y1="254" x2="140" y2="288" stroke="#FFA726" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#o)"/>
  <text x="148" y="274" fill="#FFA726" font-size="9">implements</text>
  <!-- RepoImpl ACTIVE -->
  <rect x="42" y="288" width="196" height="42" rx="6" fill="#FFA726" stroke="#E65100" stroke-width="1.5"/>
  <text x="140" y="313" text-anchor="middle" fill="white" font-size="12" font-weight="bold">MusicRepositoryImpl</text>
  <line x1="140" y1="330" x2="140" y2="352" stroke="#888" stroke-width="1.5" marker-end="url(#a)"/>
  <!-- DataSource ACTIVE -->
  <rect x="42" y="352" width="196" height="42" rx="6" fill="#FFA726" stroke="#E65100" stroke-width="1.5"/>
  <text x="140" y="377" text-anchor="middle" fill="white" font-size="12" font-weight="bold">MusicDataSource</text>
  <line x1="140" y1="394" x2="140" y2="408" stroke="#888" stroke-width="1.5" marker-end="url(#a)"/>
  <!-- API ACTIVE -->
  <ellipse cx="140" cy="432" rx="80" ry="22" fill="#AB47BC" stroke="#7B1FA2" stroke-width="1.5"/>
  <text x="140" y="437" text-anchor="middle" fill="white" font-size="12" font-weight="bold">api.deezer.com</text>
</svg>
[endsvg]

`lib/features/search/data/repository/music_repository_impl.dart`

[code:dart]
import 'package:moviles252/features/search/domain/entities/track.dart';
import 'package:moviles252/features/search/domain/repository/music_repository.dart';
import 'package:moviles252/features/search/data/source/music_data_source.dart';

class MusicRepositoryImpl extends MusicRepository {
  MusicDataSource _dataSource = MusicDataSourceImpl();

  @override
  Future<List<Track>> searchTracks(String query) async {
    return await _dataSource.fetchTracks(query);
  }
}
[endcode]

[st] Paso 6 · SearchBloc (Presentación)

El BLoC define eventos, estados y lógica en un solo archivo. Instancia el UseCase directamente.

[svg]
<svg xmlns="http://www.w3.org/2000/svg" width="280" height="475" font-family="Roboto, Arial, sans-serif">
  <defs>
    <marker id="a" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#888"/></marker>
    <marker id="d" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#2e3545"/></marker>
    <marker id="o" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#FFA726"/></marker>
  </defs>
  <rect x="34" y="140" width="212" height="122" rx="8" fill="none" stroke="#66BB6A" stroke-width="1.2" stroke-dasharray="6,3" opacity="0.5"/>
  <text x="140" y="134" text-anchor="middle" fill="#66BB6A" font-size="9" font-weight="bold" letter-spacing="1">DOMINIO · PURO</text>
  <!-- Vista -->
  <rect x="42" y="18" width="196" height="42" rx="6" fill="#1e2530" stroke="#2e3545" stroke-width="1.5"/>
  <text x="140" y="43" text-anchor="middle" fill="#3d4a5e" font-size="12" font-weight="bold">SearchScreen</text>
  <line x1="140" y1="60" x2="140" y2="82" stroke="#2e3545" stroke-width="1.5" marker-end="url(#d)"/>
  <!-- BLoC ACTIVE -->
  <rect x="42" y="82" width="196" height="42" rx="6" fill="#42A5F5" stroke="#1565C0" stroke-width="1.5"/>
  <text x="140" y="107" text-anchor="middle" fill="white" font-size="12" font-weight="bold">SearchBloc</text>
  <line x1="140" y1="124" x2="140" y2="148" stroke="#888" stroke-width="1.5" marker-end="url(#a)"/>
  <!-- UseCase ACTIVE -->
  <rect x="42" y="148" width="196" height="42" rx="6" fill="#66BB6A" stroke="#388E3C" stroke-width="1.5"/>
  <text x="140" y="173" text-anchor="middle" fill="white" font-size="12" font-weight="bold">SearchTracksUsecase</text>
  <line x1="140" y1="190" x2="140" y2="212" stroke="#888" stroke-width="1.5" marker-end="url(#a)"/>
  <!-- RepoAbs ACTIVE -->
  <rect x="42" y="212" width="196" height="42" rx="6" fill="#66BB6A" stroke="#388E3C" stroke-width="1.5"/>
  <text x="140" y="230" text-anchor="middle" fill="white" font-size="12" font-weight="bold">MusicRepository</text>
  <text x="140" y="246" text-anchor="middle" fill="white" font-size="10">abstract</text>
  <line x1="140" y1="254" x2="140" y2="288" stroke="#FFA726" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#o)"/>
  <text x="148" y="274" fill="#FFA726" font-size="9">implements</text>
  <!-- RepoImpl ACTIVE -->
  <rect x="42" y="288" width="196" height="42" rx="6" fill="#FFA726" stroke="#E65100" stroke-width="1.5"/>
  <text x="140" y="313" text-anchor="middle" fill="white" font-size="12" font-weight="bold">MusicRepositoryImpl</text>
  <line x1="140" y1="330" x2="140" y2="352" stroke="#888" stroke-width="1.5" marker-end="url(#a)"/>
  <!-- DataSource ACTIVE -->
  <rect x="42" y="352" width="196" height="42" rx="6" fill="#FFA726" stroke="#E65100" stroke-width="1.5"/>
  <text x="140" y="377" text-anchor="middle" fill="white" font-size="12" font-weight="bold">MusicDataSource</text>
  <line x1="140" y1="394" x2="140" y2="408" stroke="#888" stroke-width="1.5" marker-end="url(#a)"/>
  <!-- API ACTIVE -->
  <ellipse cx="140" cy="432" rx="80" ry="22" fill="#AB47BC" stroke="#7B1FA2" stroke-width="1.5"/>
  <text x="140" y="437" text-anchor="middle" fill="white" font-size="12" font-weight="bold">api.deezer.com</text>
</svg>
[endsvg]

`lib/features/search/ui/bloc/search_bloc.dart`

[code:dart]
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:moviles252/features/search/domain/entities/track.dart';
import 'package:moviles252/features/search/domain/usecases/search_tracks_usecase.dart';

// ─── Eventos ────────────────────────────────────────
abstract class SearchEvent {}

class SubmitSearchEvent extends SearchEvent {
  final String query;
  SubmitSearchEvent(this.query);
}

// ─── Estados ────────────────────────────────────────
abstract class SearchState {
  final List<Track> tracks;
  SearchState({this.tracks = const []});
}

class SearchIdleState extends SearchState {}

class SearchLoadingState extends SearchState {}

class SearchLoadedState extends SearchState {
  SearchLoadedState({required super.tracks});
}

class SearchErrorState extends SearchState {
  final String message;
  SearchErrorState(this.message);
}

// ─── BLoC ───────────────────────────────────────────
class SearchBloc extends Bloc<SearchEvent, SearchState> {
  SearchTracksUsecase _usecase = SearchTracksUsecase();

  SearchBloc() : super(SearchIdleState()) {
    on<SubmitSearchEvent>(_onSearch);
  }

  Future<void> _onSearch(
    SubmitSearchEvent event,
    Emitter<SearchState> emit,
  ) async {
    emit(SearchLoadingState());
    try {
      final tracks = await _usecase.execute(event.query);
      emit(SearchLoadedState(tracks: tracks));
    } on Exception catch (e) {
      emit(SearchErrorState(e.toString()));
    }
  }
}
[endcode]

[st] Paso 7 · SearchScreen (Presentación)

La pantalla escucha estados del BLoC y renderiza la lista. No contiene lógica de negocio.

[svg]
<svg xmlns="http://www.w3.org/2000/svg" width="280" height="475" font-family="Roboto, Arial, sans-serif">
  <defs>
    <marker id="a" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#888"/></marker>
    <marker id="o" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#FFA726"/></marker>
  </defs>
  <rect x="34" y="140" width="212" height="122" rx="8" fill="none" stroke="#66BB6A" stroke-width="1.2" stroke-dasharray="6,3" opacity="0.5"/>
  <text x="140" y="134" text-anchor="middle" fill="#66BB6A" font-size="9" font-weight="bold" letter-spacing="1">DOMINIO · PURO</text>
  <!-- Vista ACTIVE -->
  <rect x="42" y="18" width="196" height="42" rx="6" fill="#FFA726" stroke="#E65100" stroke-width="1.5"/>
  <text x="140" y="43" text-anchor="middle" fill="white" font-size="12" font-weight="bold">SearchScreen</text>
  <line x1="140" y1="60" x2="140" y2="82" stroke="#888" stroke-width="1.5" marker-end="url(#a)"/>
  <!-- BLoC ACTIVE -->
  <rect x="42" y="82" width="196" height="42" rx="6" fill="#42A5F5" stroke="#1565C0" stroke-width="1.5"/>
  <text x="140" y="107" text-anchor="middle" fill="white" font-size="12" font-weight="bold">SearchBloc</text>
  <line x1="140" y1="124" x2="140" y2="148" stroke="#888" stroke-width="1.5" marker-end="url(#a)"/>
  <!-- UseCase ACTIVE -->
  <rect x="42" y="148" width="196" height="42" rx="6" fill="#66BB6A" stroke="#388E3C" stroke-width="1.5"/>
  <text x="140" y="173" text-anchor="middle" fill="white" font-size="12" font-weight="bold">SearchTracksUsecase</text>
  <line x1="140" y1="190" x2="140" y2="212" stroke="#888" stroke-width="1.5" marker-end="url(#a)"/>
  <!-- RepoAbs ACTIVE -->
  <rect x="42" y="212" width="196" height="42" rx="6" fill="#66BB6A" stroke="#388E3C" stroke-width="1.5"/>
  <text x="140" y="230" text-anchor="middle" fill="white" font-size="12" font-weight="bold">MusicRepository</text>
  <text x="140" y="246" text-anchor="middle" fill="white" font-size="10">abstract</text>
  <line x1="140" y1="254" x2="140" y2="288" stroke="#FFA726" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#o)"/>
  <text x="148" y="274" fill="#FFA726" font-size="9">implements</text>
  <!-- RepoImpl ACTIVE -->
  <rect x="42" y="288" width="196" height="42" rx="6" fill="#FFA726" stroke="#E65100" stroke-width="1.5"/>
  <text x="140" y="313" text-anchor="middle" fill="white" font-size="12" font-weight="bold">MusicRepositoryImpl</text>
  <line x1="140" y1="330" x2="140" y2="352" stroke="#888" stroke-width="1.5" marker-end="url(#a)"/>
  <!-- DataSource ACTIVE -->
  <rect x="42" y="352" width="196" height="42" rx="6" fill="#FFA726" stroke="#E65100" stroke-width="1.5"/>
  <text x="140" y="377" text-anchor="middle" fill="white" font-size="12" font-weight="bold">MusicDataSource</text>
  <line x1="140" y1="394" x2="140" y2="408" stroke="#888" stroke-width="1.5" marker-end="url(#a)"/>
  <!-- API ACTIVE -->
  <ellipse cx="140" cy="432" rx="80" ry="22" fill="#AB47BC" stroke="#7B1FA2" stroke-width="1.5"/>
  <text x="140" y="437" text-anchor="middle" fill="white" font-size="12" font-weight="bold">api.deezer.com</text>
</svg>
[endsvg]

`lib/features/search/ui/screens/search_screen.dart`

[code:dart]
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:moviles252/features/search/ui/bloc/search_bloc.dart';

class SearchScreen extends StatefulWidget {
  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final TextEditingController _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _search() {
    final query = _controller.text.trim();
    if (query.isEmpty) return;
    context.read<SearchBloc>().add(SubmitSearchEvent(query));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Buscar en Deezer')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: const InputDecoration(
                      hintText: 'Artista o canción...',
                      border: OutlineInputBorder(),
                    ),
                    onSubmitted: (_) => _search(),
                  ),
                ),
                const SizedBox(width: 8),
                ElevatedButton(
                  onPressed: _search,
                  child: const Text('Buscar'),
                ),
              ],
            ),
          ),
          Expanded(
            child: BlocBuilder<SearchBloc, SearchState>(
              builder: (context, state) {
                return Column(
                  children: [
                    if (state is SearchLoadingState)
                      const LinearProgressIndicator(),
                    if (state is SearchErrorState)
                      Padding(
                        padding: const EdgeInsets.all(8),
                        child: Text(
                          state.message,
                          style: const TextStyle(color: Colors.red),
                        ),
                      ),
                    Expanded(
                      child: state.tracks.isEmpty
                          ? const Center(child: Text('Escribe algo para buscar.'))
                          : ListView.builder(
                              itemCount: state.tracks.length,
                              itemBuilder: (context, index) {
                                final track = state.tracks[index];
                                return ListTile(
                                  leading: Image.network(
                                    track.albumCover,
                                    width: 50,
                                    height: 50,
                                    fit: BoxFit.cover,
                                  ),
                                  title: Text(track.title),
                                  subtitle: Text(track.artistName),
                                );
                              },
                            ),
                    ),
                  ],
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
[endcode]

[st] Registrar el BLoC en main.dart

Envuelve `SearchScreen` con un `BlocProvider` para que tenga acceso al `SearchBloc`.

[code:dart]
BlocProvider(
  create: (_) => SearchBloc(),
  child: const SearchScreen(),
)
[endcode]
.