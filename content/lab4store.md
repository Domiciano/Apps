# Laboratorio 4: Fake Store

<!-- tags: ProductsBloc, copyWith, entrega y recibe entre capas, SearchProductsUseCase, filtrar en el UseCase, Product.fromJson, 'int' is not a subtype of type 'double', StoreDataSource, ProductsRepositoryImpl, BlocProvider, respuesta envuelta en data, POST a Firebase -->

Es el mismo laboratorio que *Deezer ain't the best option*, esta vez con el catálogo de una tienda de ropa: `https://fakestoreapi.noksha.dev/api/products`. Vas a construir un buscador de productos con Clean Architecture y Bloc, capa por capa.

La **Parte 1** es guiada: cada paso trae un gráfico con lo que esa capa **entrega** a la de abajo y lo que **recibe** de vuelta, una descripción de su trabajo y el código mínimo. La **Parte 2** —guardar productos en *favoritos* y consultarlos— la construyes tú con las mismas piezas.

Hay una diferencia importante con Deezer: esta API **no busca**. Siempre devuelve el catálogo completo, sin importar lo que le pidas. Buscar es entonces una regla de negocio de tu app, y vive donde viven las reglas de negocio: en el `UseCase`.

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
└── features/products/
    ├── domain/  product.dart · products_repository.dart · search_products_usecase.dart
    ├── data/    store_data_source.dart · products_repository_impl.dart
    └── ui/      products_bloc.dart · products_screen.dart
```

En los bloques de código se omiten los `import`: el editor los sugiere.

## El mapa

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="615" viewBox="0 0 640 615" font-family="Roboto, Arial, sans-serif" style="display:block;margin:0 auto;max-width:100%;height:auto;">
  <defs>
    <marker id="l4smap-e" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#FF7043"/></marker>
    <marker id="l4smap-r" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#26A69A"/></marker>
    <marker id="l4smap-g" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#9E9E9E"/></marker>
    <marker id="l4smap-i" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#66BB6A"/></marker>
  </defs>
  <rect x="220" y="20" width="200" height="44" rx="8" fill="#FFA726"/>
  <text x="320" y="40" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">ProductsScreen</text>
  <text x="320" y="55" text-anchor="middle" fill="#FFFFFF" font-size="10">Vista</text>
  <rect x="220" y="104" width="200" height="44" rx="8" fill="#42A5F5"/>
  <text x="320" y="124" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">ProductsBloc</text>
  <text x="320" y="139" text-anchor="middle" fill="#FFFFFF" font-size="10">Bloc</text>
  <rect x="220" y="188" width="200" height="44" rx="8" fill="#66BB6A"/>
  <text x="320" y="208" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">SearchProductsUseCase</text>
  <text x="320" y="223" text-anchor="middle" fill="#FFFFFF" font-size="10">UseCase · filtra</text>
  <rect x="220" y="272" width="200" height="44" rx="8" fill="#66BB6A"/>
  <text x="320" y="292" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">ProductsRepository</text>
  <text x="320" y="307" text-anchor="middle" fill="#FFFFFF" font-size="10">contrato</text>
  <rect x="220" y="356" width="200" height="44" rx="8" fill="#FFA726"/>
  <text x="320" y="376" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">ProductsRepositoryImpl</text>
  <text x="320" y="391" text-anchor="middle" fill="#FFFFFF" font-size="10">implementación</text>
  <rect x="220" y="440" width="200" height="44" rx="8" fill="#FFA726"/>
  <text x="320" y="460" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">StoreDataSource</text>
  <text x="320" y="475" text-anchor="middle" fill="#FFFFFF" font-size="10">DataSource</text>
  <ellipse cx="320" cy="546" rx="100" ry="22" fill="#AB47BC"/>
  <text x="320" y="551" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">fakestoreapi.noksha.dev</text>
  <line x1="300" y1="67" x2="300" y2="101" stroke="#FF7043" stroke-width="2" marker-end="url(#l4smap-e)"/>
  <line x1="340" y1="101" x2="340" y2="67" stroke="#26A69A" stroke-width="2" marker-end="url(#l4smap-r)"/>
  <text x="292" y="88.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">SearchSubmitted(query)</tspan></text>
  <text x="348" y="88.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">ProductsState</tspan></text>
  <line x1="300" y1="151" x2="300" y2="185" stroke="#FF7043" stroke-width="2" marker-end="url(#l4smap-e)"/>
  <line x1="340" y1="185" x2="340" y2="151" stroke="#26A69A" stroke-width="2" marker-end="url(#l4smap-r)"/>
  <text x="292" y="172.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">query</tspan></text>
  <text x="348" y="172.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">List&lt;Product&gt;</tspan></text>
  <line x1="300" y1="235" x2="300" y2="269" stroke="#FF7043" stroke-width="2" marker-end="url(#l4smap-e)"/>
  <line x1="340" y1="269" x2="340" y2="235" stroke="#26A69A" stroke-width="2" marker-end="url(#l4smap-r)"/>
  <text x="292" y="256.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">getProducts()</tspan></text>
  <text x="348" y="256.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">List&lt;Product&gt;</tspan></text>
  <line x1="320" y1="318" x2="320" y2="353" stroke="#66BB6A" stroke-width="2" stroke-dasharray="5,3" marker-end="url(#l4smap-i)"/>
  <text x="330" y="340.0" fill="#66BB6A" font-size="10">implementado por</text>
  <line x1="300" y1="403" x2="300" y2="437" stroke="#FF7043" stroke-width="2" marker-end="url(#l4smap-e)"/>
  <line x1="340" y1="437" x2="340" y2="403" stroke="#26A69A" stroke-width="2" marker-end="url(#l4smap-r)"/>
  <text x="292" y="424.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">getProducts()</tspan></text>
  <text x="348" y="424.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">List&lt;Product&gt;</tspan></text>
  <line x1="300" y1="487" x2="300" y2="521" stroke="#FF7043" stroke-width="2" marker-end="url(#l4smap-e)"/>
  <line x1="340" y1="521" x2="340" y2="487" stroke="#26A69A" stroke-width="2" marker-end="url(#l4smap-r)"/>
  <text x="292" y="508.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">GET /api/products</tspan></text>
  <text x="348" y="508.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">JSON</tspan></text>
  <line x1="150" y1="597" x2="176" y2="597" stroke="#FF7043" stroke-width="2" marker-end="url(#l4smap-e)"/>
  <text x="182" y="601" fill="#888" font-size="10">entrega a la capa de abajo</text>
  <line x1="350" y1="597" x2="376" y2="597" stroke="#26A69A" stroke-width="2" marker-end="url(#l4smap-r)"/>
  <text x="382" y="601" fill="#888" font-size="10">recibe de la capa de abajo</text>
</svg>
```

