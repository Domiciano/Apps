Esta carpeta está pensada para los artefactos de base de datos del backend.

- El script actual de carga de datos vive en `../data.sql` (en la raíz de `classnotesapp`).
- El `docker-compose.yml` de este backend monta ese archivo dentro del contenedor de Postgres
  en la ruta `/docker-entrypoint-initdb.d/data.sql`, de modo que la base se inicializa
  automáticamente la primera vez que se levanta el contenedor.

