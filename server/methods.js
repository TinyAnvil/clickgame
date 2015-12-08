Meteor.methods({
  'sayHello': function() {
    var hello_doc = Hello.findOne();

    if (hello_doc) {
      return Hello.update(hello_doc._id, {
        $push: {
          hello: {
            date: new Date().toISOString()
          }
        }
      });
    }

    return Hello.insert({
      hello: [
        {
          date: new Date().toISOString()
        }
      ]
    });
  },

  'sayGoodbye': function() {
    var hello_doc = Hello.findOne();

    if (hello_doc)
      return Hello.remove(hello_doc._id);
  }
});