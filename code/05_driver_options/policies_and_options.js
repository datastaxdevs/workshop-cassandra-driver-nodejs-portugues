const { Client, types, policies } = require('cassandra-driver');

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

const client = new Client({
  ...config,
  ...{
    'policies': {
      'loadBalancing': new policies.loadBalancing.TokenAwarePolicy(
        new policies.loadBalancing.DCAwareRoundRobinPolicy('eu-west-1')
        // in a real setting, one would specify policies using different
        // datacenters for different execution profiles.
      ),
      'reconnection': new policies.reconnection. ExponentialReconnectionPolicy(
        2000,           // base value
        10 * 60 * 1000, // max value
        false,          // start with no delay?
      ),
      // this can be specified at query-level as well
      'retry': new policies.retry.FallthroughRetryPolicy()
    }
  }
});

async function main() {

  await client.connect();

  // we will neglect to shutdown the client here to focus on the point

  // Various options when executing a query
  client.eachRow(
    'SELECT name, density FROM metals WHERE kind = ?;',
    ['regular'],
    {
      prepare: true,
      autoPage: true,   // this option relevant for eachRow() only
      consistency: types.consistencies.localQuorum,
      fetchSize: 2,
      readTimeout: 1500, // milliseconds
      policies: {
        retry: new policies.retry.FallthroughRetryPolicy(),
      }
    },
    (n, row) => {
      // 'n' will be an in-page index!
      console.log('Metal %s is %s with density %s', n, row.name, row.density)
    },
    err => {
      if(err){
        console.error('Error reading regular metals:', err)
      }
    }
  );

}

main();
