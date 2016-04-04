d3.select("#type").classed("active", true)
d3.select("#button-color-by").selectAll("div").on("click", function(d) {
    id = d3.select(this).attr("id")
    d3.select("#button-color-by").selectAll("div").classed("active", false)
    d3.select("#" + id).classed("active", true)

    updateColors(id)
});

var wsUrl = getWebServerURL();

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

var data_legend = [
    {type:"First2Finish", color:"orange"},
    {type:"UI Prototype Competition", color:"green"},
    {type:"Assembly Competition", color:"yellow"},
    {type:"Code", color:"red"},
    {type:"Design", color:"blue"}
]

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

    var elem = legend.selectAll("legendDot")
        .data(data_legend)
        
    var elemEnter = elem.enter()
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

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

    // Add the scatterplot
    svg.selectAll("dot")
        .data(data)
      //.enter().append("circle")
        //.attr("r", 3.5)
        .enter().append("path")
            .attr("class", "dot")
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

function updateColors(id) {
    if (id == "submission") {
        d3.selectAll(".dot")
            .style("fill", function(d,i) {
                    if (d.submitted == 1)
                        return 'green'
                    return 'black'
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