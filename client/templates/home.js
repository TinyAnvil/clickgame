Template.home.rendered = function() {

}

Template.home.events({

});

Template.home.helpers({
  medals: function() {
    var hello = Hello.find().fetch();

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
