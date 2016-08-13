var timer;
var fire = {
  up: null,
  down: null
}

function down(event) {
  var i = 0;

  timer = Meteor.setInterval(function() {
    $('.hello-tag', event.currentTarget).css('transform', 'scale('+ (i > 300 ? (-9 + (i * 0.05)) : 1) +') rotate('+ (i / 5 * i) +'deg)');

    if (i > 500)
      $('.hello-tag', event.currentTarget).css({
        color: '#FCEDDA',
        background: '#D32D2D'
      });

    i++;
  }, 100);

  fire.down = moment();
}

function up(event) {
  Meteor.clearInterval(timer);
  timer = undefined;

  $('.hello-tag', event.currentTarget).css({
    transform: '',
    color: '',
    background: ''
  });

  fire.up = moment();

  if (event.isTrigger ||
      !event.originalEvent ||
      !event.view)
    return false;

  Meteor.call('sayHello', {
    clickedAt: fire.up._d,
    clickDuration: fire.up.diff(fire.down)
  }, function(err, IP) {
    if (!err && sessionStorage.getItem('ClickGame') === null)
      sessionStorage.setItem('ClickGame', IP);
  });
}

Template.sayHello.rendered = function() {
  $('.hello-box button').attr('unselectable', 'on').addClass('unselectable');
}

Template.sayHello.events({
  'mousedown .hello-box button': function(event) {
    if (!Meteor.Device.isDesktop()) return false;
    down(event);
  },

  'mouseup .hello-box button': function(event) {
    if (!Meteor.Device.isDesktop()) return false;
    up(event);
  },

  'mouseleave .hello-box button': function(event) {
    if (!Meteor.Device.isDesktop() || !timer) return false;
    up(event);
  },

  'touchstart .hello-box button': function(event) {
    if (Meteor.Device.isDesktop()) return false;
    down(event);
  },

  'touchend .hello-box button': function(event) {
    if (Meteor.Device.isDesktop()) return false;
    up(event);
  }
});

Template.sayHello.helpers({
  count: function() {
    return d3.sum(_.values(this));
  }
});
