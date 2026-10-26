# Inyección de dependencias con GetIt

<!-- tags: GetIt, sl(), registerLazySingleton, registerFactory, injection_container.dart,
     is not registered inside GetIt, service locator, inyección de dependencias,
     el caso de uso importa la implementación, initDependencies -->

En el Laboratorio 7, cada capa crea la siguiente: `final PostRepository _posts = PostRepositoryImpl();`. Funciona, pero tiene dos problemas. El caso de uso tiene que importar la implementación, que vive en `data`, aunque solo debería conocer el contrato. Y cada objeto se vuelve a crear cada vez que alguien lo necesita.

`GetIt` es un registro central: cada objeto se registra una vez al arrancar la app, y cada capa se lo pide en vez de crearlo. En esta lección haces ese cambio en **un solo camino** del Laboratorio 7, el de publicar un post. El resto de la app es el reto.

## El camino

```svg
<svg id="diCamino" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 676" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="diCamino-ttl diCamino-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="diCamino-ttl">Un camino, una línea por capa</title>
  <desc id="diCamino-dsc">Seis capas en columna, de arriba abajo: la ruta /compose de main.dart, ComposeBloc, PublishPostUseCase, el contrato PostRepository, PostRepositoryImpl y SupabasePostDataSource. A la derecha de cada una, la línea que cambia. La ruta pasa de ComposeBloc() a sl&lt;ComposeBloc&gt;(). ComposeBloc pasa de PublishPostUseCase() a sl(). PublishPostUseCase pasa de PostRepositoryImpl() a sl(), y con eso deja de importar la implementación. PostRepositoryImpl pasa de SupabasePostDataSource() a sl(). El contrato y el data source no cambian.</desc>
  <defs>
    <style>
      #diCamino .title{fill:#161A26;font-size:22px;font-weight:700}
      #diCamino .sub{fill:#79809A;font-size:13.5px}
      #diCamino .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #diCamino .foot{fill:#79809A;font-size:12px}
      #diCamino .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #diCamino .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #diCamino .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#diCamino-arrow)}
      #diCamino .ar-violet{fill:none;stroke:#7439B8;stroke-width:1.75;marker-end:url(#diCamino-ar-violet)}
      #diCamino .ar-amber{fill:none;stroke:#A96C05;stroke-width:1.75;marker-end:url(#diCamino-ar-amber)}
      #diCamino .ar-teal{fill:none;stroke:#0F8478;stroke-width:1.75;marker-end:url(#diCamino-ar-teal)}
    </style>
    <marker id="diCamino-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="diCamino-ar-violet" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#7439B8"/></marker>
    <marker id="diCamino-ar-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#A96C05"/></marker>
    <marker id="diCamino-ar-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#0F8478"/></marker>
  </defs>
  <rect width="960" height="676" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Un camino, una línea por capa</text>
  <text class="sub" x="48" y="80" data-fit="860">Publicar un post en el Laboratorio 7. Cada capa deja de crear la siguiente y se la pide a GetIt.</text>
  <text class="h" x="392" y="100">ANTES</text>
  <text class="h" x="676" y="100">CON GETIT</text>
  <rect x="48" y="108" width="300" height="68" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.75"/>
  <text class="h" x="62" y="128" style="fill:#7439B8">UI · RUTA</text>
  <text class="mono" x="62" y="148" font-size="13.5" font-weight="700" fill="#7439B8" data-fit="272">'/compose'</text>
  <text class="mono" x="62" y="166" font-size="11" fill="#79809A" data-fit="272">lib/main.dart</text>
  <rect x="392" y="126" width="252" height="32" rx="8" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.25"/>
  <text class="mono" x="404" y="142" dy="0.35em" font-size="12" fill="#C2354F" text-decoration="line-through" data-fit="228">ComposeBloc()</text>
  <path class="link" d="M648,142 H670"/>
  <rect x="676" y="126" width="236" height="32" rx="8" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/>
  <text class="mono" x="688" y="142" dy="0.35em" font-size="12.5" font-weight="700" fill="#3A8235" data-fit="212">sl&lt;ComposeBloc&gt;()</text>
  <rect x="48" y="198" width="300" height="68" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.75"/>
  <text class="h" x="62" y="218" style="fill:#7439B8">BLOC</text>
  <text class="mono" x="62" y="238" font-size="13.5" font-weight="700" fill="#7439B8" data-fit="272">ComposeBloc</text>
  <text class="mono" x="62" y="256" font-size="11" fill="#79809A" data-fit="272">compose/ui/bloc/compose_bloc.dart</text>
  <path class="ar-violet" d="M198,178 V195"/>
  <rect x="392" y="216" width="252" height="32" rx="8" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.25"/>
  <text class="mono" x="404" y="232" dy="0.35em" font-size="12" fill="#C2354F" text-decoration="line-through" data-fit="228">= PublishPostUseCase();</text>
  <path class="link" d="M648,232 H670"/>
  <rect x="676" y="216" width="236" height="32" rx="8" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/>
  <text class="mono" x="688" y="232" dy="0.35em" font-size="12.5" font-weight="700" fill="#3A8235" data-fit="212">= sl();</text>
  <rect x="48" y="288" width="300" height="68" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.75"/>
  <text class="h" x="62" y="308" style="fill:#A96C05">CASO DE USO</text>
  <text class="mono" x="62" y="328" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="272">PublishPostUseCase</text>
  <text class="mono" x="62" y="346" font-size="11" fill="#79809A" data-fit="272">posts/domain/usecases/</text>
  <path class="ar-violet" d="M198,268 V285"/>
  <rect x="392" y="306" width="252" height="32" rx="8" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.25"/>
  <text class="mono" x="404" y="322" dy="0.35em" font-size="12" fill="#C2354F" text-decoration="line-through" data-fit="228">= PostRepositoryImpl();</text>
  <path class="link" d="M648,322 H670"/>
  <rect x="676" y="306" width="236" height="32" rx="8" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/>
  <text class="mono" x="688" y="322" dy="0.35em" font-size="12.5" font-weight="700" fill="#3A8235" data-fit="212">= sl();</text>
  <rect x="48" y="378" width="300" height="68" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.75"/>
  <text class="h" x="62" y="398" style="fill:#A96C05">CONTRATO</text>
  <text class="mono" x="62" y="418" font-size="13.5" font-weight="700" fill="#A96C05" data-fit="272">PostRepository</text>
  <text class="mono" x="62" y="436" font-size="11" fill="#79809A" data-fit="272">posts/domain/repository/</text>
  <path class="ar-amber" d="M198,358 V375"/>
  <text x="392" y="412" dy="0.35em" font-size="12.5" fill="#79809A" data-fit="520">No cambia. Es lo único que el caso de uso conoce ahora.</text>
  <rect x="48" y="468" width="300" height="68" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.75"/>
  <text class="h" x="62" y="488" style="fill:#0F8478">IMPLEMENTACIÓN</text>
  <text class="mono" x="62" y="508" font-size="13.5" font-weight="700" fill="#0F8478" data-fit="272">PostRepositoryImpl</text>
  <text class="mono" x="62" y="526" font-size="11" fill="#79809A" data-fit="272">posts/data/repository/</text>
  <path class="ar-amber" d="M198,448 V465"/>
  <rect x="392" y="486" width="252" height="32" rx="8" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.25"/>
  <text class="mono" x="404" y="502" dy="0.35em" font-size="12" fill="#C2354F" text-decoration="line-through" data-fit="228">= SupabasePostDataSource();</text>
  <path class="link" d="M648,502 H670"/>
  <rect x="676" y="486" width="236" height="32" rx="8" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.25"/>
  <text class="mono" x="688" y="502" dy="0.35em" font-size="12.5" font-weight="700" fill="#3A8235" data-fit="212">= sl();</text>
  <rect x="48" y="558" width="300" height="68" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.75"/>
  <text class="h" x="62" y="578" style="fill:#0F8478">DATA SOURCE</text>
  <text class="mono" x="62" y="598" font-size="13.5" font-weight="700" fill="#0F8478" data-fit="272">SupabasePostDataSource</text>
  <text class="mono" x="62" y="616" font-size="11" fill="#79809A" data-fit="272">posts/data/source/</text>
  <path class="ar-teal" d="M198,538 V555"/>
  <text x="392" y="592" dy="0.35em" font-size="12.5" fill="#79809A" data-fit="520">No cambia: es el final del camino.</text>
  <text class="foot" x="48" y="648" data-fit="860">Las demás capas del laboratorio siguen creando la siguiente con su constructor. Pasarlas a GetIt es el reto.</text>
</svg>
```

