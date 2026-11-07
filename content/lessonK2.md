# La llave del backend

<!-- tags: cuenta de servicio, service account, clave privada, Firebase Admin SDK,
     generar nueva clave privada, JSON de credenciales, nunca en la app -->

Para que tu backend pueda pedirle a FCM que envíe un mensaje, necesita identificarse. Lo hace con la llave de una **cuenta de servicio**: un usuario que no es una persona, sino tu servidor.

## Generarla

```svg
<svg id="pnLlave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 500" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="pnLlave-ttl pnLlave-dsc" font-family="ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif">
  <title id="pnLlave-ttl">Generar la llave de la cuenta de servicio</title>
  <desc id="pnLlave-dsc">Esquema de la consola de Firebase en Configuración del proyecto. Pestañas arriba, con Cuentas de servicio seleccionada (paso 1). En el panel, SDK de Firebase Admin con la cuenta firebase-adminsdk y el botón Generar nueva clave privada (paso 2). Un diálogo confirma con Generar clave (paso 3) y se descarga un archivo JSON.</desc>
  <defs>
    <style>
      #pnLlave .title{fill:#161A26;font-size:22px;font-weight:700}
      #pnLlave .sub{fill:#79809A;font-size:13.5px}
      #pnLlave .h{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}
      #pnLlave .foot{fill:#79809A;font-size:12px}
      #pnLlave .mono{font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace}
      #pnLlave .tree{fill:none;stroke:#C4CBD8;stroke-width:1.75}
      #pnLlave .link{fill:none;stroke:#556074;stroke-width:1.75;marker-end:url(#pnLlave-arrow)}
    </style>
    <marker id="pnLlave-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="#556074"/>
    </marker>
  </defs>
  <rect width="960" height="500" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">Generar la llave de la cuenta de servicio</text>
  <text class="sub" x="48" y="80" data-fit="860">Configuración del proyecto → Cuentas de servicio → Generar nueva clave privada.</text>
  <rect x="48" y="104" width="864" height="340" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>
  <path d="M48,138 V116 A12,12 0 0 1 60,104 H900 A12,12 0 0 1 912,116 V138 Z" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>
  <circle cx="68" cy="121" r="4.5" fill="#F14C4C"/>  <circle cx="83" cy="121" r="4.5" fill="#E5C07B"/>  <circle cx="98" cy="121" r="4.5" fill="#6BCB77"/>
  <text x="480.0" y="121" dy="0.35em" font-size="13" font-weight="700" fill="#A96C05" text-anchor="middle" data-fit="724">Consola de Firebase · Configuración del proyecto</text>
  <text x="72" y="164" dy="0.35em" font-size="12.5" font-weight="400" fill="#556074" text-anchor="start">General</text>
  <text x="148.4" y="164" dy="0.35em" font-size="12.5" font-weight="400" fill="#556074" text-anchor="start">Cloud Messaging</text>
  <text x="282.4" y="164" dy="0.35em" font-size="12.5" font-weight="400" fill="#556074" text-anchor="start">Integraciones</text>
  <text x="402.0" y="164" dy="0.35em" font-size="12.5" font-weight="700" fill="#A96C05" text-anchor="start">Cuentas de servicio</text>
  <rect x="398.0" y="176" width="149" height="3" rx="1.5" fill="#A96C05"/>
  <circle cx="558.8" cy="164" r="11" fill="#C2354F"/><text x="558.8" y="164" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">1</text>
  <path d="M72,182 H888" stroke="#D9DEE8" stroke-width="1.25"/>
  <text x="72" y="210" dy="0.35em" font-size="15" font-weight="700" fill="#161A26" text-anchor="start">SDK de Firebase Admin</text>
  <text x="72" y="234" dy="0.35em" font-size="12" font-weight="700" fill="#556074" text-anchor="start">Cuenta de servicio de Firebase</text>
  <text class="mono" x="72" y="254" dy="0.35em" font-size="12.5" font-weight="400" fill="#161A26" text-anchor="start">firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com</text>
  <rect x="72" y="290" width="230" height="30" rx="15" fill="#A96C05" stroke="#A96C05" stroke-width="1.5"/>
  <text x="187.0" y="305" dy="0.35em" font-size="12.5" font-weight="700" fill="#FFFFFF" text-anchor="middle">Generar nueva clave privada</text>
  <circle cx="316" cy="305" r="11" fill="#C2354F"/><text x="316" y="305" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">2</text>
  <rect x="430" y="318" width="458" height="108" rx="12" fill="#FFFFFF" stroke="#F0C572" stroke-width="1.5"/>
  <text x="450" y="342" dy="0.35em" font-size="13.5" font-weight="700" fill="#161A26" text-anchor="start">Generar nueva clave privada</text>
  <text x="450" y="364" dy="0.35em" font-size="11.5" font-weight="400" fill="#454C61" text-anchor="start">Guárdala en un lugar seguro: no se puede volver a descargar.</text>
  <rect x="780" y="384" width="96" height="30" rx="15" fill="#A96C05" stroke="#A96C05" stroke-width="1.5"/>
  <text x="828.0" y="399" dy="0.35em" font-size="12.5" font-weight="700" fill="#FFFFFF" text-anchor="middle">Generar clave</text>
  <circle cx="888" cy="384" r="11" fill="#C2354F"/><text x="888" y="384" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">3</text>
  <path d="M450,382 H470 L478,390 V416 H450 Z" fill="#FFEBEF" stroke="#F3A3B2" stroke-width="1.5"/><path d="M470,382 V390 H478" fill="none" stroke="#F3A3B2" stroke-width="1.5"/>
  <text class="mono" x="488" y="394" dy="0.35em" font-size="12.5" font-weight="700" fill="#C2354F" data-fit="280">tu-proyecto-firebase-adminsdk.json</text>
  <text class="foot" x="48" y="472" data-fit="860">Ese JSON es la identidad del backend: vive en el servidor, nunca dentro de la app.</text>
</svg>
```

1. En la consola de Firebase, pulsa el engranaje junto a *Descripción general* y entra a **Configuración del proyecto**.
2. Abre la pestaña **Cuentas de servicio** (1). Firebase ya creó una cuenta para el SDK de Firebase Admin.
3. Pulsa **Generar nueva clave privada** (2) y confirma con **Generar clave** (3). Se descarga un archivo `.json`.

## Cuidarla

Ese archivo tiene permisos de administrador sobre todo tu proyecto de Firebase. Trátalo como una contraseña:

- Nunca lo pongas dentro de la app: cualquiera puede abrir un APK y sacarlo.
- No lo subas a un repositorio. Si se filtra, bórralo en Google Cloud Console → *IAM* → *Cuentas de servicio* → *Claves* y genera otro.

La lección *Enviar notificaciones desde el backend* muestra dónde se usa.
