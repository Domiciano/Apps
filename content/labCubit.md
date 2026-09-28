# Laboratorio Cubit

<!-- tags: ProductsCubit, entrega y recibe entre capas, Product.fromJson, 'int' is not a subtype of type 'double', respuesta envuelta en data, capa de infraestructura, loadProducts, BlocProvider y ..loadProducts(), BlocBuilder, context.read, paginación con ?page, Page 3 exceeds total pages -->

Vamos a mostrar el catálogo de una tienda de ropa desde una API real, `https://fakestoreapi.noksha.dev/api/products`, con un `Cubit` que carga los productos y una vista que solo dibuja lo que el `Cubit` le entrega.

La **Parte 1** es guiada: cada paso trae un gráfico con lo que esa capa **entrega** a la de abajo y lo que **recibe** de vuelta, una descripción de su trabajo y el código mínimo. La **Parte 2** —cargar más productos— la construyes tú con las mismas piezas.

Los estados son subclases, como en *Objeto como estado en Cubit*, y la petición usa `http`, como en el *Laboratorio 3*.

## Preparación

Crea un proyecto y agrega las dependencias:

```yaml
dependencies:
  flutter_bloc: ^9.1.1
  http: ^1.5.0
```

La API y sus imágenes aceptan peticiones desde el navegador, así que la app funciona igual en web.

```plain
lib/
├── main.dart
├── models/          product.dart
├── ui/              products_screen.dart
├── cubit/           products_cubit.dart
└── infrastructure/  products_api.dart
```

Una carpeta por capa: `ui/` para la vista, `cubit/` para el `Cubit` e `infrastructure/` para lo que habla con la API. `Product` no es una capa: es el dato que viaja entre las tres.

En los bloques de código se omiten los `import`: el editor los sugiere.

## El mapa

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="366" viewBox="0 0 640 366" font-family="Roboto, Arial, sans-serif" style="display:block;margin:0 auto;max-width:100%;height:auto;">
  <defs>
    <marker id="lcmap-e" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#FF7043"/></marker>
    <marker id="lcmap-r" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#26A69A"/></marker>
    <marker id="lcmap-g" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#9E9E9E"/></marker>
  </defs>
  <rect x="220" y="20" width="200" height="44" rx="8" fill="#FFA726"/>
  <text x="320" y="40" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">ProductsScreen</text>
  <text x="320" y="55" text-anchor="middle" fill="#FFFFFF" font-size="10">Vista</text>
  <rect x="220" y="104" width="200" height="44" rx="8" fill="#42A5F5"/>
  <text x="320" y="124" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">ProductsCubit</text>
  <text x="320" y="139" text-anchor="middle" fill="#FFFFFF" font-size="10">Cubit</text>
  <rect x="220" y="188" width="200" height="44" rx="8" fill="#FFA726"/>
  <text x="320" y="208" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">ProductsApi</text>
  <text x="320" y="223" text-anchor="middle" fill="#FFFFFF" font-size="10">Infrastructure · HTTP</text>
  <ellipse cx="320" cy="294" rx="110" ry="22" fill="#AB47BC"/>
  <text x="320" y="299" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="bold">fakestoreapi.noksha.dev</text>
  <line x1="300" y1="67" x2="300" y2="101" stroke="#FF7043" stroke-width="2" marker-end="url(#lcmap-e)"/>
  <line x1="340" y1="101" x2="340" y2="67" stroke="#26A69A" stroke-width="2" marker-end="url(#lcmap-r)"/>
  <text x="292" y="88.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">loadProducts()</tspan></text>
  <text x="348" y="88.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">ProductsState</tspan></text>
  <line x1="300" y1="151" x2="300" y2="185" stroke="#FF7043" stroke-width="2" marker-end="url(#lcmap-e)"/>
  <line x1="340" y1="185" x2="340" y2="151" stroke="#26A69A" stroke-width="2" marker-end="url(#lcmap-r)"/>
  <text x="292" y="172.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">getProducts()</tspan></text>
  <text x="348" y="172.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">List&lt;Product&gt;</tspan></text>
  <line x1="300" y1="235" x2="300" y2="269" stroke="#FF7043" stroke-width="2" marker-end="url(#lcmap-e)"/>
  <line x1="340" y1="269" x2="340" y2="235" stroke="#26A69A" stroke-width="2" marker-end="url(#lcmap-r)"/>
  <text x="292" y="256.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">GET /api/products</tspan></text>
  <text x="348" y="256.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">JSON</tspan></text>
  <line x1="150" y1="348" x2="176" y2="348" stroke="#FF7043" stroke-width="2" marker-end="url(#lcmap-e)"/>
  <text x="182" y="352" fill="#888" font-size="10">entrega a la capa de abajo</text>
  <line x1="350" y1="348" x2="376" y2="348" stroke="#26A69A" stroke-width="2" marker-end="url(#lcmap-r)"/>
  <text x="382" y="352" fill="#888" font-size="10">recibe de la capa de abajo</text>
