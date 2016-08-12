Template.graph.rendered = function() {
  var graphs = new Graphs();

  Tracker.autorun(function() {
    graphs.draw();
  });
}


Graphs = function() {
  this.id = localStorage.getItem('ClickGame');
  this.resize();
}

Graphs.prototype.resize = function() {
  $(window).resize(_.debounce(function() {
    this.draw();
  }.bind(this), 250));
}

Graphs.prototype.draw = function() {
  this.lineGraph('.hello-graph', Hello.find().fetch());
}

Graphs.prototype.lineGraph = function(el, raw_data) {
  var self = this;

  var clean_data = _.map(raw_data, function(d) {
    return d.clickDuration;
  });

  var width = $(el).width() / clean_data.length > 20 ? $(el).width() : clean_data.length * 20,
      height = $(el).height(),
      svg = d3.select(el).select('svg');

  if (svg.empty()) {
    svg = d3.select(el).append('svg');
  } svg.attr('width', width).attr('height', height);

  var min = d3.min(clean_data),
      max = d3.max(clean_data);

  var yScale = d3.scale.linear()
    .domain([min, max])
    .range([height - 20, 20]);

  var xScale = d3.scale.linear()
    .domain([0, clean_data.length - 1])
    .range([20, width - 20]);

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
        d: line,
        fill: 'none',
        'stroke-width': 0.75,
        'stroke-linecap': 'square'
      });
  }

  var halos = svg.selectAll('svg > .halo').data(raw_data);
      halos.enter().append('circle');

  halos
    .attr({
      'class': function(d) {
        return self.id === d._owner ? 'halo mine' : 'halo'
      }
    })
    .transition()
    .duration(250)
    .attr({
      cx: function(d, i) { return xScale(i); },
      cy: function(d, i) { return yScale(d.clickDuration); },
      r: 2
    });

  halos.exit().remove();

  var circles = svg.selectAll('svg > .circle').data(raw_data);
      circles.enter().append('circle');

  circles
  .attr({
    'class': function(d) {
      return self.id === d._owner ? 'circle mine' : 'circle'
    }
  })
    .transition()
    .duration(250)
    .attr({
      cx: function(d, i) { return xScale(i); },
      cy: function(d, i) { return yScale(d.clickDuration); },
      r: 1
    });

  circles.exit().remove();

  $(el).scrollLeft(width);
}
