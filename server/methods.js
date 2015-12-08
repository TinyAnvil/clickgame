Meteor.methods({
  'sayHello': function(doc) {
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

  'sayGoodbye': function() {
    var hello_doc = Hello.findOne();

    if (hello_doc) {
      Hello.remove(hello_doc._id);
      return Meteor.call('seed');
    }
  },

  'seed': function(i) {
    i = i || 3;
    
    _.each(_.range(i), function() {
      Meteor.call('sayHello', {
        clickedAt: new Date().toISOString(),
        clickDuration: _.random(0, 5000) 
      });
    });
  }
});