var fire = {
  up: null,
  down: null
}
var timer;

Template.sayHello.events({
  'mousedown .hello-box button': function(event) {
    var i = 0;
    fire.down = new Date().toISOString();

    timer = Meteor.setInterval(function() {
      i++
      $('span', event.currentTarget).css('transform', 'scale('+ (1 + (i * (0.05 * i))) +')');
    }, 100);
  },

  'mouseup .hello-box button': function(event) {
    fire.up = new Date().toISOString();
    Meteor.clearInterval(timer);
    $('span', event.currentTarget).css('transform', '');
  },

  'click .hello-box button': function(event) {
    Meteor.call('sayHello', {
      clickedAt: fire.up,
      clickDuration: moment(fire.up).diff(fire.down)
    });
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