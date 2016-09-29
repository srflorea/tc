var wsUrl = getWebServerURL();
var handlesUrl =  wsUrl + "/handlesNames";

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

d3.json(handlesUrl, function (data) {
    console.log(data.length)
    var list = document.getElementById("projectSelectorDropdown"); 
    data.forEach(function(d, i, obj) {
        var opt = d;
        var text = document.createTextNode(opt);

        var option = document.createElement("option");
        option.appendChild(text);
        list.appendChild(option);
    });

    $("select").trigger("chosen:updated");
});

$(document).ready(function() {
    $('select').chosen( { width: '50%' } );
});

var registrationsTable;
$("#button-run").on('click', function (e) {
    worker = $(".chosen-select").val();
    if (worker == "") {
        return;
    }

    registrationsTable = dc.dataTable("#dc-reg-table");

    var wsUrl = getWebServerURL();
    var registrationsUrl =  wsUrl + "/registrations?handle=" + worker;

    var dateVal = $("#date-picker-1").val();
    if (dateVal != "") {
        registrationsUrl += "&date=" + dateVal;
    }

    d3.json(registrationsUrl, function (data) {
        var ndx = crossfilter(data);
        var dimension = ndx.dimension(function (d) { return [d.dtgDate, +d.prize]; })

        // Table of registrations
        registrationsTable.width(960).height(800)
            .dimension(dimension)
            .group(function (d) { return '<b>Project Id:</b> <a href=\"tasks.html?projectId=' + d.projectId +  '\">' + d.projectId + '</a>'})
            //.showGroups(false)
            .size(ndx.size())
            .columns([
                function (d) { return '<a href=\"challenge.html?challengeId=' + d.challengeId + '\">' + d.challengeName + '</a>'; },
                function (d) { return d.registrationStartDate; },
                function (d) { return d.submissionEndDate; },
                function (d) { return d.type; },
                function (d) { return d.submitted != 0; },
                function (d) { return d.prize; },
                ])
            .sortBy(function (d){ return d.dtgDate; })
            .order(d3.ascending)

        updatePagination();

        dc.renderAll();

        var tableTitle = document.getElementById("registrations-title");
        tableTitle.innerHTML = "Registrations for <a href=\"worker.html?handle=" + worker + '\">' + worker + '</a>';
        if (dateVal != "") {
            tableTitle.innerHTML += " on <b>" + dateVal + "</b>";
        }

        var registrations_table = $('#registrations-table');
        registrations_table.show('slow');
    });
});

var newChallengesTable;
$("#button-get-chal").on('click', function (e) {
    var dateVal = $("#date-picker-1").val();
    console.log(dateVal)
    if (dateVal == "") {
        return
    }

    newChallengesTable = dc.dataTable("#dc-new-challenges-table");

    var wsUrl = getWebServerURL();
    var registrationsUrl =  wsUrl + "/challenges?date=" + dateVal;

    d3.json(registrationsUrl, function (data) {
        var mdyFormat = d3.time.format("%m/%d/%Y");
        var ymdFormat = d3.time.format("%Y-%m-%d");

        var ndx = crossfilter(data);
        var dimension = ndx.dimension(function (d) { return [d.registrationStartDate, +d.prize]; })

        // Table of registrations
        newChallengesTable.width(960).height(800)
            .dimension(dimension)
            .group(function (d) { return '<b>Project Id:</b> <a href=\"tasks.html?projectId=' + d.projectId +  '\">' + d.projectId + '</a>'})
            //.showGroups(false)
            .size(ndx.size())
            .columns([
                function (d) { return '<a href=\"challenge.html?challengeId=' + d.challengeId + '\">' + d.challengeName + '</a>'; },
                function (d) { return d.registrationStartDate; },
                function (d) { return d.submissionEndDate; },
                function (d) { return d.challengeType; },
                function (d) { return d.submitted != 0; },
                function (d) { return d.prize; },
                ])
            .sortBy(function (d){ return d.dtgDate; })
            .order(d3.ascending)

        //updatePagination();

        dc.renderAll();

        var tableTitle = document.getElementById("new-challenges-title");
        tableTitle.innerHTML = "New challenges on <b>" + dateVal + "</b>";

        var new_challenges_table = $('#new-challenges-table');
        new_challenges_table.show('slow');
    });
});


var ofs = 0, pag = 5;
function updatePagination() {
    ofs = 0;
    updateDataTable()
}

function display() {
    var length = registrationsTable.dimension().top(Number.POSITIVE_INFINITY).length
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
    registrationsTable.beginSlice(ofs);
    registrationsTable.endSlice(ofs+pag);
    display();
}
function next() {
  ofs += pag;
  updateDataTable();
  registrationsTable.redraw();
}
function last() {
  ofs -= pag;
  updateDataTable();
  registrationsTable.redraw();
}