# Autenticación con Google (Firebase) — guía de configuración

El visor puede exigir que cada estudiante inicie sesión con Google y registre su
**nombre completo** y su **perfil de GitHub** antes de acceder al contenido. El
inicio de sesión es **libre**: cualquier persona con cuenta de Google puede
entrar; solo capturamos su identidad.

Todo el código del gate vive en `src/auth/` y es **compartido** entre cursos.
Lo único que cambia por curso es `src/auth/firebaseConfig.js` (un proyecto de
Firebase por curso). Mientras ese archivo tenga los valores `REPLACE_*`, el gate
queda **desactivado** y la app funciona sin login — útil para el template y para
desarrollo local.

## Pasos en la consola de Firebase (uno por curso)

1. **Crear proyecto** — <https://console.firebase.google.com> → *Add project*.
2. **Agregar app web** — en *Project settings* → *Your apps* → ícono `</>`.
   Copia el objeto `firebaseConfig` que te muestra.
3. **Habilitar Google como proveedor** — *Build → Authentication → Get started*
   → pestaña *Sign-in method* → *Google* → *Enable* → guardar.
4. **Dominios autorizados** — *Authentication → Settings → Authorized domains*.
   Agrega el dominio donde se publica el curso (además de `localhost`, que ya
   viene):
   - Móviles (FlutterApps): `domicianorincon.github.io`
   - Compunet2 (compu2): `domiciano.github.io`
   > Es el **dominio** (host), no la ruta. GitHub Pages sirve en
   > `https://<usuario>.github.io/<repo>/`, pero aquí solo va `<usuario>.github.io`.
5. **Crear Firestore** — *Build → Firestore Database → Create database* →
   modo *production* → elige región.
6. **Reglas de Firestore** — pega esto en *Firestore → Rules* y publica. Cada
   estudiante solo puede leer/escribir su propio documento; tú ves la lista
   completa desde la consola:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /students/{uid} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```

## Pegar la config en el repo del curso

En `classnotesapp/src/auth/firebaseConfig.js`:

- Reemplaza el objeto `firebaseConfig` por el que copiaste en el paso 2.
- Cambia `courseId` por un slug corto (p. ej. `'moviles'` o `'compunet2'`) — se
  guarda en cada registro para poder separar cursos en analítica.

Estos valores son **públicos** (no son secretos): la seguridad la dan las reglas
de Firestore y los dominios autorizados. Es correcto commitearlos.

## Dónde quedan los registros

Cada estudiante genera un documento en la colección `students/{uid}`:

```
uid, email, displayName, photoURL,   // de Google
fullName, github,                    // capturados en el formulario
courseId,                            // de firebaseConfig.js
createdAt, updatedAt                 // timestamps del servidor
```

Los ves en *Firestore Database → Data → students*. Para analítica de
interacciones a mediano plazo, se pueden agregar más colecciones (p. ej.
`events/`) reusando el mismo `AuthProvider`.
