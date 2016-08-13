var fire = {
  i: null,
  timer: null,
  up: null,
  down: null
};

function down(event) {
  if (fire.timer || fire.i)
    return false;

  fire.timer = Meteor.setInterval(function() {
    $('.hello-tag', event.currentTarget).css('transform', 'scale('+ (fire.i > 300 ? (-(300 * 0.05 - 1) + (fire.i * 0.05)) : 1) +') rotate('+ (fire.i / 5 * fire.i) +'deg)');

    if (fire.i > 500)
      $('.hello-tag', event.currentTarget).css({
        color: '#FCEDDA',
        background: '#D32D2D'
      });

    fire.i++;
  }, 100);

  fire.down = moment();
}

function up(event) {
  if (event.isTrigger ||
      !event.originalEvent ||
      !event.view)
    return false;

  fire.up = moment();

  Meteor.call('sayHello', fire.up.diff(fire.down));

  Meteor.clearInterval(fire.timer);

  fire = {
    i: null,
    timer: null,
    up: null,
    down: null
  };

  $('.hello-tag', event.currentTarget).css({
    transform: '',
    color: '',
    background: ''
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
    if (!Meteor.Device.isDesktop()) return false;
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
    return this.hello.length;
  }
});
