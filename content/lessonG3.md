# Introducción a Bloc

<!-- tags: la vista lanza eventos, el Bloc emite estados, qué es un evento, qué es un estado, Bloc, un evento varios estados, flujo unidireccional, lógica fuera del widget, add, emit, BlocBuilder, BlocProvider -->

Sin un patrón, una pantalla termina haciéndolo todo: escucha el toque del usuario, pide los datos, decide qué mostrar y se redibuja. **Bloc** (*Business Logic Component*) es un patrón que parte ese trabajo en dos: la **vista**, que dibuja y escucha al usuario, y el **Bloc**, que decide. Esta lección es la idea completa, sin código: qué se dicen, en qué dirección y quién hace qué.

## La idea en una imagen

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="325" viewBox="0 0 720 325" font-family="Roboto, Arial, sans-serif" style="display:block;margin:0 auto;max-width:100%;height:auto;">
  <defs>
    <clipPath id="g3a-screen"><rect x="0" y="0" width="170" height="250" rx="16"/></clipPath>
    <marker id="g3a-evt" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="10" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#FFA726"/></marker>
    <marker id="g3a-st" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="10" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#66BB6A"/></marker>
  </defs>

  <g transform="translate(60,30)">
    <g clip-path="url(#g3a-screen)">
      <rect x="0" y="0" width="170" height="250" fill="#FFFFFF"/>
      <rect x="0" y="0" width="170" height="30" fill="#1976D2"/>
      <text x="12" y="20" fill="#FFFFFF" font-size="12" font-weight="bold">Productos</text>
      <rect x="12" y="46" width="24" height="24" rx="5" fill="#EF5350"/>
      <text x="44" y="63" fill="#212121" font-size="11">Manzana roja</text>
      <rect x="12" y="80" width="24" height="24" rx="5" fill="#FFA726"/>
      <text x="44" y="97" fill="#212121" font-size="11">Jugo de naranja</text>
      <rect x="12" y="114" width="24" height="24" rx="5" fill="#90CAF9"/>
      <text x="44" y="131" fill="#212121" font-size="11">Leche entera</text>
      <rect x="12" y="148" width="24" height="24" rx="5" fill="#4FC3F7"/>
      <text x="44" y="165" fill="#212121" font-size="11">Agua con gas</text>
      <rect x="40" y="200" width="90" height="28" rx="14" fill="#1976D2"/>
      <text x="85" y="218" text-anchor="middle" fill="#FFFFFF" font-size="11" font-weight="bold">Recargar</text>
      <circle cx="85" cy="214" r="17" fill="#FFA726" fill-opacity="0.25"/>
      <circle cx="85" cy="214" r="7" fill="#FFA726" fill-opacity="0.55"/>
    </g>
    <rect x="0" y="0" width="170" height="250" rx="16" fill="none" stroke="#9E9E9E"/>
  </g>
  <text x="145" y="302" text-anchor="middle" fill="#888" font-size="14" font-weight="bold">Vista</text>
  <text x="145" y="318" text-anchor="middle" fill="#888" font-size="10">escucha al usuario · dibuja</text>

  <rect x="470" y="100" width="200" height="120" rx="16" fill="#42A5F5" fill-opacity="0.10" stroke="#42A5F5" stroke-width="2"/>
  <text x="570" y="145" text-anchor="middle" fill="#42A5F5" font-size="22" font-weight="bold">Bloc</text>
  <text x="570" y="170" text-anchor="middle" fill="#888" font-size="11">recibe el evento</text>
  <text x="570" y="186" text-anchor="middle" fill="#888" font-size="11">decide</text>
  <text x="570" y="202" text-anchor="middle" fill="#888" font-size="11">entrega estados</text>

  <path d="M240,110 C320,40 400,50 466,126" fill="none" stroke="#FFA726" stroke-width="2.5" marker-end="url(#g3a-evt)"/>
  <text x="350" y="30" text-anchor="middle" fill="#FFA726" font-size="14" font-weight="bold">evento</text>
  <text x="350" y="46" text-anchor="middle" fill="#888" font-size="11">«tocó Recargar»</text>

  <path d="M466,196 C400,275 320,280 240,212" fill="none" stroke="#66BB6A" stroke-width="2.5" marker-end="url(#g3a-st)"/>
  <text x="350" y="290" text-anchor="middle" fill="#66BB6A" font-size="14" font-weight="bold">estado</text>
  <text x="350" y="306" text-anchor="middle" fill="#888" font-size="11">«cargando» · «lista» · «error»</text>
