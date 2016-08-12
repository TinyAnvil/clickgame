var timer;
var fire = {
  up: null,
  down: null
}

function down(el) {
  var i = 0;

  fire.down = new Date().toISOString();
  timer = Meteor.setInterval(function() {
    i++
    $('span', el).css('transform', 'scale('+ (1 + (i * (0.05 * i))) +')');
  }, 100);
}

function up(el) {
  fire.up = new Date().toISOString();
  Meteor.clearInterval(timer);
  $('span', el).css('transform', '');

  Meteor.call('sayHello', {
    clickedAt: fire.up,
    clickDuration: moment(fire.up).diff(fire.down)
  });
}

Template.sayHello.rendered = function() {
  $('.hello-box button').attr('unselectable', 'on').addClass('unselectable');
}

Template.sayHello.events({
  'mousedown .hello-box button': function(event) {
    if (!Meteor.Device.isDesktop()) return false;
    down(event.currentTarget);
  },

  'mouseup .hello-box button': function(event) {
    if (!Meteor.Device.isDesktop()) return false;
    up(event.currentTarget);
  },

  'touchstart .hello-box button': function(event) {
    if (Meteor.Device.isDesktop()) return false;
    down(event.currentTarget);
  },

  'touchend .hello-box button': function(event) {
    if (Meteor.Device.isDesktop()) return false;
    up(event.currentTarget);
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
