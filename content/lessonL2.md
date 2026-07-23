# Controlando la Cámara del Mapa

Mostrar un mapa está bien, pero lo realmente útil es **poder mover la cámara** de forma programática, por ejemplo, al hacer clic en un botón para centrarla en una ubicación específica.

## Moviendo la Cámara con un Botón

En este ejemplo, agregaremos un botón que moverá la cámara a una coordenada fija (por ejemplo, el Parque Simón Bolívar en Bogotá).

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
  final LatLng _initialPosition = const LatLng(3.341571, -76.530198); // Posición inicial
  final LatLng _destination = const LatLng(4.658383, -74.093389); // Parque Simón Bolívar
  final Set<Marker> _markers = {};

  void _onMapCreated(GoogleMapController controller) {
    mapController = controller;
    _markers.add(
      Marker(
        markerId: const MarkerId('inicio'),
        position: _initialPosition,
        infoWindow: const InfoWindow(title: 'Posición inicial'),
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
          markerId: const MarkerId('destino'),
          position: _destination,
          infoWindow: const InfoWindow(title: 'Parque Simón Bolívar'),
        ),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Controlando la Cámara del Mapa')),
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
```

Al presionar el botón flotante, la cámara se moverá suavemente hacia las coordenadas del Parque Simón Bolívar y se agregará un marcador allí.

## Ajustando la Vista de la Cámara

Si quieres más control sobre cómo se ve el mapa (por ejemplo, su orientación o inclinación), puedes usar un objeto `CameraPosition` con propiedades como:

- `target`: Coordenadas centrales (`LatLng`) del mapa.  
- `zoom`: Nivel de acercamiento (1 = mundo, 20 = edificios).  
- `bearing`: Dirección hacia la que mira la cámara (0–360°).  
- `tilt`: Inclinación de la vista (0° = vista desde arriba, 45° o más = vista en perspectiva).

Por ejemplo, para una vista inclinada y orientada al Este:

```dart
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
```

Con esto puedes crear efectos más dinámicos, como un paneo o una vista en perspectiva.
