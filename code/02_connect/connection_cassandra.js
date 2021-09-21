// Connection to a standard Cassandra cluster.
// Note: requires to have already:
//    created the keyspace
//    created the table
//    populated the table

const { Client } = require("cassandra-driver");

const config = {
    contactPoints: ['172.19.0.2'],
    localDataCenter: 'datacenter1',
    keyspace: 'chemistry'
};

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
