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

    dateVal = $("#date-picker-3").val();

    handle = "isv";
    var wsUrl = getWebServerURL();
    var registrationsUrl =  wsUrl + "/registrations?handle=" + worker;

    var dataTable = dc.dataTable("#dc-reg-table");

    d3.json(registrationsUrl, function (data) {
        if (dateVal != "") {
            var mdyFormat = d3.time.format("%m-%d-%Y");
            date = mdyFormat.parse(dateVal)
            var ymdFormat = d3.time.format("%Y-%m-%d");
            data.forEach(function (d, i, obj) {
                if (ymdFormat.parse(d.date) > date) {
                    console.log(date)
                    data.splice(i , 1);
                }
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
                function (d) { return d.date; },
                function (d) { return d.type; },
                function (d) { return d.submitted; },
                function (d) { return d.prize; },
                ])
            .sortBy(function (d){ return d.dtgDate; })
            .order(d3.ascending)

        dc.renderAll();

        var hidden_table = $('#dc-reg-table');
        hidden_table.show('slow');
    })
});