</svg>
```

Tres capas: la vista, el `Cubit` y la infraestructura. La vista le **entrega** llamadas al `Cubit` y **recibe** estados. El `Cubit` le **entrega** la petición a `ProductsApi` y **recibe** la lista. La infraestructura es la única capa que habla con la API.

## Paso 1 · Product

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="175" viewBox="0 0 720 175" font-family="Roboto, Arial, sans-serif" style="display:block;margin:0 auto;max-width:100%;height:auto;">
  <defs><marker id="lcpr-a" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#888"/></marker></defs>
  <text x="115" y="30" text-anchor="middle" fill="#AB47BC" font-size="11" font-weight="bold">JSON de la API</text>
  <rect x="20" y="38" width="190" height="118" rx="8" fill="#AB47BC" fill-opacity="0.12" stroke="#AB47BC" stroke-opacity="0.6"/>
  <g fill="#888" font-size="10" font-family="monospace">
    <text x="30" y="56" style="white-space:pre">{ "data": [</text>
    <text x="30" y="70" style="white-space:pre">  { "_id": 1,</text>
    <text x="30" y="84" style="white-space:pre">    "title": "…",</text>
    <text x="30" y="98" style="white-space:pre">    "price": 150,</text>
    <text x="30" y="112" style="white-space:pre">    "category": "women",</text>
    <text x="30" y="126" style="white-space:pre">    "image": "https://…" },</text>
    <text x="30" y="140" style="white-space:pre">  … ], "totalPages": 2 }</text>
  </g>
  <text x="238" y="86" text-anchor="middle" fill="#888" font-size="10" font-family="monospace">fromJson</text>
  <line x1="213" y1="95" x2="262" y2="95" stroke="#888" stroke-width="1.5" marker-end="url(#lcpr-a)"/>
  <rect x="266" y="25" width="200" height="138" rx="10" fill="#66BB6A" fill-opacity="0.10" stroke="#66BB6A"/>
  <rect x="266" y="25" width="200" height="30" rx="10" fill="#66BB6A"/>
  <rect x="266" y="45" width="200" height="10" fill="#66BB6A"/>
  <text x="366" y="45" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">Product</text>
  <g fill="#888" font-size="11" font-family="monospace">
    <text x="284" y="76">int id</text>
    <text x="284" y="94">String title</text>
    <text x="284" y="112">double price</text>
    <text x="284" y="130">String category</text>
    <text x="284" y="148">String image</text>
  </g>
  <text x="486" y="72" fill="#66BB6A" font-size="12" font-weight="bold" font-family="monospace">"_id" → id</text>
  <text x="486" y="89" fill="#888" font-size="11">el id llega con guion bajo</text>
  <text x="486" y="118" fill="#66BB6A" font-size="12" font-weight="bold" font-family="monospace">num → double</text>
  <text x="486" y="135" fill="#888" font-size="11">el precio a veces llega entero</text>
</svg>
```

El modelo de cada producto. Esta API tiene dos detalles que hay que cuidar al convertir el JSON:

