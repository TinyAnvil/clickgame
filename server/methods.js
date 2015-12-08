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

    if (hello_doc)
      return Hello.remove(hello_doc._id);
  }
});