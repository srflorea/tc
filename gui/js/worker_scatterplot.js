function getQueryStrings() { 
  var assoc  = {};
  var decode = function (s) { return decodeURIComponent(s.replace(/\+/g, " ")); };
  var queryString = location.search.substring(1); 
  var keyValues = queryString.split('&'); 

  for(var i in keyValues) { 
    var key = keyValues[i].split('=');
    if (key.length > 1) {
      assoc[decode(key[0])] = decode(key[1]);
    }
  } 

  return assoc; 
}

// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

var tasks_colors = {"First2Finish":"orange",
                "UI Prototype Competition":"green",
                "Assembly Competition":"yellow",
                "Code":"red",
                "Design":"blue"
                }

// Parse the date / time
var parseDate = d3.time.format("%Y-%m-%d").parse;

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom")
    .tickFormat(function (d, i) { 
        return d.toISOString().slice(0,10)
    })
    .ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the line
//var valueline = d3.svg.line()
  //  .x(function(d) { return x(d.date); })
    //.y(function(d) { return y(d.prize); });
    
// Adds the svg canvas
var svg = d3.select("#chart")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

// Adds the svg canvas
var svg2 = d3.select("#chart2")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

var qs = getQueryStrings();
var handle = qs["handle"];

var url = "http://localhost:8080/registrations?handle=" + handle;
// Get the data
d3.json(url, function(error, data) {
    data.forEach(function(d) {
        if (d.prize > 10000) {
            var i = data.indexOf(d);
            data.splice(i, 1)
        }
        d.date = parseDate(d.date);
        d.prize = +d.prize;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.prize; })]);

    // Add the valueline path.
//    svg.append("path")
//       .attr("class", "line")
//        .attr("d", valueline(data));

    // Add the scatterplot
    svg.selectAll("dot")
        .data(data)
      .enter().append("circle")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(d.date); })
        .attr("cy", function(d) { return y(d.prize); })
        .style('fill', function(d,i) {
            if (d.type in tasks_colors)
                return tasks_colors[d.type];
            return 'black'
        });

    // Add the X Axis
    svg.append("g")
        //.attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .style('text-anchor', 'end')
        //
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        //.attr("class", "y axis")
        .call(yAxis);

    // Add title
    svg.append('text')
        .attr("class", "title")
        .attr('text-anchor', 'middle')
        .attr("x", width / 2 + 20)
        .attr("y", -50)
        .attr("dy", 30)
        .text('Worker\'s registrations in time for different types of tasks')

    svg.append('text')
        .attr("class", "title")
        .attr('text-anchor', 'middle')
        .attr("x", width / 2 + 20)
        .attr("y", height)
        .attr("dy", 30)
        .text('Time')

    svg.append('text')
        .attr("class", "title")
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'left')
        .attr("x", -height + 60)
        .attr("y", -40)
        .text('Task\'s prize')
            

    var w = 300;
    var h = 300;
    var r = h/2;
    var colors = ['orange','yellow','green','red','blue'];

    var new_data = compute_data_for_pie1(data);
    var total_no = d3.sum(new_data, function(d) {return d.values;});
    //console.log(new_data);
    //console.log(total_no);

    var vis = d3.select('#pie1').append("svg:svg").data([new_data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
    var pie = d3.layout.pie().value(function(d){return d.values;});

    // declare an arc generator function
    var arc = d3.svg.arc().outerRadius(r);

    // select paths, use arc generator to draw
    var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
    arcs.append("svg:path")
        .style("fill", function(d, i){
            return tasks_colors[d.data.key];
        })
        .attr("d", function (d) {
            // log the result of the arc generator to show how cool it is :)
            //console.log(arc(d));
            return arc(d);
        });

    // add the text
    arcs.append("svg:text").attr("transform", function(d){
                d.innerRadius = 0;
                d.outerRadius = r;
    return "translate(" + arc.centroid(d) + ")";})
                .attr("text-anchor", "middle")
                .style('fill', 'black')
                .text( function(d, i) {
                    //return new_data[i].key;
                    var percent = (new_data[i].values / total_no) * 100;
                    if (percent < 6)
                        return ''
                    return (Math.round(percent * 100) / 100) + '%';
                });
});


function compute_data_for_pie1(data) {
    var new_data = d3.nest()
            .key(function(d) {return d.type;})
            .rollup(function(d) {
                return d3.sum(d, function(g) {return 1})
            })
            .entries(data)
    return new_data
}

function compute_data_for_pie2(data) {
    var new_data = d3.nest()
            .key(function(d) {return d.submitted;})
            .rollup(function(d) {
                return d3.sum(d, function(g) {return 1})
            })
            .entries(data)
    return new_data
}

// Get the data
d3.json(url, function(error, data) {
    data.forEach(function(d) {
        if (d.prize > 10000) {
            var i = data.indexOf(d);
            data.splice(i, 1)
        }
        d.date = parseDate(d.date);
        d.prize = +d.prize;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.prize; })]);

    // Add the valueline path.
//    svg.append("path")
//       .attr("class", "line")
//        .attr("d", valueline(data));

    // Add the scatterplot
    svg2.selectAll("dot")
        .data(data)
      .enter().append("circle")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(d.date); })
        .attr("cy", function(d) { return y(d.prize); })
        .style('fill', function(d,i) {
            if (d.submitted == 1)
                return '#80ff00';
            return 'black'
        });

    // Add the X Axis
    svg2.append("g")
        //.attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .style('text-anchor', 'end')
        //
        .call(xAxis);

    // Add the Y Axis
    svg2.append("g")
        //.attr("class", "y axis")
        .call(yAxis);

    // Add title
    svg2.append('text')
        .attr("class", "title")
        .attr('text-anchor', 'middle')
        .attr("x", width / 2 + 20)
        .attr("y", -50)
        .attr("dy", 30)
        .text('Worker\'s submissions in time')

    svg2.append('text')
        .attr("class", "title")
        .attr('text-anchor', 'middle')
        .attr("x", width / 2 + 20)
        .attr("y", height)
        .attr("dy", 30)
        .text('Time')

    svg2.append('text')
        .attr("class", "title")
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'left')
        .attr("x", -height + 60)
        .attr("y", -40)
        .text('Task\'s prize')
            

    var w = 300;
    var h = 300;
    var r = h/2;
    var colors = ['black','#80ff00'];

    var new_data = compute_data_for_pie2(data);
    var total_no = d3.sum(new_data, function(d) {return d.values;});

    var vis = d3.select('#pie2').append("svg:svg").data([new_data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
    var pie = d3.layout.pie().value(function(d){return d.values;});

    // declare an arc generator function
    var arc = d3.svg.arc().outerRadius(r);

    // select paths, use arc generator to draw
    var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
    arcs.append("svg:path")
        .style("fill", function(d, i){
            return colors[i];
        })
        .attr("d", function (d) {
            // log the result of the arc generator to show how cool it is :)
            //console.log(arc(d));
            return arc(d);
        });

    // add the text
    arcs.append("svg:text").attr("transform", function(d){
                d.innerRadius = 0;
                d.outerRadius = r;
    return "translate(" + arc.centroid(d) + ")";})
                .attr("text-anchor", "middle")
                .style('fill', 'white')
                .text( function(d, i) {
                    //return new_data[i].key;
                    var percent = (new_data[i].values / total_no) * 100;
                    if (percent < 4)
                        return ''
                    return (Math.round(percent * 100) / 100) + '%';
                });
});