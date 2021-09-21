const { Client, types } = require('cassandra-driver');

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
const config = {
    contactPoints: ['172.19.0.2'],
    localDataCenter: 'datacenter1',
    keyspace: 'chemistry'
};
*/

const client = new Client(config);

async function main() {

  await client.connect();

  const qry = 'SELECT name, density FROM metals WHERE kind = ?;';
  const arg = ['regular'];
  const fetchSize = 2;
  const qOpts =     {
    prepare: true,
    fetchSize: fetchSize
  };

  // we will neglect to shutdown the client here to focus on the point
  // Hit Ctrl-C to interrupt the script when done.

  const result = await client.execute(qry, arg, qOpts);
  for await (const row of result) {
    console.log('Metal %s has density %s', row.name, row.density)
  }

}

main();
