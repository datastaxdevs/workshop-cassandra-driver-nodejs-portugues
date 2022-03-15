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

  // Reading values
  // get all bands, promise-based; prepared statement.
  client.execute(
    'SELECT name, density FROM metals WHERE kind = ?;',
    ['band!'],
    {prepare: true}
  ).then(result => {
    const rows = result.rows;
    rows.forEach( row => {
      console.log('Band %s has density %s', row['name'], row['density']);
    });
    client.shutdown().then( () => console.log('** Connection closed'));
  });

}

main();
