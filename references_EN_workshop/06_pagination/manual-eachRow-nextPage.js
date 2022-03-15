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

  client.eachRow(
    qry,
    arg,
    qOpts,
    function (n, row) { 
      // Invoked per each row in all the pages
      console.log('Metal %s has density %s', row.name, row.density)
    },
    function (err, result) {
      if (typeof result !== undefined) {
        pageState = result.pageState;
        console.log("   [found pageState: ", pageState, "]");
        if(pageState !== null) {
          console.log("   [Requesting next page]");
          result.nextPage();
        } else {
          console.log("   [End of results]");
          client.shutdown().then( () => console.log('** Connection closed'));
        }
      } else {
        // some error to handle here
      }
    });

}

main();
