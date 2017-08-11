Meteor.publish('myHello', function() {
  return Hello.find({
    _owner: Meteor.call('connection', this.connection),
    clickDuration: {$gt: 0}
  });
});

Meteor.publish('theirHello', function() {
  return Hello.find({
    _owner: {$ne: Meteor.call('connection', this.connection)},
    clickDuration: {$gt: 0}
  }, {
    limit: 500,
    fields: {
      _owner: 0
    },
    sort: {
      clickedAt: -1
    }
  });
});