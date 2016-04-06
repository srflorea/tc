var tempColor, tempColorTick;

var totWidth = 1200,
    totHeight = 600,
    margin = {top: 80, right: 30, bottom: 80, left: 80},
    width = totWidth - (margin.left + margin.right),
    height = totHeight - (margin.top + margin.bottom);
    
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width]);
    
var y = d3.scale.ordinal()
    .rangeRoundBands([height, 0]);
  
var xAxis = d3.svg.axis()
  	.scale(x)
  	.orient("top");
 
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    
var chart = d3.select(".chart")
    .attr("width", totWidth)
    .attr("height", totHeight)
  .append("g")
    .attr("transform","translate("+margin.left+","+margin.top+")");
 
d3.tsv("data/igmat.tsv"/*, type*/, function(error, data) {
 
	var grpNames = d3.keys(data[0]).filter(function(key) { return key !== "Platform"; });
 
  data.forEach(function(d) {
    d.groups = grpNames.map(function(name) { return {name: name, value: +d[name]}; });
  });
	
  y.domain(data.map(function(d) { return d.Platform; }));
  var allcols = Object.keys(data[0]),
  	cols = allcols.slice(1,allcols.length);
  x.domain(grpNames);
      
  var xAxisG = chart.append("g")
      .attr("class","x axis")
      .attr("transform","translate(-20,0)")
      .call(xAxis)


  xAxisG.selectAll("text")
	      	.style("text-anchor","start")
	      	.attr("transform","rotate(-40)")
	      	.attr("dx","0.5em")
	      	.attr("dy",x.rangeBand()/2-10)
   ;	
 
  var yAxisG = chart.append("g")
      .attr("class","y axis")
      .call(yAxis)
   ;
    
  var grows = chart.selectAll(".grow")  		
  		.data(data)
  	.enter().append("g")
  		.attr("class","grow")
  		.attr("transform", function(d) { return "translate(0," + y(d.Platform) + ")"; })
  	;
  	
  var gcells = grows.selectAll(".gcell")
  		.data(function(d) { return d.groups; })
  	.enter() .append("g")
  		.attr("transform", function(d,i,j) {return "translate(" + i*x.rangeBand() + ",0)" ; } )
  		.attr("class","gcell")
  	;
	
	gcells
		.append("rect")
			.attr("x",0)
			.attr("y",0)
			.attr("height",y.rangeBand())
			.attr("width",x.rangeBand())
			.style("fill-opacity",1)
			.style("fill", function(d,i,j) {
					if ((i % 2 != 0 && j % 2 == 0))
						{return "#dddddd";}
					else if (i % 2 != 0 || j % 2 == 0) 
						{return "#eeeeee";} 
					else 
						{return "#ffffff";}
					}
				)
      .on('mouseover', function(d, iRect, jRect) {
        tempColor = this.style.fill;
        d3.select(this)
            .style('opacity', .5)
            .style('fill', 'red')

        yAxisG.selectAll(".tick")
          .each(function(d, i) {
            if (jRect == i) {
              tempColorTick = this.style.fill;
              d3.select(this)
                .selectAll('text')
                .style('fill', 'red')
            }
          })
          
          xAxisG.selectAll(".tick")
            .each(function(d, i) {
              if (iRect == i) {
                d3.select(this)
                .selectAll('text')
                .style('fill', 'red')
              }
            })
        })
      .on('mouseout', function(d, iRect, jRect) {
          d3.select(this)
            .style('opacity', 1)
            .style('fill', tempColor)

          yAxisG.selectAll(".tick")
            .each(function(d, i) {
              if (jRect == i) {
                d3.select(this)
                  .selectAll('text')
                  .style('fill', tempColorTick)
              }
            })

          xAxisG.selectAll(".tick")
            .each(function(d, i) {
              if (iRect == i) {
                d3.select(this)
                .selectAll('text')
                .style('fill', tempColorTick)
              }
            })
        })
      .on('click', function (d, i, j) {
        platform = data[j].Platform;
        technology = d.name;
        url = 'tasks.html?platform=' + platform;
        url += '&technology=' + technology;
        window.open(url, '_self')
      })
	;	
  
  rmax = Math.min(y.rangeBand()/2-4,x.rangeBand()/2-4)
	gcells.append("circle")
    	.attr("cy",y.rangeBand()/2)
    	.attr("cx",x.rangeBand()/2)
    	.attr("r", function(d) {
					var rind = d.value;
					return rmax / ((-1)*(rind - 5));
					}
				)
    	.style("fill", function(d) {
					var gbval = 1+Math.floor(255 - (255/4*(d.value-1)));
					return "rgb(" + 255 + "," + gbval + "," + gbval + ")";
					}
				)
    	.style("stroke","black")
      .style("pointer-events", "none")
			;
	
	var legend = chart
		.append("g")
			.attr("transform", "translate(250," + (height + 0) + ")")
			.attr("class","legend")
			.style("font-weight","bold")
		;
	var legwidths = [0,55,135,235];
  var legsymbols = legend.selectAll(".legsymbols")
      .data(["0-10","10-100","100-500",">500"])
    .enter()
    	.append("g")
    		.attr("class","legsymbols")
    		.attr("transform",function(d,i) {return "translate(" + (150 + legwidths[i]) + ",0)";})
    ;
    
  var legendspace = 5;
  
  legsymbols.append("circle")
      .attr("cx", function(d,i) {return rmax / ((-1)*((i+1) - 5)) + i*30 ;})
      .attr("cy", function(d,i) {return (legendspace+2*rmax) - (rmax / ((-1)*((i+1) - 5))) ;})
    	.style("fill", function(d,i) {
					var gbval = 1+Math.floor(255 - (255/4*((i+1)-1)));
					return "rgb(" + 255 + "," + gbval + "," + gbval + ")";
					}
				)
    	.style("stroke","black")
    	.attr("r", function(d,i) {
					return rmax / ((-1)*((i+1) - 5));
					}
				)
	;
	
	
  legsymbols.append("text")
      .attr("x", function(d,i) {return 5+2*rmax / ((-1)*((i+1) - 5)) + i*30 ;})
      .attr("y", legendspace + 2*rmax)
      .style("text-anchor", "start")
      .text(function(d) { return d; });
      
   legend
   		.append("text")
			.text("Number of tasks:")
			.attr("y", rmax*2+ legendspace)
		;
 
 }); 