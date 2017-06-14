module.exports = {
  servers: {
    one: {
      host: '138.197.107.24',
      username: 'root',
      pem: '/Users/Tyler/.ssh/tyvdh_rsa'
    }
  },
  meteor: {
    name: 'clickgame',
    path: '/Users/Tyler/Desktop/Web/Progress/Meteor/clickgame',
    docker: {
      image: 'abernix/meteord:base',
    },
    servers: {
      one: {}
    },
    buildOptions: {
      serverOnly: true,
    },
    env: {
      PORT: 3016,
      ROOT_URL: 'https://clickga.me',
      MONGO_URL: 'mongodb://tyler:Puk6RTBYkC4dRc6v@clickgame-shard-00-00-oscgt.mongodb.net:27017,clickgame-shard-00-01-oscgt.mongodb.net:27017,clickgame-shard-00-02-oscgt.mongodb.net:27017/clickgame?ssl=true&replicaSet=clickgame-shard-0&authSource=admin'
    },
    // ssl: {
    //   crt: './bundle.crt',
    //   key: './private.key',
    //   port: 443
    // },
    deployCheckWaitTime: 60
  }
}

// mongo "mongodb://clickgame-shard-00-00-oscgt.mongodb.net:27017,clickgame-shard-00-01-oscgt.mongodb.net:27017,clickgame-shard-00-02-oscgt.mongodb.net:27017/clickgame?replicaSet=clickgame-shard-0" --authenticationDatabase admin --ssl --username tyler --password Puk6RTBYkC4dRc6v