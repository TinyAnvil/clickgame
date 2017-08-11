const medals = new ReactiveVar({
  gold: 0,
  silver: 0,
  bronze: 0,
  total: 0
});

Template.home.rendered = function() {
  Meteor.call('connection', function(err, res) {
    var graphs = new Graphs();
        graphs.watch();

    Tracker.autorun(function() {
      graphs.draw(Hello.find({}, {sort: {clickedAt: -1}}).fetch(), res);

      Meteor.call('getStats', (err, res) => {
        if (err)
          return console.error(err);
    
        medals.set(res);
      });
    });
  });
}

Template.home.events({

});

Template.home.helpers({
  medals() {
    return medals.get()
  }
});
