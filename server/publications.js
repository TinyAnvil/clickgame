Meteor.publish('hello', function() {
  return Hello.find({}, {sort: {clickedAt: 1}});
});
