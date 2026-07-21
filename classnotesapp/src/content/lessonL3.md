# Interactuando con el Mapa

Un mapa interactivo es mucho más útil. En esta lección, aprenderemos a responder a las interacciones del usuario con el mapa, como toques (taps) y pulsaciones largas (long presses), tanto en el mapa en general como en marcadores específicos.

## Tipos de Listeners Disponibles

El widget `GoogleMap` expone varios callbacks para eventos del usuario. Los más comunes son:

- `onTap`: Se activa al tocar cualquier punto del mapa.
- `onLongPress`: Se activa cuando mantienes presionado un punto.
- `onTap` (dentro de `Marker`): Se activa cuando se toca un marcador específico.

## Escuchar Tap y Long Tap en el Mapa

Para detectar toques y pulsaciones largas en cualquier parte del mapa, simplemente agrega las propiedades `onTap` y `onLongPress` al widget `GoogleMap` y asígnales funciones que manejarán estos eventos.

Modifica tu `GoogleMap` así:

```dart
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
```

Ahora, define los métodos `_handleTap` y `_handleLongPress` dentro de tu clase `_MapScreenState`:

```dart
// Dentro de la clase _MapScreenState

void _handleTap(LatLng tappedPoint) {
  setState(() {
    _markers.add(
      Marker(
        markerId: MarkerId(tappedPoint.toString()), // ID único basado en las coordenadas
        position: tappedPoint,
        infoWindow: const InfoWindow(title: 'Nuevo marcador'),
      ),
    );
  });
}

void _handleLongPress(LatLng pressedPoint) {
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      content: Text('Manteniendo en ${pressedPoint.latitude}, ${pressedPoint.longitude}'),
      duration: const Duration(seconds: 2),
    ),
  );
}
```

Resultado:
- Un toque en cualquier parte del mapa agregará un nuevo marcador en esa posición.
- Una pulsación larga mostrará un `SnackBar` en la parte inferior de la pantalla con las coordenadas del punto presionado.

## Detectar Clics en un Marcador

El evento de toque para un marcador se maneja directamente dentro de la definición del `Marker`, usando su parámetro `onTap`. Esto te permite definir un comportamiento específico para cada marcador individual.

Ejemplo (modificando el marcador inicial de Google HQ):

```dart
Marker(
  markerId: const MarkerId('google_hq'),
  position: const LatLng(37.4219999, -122.0840575),
  infoWindow: const InfoWindow(title: 'Google HQ'),
  onTap: () { // Nuevo: Callback al tocar este marcador
    print('Marcador de Google HQ tocado');
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Tocaste el marcador de Google HQ')),
    );
  },
)
```

Importante: Cada marcador puede tener su propio comportamiento `onTap` definido, lo que permite una gran flexibilidad en la interacción.

## Ejemplo Completo

Aquí tienes el código completo de `MapScreen` integrando todos los listeners que hemos visto:

```dart
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

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
        markerId: const MarkerId('google_hq'),
        position: _center,
        infoWindow: const InfoWindow(title: 'Google HQ'),
        onTap: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Tocaste el marcador principal')),
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
          infoWindow: const InfoWindow(title: 'Nuevo marcador'),
        ),
      );
    });
  }

  void _handleLongPress(LatLng point) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Manteniendo en ${point.latitude}, ${point.longitude}')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Interacción con el mapa')),
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
```

.