Son seis capas, de la ruta al data source. En cuatro cambia una sola línea. El contrato y el data source no cambian.

## Paso 1 · Instalar

Desde la carpeta de tu Laboratorio 7 resuelto:

```shell
flutter pub add get_it
```

## Paso 2 · El registro

Crea `lib/injection_container.dart`. Importa las cuatro clases que aparecen abajo y el contrato `PostRepository`, y registra de adentro hacia afuera:

```dart
import 'package:get_it/get_it.dart';

final sl = GetIt.instance;

void initDependencies() {
  sl.registerLazySingleton(() => SupabasePostDataSource());
  sl.registerLazySingleton<PostRepository>(() => PostRepositoryImpl());
  sl.registerLazySingleton(() => PublishPostUseCase());
  sl.registerFactory(() => ComposeBloc());
}
```

- `sl` es el registro. El nombre viene de *service locator* y se usa en toda la app.
- `<PostRepository>` registra la implementación bajo el tipo del contrato. Así, quien pida un `PostRepository` recibe un `PostRepositoryImpl` sin saberlo.

```svg
<svg id="diRegistro" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 572" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="diRegistro-ttl diRegistro-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="diRegistro-ttl">Qué guarda GetIt y cuándo crea cada objeto</title>
  <desc id="diRegistro-dsc">A la izquierda, el archivo injection_container.dart con cuatro registros: SupabasePostDataSource, PostRepository con su implementación y PublishPostUseCase como registerLazySingleton, y ComposeBloc como registerFactory. A la derecha, dos aperturas seguidas de la pantalla de nuevo post: cada una recibe su propio ComposeBloc, pero las dos comparten el mismo PublishPostUseCase, el mismo PostRepositoryImpl y el mismo SupabasePostDataSource.</desc>
  <defs>
    <style>
      #diRegistro .title{fill:#161A26;font-size:22px;font-weight:700}
      #diRegistro .sub{fill:#79809A;font-size:13.5px}
      #diRegistro .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #diRegistro .foot{fill:#79809A;font-size:12px}
      #diRegistro .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #diRegistro .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #diRegistro .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#diRegistro-arrow)}
      #diRegistro .ar-violet{fill:none;stroke:#7439B8;stroke-width:1.75;marker-end:url(#diRegistro-ar-violet)}
      #diRegistro .ar-teal{fill:none;stroke:#0F8478;stroke-width:1.75;marker-end:url(#diRegistro-ar-teal)}
    </style>
    <marker id="diRegistro-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
    <marker id="diRegistro-ar-violet" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#7439B8"/></marker>
    <marker id="diRegistro-ar-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#0F8478"/></marker>
  </defs>
  <rect width="960" height="572" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Qué guarda GetIt y cuándo crea cada objeto</text>
  <text class="sub" x="48" y="80" data-fit="860">Cuatro registros, de adentro hacia afuera. El Bloc es nuevo cada vez; lo demás se crea una vez y se reutiliza.</text>
  <rect x="48" y="108" width="452" height="320" rx="12" fill="#1F2430"/>
  <text class="mono" x="66" y="134" font-size="12" fill="#9AA3B5">lib/injection_container.dart</text>
  <text class="mono" x="66" y="164" font-size="12" fill="#C9CFDA" data-fit="420">final sl = GetIt.instance;</text>
  <text class="mono" x="66" y="212" font-size="12" fill="#86D3CA" data-fit="420">sl.registerLazySingleton(</text>
  <text class="mono" x="86" y="229" font-size="12" fill="#C9CFDA" data-fit="400">() => SupabasePostDataSource());</text>
  <text class="mono" x="66" y="253" font-size="12" fill="#86D3CA" data-fit="420">sl.registerLazySingleton&lt;PostRepository&gt;(</text>
  <text class="mono" x="86" y="270" font-size="12" fill="#C9CFDA" data-fit="400">() => PostRepositoryImpl());</text>
  <text class="mono" x="66" y="294" font-size="12" fill="#86D3CA" data-fit="420">sl.registerLazySingleton(</text>
  <text class="mono" x="86" y="311" font-size="12" fill="#C9CFDA" data-fit="400">() => PublishPostUseCase());</text>
  <text class="mono" x="66" y="335" font-size="12" fill="#C9A6EE" data-fit="420">sl.registerFactory(</text>
  <text class="mono" x="86" y="352" font-size="12" fill="#C9CFDA" data-fit="400">() => ComposeBloc());</text>
  <g transform="translate(48,452)"><rect width="420" height="77" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#0F8478" data-fit="392">registerLazySingleton</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="392">Lo crea la primera vez que alguien lo pide</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="392">y después entrega siempre el mismo.</text></g>
  <g transform="translate(492,452)"><rect width="420" height="77" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.5"/><text x="14" y="23" font-size="13.5" font-weight="700" fill="#7439B8" data-fit="392">registerFactory</text><text x="14" y="43" font-size="12.5" fill="#454C61" data-fit="392">Crea uno nuevo cada vez que se pide:</text><text x="14" y="60" font-size="12.5" fill="#454C61" data-fit="392">cada pantalla, con su propio estado.</text></g>
  <text class="h" x="628" y="120" text-anchor="middle">ABRES NUEVO POST</text>
  <rect x="540" y="132" width="176" height="44" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.75"/>
  <text class="mono" x="628" y="154" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8">ComposeBloc #1</text>
  <path class="ar-violet" d="M628,178 V226"/>
  <text class="h" x="824" y="120" text-anchor="middle">LA ABRES OTRA VEZ</text>
  <rect x="736" y="132" width="176" height="44" rx="10" fill="#F4EBFF" stroke="#C9A6EE" stroke-width="1.75"/>
  <text class="mono" x="824" y="154" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#7439B8">ComposeBloc #2</text>
  <path class="ar-violet" d="M824,178 V226"/>
  <rect x="560" y="228" width="332" height="44" rx="10" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.75"/>
  <text class="mono" x="726" y="250" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#A96C05">PublishPostUseCase · el mismo</text>
  <rect x="560" y="306" width="332" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.75"/>
  <text class="mono" x="726" y="328" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478">PostRepositoryImpl · el mismo</text>
  <path class="link" d="M726,274 V303"/>
  <rect x="560" y="384" width="332" height="44" rx="10" fill="#E3F6F3" stroke="#86D3CA" stroke-width="1.75"/>
  <text class="mono" x="726" y="406" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F8478">SupabasePostDataSource · el mismo</text>
  <path class="link" d="M726,352 V381"/>
  <text class="foot" x="48" y="544" data-fit="860">Los dos Bloc reciben el mismo caso de uso: GetIt no lo vuelve a crear.</text>
</svg>
```

