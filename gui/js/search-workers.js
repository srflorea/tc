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

$("#button-run").on('click', function (e) {
    worker = $(".chosen-select").val();
    if (worker == "") {
        return;
    }

    handle = "isv";
    var wsUrl = getWebServerURL();
    var registrationsUrl =  wsUrl + "/registrations?handle=" + worker;

    var dataTable = dc.dataTable("#dc-reg-table");

    d3.json(registrationsUrl, function (data) {
        var mdyFormat = d3.time.format("%m/%d/%Y");
        var ymdFormat = d3.time.format("%Y-%m-%d");

        var dateVal = $("#date-picker-3").val();
        if (dateVal != "") {
            var date = new Date(mdyFormat.parse(dateVal))

            data = data.filter(function (d) {
                var registrationStartDate = new Date(ymdFormat.parse(d.registrationStartDate));
                var submissionEndDate = new Date(ymdFormat.parse(d.submissionEndDate));

                return registrationStartDate <= date && date <= submissionEndDate;
            })
        }

        ndx = crossfilter(data);
        dimension = ndx.dimension(function (d) { return [d.dtgDate, +d.prize]; })

        // Table of registrations
        dataTable.width(960).height(800)
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

        dc.renderAll();

        var hidden_table = $('#dc-reg-table');
        hidden_table.show('slow');
    })
});