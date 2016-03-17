
getQueryStrings = () -> 
	assoc  = {};
	decode = (s) -> decodeURIComponent(s.replace(/\+/g, " "))
	queryString = location.search.substring(1); 
	keyValues = queryString.split('&'); 

	for i in keyValues 
		key = i.split '='
		if key.length > 1
		  assoc[decode(key[0])] = decode(key[1])

	assoc

element = document.getElementById("header");

qs = getQueryStrings();
projectId = qs["projectId"];
platform = qs["platform"]
technology = qs["technology"]

wsUrl = "http://tcws.herokuapp.com/";
if projectId
	wsUrl += "projectChallenges?projectId="
	wsUrl += projectId;
	element.innerHTML += " for project with PID " + projectId;
else
	wsUrl += "matrixChallenges?platform=" + platform;
	wsUrl += "&technology=" + technology;
	element.innerHTML += " for platform <b>" + platform + "</b> and technology <b>" + technology + "</b>";

SmallMultiples = () ->
	# variables accessible to
	# the rest of the functions inside SmallMultiples
	width = 150
	height = 120
	margin = {top: 15, right: 10, bottom: 40, left: 35}
	data = []

	# These accessor functions are defined to
	# indicate the data attributes used for the
	# x and y values. This makes it easier to
	# swap in your own data!
	xValue = (d) -> d.day
	yValue = (d) -> d.noOfRegistrations

	# back at the top of the function...
	xScale = d3.time.scale().range([0,width])
	yScale = d3.scale.linear().range([height,0])

	yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left").ticks(4)
		.outerTickSize(0)
		.tickSubdivide(1)
		.tickSize(-width)


	area = d3.svg.area()
		.x((d) -> xScale(xValue(d)))
		.y0(height)
		.y1((d) -> yScale(yValue(d)))

	line = d3.svg.line()
		.x((d) -> xScale(xValue(d)))
		.y((d) -> yScale(yValue(d)))

	# ---
	# Sets the domain for our x and y scales.
	# We want all the small multiples to have the
	# same domains, so we only have to do this once.
	# ---
	setupScales = (data) ->
		maxY = d3.max(data, (c) -> d3.max(c.values, (d) -> yValue(d)))
		maxY = maxY + (maxY * 1/4)
		yScale.domain([0,maxY])
		#extentX = d3.extent(data[0].values, (d) -> xValue(d))
		#xScale.domain(extentX)

	# trying to change the scale while loading another small multiple
	changeXScale = (data) ->
		extentX = d3.extent(data, (d) -> xValue(d))
		xScale.domain(extentX)


	# ...
	chart = (selection) ->
		selection.each (rawData) ->
			# Set local variable for input data.
			# Transformation of this data has already
			# been done by the time it reaches chart.
			data = rawData

			setupScales(data)

			# Create a div and an SVG element for each element in
			# our data array. Note that data is a nested array
			# with each element containing another array of 'values'
			div = d3.select(this).selectAll(".chart").data(data)
		    
			div.enter().append("div")
				.attr("class", ((c) -> "chart" + " " +
					if c.values[0].status == "Completed"
						"completed"
					else
						"uncompleted"
					))
				.append("svg").append("g")
				
			svg = div.select("svg")
				.attr("width", width + margin.left + margin.right )
				.attr("height", height + margin.top + margin.bottom )
			
			g = svg.select("g")
				.attr("transform", "translate(#{margin.left},#{margin.top})")
		    	
			# Invisible background rectangle that will
			# capture all our mouse movements
			g.append("rect")
				.attr("class", "mouse_preview")
				.style("pointer-events", "all")
				.attr("width", width + margin.right )
				.attr("height", height)
				.on("click", showWorkers)

			lines = g.append("g")
			lines.append("path")
				.attr("class", ((c) ->
					if c.values[0].status != "Completed"
						"area-unf"
					else
						"area"))
				.style("pointer-events", "none")
				.attr("d", (c) -> 
					changeXScale(c.values)
					#console.log(c.values)
					area(c.values))

			lines.append("path")
				.attr("class", "line")
				.style("pointer-events", "none")
				.attr("d", (c) -> 
					changeXScale(c.values)
					line(c.values))


			lines = g.append("g")
			lines.append("text")
				.attr("class", "title")
				.attr("text-anchor", "middle")
				.attr("x", width / 2)
				.attr("y", height)
				.attr("dy", margin.bottom / 2 + 5)
				.text((c) -> c.values[0].challengeName.substring(0,25))

			lines.append("text")
				.attr("class", "static_year")
				.attr("text-anchor", "start")
				.style("pointer-events", "none")
				.attr("dy", 13)
				.attr("y", height)
				.attr("x", 0)
				.text((c) -> ((c.values[0].registrationStart.getUTCMonth() + 1) + "/" + c.values[0].registrationStart.getUTCDate()))

			lines.append("text")
				.attr("class", "static_year")
				.attr("text-anchor", "end")
				.style("pointer-events", "none")
				.attr("dy", 13)
				.attr("y", height)
				.attr("x", width + 11)
				.text((c) -> ((c.values[0].registrationEnd.getUTCMonth() + 1) + "/" + c.values[0].registrationEnd.getUTCDate()))



			# Add axis last so the tick lines
			# show over the paths (Upshot style).
			g.append("g")
				.attr("class", "y axis")
				.call(yAxis)

	showWorkers = (d, i) ->
		challengeId = d.values[0].challengeId
		url = 'workers.html?challengeId=' + challengeId;
		window.open url, '_self'

	return chart