- El id se llama `_id`, con guion bajo.
- `price` llega a veces entero (`150`) y a veces decimal (`55.99`). Asignarlo directo a un `double` falla con los enteros: `type 'int' is not a subtype of type 'double'`. `(json['price'] as num).toDouble()` acepta los dos.

```dart
class Product {
  final int id;
  final String title;
  final double price;
  final String category;
  final String image;

  Product({required this.id, required this.title, required this.price, required this.category, required this.image});

  factory Product.fromJson(Map<String, dynamic> json) => Product(
        id: json['_id'],
        title: json['title'],
        price: (json['price'] as num).toDouble(),
        category: json['category'],
        image: json['image'],
      );
}
```

## Paso 2 · La vista

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="420" viewBox="0 0 720 420" font-family="Roboto, Arial, sans-serif" style="display:block;margin:0 auto;max-width:100%;height:auto;">
  <defs><clipPath id="lcv-screen"><rect x="0" y="0" width="240" height="380" rx="20"/></clipPath></defs>
  <g transform="translate(40,20)">
    <g clip-path="url(#lcv-screen)">
      <rect x="0" y="0" width="240" height="380" fill="#FFFFFF"/>
      <rect x="0" y="0" width="240" height="44" fill="#1976D2"/>
      <text x="16" y="28" fill="#FFFFFF" font-size="14" font-weight="bold">Tienda</text>
      <text x="220" y="29" text-anchor="middle" fill="#FFFFFF" font-size="18">↻</text>
      <rect x="12" y="57" width="44" height="44" rx="6" fill="#8D6E63"/>
      <text x="66" y="76" fill="#212121" font-size="12">Long sleeve Jacket</text>
      <text x="66" y="93" fill="#757575" font-size="10">women · $150.00</text>
      <line x1="66" y1="105" x2="240" y2="105" stroke="#EEEEEE"/>
      <rect x="12" y="111" width="44" height="44" rx="6" fill="#5C6BC0"/>
      <text x="66" y="130" fill="#212121" font-size="12">Jacket with wollen hat</text>
      <text x="66" y="147" fill="#757575" font-size="10">women · $65.00</text>
      <line x1="66" y1="159" x2="240" y2="159" stroke="#EEEEEE"/>
      <rect x="12" y="165" width="44" height="44" rx="6" fill="#EF5350"/>
      <text x="66" y="184" fill="#212121" font-size="12">Compact fashion t-shirt</text>
      <text x="66" y="201" fill="#757575" font-size="10">women · $55.99</text>
      <line x1="66" y1="213" x2="240" y2="213" stroke="#EEEEEE"/>
      <rect x="12" y="219" width="44" height="44" rx="6" fill="#42A5F5"/>
      <text x="66" y="238" fill="#212121" font-size="12">Blue jins</text>
      <text x="66" y="255" fill="#757575" font-size="10">women · $50.00</text>
      <line x1="66" y1="267" x2="240" y2="267" stroke="#EEEEEE"/>
      <rect x="12" y="273" width="44" height="44" rx="6" fill="#FFCA28"/>
      <text x="66" y="292" fill="#212121" font-size="12">Yellow Hoody</text>
      <text x="66" y="309" fill="#757575" font-size="10">men · $180.00</text>
      <rect x="60" y="334" width="120" height="28" rx="14" fill="#FFFFFF" stroke="#1976D2"/>
      <text x="120" y="352" text-anchor="middle" fill="#1976D2" font-size="11" font-weight="bold">Cargar más</text>
    </g>
    <rect x="0" y="0" width="240" height="380" rx="20" fill="none" stroke="#9E9E9E"/>
  </g>
  <circle cx="262" cy="42" r="3" fill="#FFA726"/>
  <line x1="262" y1="42" x2="318" y2="42" stroke="#888" stroke-dasharray="3,3"/>
  <text x="326" y="38" fill="#FFA726" font-size="12" font-weight="bold">↻ Recargar</text>
  <text x="326" y="54" fill="#888" font-size="11">llama loadProducts() otra vez</text>
  <path d="M284,74 H292 V340 H284" fill="none" stroke="#888"/>
  <circle cx="292" cy="110" r="3" fill="#FFA726"/>
  <line x1="292" y1="110" x2="318" y2="104" stroke="#888" stroke-dasharray="3,3"/>
  <text x="326" y="100" fill="#FFA726" font-size="12" font-weight="bold">ListView</text>
  <text x="326" y="116" fill="#888" font-size="11">dibuja state.products: foto, título, categoría y precio</text>
  <text x="326" y="170" fill="#FFA726" font-size="12" font-weight="bold">Mientras carga</text>
  <text x="326" y="186" fill="#888" font-size="11">CircularProgressIndicator en lugar de la lista</text>
  <text x="326" y="222" fill="#FFA726" font-size="12" font-weight="bold">Si falla</text>
  <text x="326" y="238" fill="#888" font-size="11">el mensaje de ProductsError</text>
  <circle cx="222" cy="368" r="3" fill="#FFA726"/>
  <line x1="222" y1="368" x2="318" y2="332" stroke="#888" stroke-dasharray="3,3"/>
  <text x="326" y="328" fill="#FFA726" font-size="12" font-weight="bold">Cargar más · Parte 2</text>
  <text x="326" y="344" fill="#888" font-size="11">pide la página siguiente</text>
