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

  // get density of copper, callback-based
  client.execute(
    'SELECT density FROM metals WHERE kind = ? AND name = ?;',
    ['regular', 'copper'],
    {prepare: true},
    (err, res) => {
      const row = res.first();
      console.log('Copper density = %s', row['density']);
      client.shutdown().then( () => console.log('** Connection closed'));
    }
  );

}

main();