Cada caja es una clase y cada paso construye una. Las flechas de la izquierda bajan: lo que una capa **entrega** a la de abajo. Las de la derecha suben: lo que **recibe** de vuelta. Fíjate en el `UseCase`: **recibe** el `query`, pero no se lo pasa a nadie. Pide el catálogo completo y filtra él mismo.

## Paso 1 · Product

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="175" viewBox="0 0 720 175" font-family="Roboto, Arial, sans-serif" style="display:block;margin:0 auto;max-width:100%;height:auto;">
  <defs><marker id="l4spr-a" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#888"/></marker></defs>
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
  <line x1="213" y1="95" x2="262" y2="95" stroke="#888" stroke-width="1.5" marker-end="url(#l4spr-a)"/>
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

Es la entidad que viaja por todas las capas. Esta API tiene dos detalles que hay que cuidar al convertir el JSON:

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
  <defs><clipPath id="l4sv-screen"><rect x="0" y="0" width="240" height="380" rx="20"/></clipPath></defs>
  <g transform="translate(40,20)">
    <g clip-path="url(#l4sv-screen)">
      <rect x="0" y="0" width="240" height="380" fill="#FFFFFF"/>
      <rect x="0" y="0" width="240" height="44" fill="#1976D2"/>
      <text x="16" y="28" fill="#FFFFFF" font-size="13" font-weight="bold">Fake Store</text>
      <rect x="12" y="56" width="216" height="36" rx="6" fill="#FFFFFF" stroke="#9E9E9E"/>
      <text x="22" y="79" fill="#212121" font-size="11">jacket</text>
      <rect x="0" y="100" width="240" height="3" fill="#BBDEFB"/>
      <rect x="0" y="100" width="90" height="3" fill="#1976D2"/>
      <rect x="12" y="118" width="42" height="42" rx="6" fill="#8D6E63"/>
      <text x="62" y="137" fill="#212121" font-size="11">Long sleeve Jacket</text>
      <text x="62" y="153" fill="#757575" font-size="10">women · $150.00</text>
      <text x="214" y="146" fill="#EF5350" font-size="20">♡</text>
      <line x1="62" y1="167" x2="240" y2="167" stroke="#EEEEEE"/>
      <rect x="12" y="174" width="42" height="42" rx="6" fill="#5C6BC0"/>
      <text x="62" y="193" fill="#212121" font-size="11">Jacket with wollen hat</text>
      <text x="62" y="209" fill="#757575" font-size="10">women · $65.00</text>
      <text x="214" y="202" fill="#EF5350" font-size="20">♡</text>
      <line x1="62" y1="223" x2="240" y2="223" stroke="#EEEEEE"/>
      <rect x="12" y="230" width="42" height="42" rx="6" fill="#42A5F5"/>
      <text x="62" y="249" fill="#212121" font-size="11">Jean&#x27;s stylish Jacket</text>
      <text x="62" y="265" fill="#757575" font-size="10">men · $245.00</text>
      <text x="214" y="258" fill="#EF5350" font-size="20">♡</text>
      <line x1="62" y1="279" x2="240" y2="279" stroke="#EEEEEE"/>
      <rect x="12" y="286" width="42" height="42" rx="6" fill="#424242"/>
      <text x="62" y="305" fill="#212121" font-size="11">Black Jacket</text>
      <text x="62" y="321" fill="#757575" font-size="10">men · $140.00</text>
      <text x="214" y="314" fill="#EF5350" font-size="20">♡</text>
    </g>
    <rect x="0" y="0" width="240" height="380" rx="20" fill="none" stroke="#9E9E9E"/>
  </g>
  <path d="M284,134 H292 V352 H284" fill="none" stroke="#888"/>
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
  <text x="326" y="242" fill="#888" font-size="11">dibuja state.products: foto, título, categoría y precio</text>
  <circle cx="263" cy="313" r="3" fill="#FFA726"/>
  <line x1="263" y1="313" x2="318" y2="318" stroke="#888" stroke-dasharray="3,3"/>
  <text x="326" y="314" fill="#FFA726" font-size="12" font-weight="bold">♡ Favorito</text>
  <text x="326" y="330" fill="#888" font-size="11">Parte 2: guarda el producto con POST</text>
</svg>
```

`ProductsScreen` hace dos cosas y nada más: **entrega** el evento `SearchSubmitted` cuando el usuario envía el texto, y dibuja el `ProductsState` que **recibe**. No filtra ni decide nada.

- Un `TextField` que, al enviar, lanza `SearchSubmitted(query)`.
- Una `LinearProgressIndicator`, solo si `status` es `loading`.
- El mensaje de error, solo si `status` es `failure`.
- Un `ListView` con `state.products`: foto, título, categoría y precio.

```dart
class ProductsScreen extends StatefulWidget {
  const ProductsScreen({super.key});

  @override
  State<ProductsScreen> createState() => _ProductsScreenState();
}