</svg>
```

`ProductsScreen` no decide nada: dibuja el estado que **recibe** y le **entrega** al `Cubit` una llamada cuando el usuario quiere recargar.

- Un `BlocBuilder` que dibuja según el estado: `CircularProgressIndicator` si es `ProductsLoading`, el mensaje si es `ProductsError` y la lista si es `ProductsSuccess`.
- Cada producto con su foto, título, categoría y precio.
- Un botón ↻ en el `AppBar` que llama `loadProducts()`.

```dart
class ProductsScreen extends StatelessWidget {
  const ProductsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tienda'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => context.read<ProductsCubit>().loadProducts(),
          ),
        ],
      ),
      body: BlocBuilder<ProductsCubit, ProductsState>(
        builder: (context, state) {
          if (state is ProductsLoading) return const Center(child: CircularProgressIndicator());
          if (state is ProductsError) return Center(child: Text(state.message));
          if (state is! ProductsSuccess) return const SizedBox.shrink();
          return ListView(
            children: [
              for (final product in state.products)
                ListTile(
                  leading: Image.network(product.image, width: 56, fit: BoxFit.cover),
                  title: Text(product.title),
                  subtitle: Text('${product.category} · \$${product.price.toStringAsFixed(2)}'),
                ),
            ],
          );
        },
      ),
    );
  }
}
```

## Paso 3 · El Cubit

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="420" viewBox="0 0 720 420" font-family="Roboto, Arial, sans-serif" style="display:block;margin:0 auto;max-width:100%;height:auto;">
  <defs>
    <marker id="lcc-e" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#FF7043"/></marker>
    <marker id="lcc-r" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#26A69A"/></marker>
    <marker id="lcc-g" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#888"/></marker>
  </defs>
  <rect x="20" y="70" width="170" height="230" rx="14" fill="#FFA726" fill-opacity="0.08" stroke="#FFA726"/>
  <text x="105" y="96" text-anchor="middle" fill="#FFA726" font-size="14" font-weight="bold">ProductsScreen</text>
  <text x="105" y="112" text-anchor="middle" fill="#888" font-size="10">Vista</text>
  <rect x="35" y="135" width="140" height="40" rx="8" fill="#FFA726" fill-opacity="0.18"/>
  <text x="105" y="160" text-anchor="middle" fill="#888" font-size="12">↻ Recargar</text>
  <rect x="35" y="230" width="140" height="40" rx="8" fill="#FFA726" fill-opacity="0.18"/>
  <text x="105" y="255" text-anchor="middle" fill="#888" font-size="12">BlocBuilder</text>

  <rect x="300" y="40" width="400" height="280" rx="16" fill="#42A5F5" fill-opacity="0.08" stroke="#42A5F5"/>
  <text x="500" y="66" text-anchor="middle" fill="#42A5F5" font-size="15" font-weight="bold">ProductsCubit</text>

  <rect x="318" y="100" width="170" height="70" rx="10" fill="#FF7043" fill-opacity="0.12" stroke="#FF7043" stroke-opacity="0.6"/>
  <text x="403" y="122" text-anchor="middle" fill="#FF7043" font-size="12" font-weight="bold">Función pública</text>
  <text x="403" y="148" text-anchor="middle" fill="#888" font-size="11" font-family="monospace">loadProducts()</text>

  <rect x="318" y="195" width="170" height="110" rx="10" fill="#26A69A" fill-opacity="0.12" stroke="#26A69A" stroke-opacity="0.6"/>
  <text x="403" y="217" text-anchor="middle" fill="#26A69A" font-size="12" font-weight="bold">Estados</text>
  <g fill="#888" font-size="10" font-family="monospace" text-anchor="middle">
    <text x="403" y="238">ProductsInitial</text>
    <text x="403" y="254">ProductsLoading</text>
    <text x="403" y="270">ProductsSuccess(products)</text>
    <text x="403" y="286">ProductsError(message)</text>
  </g>

  <rect x="510" y="100" width="175" height="205" rx="10" fill="#42A5F5" fill-opacity="0.15"/>
  <text x="597" y="122" text-anchor="middle" fill="#42A5F5" font-size="12" font-weight="bold" font-family="monospace">loadProducts()</text>
  <text x="524" y="152" fill="#888" font-size="11">1 · emite Loading</text>
  <text x="524" y="176" fill="#888" font-size="11">2 · pide a ProductsApi</text>
  <text x="524" y="200" fill="#888" font-size="11">3 · emite Success</text>
  <text x="538" y="218" fill="#888" font-size="11">o Error</text>

  <line x1="490" y1="135" x2="507" y2="135" stroke="#888" stroke-width="1.5" marker-end="url(#lcc-g)"/>
  <line x1="508" y1="250" x2="491" y2="250" stroke="#888" stroke-width="1.5" marker-end="url(#lcc-g)"/>

  <line x1="177" y1="155" x2="315" y2="135" stroke="#FF7043" stroke-width="2.5" marker-end="url(#lcc-e)"/>
  <text x="245" y="128" text-anchor="middle" fill="#FF7043" font-size="10" font-weight="bold">entrega la llamada</text>
  <line x1="316" y1="250" x2="179" y2="250" stroke="#26A69A" stroke-width="2.5" marker-end="url(#lcc-r)"/>
  <text x="245" y="270" text-anchor="middle" fill="#26A69A" font-size="10" font-weight="bold">recibe el estado</text>

  <line x1="580" y1="307" x2="580" y2="355" stroke="#FF7043" stroke-width="2" marker-end="url(#lcc-e)"/>
  <line x1="610" y1="356" x2="610" y2="309" stroke="#26A69A" stroke-width="2" marker-end="url(#lcc-r)"/>
  <text x="572" y="336" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-weight="bold">getProducts()</tspan></text>
  <text x="572" y="351" text-anchor="end" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-weight="bold">List&lt;Product&gt;</tspan></text>
  <rect x="505" y="360" width="180" height="44" rx="8" fill="#FFA726" fill-opacity="0.15" stroke="#FFA726"/>
  <text x="595" y="387" text-anchor="middle" fill="#FFA726" font-size="12" font-weight="bold">ProductsApi</text>
</svg>
```

