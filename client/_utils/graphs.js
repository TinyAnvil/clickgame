Graphs = function() {}

Graphs.prototype.watch = function() {
  $(window).resize(_.debounce(function() {
    this.draw();
  }.bind(this), 250));
}

Graphs.prototype.draw = function(data, IP) {
  this.IP = IP || this.IP;
  this.raw = data || this.raw;
  this.data = _.map(this.raw, function(d) {return d.clickDuration}) || this.data;
  this.lineGraph('.hello-graph', data);
}

Graphs.prototype.lineGraph = function(el) {
  var self = this;

  var el_width = $(el).width(),
      width = el_width / this.data.length > 10 ? el_width : this.data.length * 10,
      height = $(el).height(),
      svg = d3.select(el).select('svg');

  if (svg.empty()) {
    svg = d3.select(el).append('svg');
  } svg.attr('width', width).attr('height', height);

  var min = d3.min(this.data),
      max = d3.max(this.data);

  var yScale = d3.scale.linear()
    .domain([min, max])
    .range([height - (el_width <= 600 ? 10 : 20), (el_width <= 600 ? 10 : 20)]);

  var xScale = d3.scale.linear()
    .domain([this.data.length - 1, 0])
    .range([el_width <= 600 ? 10 : 20, width - (el_width <= 600 ? 10 : 20)]);

  var area = d3.svg.area()
    .x(function(d, i) { return xScale(i); })
    .y0(height)
    .y1(function(d) { return yScale(d); })
    .tension(0.7)
    .interpolate("cardinal");

  if ($(".area", el).length) {
    svg.select(".area")
      .data([this.data])
      .transition()
      .duration(250)
      .attr("d", area);
  } else {
    svg.append("path")
      .data([this.data])
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
      .data([this.data])
      .transition()
      .duration(250)
      .attr('d', line);
  } else {
    svg.append('path')
      .data([this.data])
      .attr({
        'class': 'line',
        d: line
      });
  }

  var halos = svg.selectAll('svg > .halo').data(this.data);
      halos.enter().append('circle');

  halos
    .attr({
      'class': function(d, i) {
        var string = self.IP === self.raw[i]._owner ? 'halo mine ' : 'halo ';

        if (d > 300000) {
           string += 'gold';
        } else if (d > 90000 &&
                   d <= 300000) {
          string += 'silver';
        } else if (d > 30000 &&
                   d <= 90000) {
          string += 'bronze';
        } else if (d <= 30000) {
          string += 'garbage';
        }

        return string;
      },
      cx: function(d, i) { return xScale(i); },
      cy: function(d) { return yScale(d); },
      r: function(d) {
        return d <= 30000 ? 3 : 4;
      }
    });

  halos.exit().remove();

  var circles = svg.selectAll('svg > .circle').data(this.data);
      circles.enter().append('circle');

  circles
    .attr({
      'class': function(d) {
        var string = 'circle ';

        if (d > 300000) {
           string += 'gold';
        } else if (d > 90000 &&
                   d <= 300000) {
          string += 'silver';
        } else if (d > 30000 &&
                   d <= 90000) {
          string += 'bronze';
        } else if (d <= 30000) {
          string += 'garbage';
        }

        return string;
      },
      cx: function(d, i) { return xScale(i); },
      cy: function(d) { return yScale(d); },
      r: function(d) {
        return d <= 30000 ? 1 : 2;
      }
    });

  circles.exit().remove();

  $(el).scrollLeft(width);
}
