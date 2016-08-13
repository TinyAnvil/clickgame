Meteor.methods({
  sayHello: function(doc, code) {
    if (!moment.isDate(doc.clickedAt) ||
        !_.isNumber(doc.clickDuration) ||
        _.isNaN(doc.clickDuration))
      return false;

    doc._owner = Meteor.settings.env.key === code ? Meteor.settings.env.key : this.connection.clientAddress;

    var doc_count = Hello.find({
      _owner: doc._owner,
      clickedAt: {
        $gte: moment(doc.clickedAt).subtract(60, 'seconds')._d
      }
    }).count();

    if (doc_count >= 10 && code !== Meteor.settings.env.key)
      return false; // Allow any one user 10 requests per minute

    Hello.insert(doc);
    return doc._owner;
  },

  sayGoodbye: function(i, code) {
    if (code !== Meteor.settings.env.key)
      throw new Meteor.Error(500, 'To execute this method you must pass the secret access key')

    _.each(Hello.find().fetch(), function(doc) {
      Hello.remove(doc._id);
    });

    return Meteor.call('seed', i, code);
  },

  seed: function(i, code) {
    if (code !== Meteor.settings.env.key)
      throw new Meteor.Error(500, 'To execute this method you must pass the secret access key')

    _.each(_.range(i), function(i) {
      var int = i * 200;

      Meteor.call('sayHello', {
        clickedAt: moment()._d,
        clickDuration: _.random(int, int * 1.05),
        _owner: Meteor.settings.env.key
      }, code);
    });
  },

  getIP: function() {
    console.log(this.connection);
    return this.connection.clientAddress;
  }
});
