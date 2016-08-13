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
  data: function() {
    return {
      hello: Hello.find({}, {sort: {clickDuration: -1}}).fetch()
    }
  },
  onAfterAction: function() {
    Meteor.call('getIP', function(err, IP) {
      sessionStorage.setItem('ClickGame', IP);
    });
  }
});