El `Cubit` es el que decide. La vista le **entrega** una llamada a `loadProducts()`; el `Cubit` emite `ProductsLoading`, le **entrega** la petición a `ProductsApi`, **recibe** la lista y emite `ProductsSuccess` con los productos, o `ProductsError` con el mensaje si algo falló.

```dart
abstract class ProductsState {}

class ProductsInitial extends ProductsState {}

class ProductsLoading extends ProductsState {}

class ProductsSuccess extends ProductsState {
  final List<Product> products;

  ProductsSuccess(this.products);
}

class ProductsError extends ProductsState {
  final String message;

  ProductsError(this.message);
}
```

```dart
class ProductsCubit extends Cubit<ProductsState> {
  final ProductsApi _api;

  ProductsCubit(this._api) : super(ProductsInitial());

  Future<void> loadProducts() async {
    emit(ProductsLoading());
    try {
      emit(ProductsSuccess(await _api.getProducts()));
    } on Exception catch (e) {
      emit(ProductsError(e.toString()));
    }
  }
}
```

## Paso 4 · Infrastructure

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="366" viewBox="0 0 640 366" font-family="Roboto, Arial, sans-serif" style="display:block;margin:0 auto;max-width:100%;height:auto;">
  <defs>
    <marker id="lcrep-e" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#FF7043"/></marker>
    <marker id="lcrep-r" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#26A69A"/></marker>
    <marker id="lcrep-g" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#9E9E9E"/></marker>
  </defs>
  <rect x="220" y="20" width="200" height="44" rx="8" fill="#FFA726" fill-opacity="0.08" stroke="#FFA726" stroke-opacity="0.5"/>
  <text x="320" y="40" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">ProductsScreen</text>
  <text x="320" y="55" text-anchor="middle" fill="#888" font-size="10">Vista</text>
  <rect x="220" y="104" width="200" height="44" rx="8" fill="#42A5F5" fill-opacity="0.08" stroke="#42A5F5" stroke-opacity="0.5"/>
  <text x="320" y="124" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">ProductsCubit</text>
  <text x="320" y="139" text-anchor="middle" fill="#888" font-size="10">Cubit</text>
  <rect x="220" y="188" width="200" height="44" rx="8" fill="#FFA726"/>
  <text x="320" y="208" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">ProductsApi</text>
  <text x="320" y="223" text-anchor="middle" fill="#FFFFFF" font-size="10">Infrastructure · HTTP</text>
  <ellipse cx="320" cy="294" rx="110" ry="22" fill="#AB47BC"/>
  <text x="320" y="299" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="bold">fakestoreapi.noksha.dev</text>
  <line x1="300" y1="67" x2="300" y2="101" stroke="#9E9E9E" stroke-width="2" marker-end="url(#lcrep-g)" opacity="0.6"/>
  <line x1="340" y1="101" x2="340" y2="67" stroke="#9E9E9E" stroke-width="2" marker-end="url(#lcrep-g)" opacity="0.6"/>
  <text x="292" y="88.0" text-anchor="end" font-size="10" opacity="0.6"><tspan fill="#888">entrega </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">loadProducts()</tspan></text>
  <text x="348" y="88.0" font-size="10" opacity="0.6"><tspan fill="#888">recibe </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">ProductsState</tspan></text>
  <line x1="300" y1="151" x2="300" y2="185" stroke="#FF7043" stroke-width="2" marker-end="url(#lcrep-e)"/>
  <line x1="340" y1="185" x2="340" y2="151" stroke="#26A69A" stroke-width="2" marker-end="url(#lcrep-r)"/>
  <text x="292" y="172.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">getProducts()</tspan></text>
  <text x="348" y="172.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">List&lt;Product&gt;</tspan></text>
  <line x1="300" y1="235" x2="300" y2="269" stroke="#FF7043" stroke-width="2" marker-end="url(#lcrep-e)"/>
  <line x1="340" y1="269" x2="340" y2="235" stroke="#26A69A" stroke-width="2" marker-end="url(#lcrep-r)"/>
  <text x="292" y="256.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">GET /api/products</tspan></text>
  <text x="348" y="256.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">JSON</tspan></text>
  <line x1="150" y1="348" x2="176" y2="348" stroke="#FF7043" stroke-width="2" marker-end="url(#lcrep-e)"/>
  <text x="182" y="352" fill="#888" font-size="10">entrega a la capa de abajo</text>
  <line x1="350" y1="348" x2="376" y2="348" stroke="#26A69A" stroke-width="2" marker-end="url(#lcrep-r)"/>
  <text x="382" y="352" fill="#888" font-size="10">recibe de la capa de abajo</text>
