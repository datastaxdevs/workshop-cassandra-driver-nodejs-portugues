// If working with Astra DB, create the keyspace via the UI instead of using the CREATE KEYSPACE command below:
CREATE KEYSPACE chemistry WITH REPLICATION = {'class': 'SimpleStrategy', 'replication_factor': 2};

USE chemistry;

CREATE TABLE elements (
    symbol TEXT PRIMARY KEY,
    name TEXT,
    atomic_mass DOUBLE,
    atomic_number INT
);

// If working with Astra DB, import the data via the UI instead of using the CQL COPY command below:
COPY elements FROM 'elements.csv' WITH HEADER=TRUE;