</svg>
```

La vista y el Bloc se comunican en dos direcciones, y solo en dos:

- **La vista lanza eventos.** Le cuenta al Bloc lo que pasó.
- **El Bloc devuelve estados.** Le entrega a la vista lo que tiene que dibujar.

Nada más cruza entre ellos. La vista no le pide datos al Bloc ni le cambia nada por dentro; el Bloc no toca ningún widget.

## Qué es un evento

Un **evento** es algo que pasó y que el Bloc necesita saber. En el catálogo de una tienda, por ejemplo:

- «se abrió la pantalla»
- «el usuario tocó Recargar»
- «el usuario tocó la categoría Bebidas»
- «el usuario escribió *jugo* en el buscador»

Un evento describe **lo que pasó**, no lo que hay que hacer. La vista dice «tocó Recargar»; no dice «muestra la barra de progreso y pide los productos otra vez». Decidir qué hacer con lo que pasó es trabajo del Bloc.

Cada pantalla tiene su lista cerrada de eventos posibles. Esa lista es, a la vez, el inventario de todo lo que puede ocurrir en la pantalla: si algo no es un evento, no puede cambiar lo que se ve.

## Qué es un estado

Un **estado** es una foto de lo que la pantalla debe mostrar en un momento: «cargando», «cuatro productos», «error: sin conexión».

- En cada momento hay **exactamente un** estado actual.
- La vista dibuja ese estado tal cual. No le agrega decisiones propias: si la pantalla debe verse distinta, es porque llegó otro estado.
- Un estado nuevo reemplaza por completo al anterior. La vista no mezcla estados; solo dibuja el último.

## Un evento, varios estados

Un solo evento puede producir varios estados, uno detrás de otro:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="330" viewBox="0 0 720 330" font-family="Roboto, Arial, sans-serif" style="display:block;margin:0 auto;max-width:100%;height:auto;">
  <defs>
    <clipPath id="g3b-screen"><rect x="0" y="0" width="150" height="200" rx="14"/></clipPath>
    <marker id="g3b-arrow" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="10" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#888"/></marker>
    <g id="g3b-bar">
      <rect x="0" y="0" width="150" height="200" fill="#FFFFFF"/>
      <rect x="0" y="0" width="150" height="24" fill="#1976D2"/>
      <text x="10" y="16" fill="#FFFFFF" font-size="10" font-weight="bold">Productos</text>
      <rect x="30" y="162" width="90" height="24" rx="12" fill="#1976D2"/>
      <text x="75" y="178" text-anchor="middle" fill="#FFFFFF" font-size="10" font-weight="bold">Recargar</text>
    </g>
    <g id="g3b-rows" font-size="10" fill="#212121">
      <rect x="10" y="39" width="18" height="18" rx="4" fill="#EF5350"/>
      <text x="34" y="52">Manzana roja</text>
      <rect x="10" y="67" width="18" height="18" rx="4" fill="#FFA726"/>
      <text x="34" y="80">Jugo de naranja</text>
      <rect x="10" y="95" width="18" height="18" rx="4" fill="#90CAF9"/>
      <text x="34" y="108">Leche entera</text>
    </g>
  </defs>

  <text x="120" y="18" text-anchor="middle" fill="#888" font-size="12" font-weight="bold">La vista avisa</text>
  <text x="360" y="18" text-anchor="middle" fill="#888" font-size="12" font-weight="bold">El Bloc responde de inmediato</text>
  <text x="600" y="18" text-anchor="middle" fill="#888" font-size="12" font-weight="bold">…y otra vez al llegar los datos</text>

  <g transform="translate(45,30)">
    <g clip-path="url(#g3b-screen)">
      <use href="#g3b-bar"/>
      <use href="#g3b-rows"/>
      <rect x="10" y="123" width="18" height="18" rx="4" fill="#4FC3F7"/>
      <text x="34" y="136" fill="#212121" font-size="10">Agua con gas</text>
      <circle cx="75" cy="174" r="15" fill="#FFA726" fill-opacity="0.25"/>
      <circle cx="75" cy="174" r="6" fill="#FFA726" fill-opacity="0.55"/>
    </g>
    <rect x="0" y="0" width="150" height="200" rx="14" fill="none" stroke="#9E9E9E"/>
  </g>
  <g transform="translate(285,30)">
    <g clip-path="url(#g3b-screen)">
      <use href="#g3b-bar"/>
      <rect x="0" y="24" width="150" height="3" fill="#BBDEFB"/>
      <rect x="0" y="24" width="55" height="3" fill="#1976D2"/>
      <use href="#g3b-rows"/>
      <rect x="10" y="123" width="18" height="18" rx="4" fill="#4FC3F7"/>
      <text x="34" y="136" fill="#212121" font-size="10">Agua con gas</text>
    </g>
    <rect x="0" y="0" width="150" height="200" rx="14" fill="none" stroke="#9E9E9E"/>
  </g>
  <g transform="translate(525,30)">
    <g clip-path="url(#g3b-screen)">
      <use href="#g3b-bar"/>
      <use href="#g3b-rows"/>
      <rect x="0" y="118" width="150" height="28" fill="#E8F5E9"/>
      <rect x="10" y="123" width="18" height="18" rx="4" fill="#A1887F"/>
      <text x="34" y="136" fill="#212121" font-size="10">Té helado</text>
      <text x="140" y="136" text-anchor="end" fill="#2E7D32" font-size="9" font-weight="bold">nuevo</text>
    </g>
    <rect x="0" y="0" width="150" height="200" rx="14" fill="none" stroke="#9E9E9E"/>
  </g>

  <line x1="203" y1="130" x2="278" y2="130" stroke="#888" stroke-width="1.5" marker-end="url(#g3b-arrow)"/>
  <line x1="443" y1="130" x2="518" y2="130" stroke="#888" stroke-width="1.5" marker-end="url(#g3b-arrow)"/>

  <line x1="120" y1="236" x2="120" y2="272" stroke="#888" stroke-dasharray="3,3"/>
  <line x1="360" y1="236" x2="360" y2="272" stroke="#888" stroke-dasharray="3,3"/>
  <line x1="600" y1="236" x2="600" y2="272" stroke="#888" stroke-dasharray="3,3"/>
  <line x1="40" y1="280" x2="690" y2="280" stroke="#888" stroke-width="1.5" marker-end="url(#g3b-arrow)"/>
  <text x="690" y="270" text-anchor="end" fill="#888" font-size="10">tiempo</text>

  <circle cx="120" cy="280" r="7" fill="#FFA726"/>
  <text x="120" y="302" text-anchor="middle" fill="#FFA726" font-size="12" font-weight="bold">evento</text>
  <text x="120" y="318" text-anchor="middle" fill="#888" font-size="11">«tocó Recargar»</text>
  <circle cx="360" cy="280" r="7" fill="#66BB6A"/>
  <text x="360" y="302" text-anchor="middle" fill="#66BB6A" font-size="12" font-weight="bold">estado 1</text>
  <text x="360" y="318" text-anchor="middle" fill="#888" font-size="11">«cargando»</text>
  <circle cx="600" cy="280" r="7" fill="#66BB6A"/>
  <text x="600" y="302" text-anchor="middle" fill="#66BB6A" font-size="12" font-weight="bold">estado 2</text>
  <text x="600" y="318" text-anchor="middle" fill="#888" font-size="11">«lista nueva»</text>
</svg>
```

