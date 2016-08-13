Template.home.rendered = function() {
  var graphs = new Graphs();
      graphs.watch();

  Tracker.autorun(function() {
    graphs.draw(Hello.find({}, {sort: {clickedAt : -1}, limit: 500}).fetch());
  }.bind(this));
}

Template.home.events({

});

Template.home.helpers({
  medals: function() {
    // 10, 20, 30, 40

    // _.each(this, function(d) {
    //   console.log(d.clickDuration);
    // });

    var hello = this.hello;

    return {
      gold: hello.filter(function(d) {
        return d.clickDuration > 300000 ? true : false;
      }).length, // 5 minutes
      silver: hello.filter(function(d) {
        return d.clickDuration > 90000 &&
               d.clickDuration <= 300000 ? true : false;
      }).length, // 1.5 minutes
      bronze: hello.filter(function(d) {
        return d.clickDuration > 30000 &&
               d.clickDuration <= 90000 ? true : false;
      }).length, // 30 seconds
      garbage: hello.filter(function(d) {
        return d.clickDuration <= 30000 ? true : false;
      }).length,
    }
  }
});
