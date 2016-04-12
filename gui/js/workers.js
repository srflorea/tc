/*get challengeId (from the parameters) to be loaded */
var qs = getQueryStrings();
var challengeId = qs["challengeId"];

var element = document.getElementById("header");
element.innerHTML += " for challenge with PID " + challengeId;

var wsUrl = getWebServerURL();

var tempColor;

var margin = { top: 30, right: 30, bottom: 100, left: 80 };

var height = 400 - margin.top - margin.bottom,
	width = 600 - margin.right - margin.left,
	barWidth = 50,
	barOffset = 5;

var tooltip = d3.select('body').append('div')
						.style('position', 'absolute')
						.style('padding', '0 10px')
						.style('background', 'white')
						.style('opacity', '0')
 
/*
var element = document.getElementById("header");
element.innerHTML += myParam;
*/
var yField = "y"
function yValue(value) {
	//return value.y
	return eval("value." + yField)
}

function xValue(value) {
	return value.handle
}

var hidden_div = $('#info_hidden');
d3.select("#button-info").selectAll("div").on("click", function() {
        var text = d3.select("#button_info").text();
        if (text == "Open Info") {
            hidden_div.show('slow')
            d3.select("#button_info").text('Hide Info')
        }
        else {
            hidden_div.hide('slow')
            d3.select("#button_info").text('Open Info')
        }
    });

d3.select("#button-handles").selectAll("div").on("click", function(d) {
	id = d3.select(this).attr("id")
	d3.select("#button-handles").selectAll("div").classed("active", false)
	d3.select("#" + id).classed("active", true)

	updateData(id)
});

updateData("rating");
d3.select("#rating").classed("active", true)

function updateData(id) {

	d3.select('svg').remove();
	bardata = [];
	xs = [];

	//fileName = 'data/30048038_handles_reliability_ratings.csv'
	url = wsUrl + "/handles/info";
	url += "?challengeId=" + challengeId;
	if (id == "rating") {
		yField = "y"
		url += "&type=1";
	} else if(id == "rel-rating") {
		yField = "y"
		url += "&type=2"
	} else if(id == "registrations") {
		yField = "y"
		//url += "&type=3";
		url = wsUrl + "/handlesNoOfReg?challengeId=" + challengeId;
	} else if(id == "submissions") {
		yField = "y"
		//url += "&type=4";
		url = wsUrl + "/handlesNoOfSub?challengeId=" + challengeId;
	}

	d3.json(url, function(data) {

		data.sort(function(a, b) {
			return new Date(a.registrationDate) - new Date(b.registrationDate);
		})

		data.forEach(function (d) { 
			d.y = +yValue(d);
			d.submitted = +d.submitted
		});

		data.forEach(function (d) {
			bardata.push(yValue(d))
			xs.push(xValue(d))
		});

		var colors = d3.scale.linear()
						.domain([0, bardata.length])
						.range(['#FFB832','#C61C6F'])

		var yScale = d3.scale.linear()
						.domain([0, d3.max(bardata)])
						.range([0, height]);

		var xScale = d3.scale.ordinal()
						.domain(d3.range(0, bardata.length))
						.rangeBands([0, width], 0.3);

		var myChart = d3.select('#chart').append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.style('background', '#F0F0F5')
			.append('g')
			.attr('transform', 'translate(' + margin.left + ', ' + margin.right + ')')
			.selectAll('rect').data(data)
			.enter().append('rect')
				.style('fill', function(d,i) {
					if (d.submitted) {
						return '#00FF00'
					}
					return '#FF0000'
				})
				.attr('width', xScale.rangeBand())
				.attr('x', function(d, i) {
					return xScale(i);
				})
				.attr('height', 0)
				.attr('y', height)
				.on('mouseover', function(d) {
					tooltip.transition()
						.style('opacity', .9)

					tooltip.html(xValue(d) + ": " + yValue(d))
						.style('left', (d3.event.pageX) + 'px')
						.style('top', (d3.event.pageY) + 'px')

					tempColor = this.style.fill;
					d3.select(this)
						.style('opacity', .5)
						.style('fill', 'yellow')
				})
				.on('mouseout', function(d) {
					d3.select(this)
						.style('opacity', 1)
						.style('fill', tempColor)

					tooltip.html("")
				})

		myChart.transition()
			.attr('height', function(d) {
				return yScale(yValue(d));
			})
			.attr('y', function(d) {
				return height - yScale(yValue(d));
			})
			.delay(function(d, i) {
				return i * 10;
			})
			.duration(1000)
			.ease('elastic')

		var vGuideScale = d3.scale.linear()
			.domain([0, d3.max(bardata)])
			.range([height, 0])

		var vAxis = d3.svg.axis()
						.scale(vGuideScale)
						.orient('left')
						.ticks(10)

		var vGuide = d3.select('svg').append('g')
		vAxis(vGuide)

		vGuide.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
		vGuide.selectAll('path')
			.style({fill: 'none', stroke: "#000"})
		vGuide.selectAll('line')
			.style({stroke: "#000"})

		var hAxis = d3.svg.axis()
						.scale(xScale)
						.orient('bottom')
						/*.tickValues(xScale.domain().filter(function(d, i) {
							return !(i % (bardata.length/5));
						}))*/
						.tickFormat(function (d, i) { return xs[d] })

		var hGuide = d3.select('svg').append('g')
		hAxis(hGuide)
		hGuide.attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')')
		hGuide.selectAll('path')
			.style({fill: 'none', stroke: "#000"})
		hGuide.selectAll('line')
			.style({stroke: "#000"})

		hGuide.selectAll('text')
			.attr('class', 'clickable')
			.style('text-anchor', 'end')
			.style('fill', function (d) {
				if (data[d].submitted)
					return 'green'
				return 'red'
			})
			.attr('transform', 'rotate(-50)')
			.on('click', function (d) {
				url = 'worker_scatterplot.html?handle=' + data[d].handle;
				window.open(url, '_self')
			})

		d3.select('svg').append('text')
			.attr("class", "title")
			.attr('text-anchor', 'middle')
			.attr("x", width / 2 + 20)
			.attr("y", height)
			.attr("dy", 115)
			.text('Workers\' handles')

		d3.select('svg').append('text')
			.attr("class", "title")
			.attr('transform', 'rotate(-90)')
			.attr('text-anchor', 'left')
			.attr("x", -height + 50)
			.attr("y", 20)
			.text(function() {
				if (id == "rating") 
					return "Rating"
				else if (id == "rel-rating")
					return 'Reliability rating'
				else if (id == "registrations")
					return "No of registrations"
				else if (id == "submissions")
					return "No of submissions"
			})
	});
}