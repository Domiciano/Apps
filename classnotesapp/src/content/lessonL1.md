# Agregando Marcadores al Mapa

En esta lección, aprenderás a agregar marcadores a tu mapa de Google. Un marcador es un ícono que se coloca en una ubicación específica del mapa, a menudo con una ventana de información.

## Almacenando los Marcadores

Dentro de la clase `_MapScreenState`, agrega una nueva variable para guardar la colección de marcadores.

```dart
class _MapScreenState extends State<MapScreen> {
  late GoogleMapController mapController;
  final LatLng _center = const LatLng(37.4219999, -122.0840575);
  
  final Set<Marker> _markers = {};

  // ... resto del código
}
```

## Creando un Marcador al Iniciar el Mapa

Modificaremos el método `_onMapCreated` para que, una vez que el mapa esté listo, agregue un marcador a nuestro `Set`.

```dart
void _onMapCreated(GoogleMapController controller) {
  mapController = controller;
  setState(() { // Notificamos a Flutter que vamos a cambiar el estado
    _markers.add(
      const Marker(
        markerId: MarkerId('google_hq'),
        position: LatLng(37.4219999, -122.0840575),
        infoWindow: InfoWindow(
          title: 'Google HQ',
          snippet: 'La sede de Google',
        ),
      ),
    );
  });
}
```

Aquí, `Marker` recibe:
- `markerId`: Un identificador único.
- `position`: Las coordenadas `LatLng` donde se ubicará.
- `infoWindow`: El texto que aparece al tocar el marcador.

## Mostrando los Marcadores en el Mapa

Finalmente, necesitamos decirle al widget `GoogleMap` que use nuestro `Set` de marcadores. Para ello, asignamos `_markers` a la propiedad `markers` del mapa.

```dart
@override
Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(title: const Text('Hola Google Maps')),
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
```

Ejecuta tu aplicación. Ahora deberías ver el mismo mapa, pero con un marcador rojo en la ubicación de la sede de Google. Toca el marcador para ver la `InfoWindow` con el título y el texto que definiste.
