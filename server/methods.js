Meteor.methods({
  sayHello: function(doc, code) {
    if (!moment.isDate(doc.clickedAt) ||
        !_.isNumber(doc.clickDuration) ||
        _.isNaN(doc.clickDuration) ||
        typeof doc._owner !== 'string')
      return false;

    // var doc_count = Hello.find({
    //   _owner: doc._owner,
    //   clickedAt: {
    //     $gte: moment(doc.clickedAt).subtract(10, 'seconds')._d
    //   }
    // }).count();
    //
    // if (doc_count >= 10 && code !== Meteor.settings.env.key)
    //   return false;

    Hello.insert(doc);
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

    i = i || 10;

    _.each(_.range(i), function(i) {
      var int = i*200;

      Meteor.call('sayHello', {
        clickedAt: moment()._d,
        clickDuration: _.random(int, int*1.05),
        _owner: 'ClickGame'
      }, code);
    });
  }
});
