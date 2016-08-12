Meteor.methods({
  'sayHello': function(doc) {
    if (!doc.clickedAt || !doc.clickDuration)
      return false;

    var hello_doc = Hello.findOne();

    if (hello_doc) {
      return Hello.update(hello_doc._id, {
        $push: {
          hello: doc
        }
      });
    }

    return Hello.insert({
      hello: [doc]
    });
  },

  'sayGoodbye': function(i) {
    var hello_doc = Hello.findOne();

    if (hello_doc) {
      Hello.remove(hello_doc._id);
      return Meteor.call('seed', i);
    }
  },

  'seed': function(i) {
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
