FROM postgres:17

ENV POSTGRES_DB=db \
    POSTGRES_USER=user \
    POSTGRES_PASSWORD=password

# Copiamos el script de inicialización al directorio especial de Postgres.
# Cuando el contenedor arranca por primera vez y el volumen de datos está vacío,
# Postgres ejecutará automáticamente este script y dejará la BD creada.
COPY data.sql /docker-entrypoint-initdb.d/data.sql