1. La vista lanza el evento «tocó Recargar» y no hace nada más.
2. El Bloc responde de inmediato con el estado «cargando». La barra de progreso le confirma al usuario que su toque se registró.
3. Cuando llegan los datos, el Bloc entrega un segundo estado con la lista nueva. Si la petición fallara, ese segundo estado sería «error» en vez de «lista nueva».

La vista no espera ni sabe qué está pasando detrás: dibuja cada estado a medida que llega.

## Quién hace qué

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="300" viewBox="0 0 720 300" font-family="Roboto, Arial, sans-serif" style="display:block;margin:0 auto;max-width:100%;height:auto;">
  <defs>
    <marker id="g3c-evt" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="10" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#FFA726"/></marker>
    <marker id="g3c-st" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="10" refX="9" refY="4" orient="auto"><path d="M0,0 L0,8 L10,4 z" fill="#66BB6A"/></marker>
  </defs>

  <text x="170" y="24" text-anchor="middle" fill="#888" font-size="14" font-weight="bold">Sin Bloc</text>
  <rect x="40" y="40" width="260" height="220" rx="14" fill="#9E9E9E" fill-opacity="0.08" stroke="#9E9E9E"/>
  <text x="170" y="64" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">Widget</text>
  <g font-size="11" fill="#888" text-anchor="middle">
    <rect x="60" y="80" width="220" height="34" rx="8" fill="#9E9E9E" fill-opacity="0.15"/>
    <text x="170" y="102">escucha el toque</text>
    <rect x="60" y="124" width="220" height="34" rx="8" fill="#9E9E9E" fill-opacity="0.15"/>
    <text x="170" y="146">pide los datos</text>
    <rect x="60" y="168" width="220" height="34" rx="8" fill="#9E9E9E" fill-opacity="0.15"/>
    <text x="170" y="190">decide qué mostrar</text>
    <rect x="60" y="212" width="220" height="34" rx="8" fill="#9E9E9E" fill-opacity="0.15"/>
    <text x="170" y="234">se redibuja con setState</text>
  </g>
  <text x="170" y="285" text-anchor="middle" fill="#EF5350" font-size="11">todo en un solo lugar: difícil de probar</text>

  <text x="540" y="24" text-anchor="middle" fill="#888" font-size="14" font-weight="bold">Con Bloc</text>
  <rect x="380" y="40" width="130" height="220" rx="14" fill="#9E9E9E" fill-opacity="0.08" stroke="#9E9E9E"/>
  <text x="445" y="64" text-anchor="middle" fill="#888" font-size="13" font-weight="bold">Vista</text>
  <g font-size="11" fill="#888" text-anchor="middle">
    <rect x="390" y="93" width="110" height="34" rx="8" fill="#9E9E9E" fill-opacity="0.15"/>
    <text x="445" y="115">escucha el toque</text>
    <rect x="390" y="193" width="110" height="34" rx="8" fill="#9E9E9E" fill-opacity="0.15"/>
    <text x="445" y="215">pinta el estado</text>
  </g>

  <rect x="570" y="40" width="130" height="220" rx="14" fill="#42A5F5" fill-opacity="0.10" stroke="#42A5F5"/>
  <text x="635" y="64" text-anchor="middle" fill="#42A5F5" font-size="13" font-weight="bold">Bloc</text>
  <g font-size="11" fill="#888" text-anchor="middle">
    <rect x="580" y="80" width="110" height="34" rx="8" fill="#42A5F5" fill-opacity="0.15"/>
    <text x="635" y="102">recibe el evento</text>
    <rect x="580" y="124" width="110" height="34" rx="8" fill="#42A5F5" fill-opacity="0.15"/>
    <text x="635" y="146">pide los datos</text>
    <rect x="580" y="168" width="110" height="34" rx="8" fill="#42A5F5" fill-opacity="0.15"/>
    <text x="635" y="190">decide qué mostrar</text>
    <rect x="580" y="212" width="110" height="34" rx="8" fill="#42A5F5" fill-opacity="0.15"/>
    <text x="635" y="234">entrega el estado</text>
  </g>

  <line x1="512" y1="110" x2="567" y2="110" stroke="#FFA726" stroke-width="2.5" marker-end="url(#g3c-evt)"/>
  <text x="540" y="102" text-anchor="middle" fill="#FFA726" font-size="10" font-weight="bold">evento</text>
  <line x1="568" y1="210" x2="513" y2="210" stroke="#66BB6A" stroke-width="2.5" marker-end="url(#g3c-st)"/>
  <text x="540" y="202" text-anchor="middle" fill="#66BB6A" font-size="10" font-weight="bold">estado</text>
  <text x="540" y="285" text-anchor="middle" fill="#66BB6A" font-size="11">la vista pinta · el Bloc decide</text>
