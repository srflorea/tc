var qs = getQueryStrings();
var challengeId = qs["challengeId"];

var wsUrl = getWebServerURL();
var handlesInfoUrl =  wsUrl + "/handles/info?challengeId=" + challengeId;
var challengeInfoUrl = wsUrl + "/challenges?challengeId=" + challengeId;

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


// load challenge info from the web server
d3.json(challengeInfoUrl, function (data) {
	var info = data[0];

	var element = document.getElementById("challenge-name");
	element.innerHTML += "<b>" + info.challengeName + "</b>";

	element = document.getElementById("challenge-type");
	element.innerHTML += "<b>" + info.challengeType + "</b>";

	element = document.getElementById("challenge-prize");
	element.innerHTML += "<b>$" + info.prize + "</b>";

	element = document.getElementById("challenge-status");
	element.innerHTML += "<b>" + info.status + "</b>";

	element = document.getElementById("challenge-tech");
	element.innerHTML += "<b>" + info.technologies + "</b>";

	element = document.getElementById("challenge-plat");
	element.innerHTML += "<b>" + info.platforms + "</b>";
});

var ndx;

// load handles info from a the web server
d3.json(handlesInfoUrl, function (data) {
	
	data.sort(function(a, b) {
		return new Date(a.registrationDate) - new Date(b.registrationDate);
	})

	data.forEach(function(d, i, obj) { 
		if (d.regNo > 2000) {
			data.splice(i , 1);
		}

		if (d.submitted) {
			var element = document.getElementById("challenge-sub");
			if (element.innerHTML != "") {
				element.innerHTML += ', '
			}
			element.innerHTML += '<a href=\"worker.html?handle=' + d.handle + '\">' + d.handle + '</a>';
		}
	});

	ndx = crossfilter(data);

	// for handles
	var handlesDim = ndx.dimension(function (d) {
		return d.handle;
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
			function(d) { return d.submitted; },
			])

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