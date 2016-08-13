Template.graph.rendered = function() {
  var graphs = new Graphs();
      graphs.watch();

  Tracker.autorun(function() {
    graphs.draw();
  });
}


Graphs = function() {}

Graphs.prototype.watch = function() {
  $(window).resize(_.debounce(function() {
    this.draw();
  }.bind(this), 250));
}

Graphs.prototype.draw = function() {
  this.lineGraph('.hello-graph', Hello.find({}, {sort: {clickedAt : -1}, limit: 500}).fetch());
}

Graphs.prototype.lineGraph = function(el, raw_data) {
  var self = this,
      IP = sessionStorage.getItem('ClickGame');

  var clean_data = _.map(raw_data, function(d) {
    return d.clickDuration;
  });

  var el_width = $(el).width(),
      width = el_width / clean_data.length > 10 ? el_width : clean_data.length * 10,
      height = $(el).height(),
      svg = d3.select(el).select('svg');

  if (svg.empty()) {
    svg = d3.select(el).append('svg');
  } svg.attr('width', width).attr('height', height);

  var min = d3.min(clean_data),
      max = d3.max(clean_data);

  var yScale = d3.scale.linear()
    .domain([min, max])
    .range([height - (el_width <= 600 ? 10 : 20), (el_width <= 600 ? 10 : 20)]);

  var xScale = d3.scale.linear()
    .domain([clean_data.length - 1, 0])
    .range([(el_width <= 600 ? 10 : 20), width - (el_width <= 600 ? 10 : 20)]);

  var area = d3.svg.area()
    .x(function(d, i) { return xScale(i); })
    .y0(height)
    .y1(function(d) { return yScale(d.clickDuration); })
    .tension(0.7)
    .interpolate("cardinal");

  if ($(".area", el).length) {
    svg.select(".area")
      .data([raw_data])
      .transition()
      .duration(250)
      .attr("d", area);
  } else {
    svg.append("path")
      .data([raw_data])
      .attr({
        "class": "area",
        d: area
      });
  }

  var line = d3.svg.line()
    .x(function(d, i) { return xScale(i); })
    .y(function(d) { return yScale(d.clickDuration); })
    .tension(0.7)
    .interpolate('cardinal');

  if ($('.line', el).length) {
    svg.select('.line')
      .data([raw_data])
      .transition()
      .duration(250)
      .attr('d', line);
  } else {
    svg.append('path')
      .data([raw_data])
      .attr({
        'class': 'line',
        d: line
      });
  }

  var halos = svg.selectAll('svg > .halo').data(raw_data);
      halos.enter().append('circle');

  halos
    .attr({
      'class': function(d) {
        return IP === d._owner ? 'halo mine' : 'halo'
      },
      cx: function(d, i) { return xScale(i); },
      cy: function(d, i) { return yScale(d.clickDuration); },
      r: 3
    });

  halos.exit().remove();

  var circles = svg.selectAll('svg > .circle').data(raw_data);
      circles.enter().append('circle');

  circles
    .attr({
      'class': function(d) {
        var string = 'circle ';

        if (d.clickDuration > 300000) {
           string += 'gold';
        } else if (d.clickDuration > 90000 &&
                   d.clickDuration <= 300000) {
          string += 'silver';
        } else if (d.clickDuration > 30000 &&
                   d.clickDuration <= 90000) {
          string += 'bronze';
        } else if (d.clickDuration <= 30000) {
          string += 'garbage';
        }

        return string;
      },
      cx: function(d, i) { return xScale(i); },
      cy: function(d, i) { return yScale(d.clickDuration); },
      r: 1.25
    });

  circles.exit().remove();

  $(el).scrollLeft(width);
}
