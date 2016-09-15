var qs = getQueryStrings();
var handle = qs["handle"];

var element = document.getElementById("header");
//element.innerHTML += " for <b>" + handle + "</b>";

var wsUrl = getWebServerURL();
var registrationsUrl =  wsUrl + "/registrations?handle=" + handle;
var handleInfoUrl = wsUrl + "/handles?handle=" + handle;

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

var registrationsChart = dc.scatterPlot("#dc-registrations-chart");
var statusChart = dc.pieChart("#dc-status-chart");
var challengeTypeChart = dc.rowChart("#dc-challengeType-chart");
var prizeChart = dc.barChart("#dc-prize-chart");
var dataTable = dc.dataTable("#dc-table-graph");

// load challenge info from the web server
d3.json(handleInfoUrl, function (data) {
	var info = data[0];

	var element = document.getElementById("handle");
	element.innerHTML += "<b>" + info.handle + "</b>";

	element = document.getElementById("country");
	element.innerHTML += "<b>" + info.country + "</b>";

	element = document.getElementById("quote");
	element.innerHTML += "<b>" + info.quote + "</b>";

	element = document.getElementById("earning");
	element.innerHTML += "<b>" + info.overallEarning + "</b>";

	element = document.getElementById("rel-rating");
	element.innerHTML += "<b>" + info.reliabilityRating + "</b>";
});

var ndx;

// load data from a csv file
d3.json(registrationsUrl, function (data) {

	var dtgFormat = d3.time.format("%Y-%m-%d");

	data.forEach(function(d, i, obj) {		
		d.dtgDate = dtgFormat.parse(d.date);

		if (d.prize > 10000) {
			data.splice(i , 1);
		}
	});

	// Run the data through crossfilter and load our 'facts'
	ndx = crossfilter(data);
	var all = ndx.groupAll();

	var scatterDimension	= ndx.dimension(function (d) { return [d.dtgDate, +d.prize]; }),
		scatterGroup		= scatterDimension.group();

	// Status Pie Chart
	var status 		= ndx.dimension(function (d) { return d.submitted; }),
 		statusGroup = status.group();

	  // Challenge Type Row Chart
	var challengeType 		= ndx.dimension(function (d) { return d.type; }),
		challengeTypeGroup 	= challengeType.group();

	var prize 		= ndx.dimension(function (d) { return d.prize; }),
		prizeGroup 	= prize.group().reduceCount(function(d) { return d.prize; }) // counts ();

	// count all the ndx
	dc.dataCount(".dc-data-count")
		.dimension(ndx)
		.group(all);


	registrationsChart
		.width(960)
		.height(300)
		.dimension(scatterDimension)
		.group(scatterGroup)
		.x(d3.time.scale().domain(d3.extent(data, function(d) { return d.dtgDate; })))
		.brushOn(true)
		.symbolSize(8)
		.clipPadding(10)
		.excludedOpacity(0.5)
		.excludedSize(4)
		.yAxisLabel("Task's prize")
		.xAxisLabel("Time")
		.on("filtered", function (chart, filter) {
			updatePagination()
		});

	// prize bar chart
	prizeChart.width(300)
		.height(220)
		.margins({top: 10, right: 10, bottom: 20, left: 40})
		.dimension(prize)
		.group(prizeGroup)
		.on("filtered", function (chart, filter) {
			updatePagination()
		})
		.transitionDuration(500)
		.centerBar(true)	
		.x(d3.scale.linear().domain(
			[
				d3.min(prizeGroup.all(), function (d) {
                    return d.key;
                }),
                d3.max(prizeGroup.all(), function (d) {
                    return d.key;
                })
			]
			))
		.elasticY(true)
		.xUnits(function(){return 15;})
		.gap(8)
		.xAxis().ticks(8)

	// status pie chart
  	statusChart.width(250)
	    .height(220)
	    .radius(100)
	    .innerRadius(30)
	    .dimension(status)
	    .label(function(d) { 
	    	if (d.key == 1) 
	    		return "Submitted"; 
	    	return "Not Submitted";
	    })
	    .title(function(d) {
	    	var str = ""; 
	    	if (d.key == 1) 
	    		str += "Submitted: "; 
	    	else str += "Not Submitted: ";
	    	return str += d.value + " challenge(s)"
	    })
	    .group(statusGroup)
	    .on("filtered", function (chart, filter) {
			updatePagination()
		});

	// row chart challenge type
	challengeTypeChart.width(300)
		.height(220)
		.margins({top: 5, left: 10, right: 10, bottom: 20})
		.dimension(challengeType)
		.group(challengeTypeGroup)
		.on("filtered", function (chart, filter) {
			updatePagination()
		})
		.colors(d3.scale.category10())
		.label(function (d){
		   return d.key;
		})
		.title(function(d){return d.key + ": " + d.value + " challenge(s)";})
		.elasticX(true)
		.xAxis().ticks(4);

	// Table of registrations
	dataTable.width(960).height(800)
		.dimension(scatterDimension)
		.group(function(d) { return '<b>Project Id:</b> <a href=\"tasks.html?projectId=' + d.projectId +  '\">' + d.projectId + '</a>'})
		//.showGroups(false)
		.size(ndx.size())
		.columns([
			function(d) { return '<a href=\"challenge.html?challengeId=' + d.challengeId + '\">' + d.challengeName + '</a>'; },
			function(d) { return d.date; },
			function(d) { return d.type; },
			function(d) { return d.submitted; },
			function(d) { return d.prize; },
			])
		.sortBy(function(d){ return d.dtgDate; })
		.order(d3.ascending)

	updatePagination()

	dc.renderAll();
});

var ofs = 0, pag = 10;
function updatePagination() {
	ofs = 0;
	updateDataTable()
}

function display() {
	var length = dataTable.dimension().top(Number.POSITIVE_INFINITY).length
	console.log(length)
  d3.select('#begin')
      .text(ofs);
  d3.select('#end')
      .text(ofs + pag - 1 > length ? length : ofs + pag - 1);
  d3.select('#last')
      .attr('disabled', ofs - pag < 0 ? 'true' : null);
  d3.select('#next')
      .attr('disabled', ofs + pag >= length ? 'true' : null);
  d3.select('#size').text(length);
}
function updateDataTable() {
	dataTable.beginSlice(ofs);
	dataTable.endSlice(ofs+pag);
	display();
}
function next() {
  ofs += pag;
  updateDataTable();
  dataTable.redraw();
}
function last() {
  ofs -= pag;
  updateDataTable();
  dataTable.redraw();
}