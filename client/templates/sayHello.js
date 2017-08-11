let fire = {
  i: null,
  id: null,
  timer: null
}

function down(event) {
  if (
    fire.id ||
    event.isTrigger ||
    !event.originalEvent ||
    !event.view
  ) return false;

  fire.timer = Meteor.setInterval(() => {
    $('.hello-tag', event.currentTarget).css('transform', 'scale('+ (fire.i > 300 ? (-(300 * 0.05 - 1) + (fire.i * 0.05)) : 1) +') rotate('+ (fire.i / 5 * fire.i) +'deg)');

    if (fire.i > 500)
      $('.hello-tag', event.currentTarget).css({
        color: '#FCEDDA',
        background: '#D32D2D'
      });

    fire.i++;
  }, 100);

  fire.id = Random.id(44);
  Meteor.call('sayHello', fire.id);

  // Meteor.setInterval(function() {Meteor.call('sayHello', Random.id(), (err, res) => {Meteor.call('sayHello', res)})}, 100);
}

function up(event) {
  if (
    event.isTrigger ||
    !event.originalEvent ||
    !event.view ||
    !fire.id
  ) return false;

  Meteor.call('sayHello', fire.id);

  Meteor.clearInterval(fire.timer);

  fire = {
    i: null,
    id: null,
    timer: null
  };

  $('.hello-tag', event.currentTarget).css({
    transform: '',
    color: '',
    background: ''
  });
}

Template.sayHello.rendered = () => {
  
}

Template.sayHello.events({
  'mousedown .hello-box button'(event) {
    if (!Meteor.Device.isDesktop()) return false;
    down(event);
  },

  'mouseup .hello-box button'(event) {
    if (!Meteor.Device.isDesktop()) return false;
    up(event);
  },

  'mouseleave .hello-box button'(event) {
    if (!Meteor.Device.isDesktop()) return false;
    up(event);
  },

  'touchstart .hello-box button'(event) {
    if (Meteor.Device.isDesktop()) return false;
    down(event);
  },

  'touchend .hello-box button'(event) {
    if (Meteor.Device.isDesktop()) return false;
    up(event);
  }
});

Template.sayHello.helpers({
  
});
