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

  // A statement string we'll be using several times...
  const metalInsertionStatement = "INSERT INTO metals (kind, name, density) VALUES (?, ?, ?);";

  // batch execution
  const densityUpdateStatement = 'UPDATE metals SET density = ? WHERE kind = ? AND name = ?;';
  const batchForMetals = [
    {
      query: metalInsertionStatement,
      params: {
        kind: 'regular',
        name: 'silver',
        density: 10.49
      }
    },
    {
      query: densityUpdateStatement,
      params: [
        8.95,
        'regular',
        'copper'
      ]
    }
  ];
  // Promise-based batch execution (can also be done callback-based)
  client.batch(batchForMetals, { prepare: true }
  ).then(function() {
      console.log('The whole batch succeeded');
      client.shutdown().then( () => console.log('** Connection closed'));
    }
  ).catch(function(err) {
      console.error('Batch has failed: ', err);
  });

}

main();
