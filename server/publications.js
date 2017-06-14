Meteor.publish('myHello', function() {
  return Hello.find({_owner: Meteor.call('connection', this.connection)})
});

Meteor.publish('theirHello', function() {
  return Hello.find({_owner: {$ne: Meteor.call('connection', this.connection)}}, {
    fields: {
      _owner: 0
    }
  });
});