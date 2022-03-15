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

  // callback-based demo
  // (try tweaking the table name to a nonexistent one)
  client.execute(
    metalInsertionStatement,
    ['band!', 'Iron Maiden', 9999.99],
    {prepare: true},
    (err, res) => {
      if (! err){
        console.log('Iron Maiden inserted!');
        client.shutdown().then( () => console.log('** Connection closed'));
      }else{
        console.error('ERROR inserting Iron Maiden:', err);
      }
    }
  )

}

main();
