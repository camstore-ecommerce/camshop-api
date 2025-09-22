#!/bin/bash
set -e

# create db1
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE camshop_micro_user;
EOSQL

# create db2
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE camshop_micro_order;
EOSQL