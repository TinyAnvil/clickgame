Meteor.startup(function() {
  if (!Hello.findOne()) {
    Meteor.call('sayHello', {
      clickedAt: new Date().toISOString(),
      clickDuration: 1234
    });

    Meteor.call('sayHello', {
      clickedAt: new Date().toISOString(),
      clickDuration: 234
    });

    Meteor.call('sayHello', {
      clickedAt: new Date().toISOString(),
      clickDuration: 2345
    });
  }
});