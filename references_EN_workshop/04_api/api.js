const express = require('express');
const api = express();

api.use(express.json());

api.listen(5000, () => {
  console.log('API ready on port 5000');
});

// database client instantiation

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

/*
const config = {
    contactPoints: ['172.19.0.2'],
    localDataCenter: 'datacenter1',
    keyspace: 'chemistry'
};
*/

const client = new Client(config);
// 'client' will connect when executing the first query

/*
  Sample curls:
    curl -s localhost:5000/metal | jq
    curl -s localhost:5000/metal/silver | jq
    curl -s -XPOST localhost:5000/metal \
      --data '{"density": 101.11, "name": "armonium"}' \
      -H "Content-Type: application/json" | jq
    curl -s localhost:5000/metal | jq
*/

api.get('/metal', (req, res) => {
  // get all metals
  client.execute(
    'SELECT name, density FROM metals WHERE kind = ?;',
    ['regular'],
    {prepare: true}
  ).then( qres => {
    const rows = qres.rows;
    res.send(rows);
  })
});

api.get('/metal/:name', (req, res) => {
  // get a specific metal
  client.execute(
    'SELECT name, density FROM metals WHERE kind = ? AND name = ?',
    ['regular', req.params.name],
    {prepare: true}
  ).then( qres => {
    if (qres.rowLength > 0){
      const row = qres.first();
      res.send(row);
    } else {
      res.status(404).send('Not found');
    }
  });
});

api.post('/metal', (req, res) => {
  // upsert a metal
  const newMetal = {
    ...req.body,
    ...{kind: 'regular'}
  };
  console.log(newMetal);
  client.execute(
    'INSERT INTO metals (kind, name, density) VALUES (?, ?, ?);',
    newMetal,
    {prepare: true}
  ).then( () => {
    res.send({inserted: true});
  })
});
