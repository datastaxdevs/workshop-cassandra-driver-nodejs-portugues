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

  // BAD PRACTICE: literals in the query text
  await client.execute("INSERT INTO metals (kind, name, density) VALUES ('regular', 'copper', 0.01);");

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

  // Enter prepared statements.
  // A statement string we'll be using several times...
  const metalInsertionStatement = "INSERT INTO metals (kind, name, density) VALUES (?, ?, ?);";

  // prepared statement (re-usable schema info fetched from server, accurate type mapping
  await client.execute(
    metalInsertionStatement,
    ['regular', 'zinc', 7.14],
    {prepare: true}
  );
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

  // promise-based demo (also error handling)
  // (try tweaking the table name to a nonexistent one)
  client.execute(
    metalInsertionStatement,
    ['band!', 'AC/DC', 9999.99],
    {prepare: true}
  ).then(
    r => console.log('AC/DC inserted!')
  ).catch(
    err => console.error('Did something go wrong?', err)
  );

  // callback-based demo
  // (try tweaking the table name to a nonexistent one)
  client.execute(
    metalInsertionStatement,
    ['band!', 'Iron Maiden', 9999.99],
    {prepare: true},
    (err, res) => {
      if (! err){
        console.log('Iron Maiden inserted!');
      }else{
        console.error('ERROR inserting Iron Maiden:', err);
      }
    }
  )

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
  });

  // get density of copper, callback-based
  client.execute(
    'SELECT density FROM metals WHERE kind = ? AND name = ?;',
    ['regular', 'copper'],
    {prepare: true},
    (err, res) => {
      const row = res.first();
      console.log('Copper density = %s', row['density']);
    }
  );

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
      if(err){
        console.error('Error reading regular metals:', err)
      }
    }
  );

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
    }
  ).catch(function(err) {
      console.error('Batch has failed: ', err);
  });

}

main();