plotData = (selector, data, plot) ->
	d3.select(selector)
	.datum(data)
	.call(plot)

# ---
# Convert the raw input data into the format
# that our visualization expects.
# ---
transformData = (rawData) ->
	format = d3.time.format("%Y-%m-%d")
	rawData.forEach (d) ->
		d.prize = +d.prize
		d.noOfRegistrations = +d.noOfRegistrations
		d.registrationDate = format.parse(d.registrationDate)
		d.registrationStart = format.parse(d.registrationStart)
		d.registrationEnd = format.parse(d.registrationEnd)
	nest = d3.nest()
		.key((d) -> d.challengeName)
		.sortValues((a,b) -> d3.ascending(a.registrationDate, b.registrationDate))
		.entries(rawData)

	nest.forEach (d) ->
		d.values = makeValues(d.values)

	nest

makeValues = (values) ->
	newValues = []
	start = values[0].registrationStart;

	noOfRegistrations = 0
	for day in [0..values[0].daysLength]
		date = new Date(start)
		date.setDate(date.getDate() + day)
		for oldValue in values
			if oldValue.registrationDate.getTime() == date.getTime()
				noOfRegistrations += oldValue.noOfRegistrations
		newValues.push { 
			challengeName: values[0].challengeName,
			challengeId: values[0].challengeId,
			registrationStart: values[0].registrationStart,
			registrationEnd: values[0].registrationEnd,
			day: day + 1,
			registrationDate: new Date(date),
			noOfRegistrations: noOfRegistrations,
			status: values[0].status,
			prize: values[0].prize
		}

	newValues

setupIsoytpe = () ->
	$("#vis").isotope({
		itemSelector: '.chart',
		layoutMode: 'fitRows',
		getSortData: {
			prize: (e) ->
				d = d3.select(e).datum()
				-1 * d.values[0].prize
			name: (e) ->
				d = d3.select(e).datum()
				d.key
		}
	})

# filter functions
###filterFns = {
	# show if number is greater than 50
	completed: () ->
		d = d3.select(e).datum()
		if d.values[0].status == "Completed"
			true
		false
	completed: (e) ->
		d = d3.select(e).datum()
		if d.values[0].status != "Completed"
			true
		false
};###

$ ->

	plot = SmallMultiples()

	# ---
	# This function is called when
	# the data has been successfully loaded
	# and we can start visualizing!!
	# ---
	display = (error, rawData) ->
		if error
			console.log(error)

		data = transformData(rawData)
		plotData("#vis", data, plot)
		setupIsoytpe()

	# I've started using Bostock's queue to load data.
	# The tool allows you to easily add more input files
	# if you need to (for this example it might be overkill or
	# inefficient, but its good to know about).
	# https://github.com/mbostock/queue
	queue()
		.defer(d3.json, wsUrl)
		#.defer(d3.csv, "data/7377_reg_in_time_all.csv")
		.await(display)

	d3.select("#button-wrap-sort").selectAll("div").on "click", () ->
		id = d3.select(this).attr("id")
		d3.select("#button-wrap-sort").selectAll("div").classed("active", false)
		d3.select("##{id}").classed("active", true)
		$("#vis").isotope({sortBy:id})

	d3.select("#button-wrap-filter").selectAll("div").on "click", () ->
		id = d3.select(this).attr("id")
		d3.select("#button-wrap-filter").selectAll("div").classed("active", false)
		d3.select("##{id}").classed("active", true)

		filter_value = $(this).attr('data-filter');
		$("#vis").isotope({filter:filter_value})