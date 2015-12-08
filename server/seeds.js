Meteor.startup(function() {
  if (!Hello.findOne())
    Meteor.call('seed');
});