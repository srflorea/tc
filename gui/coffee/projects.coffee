
SmallMultiples = () ->
	# variables accessible to
	# the rest of the functions inside SmallMultiples
	width = 160
	height = 120
	margin = {top: 15, right: 10, bottom: 40, left: 35}
	data = []

	# ...
	chart = (selection) ->
		selection.each (rawData) ->
			# Set local variable for input data.
			# Transformation of this data has already
			# been done by the time it reaches chart.
			data = rawData

			# Create a div and an SVG element for each element in
			# our data array. Note that data is a nested array
			# with each element containing another array of 'values'
			div = d3.select(this).selectAll(".chart").data(data)
		    
			div.enter().append("div")
				.attr("class", ((c) ->
						classes = "chart"
						for tech in c.techsList
							classes = classes + " " + tech.toLowerCase()

						for type in c.chalTypesList
							classes = classes + " " + type.toLowerCase()

						if c.daysDuration <= 10
							classes = classes + " " + "ten"
						else if c.daysDuration <= 30
							classes = classes + " " + "thirty"
						else if c.daysDuration <= 100
							classes = classes + " " + "hundred"
						else
							classes = classes + " " + "more"

						if c.avgRegistrants <= 5
							classes = classes + " " + "fivereg"
						else if c.daysDuration <= 20
							classes = classes + " " + "twentyreg"
						else if c.daysDuration <= 50
							classes = classes + " " + "fiftyreg"
						else if c.daysDuration <= 100
							classes = classes + " " + "hundredreg"
						else
							classes = classes + " " + "morereg"

						if c.avgSubmissions == 1
							classes = classes + " " + "onesub"
						if c.avgSubmissions == 2
							classes = classes + " " + "twosub"
						else if c.avgSubmissions <= 5
							classes = classes + " " + "fivesub"
						else if c.avgSubmissions <= 10
							classes = classes + " " + "tensub"
						else
							classes = classes + " " + "moresub"

						classes
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
				.attr("width", width )
				.attr("height", height)
				.on("click", showProject)

			rects = g.append("g")
			rects.append("rect")
				.style("pointer-events", "none")
				.attr("class", "area-unf")
				.attr("width", ((c) ->
					c.tasksCancelled * width / c.noOfTasks))
				.attr("height", height)

			info = g.append("g")
			info.append("text")
				.attr("class", "title")
				.attr("text-anchor", "middle")
				.attr("x", width / 2)
				.attr("y", height)
				.attr("dy", margin.bottom / 2)
				.text((c) -> "Project id " + c.projectId)

			info.append("text")
				.attr("class", "info")
				.style("pointer-events", "none")
				.attr("text-anchor", "middle")
				.attr("x", width / 2)
				.attr("y", 0)
				.attr("dy", 20)
				.text((c) -> c.noOfTasks + " tasks")

			info.append("text")
				.attr("class", "info")
				.style("pointer-events", "none")
				.attr("text-anchor", "middle")
				.attr("x", width / 2)
				.attr("y", 0)
				.attr("dy", 30)
				.text((c) -> c.tasksCompleted + " completed tasks")

			info.append("text")
				.attr("class", "info")
				.style("pointer-events", "none")
				.attr("text-anchor", "middle")
				.attr("x", width / 2)
				.attr("y", 0)
				.attr("dy", 40)
				.text((c) -> c.tasksCancelled + " cancelled tasks")

			info.append("text")
				.attr("class", "info")
				.style("pointer-events", "none")
				.attr("text-anchor", "middle")
				.attr("x", width / 2)
				.attr("y", 0)
				.attr("dy", 50)
				.text((c) -> c.daysDuration + " daysDuration")

			info.append("text")
				.attr("class", "info")
				.style("pointer-events", "none")
				.attr("text-anchor", "middle")
				.attr("x", width / 2)
				.attr("y", 0)
				.attr("dy", 60)
				.text((c) -> c.avgAward + " average award")

			info.append("text")
				.attr("class", "info")
				.style("pointer-events", "none")
				.attr("text-anchor", "middle")
				.attr("x", width / 2)
				.attr("y", 0)
				.attr("dy", 70)
				.text((c) -> c.avgSubmissions + " submissions in average")

	showProject = (d, i) ->
		url = 'tasks.html?projectId=' + d.projectId;
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
	rawData.forEach (d) ->
		d.noOfTasks = +d.noOfTasks
		d.avgAward = Math.round(d.avgAward * 10) / 10
		d.avgSubmissions = Math.round(d.avgSubmissions)
	rawData

setupIsoytpe = () ->
	$("#vis").isotope({
		itemSelector: '.chart',
		layoutMode: 'fitRows'
	})

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
		.defer(d3.json, "http://tcws.herokuapp.com/projects")
		.await(display)

	d3.select("#tech").selectAll("a").on "click", () ->
		id = d3.select(this).attr("id")

		filter_value = $(this).attr('data-filter');
		$("#vis").isotope({filter:filter_value})

	d3.select("#type").selectAll("a").on "click", () ->
		id = d3.select(this).attr("id")

		filter_value = $(this).attr('data-filter');
		$("#vis").isotope({filter:filter_value})

	d3.select("#duration").selectAll("a").on "click", () ->
		id = d3.select(this).attr("id")

		filter_value = $(this).attr('data-filter');
		$("#vis").isotope({filter:filter_value})

	d3.select("#registrants").selectAll("a").on "click", () ->
		id = d3.select(this).attr("id")

		filter_value = $(this).attr('data-filter');
		$("#vis").isotope({filter:filter_value})

	d3.select("#submissions").selectAll("a").on "click", () ->
		id = d3.select(this).attr("id")

		filter_value = $(this).attr('data-filter');
		$("#vis").isotope({filter:filter_value})

	hidden_div = $('#info_hidden');
	d3.select("#button-info").selectAll("div").on "click", () ->
		text = d3.select("#button_info").text();
		if text == "Open Info"
			hidden_div.show('slow')
			d3.select("#button_info").text('Hide Info')
		else
			hidden_div.hide('slow')
			d3.select("#button_info").text('Open Info')