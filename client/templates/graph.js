Template.graph.rendered = function() {
  var graphs = new Graphs();
  
  Tracker.autorun(function() {
    graphs.draw();
  });  
}


Graphs = function() {
  this.raw_data = null;
  this.resize();
}

Graphs.prototype.resize = function() {
  var self = this;

  $('.hello-graph').scrollLeft(9999);

  $(window).resize(_.debounce(function() {
    self.draw();
  }, 300));
}

Graphs.prototype.draw = function() {
  var raw_data = Hello.findOne();

  if (raw_data) {
    this.raw_data = _.map(raw_data.hello, function(d) {
      return d.clickDuration;
    });

    this.lineGraph('.hello-graph', this.raw_data);
  }
}

Graphs.prototype.lineGraph = function(el, data) {
  var self = this;

  var width = $(el).width(),
      height = $(el).height(),
      svg = d3.select(el).select('svg');

  if (svg.empty()) {
    svg = d3.select(el).append('svg');
  } svg.attr('width', width).attr('height', height);

  var min = d3.min(data),
      max = d3.max(data);
      
  var yScale = d3.scale.linear()
    .domain([min, max])
    .range([height - 40, 40]);

  var xScale = d3.scale.linear()      
    .domain([0, data.length - 1])
    .range([0, width]);
  
  var area = d3.svg.area()
    .x(function(d, i) { return xScale(i); })
    .y0(height)
    .y1(function(d) { return yScale(d); })
    .tension(0.7)
    .interpolate("cardinal");

  if ($(".area", el).length) {
    svg.select(".area")
      .data([data])
      .transition()
      .duration(250)
      .attr("d", area);
  } else {
    svg.append("path")
      .data([data])
      .attr({
        "class": "area",
        d: area
      });
  }

  var line = d3.svg.line()
    .x(function(d, i) { return xScale(i); })
    .y(function(d) { return yScale(d); })
    .tension(0.7)
    .interpolate('cardinal');

  if ($('.line', el).length) {
    svg.select('.line')
      .data([data])
      .transition()
      .duration(250)
      .attr('d', line);
  } else {
    svg.append('path')
      .data([data])
      .attr({
        'class': 'line',
        d: line,
        fill: 'none',
        'stroke-width': 1,
        'stroke-linecap': 'square'
      });
  }

  var circles = svg.selectAll('svg > .circle').data(data);
      circles.enter().append('circle');

  circles
    .attr('class', 'circle')
    .transition()
    .duration(250)
    .attr({
      cx: function(d, i) { return xScale(i); },
      cy: function(d, i) { return yScale(d); },
      r: 3
    });

  circles.exit().remove();
}