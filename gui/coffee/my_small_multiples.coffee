
SmallMultiples = () ->
	# variables accessible to
	# the rest of the functions inside SmallMultiples
	width = 150
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
		    
			div.enter().append("div").attr("class", "chart")
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
				.on("click", showProject)

			lines = g.append("g")
			lines.append("text")
				.attr("class", "title")
				.attr("text-anchor", "middle")
				.attr("x", width / 2)
				.attr("y", height)
				.attr("dy", margin.bottom / 2)
				.text((c) -> "Project id " + c.projectId)

			lines.append("text")
				.attr("class", "info")
				.attr("text-anchor", "middle")
				.attr("x", width / 2)
				.attr("y", 0)
				.attr("dy", 20)
				.text((c) -> c.noOfTasks + " tasks")

			lines.append("text")
				.attr("class", "info")
				.attr("text-anchor", "middle")
				.attr("x", width / 2)
				.attr("y", 0)
				.attr("dy", 30)
				.text((c) -> c.tasksCompleted + " completed tasks")

			lines.append("text")
				.attr("class", "info")
				.attr("text-anchor", "middle")
				.attr("x", width / 2)
				.attr("y", 0)
				.attr("dy", 40)
				.text((c) -> c.tasksCancelled + " cancelled tasks")

			lines.append("text")
				.attr("class", "info")
				.attr("text-anchor", "middle")
				.attr("x", width / 2)
				.attr("y", 0)
				.attr("dy", 50)
				.text((c) -> c.daysDuration + " daysDuration")

			lines.append("text")
				.attr("class", "info")
				.attr("text-anchor", "middle")
				.attr("x", width / 2)
				.attr("y", 0)
				.attr("dy", 60)
				.text((c) -> c.avgAward + " average award")

			lines.append("text")
				.attr("class", "info")
				.attr("text-anchor", "middle")
				.attr("x", width / 2)
				.attr("y", 0)
				.attr("dy", 70)
				.text((c) -> c.avgSubmissions + " submissions in average")

	showProject = (d, i) ->
		url = 'project.html?projectId=' + d.projectId;
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
		# setupIsoytpe()

	# I've started using Bostock's queue to load data.
	# The tool allows you to easily add more input files
	# if you need to (for this example it might be overkill or
	# inefficient, but its good to know about).
	# https://github.com/mbostock/queue
	queue()
		.defer(d3.json, "http://tcws.herokuapp.com/projects")
		.await(display)