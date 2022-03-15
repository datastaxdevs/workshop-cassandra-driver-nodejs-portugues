const { Client } = require('cassandra-driver');

// Astra DB
const config = {
  cloud: {
    secureConnectBundle: process.env.SECURE_CONNECT_BUNDLE
  },
  credentials: {
    username: process.env.ASTRA_DB_CLIENT_ID,
    password: process.env.ASTRA_DB_CLIENT_SECRET
  },
  keyspace: 'chemistry'
};


/*
// Cassandra
const config = {
    contactPoints: ['172.19.0.2'],
    localDataCenter: 'datacenter1',
    keyspace: 'chemistry'
};
*/

const client = new Client(config);

async function main() {

  await client.connect();

  // we will neglect to shutdown the client here to focus on the point

  // Simple queries
  const creationCommand = `CREATE TABLE IF NOT EXISTS metals
      (kind TEXT,
      name TEXT,
      density FLOAT,
      PRIMARY KEY ((kind), name));`;
  await client.execute(creationCommand);
  console.log('Table created.');

  // BAD PRACTICE: literals in the query text
  await client.execute("INSERT INTO metals (kind, name, density) VALUES ('regular', 'copper', 0.01);");
  console.log('Copper inserted.');

  // Let's bind query and values then.
  // BUT: must provide type hints in most cases, otherwise query fails
  // (try running this without the hints...)
  await client.execute(
    "INSERT INTO metals (kind, name, density) VALUES (?, ?, ?);",
    ['regular', 'palladium', 12.02],
    {
      hints: [
        'text',
        'text',
        'float'
      ]
    }
  );
  console.log('Palladium inserted.');

  // Enter prepared statements.
  // A statement string we'll be using several times...
  const metalInsertionStatement = "INSERT INTO metals (kind, name, density) VALUES (?, ?, ?);";

  // prepared statement (re-usable schema info fetched from server, accurate type mapping
  await client.execute(
    metalInsertionStatement,
    ['regular', 'zinc', 7.14],
    {prepare: true}
  );
  console.log('Zinc inserted.');
  // can also pass the values as object:
  await client.execute(
    metalInsertionStatement,
    {
      kind: 'regular',
      name: 'mercury',
      density: 13.534
    },
    {prepare: true}
  );
  console.log('Mercury inserted.');

  await client.shutdown();
  console.log('** Connection closed');

}

main();
