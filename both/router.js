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
  name: 'home',
  onAfterAction: function() {
    Meteor.call('getIP', function(err, IP) {
      if (!err && sessionStorage.getItem('ClickGame') === null)
        sessionStorage.setItem('ClickGame', IP);
    });
  }
});