`registerLazySingleton` crea el objeto la primera vez que se pide y después entrega siempre el mismo: sirve para data sources, repositorios y casos de uso, que no guardan estado. `registerFactory` crea uno nuevo cada vez: sirve para los Bloc, porque cada pantalla necesita su propio estado.

## Paso 3 · main.dart

Llama al registro antes de `runApp`, después de inicializar Supabase:

```dart
await Supabase.initialize(
  url: 'TU_PROJECT_URL',
  publishableKey: 'TU_PUBLISHABLE_KEY',
);
initDependencies();
runApp(const App());
```

Y en la ruta `/compose`, pide el Bloc en vez de crearlo:

```dart
'/compose': (_) => BlocProvider(
  create: (_) => sl<ComposeBloc>(),
  child: const ComposeScreen(),
),
```

## Paso 4 · ComposeBloc

En `compose/ui/bloc/compose_bloc.dart`, una línea:

```dart
final PublishPostUseCase _publish = sl();
```

`sl()` no necesita el tipo entre `<>`: lo saca del tipo del campo.

## Paso 5 · PublishPostUseCase

En `posts/domain/usecases/publish_post_usecase.dart`, una línea:

```dart
final PostRepository _posts = sl();
```

Ahora borra el import de `post_repository_impl.dart`: ya no se usa. El caso de uso solo conoce el contrato, como pide la arquitectura limpia.

