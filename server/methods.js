Meteor.methods({
  sayHello: function(doc) {
    if (doc.clickedAt && doc.clickDuration)
      Hello.insert(doc);
  },

  sayGoodbye: function(i) {
    _.each(Hello.find().fetch(), function(doc) {
      Hello.remove(doc._id);
    });

    return Meteor.call('seed', i);
  },

  seed: function(i) {
    i = i || 3;

    _.each(_.range(i), function(i) {
      var int = i+1;

      Meteor.call('sayHello', {
        clickedAt: new Date().toISOString(),
        clickDuration: _.random(int, int*2)
      });
    });
  }
});