</svg>
```

Es la única clase que sabe que existe HTTP. Hace el `GET` y convierte el JSON en productos. La API no devuelve la lista directamente: la envuelve en un objeto, `{ "data": [...], "totalPages": 2, ... }`, así que primero hay que sacarla de `data`.

```dart
class ProductsApi {
  Future<List<Product>> getProducts() async {
    final response = await http.get(Uri.parse('https://fakestoreapi.noksha.dev/api/products'));
    if (response.statusCode != 200) throw Exception('Error ${response.statusCode}');
    final data = jsonDecode(response.body)['data'] as List;
    return data.map((json) => Product.fromJson(json)).toList();
  }
}
```

## Paso 5 · Ensamblar

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="200" viewBox="0 0 720 200" font-family="Roboto, Arial, sans-serif" style="display:block;margin:0 auto;max-width:100%;height:auto;">
  <rect x="120" y="10" width="480" height="180" rx="14" fill="#9E9E9E" fill-opacity="0.08" stroke="#9E9E9E"/>
  <text x="136" y="32" fill="#888" font-size="12" font-weight="bold" font-family="monospace">BlocProvider(create: …)</text>
  <rect x="142" y="44" width="436" height="132" rx="12" fill="#42A5F5" fill-opacity="0.10" stroke="#42A5F5"/>
  <text x="158" y="66" fill="#42A5F5" font-size="12" font-weight="bold" font-family="monospace">ProductsCubit(</text>
  <rect x="164" y="78" width="392" height="52" rx="8" fill="#FFA726" fill-opacity="0.18" stroke="#FFA726"/>
  <text x="360" y="109" text-anchor="middle" fill="#FFA726" font-size="12" font-weight="bold" font-family="monospace">ProductsApi()</text>
  <text x="566" y="160" text-anchor="end" fill="#42A5F5" font-size="12" font-weight="bold" font-family="monospace">)..loadProducts()</text>
</svg>
```

