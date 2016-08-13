Meteor.publish('myHello', function() {
  return Hello.find({_owner: this.connection.clientAddress})
});

Meteor.publish('theirHello', function() {
  return Hello.find({_owner: {$ne: this.connection.clientAddress}}, {
    fields: {
      _owner: 0
    }
  });
});
