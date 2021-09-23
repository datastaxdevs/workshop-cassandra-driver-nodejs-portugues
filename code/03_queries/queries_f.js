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

  // get all regular metals with the eachRow method
  // (try tweaking the table name to a nonexistent one)
  client.eachRow(
    'SELECT name, density FROM metals WHERE kind = ?;',
    ['regular'],
    {prepare: true},
    (n, row) => {
      console.log('Metal %s is %s with density %s', n, row.name, row.density)
    },
    err => {
      // if err is null, it just means 'no more rows left'
      if (err) {
        console.error('Error reading regular metals:', err)
      } else {
        client.shutdown().then( () => console.log('** Connection closed'));
      }
    }
  );

}

main();
