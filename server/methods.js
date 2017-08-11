Meteor.methods({
  sayHello(id, code, duration) {
    const owner = Meteor.settings.admin === code ? code : Meteor.call('connection', this.connection);
    const hello = Hello.findOne({_id: id});
    const now = moment();

    if (hello && hello.clickDuration > 0)
      throw new Meteor.Error(500, 'This click has already been registered. Nice try though');

    // If click has already been started, finish it off
    if (hello) {
      Hello.update(id, {$set: {
        clickDuration: now.diff(hello.clickedAt)
      }});
    }

    // Otherwise create a new hello item
    else {

      // Look out for bot clickers
      // Limit the game to 10 clicks per 10 seconds
      const recent = Hello.find({
        _owner: owner,
        clickedAt: {$gte: now.clone().subtract(10, 'seconds').toDate()}
      }).count();

      if (
        Meteor.settings.admin !== owner &&
        recent >= 10
      ) throw new Meteor.Error(500, 'Rage clicking is not supported. Try holding the button');
      ////

      return Hello.insert({
        _id: id,
        _owner: owner,
        clickedAt: now.toDate(),
        clickDuration: Meteor.settings.admin === owner ? duration : 0
      });
    }
  },

  getStats() {
    return {
      gold: Hello.find({clickDuration: {
        $gte: 300000
      }}).count(),
      silver: Hello.find({clickDuration: {
        $lt: 300000,
        $gt: 90000
      }}).count(),
      bronze: Hello.find({clickDuration: {
        $lte: 90000,
        $gt: 30000
      }}).count(),
      total: Hello.find({clickDuration: {$gt: 0}}).count()
    }
  },

  connection(con) {
    con = con || this.connection;
    return (con.clientAddress+con.httpHeaders['user-agent']).replace(/[^a-zA-Z0-9]/g, '');
  },

  seed(i, code) {
    if (code !== Meteor.settings.admin)
      throw new Meteor.Error(500, 'To execute this method you must pass the secret access key')

    _.each(_.range(i), (i) => {
      const int = _.random(i * 200, i * 200 * 1.05) + 1;
      Meteor.call('sayHello', Random.id(44), code, int);
    });
  },

  reap(i, code) {
    if (code !== Meteor.settings.admin)
      throw new Meteor.Error(500, 'To execute this method you must pass the secret access key')

    Hello.remove({});
    Meteor.call('seed', i, code);
  }
});
