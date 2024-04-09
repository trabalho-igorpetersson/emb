#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL

    CREATE USER embarcados_id PASSWORD 'embarcados_id';
    CREATE DATABASE embarcados_id;
    GRANT ALL PRIVILEGES ON DATABASE embarcados_id TO embarcados_id;

    \connect embarcados_id;
    GRANT ALL ON SCHEMA public TO embarcados_id;
    CREATE EXTENSION IF NOT EXISTS postgis;
    CREATE EXTENSION IF NOT EXISTS postgis_topology;
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

EOSQL