class _ProductsScreenState extends State<ProductsScreen> {
  final _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Fake Store')),
      body: Column(
        children: [
          TextField(
            controller: _controller,
            decoration: const InputDecoration(hintText: 'Buscar producto'),
            onSubmitted: (query) => context.read<ProductsBloc>().add(SearchSubmitted(query)),
          ),
          Expanded(
            child: BlocBuilder<ProductsBloc, ProductsState>(
              builder: (context, state) => Column(
                children: [
                  if (state.status == ProductsStatus.loading) const LinearProgressIndicator(),
                  if (state.status == ProductsStatus.failure) Text(state.errorMessage ?? ''),
                  Expanded(
                    child: ListView(
                      children: [
                        for (final product in state.products)
                          ListTile(
                            leading: Image.network(product.image, width: 56, fit: BoxFit.cover),
                            title: Text(product.title),
                            subtitle: Text('${product.category} · \$${product.price.toStringAsFixed(2)}'),
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
    <marker id="l4sb-e" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#FF7043"/></marker>
    <marker id="l4sb-r" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#26A69A"/></marker>
    <marker id="l4sb-g" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#888"/></marker>
  </defs>
  <rect x="20" y="70" width="170" height="230" rx="14" fill="#FFA726" fill-opacity="0.08" stroke="#FFA726"/>
  <text x="105" y="96" text-anchor="middle" fill="#FFA726" font-size="14" font-weight="bold">ProductsScreen</text>
  <text x="105" y="112" text-anchor="middle" fill="#888" font-size="10">Vista</text>
  <rect x="35" y="135" width="140" height="40" rx="8" fill="#FFA726" fill-opacity="0.18"/>
  <text x="105" y="160" text-anchor="middle" fill="#888" font-size="12">TextField</text>
  <rect x="35" y="230" width="140" height="40" rx="8" fill="#FFA726" fill-opacity="0.18"/>
  <text x="105" y="255" text-anchor="middle" fill="#888" font-size="12">BlocBuilder</text>

  <rect x="300" y="40" width="400" height="280" rx="16" fill="#42A5F5" fill-opacity="0.08" stroke="#42A5F5"/>
  <text x="500" y="66" text-anchor="middle" fill="#42A5F5" font-size="15" font-weight="bold">ProductsBloc</text>

  <rect x="318" y="100" width="170" height="70" rx="10" fill="#FF7043" fill-opacity="0.12" stroke="#FF7043" stroke-opacity="0.6"/>
  <text x="403" y="122" text-anchor="middle" fill="#FF7043" font-size="12" font-weight="bold">Eventos</text>
  <text x="403" y="148" text-anchor="middle" fill="#888" font-size="10" font-family="monospace">SearchSubmitted(query)</text>

  <rect x="318" y="195" width="170" height="110" rx="10" fill="#26A69A" fill-opacity="0.12" stroke="#26A69A" stroke-opacity="0.6"/>
  <text x="403" y="217" text-anchor="middle" fill="#26A69A" font-size="12" font-weight="bold">Estado · ProductsState</text>
  <text x="403" y="240" text-anchor="middle" fill="#888" font-size="10" font-family="monospace">status</text>
  <text x="403" y="256" text-anchor="middle" fill="#888" font-size="10" font-family="monospace">products</text>
  <text x="403" y="272" text-anchor="middle" fill="#888" font-size="10" font-family="monospace">errorMessage</text>
  <text x="403" y="292" text-anchor="middle" fill="#888" font-size="10" font-family="monospace">copyWith()</text>

  <rect x="510" y="100" width="175" height="205" rx="10" fill="#42A5F5" fill-opacity="0.15"/>
  <text x="597" y="122" text-anchor="middle" fill="#42A5F5" font-size="12" font-weight="bold" font-family="monospace">_onSubmitted</text>
  <text x="524" y="152" fill="#888" font-size="11">1 · emite loading</text>
  <text x="524" y="176" fill="#888" font-size="11">2 · pide al UseCase</text>
  <text x="524" y="200" fill="#888" font-size="11">3 · emite success</text>
  <text x="538" y="218" fill="#888" font-size="11">o failure</text>

  <line x1="490" y1="135" x2="507" y2="135" stroke="#888" stroke-width="1.5" marker-end="url(#l4sb-g)"/>
  <line x1="508" y1="250" x2="491" y2="250" stroke="#888" stroke-width="1.5" marker-end="url(#l4sb-g)"/>

  <line x1="177" y1="155" x2="315" y2="135" stroke="#FF7043" stroke-width="2.5" marker-end="url(#l4sb-e)"/>
  <text x="245" y="128" text-anchor="middle" fill="#FF7043" font-size="10" font-weight="bold">entrega el evento</text>
  <line x1="316" y1="250" x2="179" y2="250" stroke="#26A69A" stroke-width="2.5" marker-end="url(#l4sb-r)"/>
  <text x="245" y="270" text-anchor="middle" fill="#26A69A" font-size="10" font-weight="bold">recibe el estado</text>

  <line x1="580" y1="307" x2="580" y2="355" stroke="#FF7043" stroke-width="2" marker-end="url(#l4sb-e)"/>
  <line x1="610" y1="356" x2="610" y2="309" stroke="#26A69A" stroke-width="2" marker-end="url(#l4sb-r)"/>
  <text x="572" y="336" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-weight="bold">query</tspan></text>
  <text x="572" y="351" text-anchor="end" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-weight="bold">List&lt;Product&gt;</tspan></text>
  <rect x="495" y="360" width="200" height="44" rx="8" fill="#66BB6A" fill-opacity="0.15" stroke="#66BB6A"/>
  <text x="595" y="387" text-anchor="middle" fill="#66BB6A" font-size="12" font-weight="bold">SearchProductsUseCase</text>
</svg>
```

El `Bloc` **recibe** el evento de la vista, le **entrega** el `query` al `UseCase`, **recibe** la lista ya filtrada y le **entrega** estados a la vista: primero `loading`, después `success` con los productos o `failure` con el mensaje. Como el estado es una sola clase con `copyWith`, los resultados anteriores siguen en pantalla mientras llega la búsqueda nueva.

```dart
abstract class ProductsEvent {}

class SearchSubmitted extends ProductsEvent {
  final String query;

  SearchSubmitted(this.query);
}

enum ProductsStatus { initial, loading, success, failure }

class ProductsState {
  final ProductsStatus status;
  final List<Product> products;
  final String? errorMessage;

  const ProductsState({this.status = ProductsStatus.initial, this.products = const [], this.errorMessage});

  ProductsState copyWith({ProductsStatus? status, List<Product>? products, String? errorMessage}) {
    return ProductsState(
      status: status ?? this.status,
      products: products ?? this.products,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}
```

```dart
class ProductsBloc extends Bloc<ProductsEvent, ProductsState> {
  final SearchProductsUseCase _searchProducts;

  ProductsBloc(this._searchProducts) : super(const ProductsState()) {
    on<SearchSubmitted>(_onSubmitted);
  }

  Future<void> _onSubmitted(SearchSubmitted event, Emitter<ProductsState> emit) async {
    emit(state.copyWith(status: ProductsStatus.loading));
    try {
      final products = await _searchProducts(event.query);
      emit(state.copyWith(status: ProductsStatus.success, products: products));
    } on Exception catch (e) {
      emit(state.copyWith(status: ProductsStatus.failure, errorMessage: e.toString()));
    }
  }
}
```

## Paso 4 · El dominio: contrato y UseCase

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="615" viewBox="0 0 640 615" font-family="Roboto, Arial, sans-serif" style="display:block;margin:0 auto;max-width:100%;height:auto;">
  <defs>
    <marker id="l4sdom-e" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#FF7043"/></marker>
    <marker id="l4sdom-r" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#26A69A"/></marker>
    <marker id="l4sdom-g" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#9E9E9E"/></marker>
    <marker id="l4sdom-i" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#66BB6A"/></marker>
  </defs>
  <rect x="220" y="20" width="200" height="44" rx="8" fill="#FFA726" fill-opacity="0.08" stroke="#FFA726" stroke-opacity="0.5"/>
  <text x="320" y="40" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">ProductsScreen</text>
  <text x="320" y="55" text-anchor="middle" fill="#888" font-size="10">Vista</text>
  <rect x="220" y="104" width="200" height="44" rx="8" fill="#42A5F5" fill-opacity="0.08" stroke="#42A5F5" stroke-opacity="0.5"/>
  <text x="320" y="124" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">ProductsBloc</text>
  <text x="320" y="139" text-anchor="middle" fill="#888" font-size="10">Bloc</text>
  <rect x="220" y="188" width="200" height="44" rx="8" fill="#66BB6A"/>
  <text x="320" y="208" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">SearchProductsUseCase</text>
  <text x="320" y="223" text-anchor="middle" fill="#FFFFFF" font-size="10">UseCase · filtra</text>
  <rect x="220" y="272" width="200" height="44" rx="8" fill="#66BB6A"/>
  <text x="320" y="292" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">ProductsRepository</text>
  <text x="320" y="307" text-anchor="middle" fill="#FFFFFF" font-size="10">contrato</text>
  <rect x="220" y="356" width="200" height="44" rx="8" fill="#FFA726" fill-opacity="0.08" stroke="#FFA726" stroke-opacity="0.5"/>
  <text x="320" y="376" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">ProductsRepositoryImpl</text>
  <text x="320" y="391" text-anchor="middle" fill="#888" font-size="10">implementación</text>
  <rect x="220" y="440" width="200" height="44" rx="8" fill="#FFA726" fill-opacity="0.08" stroke="#FFA726" stroke-opacity="0.5"/>
  <text x="320" y="460" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">StoreDataSource</text>
  <text x="320" y="475" text-anchor="middle" fill="#888" font-size="10">DataSource</text>
  <ellipse cx="320" cy="546" rx="100" ry="22" fill="#AB47BC" fill-opacity="0.08" stroke="#AB47BC" stroke-opacity="0.5"/>
  <text x="320" y="551" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">fakestoreapi.noksha.dev</text>
  <line x1="300" y1="67" x2="300" y2="101" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4sdom-g)" opacity="0.6"/>
  <line x1="340" y1="101" x2="340" y2="67" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4sdom-g)" opacity="0.6"/>
  <text x="292" y="88.0" text-anchor="end" font-size="10" opacity="0.6"><tspan fill="#888">entrega </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">SearchSubmitted(query)</tspan></text>
  <text x="348" y="88.0" font-size="10" opacity="0.6"><tspan fill="#888">recibe </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">ProductsState</tspan></text>
  <line x1="300" y1="151" x2="300" y2="185" stroke="#FF7043" stroke-width="2" marker-end="url(#l4sdom-e)"/>
  <line x1="340" y1="185" x2="340" y2="151" stroke="#26A69A" stroke-width="2" marker-end="url(#l4sdom-r)"/>
  <text x="292" y="172.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">query</tspan></text>
  <text x="348" y="172.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">List&lt;Product&gt;</tspan></text>
  <line x1="300" y1="235" x2="300" y2="269" stroke="#FF7043" stroke-width="2" marker-end="url(#l4sdom-e)"/>
  <line x1="340" y1="269" x2="340" y2="235" stroke="#26A69A" stroke-width="2" marker-end="url(#l4sdom-r)"/>
  <text x="292" y="256.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">getProducts()</tspan></text>
  <text x="348" y="256.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">List&lt;Product&gt;</tspan></text>
  <line x1="320" y1="318" x2="320" y2="353" stroke="#9E9E9E" stroke-width="2" stroke-dasharray="5,3" marker-end="url(#l4sdom-g)"/>
  <text x="330" y="340.0" fill="#888" font-size="10">implementado por</text>
  <line x1="300" y1="403" x2="300" y2="437" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4sdom-g)" opacity="0.6"/>
  <line x1="340" y1="437" x2="340" y2="403" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4sdom-g)" opacity="0.6"/>
  <text x="292" y="424.0" text-anchor="end" font-size="10" opacity="0.6"><tspan fill="#888">entrega </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">getProducts()</tspan></text>
  <text x="348" y="424.0" font-size="10" opacity="0.6"><tspan fill="#888">recibe </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">List&lt;Product&gt;</tspan></text>
  <line x1="300" y1="487" x2="300" y2="521" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4sdom-g)" opacity="0.6"/>
  <line x1="340" y1="521" x2="340" y2="487" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4sdom-g)" opacity="0.6"/>
  <text x="292" y="508.0" text-anchor="end" font-size="10" opacity="0.6"><tspan fill="#888">entrega </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">GET /api/products</tspan></text>
  <text x="348" y="508.0" font-size="10" opacity="0.6"><tspan fill="#888">recibe </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">JSON</tspan></text>
  <line x1="150" y1="597" x2="176" y2="597" stroke="#FF7043" stroke-width="2" marker-end="url(#l4sdom-e)"/>
  <text x="182" y="601" fill="#888" font-size="10">entrega a la capa de abajo</text>
  <line x1="350" y1="597" x2="376" y2="597" stroke="#26A69A" stroke-width="2" marker-end="url(#l4sdom-r)"/>
  <text x="382" y="601" fill="#888" font-size="10">recibe de la capa de abajo</text>
</svg>
```

El contrato `ProductsRepository` solo dice *qué* se puede pedir: el catálogo. El `UseCase` **recibe** el `query` del `Bloc`, le pide el catálogo al contrato y se queda con los productos cuyo título contiene el texto, sin importar mayúsculas. Con el `query` vacío, todos pasan el filtro.

```dart
abstract class ProductsRepository {
  Future<List<Product>> getProducts();
}

class SearchProductsUseCase {
  final ProductsRepository _repository;

  SearchProductsUseCase(this._repository);

  Future<List<Product>> call(String query) async {
    final products = await _repository.getProducts();
    return products.where((product) => product.title.toLowerCase().contains(query.toLowerCase())).toList();
  }
}
```

Este es el primer `UseCase` del curso que hace algo más que pasar la llamada: aplica una regla. Ni la vista ni el `DataSource` saben que existe la búsqueda. Si mañana la API aprendiera a buscar, solo cambiaría esta clase.

## Paso 5 · El DataSource

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="615" viewBox="0 0 640 615" font-family="Roboto, Arial, sans-serif" style="display:block;margin:0 auto;max-width:100%;height:auto;">
  <defs>
    <marker id="l4sds-e" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#FF7043"/></marker>
    <marker id="l4sds-r" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#26A69A"/></marker>
    <marker id="l4sds-g" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#9E9E9E"/></marker>
    <marker id="l4sds-i" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#66BB6A"/></marker>
  </defs>
  <rect x="220" y="20" width="200" height="44" rx="8" fill="#FFA726" fill-opacity="0.08" stroke="#FFA726" stroke-opacity="0.5"/>
  <text x="320" y="40" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">ProductsScreen</text>
  <text x="320" y="55" text-anchor="middle" fill="#888" font-size="10">Vista</text>
  <rect x="220" y="104" width="200" height="44" rx="8" fill="#42A5F5" fill-opacity="0.08" stroke="#42A5F5" stroke-opacity="0.5"/>
  <text x="320" y="124" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">ProductsBloc</text>
  <text x="320" y="139" text-anchor="middle" fill="#888" font-size="10">Bloc</text>
  <rect x="220" y="188" width="200" height="44" rx="8" fill="#66BB6A" fill-opacity="0.08" stroke="#66BB6A" stroke-opacity="0.5"/>
  <text x="320" y="208" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">SearchProductsUseCase</text>
  <text x="320" y="223" text-anchor="middle" fill="#888" font-size="10">UseCase · filtra</text>
  <rect x="220" y="272" width="200" height="44" rx="8" fill="#66BB6A" fill-opacity="0.08" stroke="#66BB6A" stroke-opacity="0.5"/>
  <text x="320" y="292" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">ProductsRepository</text>
  <text x="320" y="307" text-anchor="middle" fill="#888" font-size="10">contrato</text>
  <rect x="220" y="356" width="200" height="44" rx="8" fill="#FFA726" fill-opacity="0.08" stroke="#FFA726" stroke-opacity="0.5"/>
  <text x="320" y="376" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">ProductsRepositoryImpl</text>
  <text x="320" y="391" text-anchor="middle" fill="#888" font-size="10">implementación</text>
  <rect x="220" y="440" width="200" height="44" rx="8" fill="#FFA726"/>
  <text x="320" y="460" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">StoreDataSource</text>
  <text x="320" y="475" text-anchor="middle" fill="#FFFFFF" font-size="10">DataSource</text>
  <ellipse cx="320" cy="546" rx="100" ry="22" fill="#AB47BC"/>
  <text x="320" y="551" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">fakestoreapi.noksha.dev</text>
  <line x1="300" y1="67" x2="300" y2="101" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4sds-g)" opacity="0.6"/>
  <line x1="340" y1="101" x2="340" y2="67" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4sds-g)" opacity="0.6"/>
  <text x="292" y="88.0" text-anchor="end" font-size="10" opacity="0.6"><tspan fill="#888">entrega </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">SearchSubmitted(query)</tspan></text>
  <text x="348" y="88.0" font-size="10" opacity="0.6"><tspan fill="#888">recibe </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">ProductsState</tspan></text>
  <line x1="300" y1="151" x2="300" y2="185" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4sds-g)" opacity="0.6"/>
  <line x1="340" y1="185" x2="340" y2="151" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4sds-g)" opacity="0.6"/>
  <text x="292" y="172.0" text-anchor="end" font-size="10" opacity="0.6"><tspan fill="#888">entrega </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">query</tspan></text>
  <text x="348" y="172.0" font-size="10" opacity="0.6"><tspan fill="#888">recibe </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">List&lt;Product&gt;</tspan></text>
  <line x1="300" y1="235" x2="300" y2="269" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4sds-g)" opacity="0.6"/>
  <line x1="340" y1="269" x2="340" y2="235" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4sds-g)" opacity="0.6"/>
  <text x="292" y="256.0" text-anchor="end" font-size="10" opacity="0.6"><tspan fill="#888">entrega </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">getProducts()</tspan></text>
  <text x="348" y="256.0" font-size="10" opacity="0.6"><tspan fill="#888">recibe </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">List&lt;Product&gt;</tspan></text>
  <line x1="320" y1="318" x2="320" y2="353" stroke="#9E9E9E" stroke-width="2" stroke-dasharray="5,3" marker-end="url(#l4sds-g)"/>
  <text x="330" y="340.0" fill="#888" font-size="10">implementado por</text>
  <line x1="300" y1="403" x2="300" y2="437" stroke="#FF7043" stroke-width="2" marker-end="url(#l4sds-e)"/>
  <line x1="340" y1="437" x2="340" y2="403" stroke="#26A69A" stroke-width="2" marker-end="url(#l4sds-r)"/>
  <text x="292" y="424.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">getProducts()</tspan></text>
  <text x="348" y="424.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">List&lt;Product&gt;</tspan></text>
  <line x1="300" y1="487" x2="300" y2="521" stroke="#FF7043" stroke-width="2" marker-end="url(#l4sds-e)"/>
  <line x1="340" y1="521" x2="340" y2="487" stroke="#26A69A" stroke-width="2" marker-end="url(#l4sds-r)"/>
  <text x="292" y="508.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">GET /api/products</tspan></text>
  <text x="348" y="508.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">JSON</tspan></text>
  <line x1="150" y1="597" x2="176" y2="597" stroke="#FF7043" stroke-width="2" marker-end="url(#l4sds-e)"/>
  <text x="182" y="601" fill="#888" font-size="10">entrega a la capa de abajo</text>
  <line x1="350" y1="597" x2="376" y2="597" stroke="#26A69A" stroke-width="2" marker-end="url(#l4sds-r)"/>
  <text x="382" y="601" fill="#888" font-size="10">recibe de la capa de abajo</text>
</svg>
```

Es la única clase que sabe que existe HTTP. Le **entrega** a la API un `GET`, **recibe** el JSON y lo convierte en productos. La API no devuelve la lista directamente: la envuelve en un objeto, `{ "data": [...], "totalPages": 2, ... }`, así que primero hay que sacarla de `data`. Trae la primera página, con 20 productos.

```dart
class StoreDataSource {
  Future<List<Product>> getProducts() async {
    final response = await http.get(Uri.parse('https://fakestoreapi.noksha.dev/api/products'));
    if (response.statusCode != 200) throw Exception('Error ${response.statusCode}');
    final data = jsonDecode(response.body)['data'] as List;
    return data.map((json) => Product.fromJson(json)).toList();
  }
}
```

## Paso 6 · El RepositoryImpl

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="615" viewBox="0 0 640 615" font-family="Roboto, Arial, sans-serif" style="display:block;margin:0 auto;max-width:100%;height:auto;">
  <defs>
    <marker id="l4simp-e" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#FF7043"/></marker>
    <marker id="l4simp-r" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#26A69A"/></marker>
    <marker id="l4simp-g" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#9E9E9E"/></marker>
    <marker id="l4simp-i" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#66BB6A"/></marker>
  </defs>
  <rect x="220" y="20" width="200" height="44" rx="8" fill="#FFA726" fill-opacity="0.08" stroke="#FFA726" stroke-opacity="0.5"/>
  <text x="320" y="40" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">ProductsScreen</text>
  <text x="320" y="55" text-anchor="middle" fill="#888" font-size="10">Vista</text>
  <rect x="220" y="104" width="200" height="44" rx="8" fill="#42A5F5" fill-opacity="0.08" stroke="#42A5F5" stroke-opacity="0.5"/>
  <text x="320" y="124" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">ProductsBloc</text>
  <text x="320" y="139" text-anchor="middle" fill="#888" font-size="10">Bloc</text>
  <rect x="220" y="188" width="200" height="44" rx="8" fill="#66BB6A" fill-opacity="0.08" stroke="#66BB6A" stroke-opacity="0.5"/>
  <text x="320" y="208" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">SearchProductsUseCase</text>
  <text x="320" y="223" text-anchor="middle" fill="#888" font-size="10">UseCase · filtra</text>
  <rect x="220" y="272" width="200" height="44" rx="8" fill="#66BB6A" fill-opacity="0.08" stroke="#66BB6A" stroke-opacity="0.5"/>
  <text x="320" y="292" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">ProductsRepository</text>
  <text x="320" y="307" text-anchor="middle" fill="#888" font-size="10">contrato</text>
  <rect x="220" y="356" width="200" height="44" rx="8" fill="#FFA726"/>
  <text x="320" y="376" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">ProductsRepositoryImpl</text>
  <text x="320" y="391" text-anchor="middle" fill="#FFFFFF" font-size="10">implementación</text>
  <rect x="220" y="440" width="200" height="44" rx="8" fill="#FFA726" fill-opacity="0.08" stroke="#FFA726" stroke-opacity="0.5"/>
  <text x="320" y="460" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">StoreDataSource</text>
  <text x="320" y="475" text-anchor="middle" fill="#888" font-size="10">DataSource</text>
  <ellipse cx="320" cy="546" rx="100" ry="22" fill="#AB47BC" fill-opacity="0.08" stroke="#AB47BC" stroke-opacity="0.5"/>
  <text x="320" y="551" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">fakestoreapi.noksha.dev</text>
  <line x1="300" y1="67" x2="300" y2="101" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4simp-g)" opacity="0.6"/>
  <line x1="340" y1="101" x2="340" y2="67" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4simp-g)" opacity="0.6"/>
  <text x="292" y="88.0" text-anchor="end" font-size="10" opacity="0.6"><tspan fill="#888">entrega </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">SearchSubmitted(query)</tspan></text>
  <text x="348" y="88.0" font-size="10" opacity="0.6"><tspan fill="#888">recibe </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">ProductsState</tspan></text>
  <line x1="300" y1="151" x2="300" y2="185" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4simp-g)" opacity="0.6"/>
  <line x1="340" y1="185" x2="340" y2="151" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4simp-g)" opacity="0.6"/>
  <text x="292" y="172.0" text-anchor="end" font-size="10" opacity="0.6"><tspan fill="#888">entrega </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">query</tspan></text>
  <text x="348" y="172.0" font-size="10" opacity="0.6"><tspan fill="#888">recibe </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">List&lt;Product&gt;</tspan></text>
  <line x1="300" y1="235" x2="300" y2="269" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4simp-g)" opacity="0.6"/>
  <line x1="340" y1="269" x2="340" y2="235" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4simp-g)" opacity="0.6"/>
  <text x="292" y="256.0" text-anchor="end" font-size="10" opacity="0.6"><tspan fill="#888">entrega </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">getProducts()</tspan></text>
  <text x="348" y="256.0" font-size="10" opacity="0.6"><tspan fill="#888">recibe </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">List&lt;Product&gt;</tspan></text>
  <line x1="320" y1="318" x2="320" y2="353" stroke="#66BB6A" stroke-width="2" stroke-dasharray="5,3" marker-end="url(#l4simp-i)"/>
  <text x="330" y="340.0" fill="#66BB6A" font-size="10">implementado por</text>
  <line x1="300" y1="403" x2="300" y2="437" stroke="#FF7043" stroke-width="2" marker-end="url(#l4simp-e)"/>
  <line x1="340" y1="437" x2="340" y2="403" stroke="#26A69A" stroke-width="2" marker-end="url(#l4simp-r)"/>
  <text x="292" y="424.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">getProducts()</tspan></text>
  <text x="348" y="424.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">List&lt;Product&gt;</tspan></text>
  <line x1="300" y1="487" x2="300" y2="521" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4simp-g)" opacity="0.6"/>
  <line x1="340" y1="521" x2="340" y2="487" stroke="#9E9E9E" stroke-width="2" marker-end="url(#l4simp-g)" opacity="0.6"/>
  <text x="292" y="508.0" text-anchor="end" font-size="10" opacity="0.6"><tspan fill="#888">entrega </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">GET /api/products</tspan></text>
  <text x="348" y="508.0" font-size="10" opacity="0.6"><tspan fill="#888">recibe </tspan><tspan fill="#9E9E9E" font-family="monospace" font-size="11">JSON</tspan></text>
  <line x1="150" y1="597" x2="176" y2="597" stroke="#FF7043" stroke-width="2" marker-end="url(#l4simp-e)"/>
  <text x="182" y="601" fill="#888" font-size="10">entrega a la capa de abajo</text>
  <line x1="350" y1="597" x2="376" y2="597" stroke="#26A69A" stroke-width="2" marker-end="url(#l4simp-r)"/>
  <text x="382" y="601" fill="#888" font-size="10">recibe de la capa de abajo</text>
</svg>
```

Cumple el contrato del dominio delegando en el `DataSource`. Es el lugar donde, más adelante, se podría guardar el catálogo en caché para no pedirlo en cada búsqueda, sin que el `UseCase` se entere.

```dart
class ProductsRepositoryImpl implements ProductsRepository {
  final StoreDataSource _dataSource;

  ProductsRepositoryImpl(this._dataSource);

  @override
  Future<List<Product>> getProducts() => _dataSource.getProducts();
}
```

## Paso 7 · Ensamblar

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="260" viewBox="0 0 720 260" font-family="Roboto, Arial, sans-serif" style="display:block;margin:0 auto;max-width:100%;height:auto;">
  <rect x="90" y="10" width="540" height="240" rx="14" fill="#9E9E9E" fill-opacity="0.08" stroke="#9E9E9E"/>
  <text x="106" y="32" fill="#888" font-size="12" font-weight="bold" font-family="monospace">BlocProvider(create: …)</text>
  <rect x="112" y="44" width="496" height="194" rx="12" fill="#42A5F5" fill-opacity="0.10" stroke="#42A5F5"/>
  <text x="128" y="66" fill="#42A5F5" font-size="12" font-weight="bold" font-family="monospace">ProductsBloc(</text>
  <rect x="134" y="78" width="452" height="126" rx="10" fill="#66BB6A" fill-opacity="0.10" stroke="#66BB6A"/>
  <text x="150" y="100" fill="#66BB6A" font-size="12" font-weight="bold" font-family="monospace">SearchProductsUseCase(</text>
  <rect x="156" y="112" width="408" height="80" rx="8" fill="#FFA726" fill-opacity="0.10" stroke="#FFA726"/>
  <text x="172" y="134" fill="#FFA726" font-size="12" font-weight="bold" font-family="monospace">ProductsRepositoryImpl(</text>
  <rect x="178" y="144" width="364" height="38" rx="6" fill="#FFA726" fill-opacity="0.22" stroke="#FFA726"/>
  <text x="360" y="168" text-anchor="middle" fill="#FFA726" font-size="12" font-weight="bold" font-family="monospace">StoreDataSource()</text>
  <text x="596" y="228" text-anchor="end" fill="#42A5F5" font-size="12" font-weight="bold" font-family="monospace">)..add(SearchSubmitted(''))</text>
</svg>
```

Ninguna capa crea a la de abajo. Se construyen de adentro hacia afuera en el `create` del `BlocProvider`, y cada una recibe la siguiente por constructor. `..add(SearchSubmitted(''))` lanza una búsqueda vacía apenas se crea el `Bloc`, así que la pantalla abre mostrando todo el catálogo.

```dart
void main() {
  runApp(
    MaterialApp(
      routes: {
        '/': (_) => BlocProvider(
              create: (_) => ProductsBloc(
                SearchProductsUseCase(ProductsRepositoryImpl(StoreDataSource())),
              )..add(SearchSubmitted('')),
              child: const ProductsScreen(),
            ),
      },
    ),
  );
}
```

Con esto la Parte 1 corre: la app abre con el catálogo, y al buscar *jacket* quedan las cuatro chaquetas.

## Parte 2 · Favoritos

Ahora es tu turno. Cada producto de la lista lleva un ♡: al tocarlo, el producto se guarda. Una segunda pantalla, `FavoritesScreen`, muestra los guardados. Guardar recorre las mismas capas que buscar:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="615" viewBox="0 0 640 615" font-family="Roboto, Arial, sans-serif" style="display:block;margin:0 auto;max-width:100%;height:auto;">
  <defs>
    <marker id="l4sfav-e" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#FF7043"/></marker>
    <marker id="l4sfav-r" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#26A69A"/></marker>
    <marker id="l4sfav-g" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#9E9E9E"/></marker>
    <marker id="l4sfav-i" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#66BB6A"/></marker>
  </defs>
  <rect x="220" y="20" width="200" height="44" rx="8" fill="#FFA726"/>
  <text x="320" y="40" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">ProductsScreen</text>
  <text x="320" y="55" text-anchor="middle" fill="#FFFFFF" font-size="10">Vista · el ♡</text>
  <rect x="220" y="104" width="200" height="44" rx="8" fill="#42A5F5"/>
  <text x="320" y="124" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">ProductsBloc</text>
  <text x="320" y="139" text-anchor="middle" fill="#FFFFFF" font-size="10">Bloc</text>
  <rect x="220" y="188" width="200" height="44" rx="8" fill="#66BB6A"/>
  <text x="320" y="208" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">FavoriteProductUseCase</text>
  <text x="320" y="223" text-anchor="middle" fill="#FFFFFF" font-size="10">UseCase</text>
  <rect x="220" y="272" width="200" height="44" rx="8" fill="#66BB6A"/>
  <text x="320" y="292" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">ProductsRepository</text>
  <text x="320" y="307" text-anchor="middle" fill="#FFFFFF" font-size="10">contrato</text>
  <rect x="220" y="356" width="200" height="44" rx="8" fill="#FFA726"/>
  <text x="320" y="376" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">ProductsRepositoryImpl</text>
  <text x="320" y="391" text-anchor="middle" fill="#FFFFFF" font-size="10">implementación</text>
  <rect x="220" y="440" width="200" height="44" rx="8" fill="#FFA726"/>
  <text x="320" y="460" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">FavoritesDataSource</text>
  <text x="320" y="475" text-anchor="middle" fill="#FFFFFF" font-size="10">DataSource</text>
  <ellipse cx="320" cy="546" rx="100" ry="22" fill="#AB47BC"/>
  <text x="320" y="551" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">firebaseio.com</text>
  <line x1="300" y1="67" x2="300" y2="101" stroke="#FF7043" stroke-width="2" marker-end="url(#l4sfav-e)"/>
  <line x1="340" y1="101" x2="340" y2="67" stroke="#26A69A" stroke-width="2" marker-end="url(#l4sfav-r)"/>
  <text x="292" y="88.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">ProductLiked(product)</tspan></text>
  <text x="348" y="88.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">ProductsState</tspan></text>
  <line x1="300" y1="151" x2="300" y2="185" stroke="#FF7043" stroke-width="2" marker-end="url(#l4sfav-e)"/>
  <line x1="340" y1="185" x2="340" y2="151" stroke="#26A69A" stroke-width="2" marker-end="url(#l4sfav-r)"/>
  <text x="292" y="172.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">product</tspan></text>
  <text x="348" y="172.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">Future&lt;void&gt;</tspan></text>
  <line x1="300" y1="235" x2="300" y2="269" stroke="#FF7043" stroke-width="2" marker-end="url(#l4sfav-e)"/>
  <line x1="340" y1="269" x2="340" y2="235" stroke="#26A69A" stroke-width="2" marker-end="url(#l4sfav-r)"/>
  <text x="292" y="256.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">product</tspan></text>
  <text x="348" y="256.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">Future&lt;void&gt;</tspan></text>
  <line x1="320" y1="318" x2="320" y2="353" stroke="#66BB6A" stroke-width="2" stroke-dasharray="5,3" marker-end="url(#l4sfav-i)"/>
  <text x="330" y="340.0" fill="#66BB6A" font-size="10">implementado por</text>
  <line x1="300" y1="403" x2="300" y2="437" stroke="#FF7043" stroke-width="2" marker-end="url(#l4sfav-e)"/>
  <line x1="340" y1="437" x2="340" y2="403" stroke="#26A69A" stroke-width="2" marker-end="url(#l4sfav-r)"/>
  <text x="292" y="424.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">product</tspan></text>
  <text x="348" y="424.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">Future&lt;void&gt;</tspan></text>
  <line x1="300" y1="487" x2="300" y2="521" stroke="#FF7043" stroke-width="2" marker-end="url(#l4sfav-e)"/>
  <line x1="340" y1="521" x2="340" y2="487" stroke="#26A69A" stroke-width="2" marker-end="url(#l4sfav-r)"/>
  <text x="292" y="508.0" text-anchor="end" font-size="10"><tspan fill="#888">entrega </tspan><tspan fill="#FF7043" font-family="monospace" font-size="11" font-weight="bold">POST product.toJson()</tspan></text>
  <text x="348" y="508.0" font-size="10"><tspan fill="#888">recibe </tspan><tspan fill="#26A69A" font-family="monospace" font-size="11" font-weight="bold">200 OK</tspan></text>
  <line x1="150" y1="597" x2="176" y2="597" stroke="#FF7043" stroke-width="2" marker-end="url(#l4sfav-e)"/>
  <text x="182" y="601" fill="#888" font-size="10">entrega a la capa de abajo</text>
  <line x1="350" y1="597" x2="376" y2="597" stroke="#26A69A" stroke-width="2" marker-end="url(#l4sfav-r)"/>
  <text x="382" y="601" fill="#888" font-size="10">recibe de la capa de abajo</text>
</svg>
```

Qué agregar en cada capa:

| Capa | Qué agregar |
|---|---|
| Vista | Un `IconButton` ♡ en cada `ListTile` que lanza `ProductLiked(product)`. Un botón en el `AppBar` que navega a `/favorites`, y la ruta `/favorites` con su propio `BlocProvider` y `FavoritesScreen` |
| Bloc | El evento `ProductLiked` en `ProductsBloc`. Un `FavoritesBloc` con un evento para cargar los favoritos y su estado con `copyWith` |
| Dominio | `addFavorite(Product)` y `getFavorites()` en `ProductsRepository`, y un `UseCase` para cada uno |
| Datos | Un `FavoritesDataSource` con el `POST` y el `GET`. `ProductsRepositoryImpl` recibe los dos `DataSource` |

Los favoritos se guardan en Firebase, en esta URL. Cambia `miusername` por tu usuario:

```plain
https://facelogprueba.firebaseio.com/favorites/miusername.json
```

Guardar es un `POST` con el producto en JSON. Si lo guardas con las mismas llaves de la API —`_id` incluido—, `Product.fromJson` sirve también para leerlo de vuelta:

```dart
Map<String, dynamic> toJson() => {'_id': id, 'title': title, 'price': price, 'category': category, 'image': image};
```

```dart
await http.post(Uri.parse(_favoritesUrl), body: jsonEncode(product.toJson()));
```

Leer es un `GET` a la misma URL. La respuesta no es una lista: es un `Map` cuyas llaves genera Firebase, una por cada `POST`, o `null` si aún no hay favoritos. Recorre solo sus valores:

```json
{
  "-OaBc123": { "_id": 1, "title": "Long sleeve Jacket", "price": 150.0, "category": "women", "image": "https://..." }
}
```

```dart
final data = jsonDecode(response.body) as Map<String, dynamic>?;
return (data ?? {}).values.map((json) => Product.fromJson(json)).toList();
```

## Criterios de entrega

- `ProductsScreen` abre con el catálogo y busca por título, con barra de progreso mientras carga y el mensaje si falla.
- La búsqueda vive en `SearchProductsUseCase`: ni la vista ni el `DataSource` filtran.
- El estado de cada `Bloc` es una sola clase con `status` y `copyWith`.
- Cada producto tiene un ♡ que lo guarda con `POST`.
- `FavoritesScreen` consulta con `GET` y muestra los productos guardados.
- Las capas están separadas: la vista solo habla con el `Bloc`, el `Bloc` con los `UseCase`, los `UseCase` con el contrato, y solo los `DataSource` usan `http`.
