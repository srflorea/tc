d3.select("#type").classed("active", true)
d3.select("#button-color-by").selectAll("div").on("click", function(d) {
    id = d3.select(this).attr("id")
    d3.select("#button-color-by").selectAll("div").classed("active", false)
    d3.select("#" + id).classed("active", true)

    update_colors_for_legend(id)
    update_colors(id);
    update_pie(id)
    update_legend(id);
});

d3.selectAll("#color").on("change", function() {
        id = d3.select(this).attr("value")

        update_colors_for_legend(id)
        update_colors(id);
        update_pie(id)
        update_legend(id);
    });

d3.selectAll("#filter").on("change", function() {
        var value = this.value;
        var to_select = "." + value;
        d3.selectAll(".dot").attr("hidden", true);
        d3.selectAll(to_select).attr("hidden", null);
    });

var wsUrl = getWebServerURL();

// Set the dimensions of the canvas / graph
var margin = {top: 60, right: 20, bottom: 40, left: 60},
    width = 600 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

var tasks_colors = {}
var data_legend = []

var colors = ["orange", "green", "yellow", "red", "blue", "brown", "grey"]

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
    
// Adds the svg canvas
var svg = d3.select("#chart")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style('background', '#F0F0F5')
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

var legend = d3.select('#legend')
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", 50)
        .style('background', '#F0F0F5')
    .append("g")
        //.attr("transform", 
          //    "translate(" + margin.left + "," + margin.top + ")");

var qs = getQueryStrings();
var handle = qs["handle"];

var url =  wsUrl + "/registrations?handle=" + handle;
// Get the data
allData = []
d3.json(url, function(error, data) {
    data.forEach(function(d) {
        if (d.prize > 10000) {
            var i = data.indexOf(d);
            data.splice(i, 1)
        }
        d.date = parseDate(d.date);
        d.prize = +d.prize;
    });

    allData = data;

    update_colors_for_legend("type")
    update_legend("type")

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.prize; })]);

    // Add the scatterplot
    svg.selectAll("dot")
        .data(data)
      //.enter().append("circle")
        //.attr("r", 3.5)
        .enter().append("path")
            .attr("class", function(c) {
                classes = "dot"
                if (c.submitted == 1) {
                    classes += " submitted"
                } else {
                    classes += " notsubmitted"
                }
                return classes;
            })
            .attr("d", d3.svg.symbol()
                .type( function(d) { return "circle" })
                .size( function(d) { return "42" })
                )
            //.attr("cx", function(d) { return x(d.date); })
            //.attr("cy", function(d) { return y(d.prize); })
            .attr("transform", function(d) { return "translate(" + x(d.date) + "," + y(d.prize) + ")"; })
            .style('fill', function(d,i) {
                ///if (d.submitted == 0)
                   // return
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
        .attr("dy", 10)
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

    d3.selectAll('.dot').on("mouseover", function(d) {
        var circleUnderMouse = this;
        d3.selectAll('.dot').transition().style('opacity',function () {
            return (this === circleUnderMouse) ? 1.0 : 0.3;
        });
    });
    d3.selectAll('.dot').on("mouseout", function(d) {
        var circleUnderMouse = this;
        d3.selectAll('.dot').transition().style('opacity', 1)
    });

    var criteria = "type";
    var new_data = compute_data_for_pie(data, criteria);
    create_pie(new_data, criteria);
});


function compute_data_for_pie(data, criteria) {
    var new_data = d3.nest()
            .key(function(d) {
                if (criteria == "type")
                    return d.type;
                else if (criteria == "submission")
                    return d.submitted;
            })
            .rollup(function(d) {
                return d3.sum(d, function(g) {return 1})
            })
            .entries(data)
    return new_data
}

function create_pie(new_data, criteria) {
    var w = 400;
    var h = 400;
    var r = h/2;

    var total_no = d3.sum(new_data, function(d) {return d.values;});

    var vis = d3.select('#pie')
                    .append("svg:svg")
                    .data([new_data])
                    .attr("width", w)
                    .attr("height", h)
                    .append("svg:g")
                        .attr("transform", "translate(" + r + "," + r + ")");
    var pie = d3.layout.pie().value(function(d){return d.values;});

    // declare an arc generator function
    var arc = d3.svg.arc()
                .innerRadius(r - 100)
                .outerRadius(r - 20);

    // select paths, use arc generator to draw
    var arcs = vis.selectAll("g.slice")
                    .data(pie)
                    .enter()
                    .append("svg:g")
                        .attr("class", "slice");
    arcs.append("svg:path")
        .style("fill", function(d, i) {
            if (criteria == "type")
                return tasks_colors[d.data.key];
            if (criteria == "submission")
                return tasks_colors[d.data.key]
        })
        .attr("d", function (d) {
            // log the result of the arc generator to show how cool it is :)
            //console.log(arc(d));
            return arc(d);
        });

    // add the text
    arcs.append("svg:text").attr("transform", function(d){
                d.innerRadius = r - 100;
                d.outerRadius = r - 20;
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
}

function update_colors(id) {
    if (id == "submission") {
        d3.selectAll(".dot")
            .style("fill", function(d,i) {
                    if (d.submitted == 1)
                        return 'green'
                    return 'red'
                });
    }
    if (id == "type") {
        d3.selectAll(".dot")
            .style("fill", function(d,i) {
                    if (d.type in tasks_colors)
                        return tasks_colors[d.type];
                    return 'black'
                });
    }
}

function update_pie(criteria) {
    var new_data = compute_data_for_pie(allData, criteria);
    var myNode = document.getElementById("pie");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }

    create_pie(new_data, criteria)
}

function update_legend(criteria) {
    var myNode = document.getElementById("legend").firstChild.firstChild;
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }

    var elem = legend.selectAll("legendDot")
        .data(data_legend)

    var elemEnter = elem.enter()
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + 40 + ")")

    var circle = elemEnter.append("circle")
            .attr("r", 10)
            .attr("cx", function(d, i) { return i * 120; })
            .attr("cy", function(d) { return -17; })
            .style('fill', function(d,i) {
                return d.color;
            })

    elemEnter.append("text")
        //.attr("cx", function(d, i) { return i * 120; })
        //.attr("cy", function(d) { return -17; })
        //.attr("text-anchor", "middle")
        .attr("dx", function(d, i ) { return i * 120 - d.type.length * 2 - 5 })
        .attr("dy", 5)
        .text(function(d,i) {
            return d.type
        })
}

var data_legend_for_sub = [
    {type:"Submitted", color:"green"},
    {type:"Not Submitted", color:"red"}
]

var submission_colors = {
    "0": "red",
    "1": "green"
}

function update_colors_for_legend(criteria) {
    data_legend = []
    tasks_colors = {}
    if (criteria == "submission") {
        data_legend = data_legend_for_sub
        tasks_colors = submission_colors;
    } else {
        var i = 0;

        var nested_data = d3.nest()
                .key(function(d) {
                    return d.type;
                })
                .rollup(function(d) {
                    return d3.sum(d, function(g) {return 1})
                })
                .entries(allData)
        nested_data.sort(function(a,b) {return a.values < b.values})

        nested_data.forEach(function(elem) {
            data_legend.push({
                type: elem.key,
                color:colors[i]
            })

            tasks_colors[elem.key] = colors[i];

            i++;
        });
    }
}