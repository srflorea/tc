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

function getWebServerURL() {
  return "http://tcws.herokuapp.com";
}

function AddXAxis(chartToUpdate, displayText) {
  chartToUpdate.svg()
    .append("text")
    .attr("class", "x-axis-label")
    .attr("text-anchor", "middle")
    .attr("x", chartToUpdate.width()/2)
    .attr("y", chartToUpdate.height()-3.5)
    .text(displayText);
}