El `Cubit` recibe su `ProductsApi` por constructor, y los dos se crean en el `create` del `BlocProvider`. `..loadProducts()` es una cascada: llama `loadProducts()` sobre el `Cubit` recién creado y le entrega ese mismo `Cubit` al provider. Así la pantalla arranca cargando.

```dart
void main() {
  runApp(
    MaterialApp(
      routes: {
        '/': (_) => BlocProvider(
              create: (_) => ProductsCubit(ProductsApi())..loadProducts(),
              child: const ProductsScreen(),
            ),
      },
    ),
  );
}
```

Con esto la Parte 1 corre: la app abre, muestra el indicador y después los primeros 20 productos.

## Parte 2 · Cargar más

Ahora es tu turno. La API entrega 20 productos por página, y hay más. Agrega un botón «Cargar más» al final de la lista que traiga la página siguiente y la sume a la que ya se ve. Recorre las mismas capas:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="366" viewBox="0 0 640 366" font-family="Roboto, Arial, sans-serif" style="display:block;margin:0 auto;max-width:100%;height:auto;">
  <defs>
    <marker id="lcpag-e" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#FF7043"/></marker>
    <marker id="lcpag-r" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#26A69A"/></marker>
    <marker id="lcpag-g" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#9E9E9E"/></marker>
  </defs>
  <rect x="220" y="20" width="200" height="44" rx="8" fill="#FFA726"/>
  <text x="320" y="40" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">ProductsScreen</text>
  <text x="320" y="55" text-anchor="middle" fill="#FFFFFF" font-size="10">Vista</text>
  <rect x="220" y="104" width="200" height="44" rx="8" fill="#42A5F5"/>
  <text x="320" y="124" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">ProductsCubit</text>
  <text x="320" y="139" text-anchor="middle" fill="#FFFFFF" font-size="10">Cubit</text>
  <rect x="220" y="188" width="200" height="44" rx="8" fill="#FFA726"/>
  <text x="320" y="208" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">ProductsApi</text>
  <text x="320" y="223" text-anchor="middle" fill="#FFFFFF" font-size="10">Infrastructure · HTTP</text>
  <ellipse cx="320" cy="294" rx="110" ry="22" fill="#AB47BC"/>
  <text x="320" y="299" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="bold">fakestoreapi.noksha.dev</text>
  <line x1="300" y1="67" x2="300" y2="101" stroke="#FF7043" stroke-width="2" marker-end="url(#lcpag-e)"/>
  <line x1="340" y1="101" x2="340" y2="67" stroke="#26A69A" stroke-width="2" marker-end="url(#lcpag-r)"/>
  <text x="292" y="88.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">loadMore()</tspan></text>
  <text x="348" y="88.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">ProductsState</tspan></text>
  <line x1="300" y1="151" x2="300" y2="185" stroke="#FF7043" stroke-width="2" marker-end="url(#lcpag-e)"/>
  <line x1="340" y1="185" x2="340" y2="151" stroke="#26A69A" stroke-width="2" marker-end="url(#lcpag-r)"/>
  <text x="292" y="172.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">getProducts(page)</tspan></text>
  <text x="348" y="172.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">(List&lt;Product&gt;, totalPages)</tspan></text>
  <line x1="300" y1="235" x2="300" y2="269" stroke="#FF7043" stroke-width="2" marker-end="url(#lcpag-e)"/>
  <line x1="340" y1="269" x2="340" y2="235" stroke="#26A69A" stroke-width="2" marker-end="url(#lcpag-r)"/>
  <text x="292" y="256.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">GET ?page=2</tspan></text>
  <text x="348" y="256.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">JSON</tspan></text>
  <line x1="150" y1="348" x2="176" y2="348" stroke="#FF7043" stroke-width="2" marker-end="url(#lcpag-e)"/>
  <text x="182" y="352" fill="#888" font-size="10">entrega a la capa de abajo</text>
  <line x1="350" y1="348" x2="376" y2="348" stroke="#26A69A" stroke-width="2" marker-end="url(#lcpag-r)"/>
  <text x="382" y="352" fill="#888" font-size="10">recibe de la capa de abajo</text>
