Meteor.publish('hello', function() {
  return Hello.find();
});