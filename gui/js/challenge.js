var qs = getQueryStrings();
var challengeId = qs["challengeId"];

var element = document.getElementById("header");
//element.innerHTML += " for <b>" + handle + "</b>";

var wsUrl = getWebServerURL();
var url =  wsUrl + "/handles/info?challengeId=" + challengeId;

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

var regSubChart = dc.barChart("#dc-reg-sub-chart");
var ratingChart = dc.barChart("#dc-rating-chart");
var relRatingChart = dc.barChart("#dc-rel-rating-chart");
var dataTable = dc.dataTable("#dc-table-graph");

var ndx;

// load data from a csv file
d3.json(url, function (data) {
	
	data.sort(function(a, b) {
		return new Date(a.registrationDate) - new Date(b.registrationDate);
	})

	data.forEach(function(d, i, obj) { 
		if (d.regNo > 2000) {
			data.splice(i , 1);
		}
	});

	ndx = crossfilter(data);

	// for handles
	var handlesDim = ndx.dimension(function (d) {
		return d.handle;       // add the magnitude dimension
	});

	var regNoGroup = handlesDim.group().reduceSum(function (d) { return d.regNo; });	// sums
	var subNoGroup = handlesDim.group().reduceSum(function (d) { return d.subNo; });
	var ratingGroup = handlesDim.group().reduceSum(function (d) { return d.rating; });
	var relRatingGroup = handlesDim.group().reduceSum(function (d) { return d.relRating; });


	regSubChart.width(960)
		.height(300)
		.margins({top: 10, right: 10, bottom: 80, left: 40})
		.dimension(handlesDim)
		.group(regNoGroup, "Registrations")
		.stack(subNoGroup, "Submissions")
		.groupBars(true)
		.groupGap(6)
		.transitionDuration(500)
		//.centerBar(true)
		.x(d3.scale.ordinal().domain(data.map(function (d) {return d.handle})))
		.xUnits(dc.units.ordinal)
		.elasticY(true)
		.legend(dc.legend().x(800).y(10).itemHeight(13).gap(5))
		.yAxisLabel('Number of registrations/submissions')
		.xAxisLabel('Handles')

    ratingChart.width(480)
		.height(300)
		.margins({top: 10, right: 10, bottom: 80, left: 40})
		.dimension(handlesDim)
		.group(ratingGroup, "Rating")
		.transitionDuration(500)
		//.centerBar(true)
		.x(d3.scale.ordinal().domain(data.map(function (d) {return d.handle})))
		.xUnits(dc.units.ordinal)
		.elasticY(true)
		.legend(dc.legend().x(800).y(10).itemHeight(13).gap(5))
		.yAxisLabel('Rating')
		.xAxisLabel('Handles')

	relRatingChart.width(480)
		.height(300)
		.margins({top: 10, right: 10, bottom: 80, left: 40})
		.dimension(handlesDim)
		.group(relRatingGroup, " Reliability Rating")
		.transitionDuration(500)
		//.centerBar(true)
		.x(d3.scale.ordinal().domain(data.map(function (d) {return d.handle})))
		.xUnits(dc.units.ordinal)
		.elasticY(true)
		.legend(dc.legend().x(800).y(10).itemHeight(13).gap(5))
		.yAxisLabel('Reliability rating')
		.xAxisLabel('Handles')

	// Table of handles
	dataTable.width(960).height(800)
		.dimension(handlesDim)
		.group(function(d) { return ''})
		.showGroups(false)
		.size(ndx.size())
		.columns([
			function(d) { return '<a href=\"worker.html?handle=' + d.handle + '\">' + d.handle + '</a>'; },
			function(d) { return d.registrationDate; },
			//function(d) { return d.type; },
			function(d) { return d.submitted; },
			//function(d) { return d.prize; },
			])
		// /.sortBy(function(d){ return d.dtgDate; })
		//.order(d3.ascending)

	updatePagination();

    dc.renderAll();
})

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

$('#dc-table-graph').on('click', '.data-table-col', function() {
	var column = $(this).attr("data-col");

	dataTable.sortBy(function(d) {
		return d[column];
	});

	var order = dataTable.order()
	if (order == d3.ascending) {
		dataTable.order(d3.descending);
	} else {
		dataTable.order(d3.ascending);
	}

	dataTable.redraw();
});