const { Client, types, mapping } = require('cassandra-driver');

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

  const mapper = new mapping.Mapper(client, { 
    models: {
      // supports multiple tables to handle denormalization...
      'Element': { tables: ['elements'] },
    }
  });
  const elementMapper = mapper.forModel('Element');

  const newElement = {name: 'Philosophium', symbol: 'Ph',
    atomic_mass: 12.3, atomic_number: 120};
  await elementMapper.insert(newElement);
  console.log('New element inserted.');

  const myElement = await elementMapper.get({symbol: 'Ph'});
  console.log('Element name = %s', myElement.name);

  const symbol = 'Ph';
  elementMapper.remove({ symbol }).then( res => {
    console.log('New element deleted.');
    client.shutdown().then( () => console.log('** Connection closed'));
  });

  // Mapper also supports: update(), find() ...

}

main();