</svg>
```

Qué agregar en cada capa:

| Capa | Qué agregar |
|---|---|
| Vista | Un botón «Cargar más» después del último producto, que llama `loadMore()`. Se oculta cuando ya no hay más páginas |
| Cubit | `ProductsSuccess` guarda también `page` y `totalPages`. `loadMore()` pide la página siguiente y emite un `ProductsSuccess` con la lista anterior más la nueva |
| Infrastructure | `getProducts(page)` de `ProductsApi` agrega `?page=` a la URL y devuelve los productos junto con `totalPages` |

La página se pide con `?page=`:

```dart
Uri.parse('https://fakestoreapi.noksha.dev/api/products?page=$page')
```

Pedir una página que no existe no devuelve una lista vacía: devuelve un error `400` con el mensaje `Page 3 exceeds total pages (2)`. Por eso `ProductsApi` devuelve también `totalPages`, y el `Cubit` deja de pedir cuando la alcanza. Un *record* devuelve los dos valores sin crear una clase nueva:

```dart
return (products, body['totalPages'] as int);
```

```dart
final (products, totalPages) = await _api.getProducts(page);
```

Dentro de `loadMore()` necesitas la lista actual, que solo existe en `ProductsSuccess`. Escribir `if (state is ProductsSuccess)` no alcanza: `state` es un getter del `Cubit` y Dart no promueve el tipo de un getter. Cópialo a una variable local, que sí se promueve:

```dart
final current = state;
if (current is! ProductsSuccess) return;
```

## Criterios de entrega

- La pantalla carga los productos al abrir, con un indicador mientras carga y el mensaje si falla.
- Cada producto muestra foto, título, categoría y precio.
- El botón ↻ recarga la lista.
- «Cargar más» trae la página siguiente, la suma a la lista y desaparece en la última página.
- Solo `ProductsApi`, en la infraestructura, usa `http`, y la vista solo habla con el `Cubit`.
