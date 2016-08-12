Meteor.startup(function() {
  if (!Hello.find())
    Meteor.call('seed');
});