</svg>
```

| | Vista | Bloc |
|---|---|---|
| Escuchar al usuario | Sí: convierte cada toque en un evento | No |
| Pedir datos | No | Sí |
| Decidir qué se muestra | No | Sí |
| Dibujar | Sí: pinta el estado que recibe | No: nunca toca un widget |

De esa separación salen las reglas del patrón:

- **La vista nunca cambia el estado.** Solo avisa lo que pasó.
- **El Bloc nunca toca la vista.** Solo entrega estados.
- **El flujo va en un solo sentido por cada lado**: eventos hacia el Bloc, estados hacia la vista. Por eso se dice que Bloc tiene un flujo **unidireccional**.

La ganancia es que el Bloc se puede probar sin pantalla: se le da un evento y se revisa qué estados entrega. Y la vista queda tan simple que casi no hay nada que probar en ella.

## Cómo se llama cada pieza

Todo lo anterior tiene nombre en la librería `flutter_bloc`:

| Idea | Nombre |
|---|---|
| La vista lanza un evento | `add` |
| El Bloc atiende un tipo de evento | `on` |
| El Bloc entrega un estado | `emit` |
| El estado actual del Bloc | `state` |
| Poner un Bloc al alcance de una pantalla | `BlocProvider` |
| Redibujar la vista cada vez que llega un estado | `BlocBuilder` |

Con estas seis piezas se escribe cualquier Bloc. En las lecciones que siguen aparecen en código, sobre el catálogo de productos.