## Paso 6 · PostRepositoryImpl

En `posts/data/repository/post_repository_impl.dart`, una línea:

```dart
final SupabasePostDataSource _dataSource = sl();
```

Los otros dos campos, el del teléfono y el de imágenes, se quedan como están: no son parte de este camino.

## La prueba

Haz un hot restart, o detén la app y córrela de nuevo: el registro está en `main`, y el hot reload no vuelve a ejecutarlo. Publica un post con texto y otro con foto. Los dos aparecen en el muro, igual que antes. Nada cambió para quien usa la app, y el caso de uso ya no depende de `data`.

## Cuando algo falla

- **`Bad state: GetIt: Object/factory with type PublishPostUseCase is not registered inside GetIt.`** Falta registrar ese tipo, o `initDependencies()` no se llamó antes de `runApp`.
- **El mismo error con `type PostRepository`.** Registraste `PostRepositoryImpl()` sin `<PostRepository>`, así que quedó guardado bajo el tipo de la implementación.
- **Cambiaste el registro y no pasa nada.** El hot reload no vuelve a correr `main`. Haz un hot restart.

## Reto

Haz lo mismo con toda la app del Laboratorio 7:

- **Registra cada data source**: los de Auth, perfiles, posts, imágenes de posts, avatares y el del teléfono.
- **Registra cada repositorio** bajo su contrato: `AuthRepository`, `ProfileRepository`, `AvatarRepository` y `PostRepository`.
- **Registra cada caso de uso**, y cada Bloc con `registerFactory`: `LoginBloc`, `RegisterBloc`, `FeedBloc` y `ComposeBloc`.
- **Cambia cada `= XImpl()` y cada `= XUseCase()` por `= sl()`**, y cada `create:` de `main.dart` por `sl<XBloc>()`.

Cuando termines, ningún archivo de `domain` debe importar nada de `data`. Compruébalo buscando `data/` en los imports de esa carpeta.
