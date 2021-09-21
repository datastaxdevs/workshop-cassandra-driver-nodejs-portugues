// Connection to an Astra DB database.
// Note: requires to have already:
//    created the keyspace
//    created the table
//    populated the table
// Make sure you sourced .env in this shell!

const { Client } = require('cassandra-driver');

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

// either 'credentials' or an 'authProvider' to the above
// config, when connecting to an auth-enabled cluster.
// (https://docs.datastax.com/en/developer/nodejs-driver/4.6/api/type.ClientOptions/)

const client = new Client(config);

async function main() {

  await client.connect();

  const query = 'SELECT symbol, name FROM elements;';

  client.execute(query)
    .then(result => {
      const rows = result.rows;
      rows.forEach( row => {
        console.log('Symbol for %s is %s', row['name'], row['symbol']);
      });
      client.shutdown();
    });

}

main();
