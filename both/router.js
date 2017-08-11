Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() {
    return [
      Meteor.subscribe('myHello'),
      Meteor.subscribe('theirHello')
    ]
  }
});

Router.route('/', {
  name: 'home'
});
