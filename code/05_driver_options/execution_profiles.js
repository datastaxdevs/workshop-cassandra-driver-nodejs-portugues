const { Client, ExecutionProfile, types, policies } = require('cassandra-driver');

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

// unspecified profile settings fall back to:
//    given in profile -> 'default' profile -> hardcoded defaults in Client
const defaultProfile = new ExecutionProfile('default', {
  readTimeout: 4000,
  consistency: types.consistencies.localQuorum
})
const pedanticProfile = new ExecutionProfile('pedantic', {
  consistency: types.consistencies.all,
  retry: new policies.retry. IdempotenceAwareRetryPolicy()
})
const localizedProfile = new ExecutionProfile('europe', {
  // let's pretend there's a datacenter we want to direct *some* queries to...
  // (in practice we write an existing datacenter's name here to have working code)
  loadBalancing: new policies.loadBalancing.DCAwareRoundRobinPolicy('eu-west-1')
})

const client = new Client({
  ...config,
  ...{
    profiles: [
      defaultProfile,
      pedanticProfile,
      localizedProfile
    ]
  }
});

async function main() {

  await client.connect();

  // we will neglect to shutdown the client here to focus on the point

  const qry = 'SELECT density FROM metals WHERE kind = ? AND name = ?;';
  const arg = ['regular', 'copper']

  const row1 = (await client.execute(qry, arg,
    {
      executionProfile: 'pedantic'
    }
  )).first();
  console.log('Copper density = %s', row1['density']);


  const row2 = (await client.execute(qry, arg,
    {
      executionProfile: 'europe'
    }
  )).first();
  console.log('Copper density = %s', row2['density']);


  // will use the default profile
  const row3 = (await client.execute(qry, arg)).first();
  console.log('Copper density = %s', row3['density']);

  await client.shutdown();
  console.log('** Connection closed');

}

main();
