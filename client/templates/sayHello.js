var timer;
var fire = {
  up: null,
  down: null,
  id: (function() {
    if (localStorage.getItem('ClickGame') === null) {
      var id = Random.id();
      localStorage.setItem('ClickGame', id);
      return id;
    } else {
      return localStorage.getItem('ClickGame');
    }
  })()
}

function down(el) {
  var i = 0;

  timer = Meteor.setInterval(function() {
    $('.hello-tag', el).css('transform', 'scale('+ (i > 200 ? (-9 + (i * 0.05)) : 1) +') rotate('+ (i / 5 * i) +'deg)');

    if (i > 400)
      $('.hello-tag', el).css({
        color: '#FCEDDA',
        background: '#D32D2D'
      });

    console.log(i);

    i++;
  }, 100);

  fire.down = new Date().toISOString();
}

function up(el) {
  Meteor.clearInterval(timer);
  timer = undefined;

  $('.hello-tag', el).css({
    transform: '',
    color: '',
    background: ''
  });

  fire.up = new Date().toISOString();

  Meteor.call('sayHello', {
    clickedAt: fire.up,
    clickDuration: moment(fire.up).diff(fire.down),
    _owner: fire.id
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

  'mouseleave .hello-box button': function(event) {
    if (!Meteor.Device.isDesktop() || !timer) return false;
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
  count: function() {
    return Hello.find().count();
  }
});
