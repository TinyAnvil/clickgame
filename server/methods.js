Meteor.methods({
  sayHello: function(duration, code) {
    if (!_.isNumber(duration) ||
        _.isNaN(duration))
      return false;

    var doc = {
      clickedAt: moment()._d,
      clickDuration: duration,
      _owner: Meteor.settings.env.key === code ? Meteor.settings.env.key : this.connection.clientAddress
    }

    var recent = Hello.find({
      _owner: doc._owner,
      clickedAt: {
        $gte: moment(doc.clickedAt).subtract(30, 'seconds')._d
      }
    }).fetch();

    if (recent.length >= 10 && code !== Meteor.settings.env.key)
      return false; // Allow any one user 10 requests per minute unless it's been 10 seconds since the last request

    Hello.insert(doc);
  },

  sayGoodbye: function(i, code) {
    if (code !== Meteor.settings.env.key)
      throw new Meteor.Error(500, 'To execute this method you must pass the secret access key')

    Hello.remove({});
    Meteor.call('seed', i, code);
  },

  seed: function(i, code) {
    if (code !== Meteor.settings.env.key)
      throw new Meteor.Error(500, 'To execute this method you must pass the secret access key')

    _.each(_.range(i), function(i) {
      var int = i * 200;
      Meteor.call('sayHello', _.random(int, int * 1.05), code);
    });
  },

  getIP: function() {
    return this.connection.clientAddress;
  }
});
