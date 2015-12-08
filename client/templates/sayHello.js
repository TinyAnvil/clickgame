Template.sayHello.events({
  'click .hello-box button': function(event) {
    Meteor.call('sayHello');
  }
});

Template.sayHello.helpers({
  'count': function() {
    var hello_doc = Hello.findOne();

    if (hello_doc)
      return Hello.findOne().hello.length;

    return 0;
  }
});