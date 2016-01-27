
plotData = (data) ->

	margin = { top: 30, right: 30, bottom: 40, left: 50 };

	height = 400 - margin.top - margin.bottom
	width = 600 - margin.right - margin.left
	barWidth = 50
	barOffset = 5

	xValue = (d) -> d.handle
	yValue = (d) -> d.reliability_rating

	colors = d3.scale.linear()
				.domain([0, data.length])
				.range(['#FFB832','#C61C6F'])

	#xScale = d3.time.scale().range([0,width])
	xScale = d3.scale.ordinal()
					.domain(d3.range(0, data.length))
					.rangeBands([0, width], 0.3);
	#xScale = d3.scale.ordinal().rangeRoundBands([0, width], 0.1)
	yScale = d3.scale.linear().range([height,0])

	yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left").ticks(4)
		.outerTickSize(0)
		.tickSubdivide(1)
		.tickSize(-width)

	setupScales = (data) ->
		maxY = d3.max(data, (d) -> yValue(d))
		maxY = maxY + (maxY * 1/4)
		yScale.domain([0,maxY])
		extentX = d3.extent(data, (d) -> xValue(d))
		xScale.domain(extentX)

	chart = (data) ->

		setupScales(data)

		d3.select('#chart')
			.append("svg")
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.style("background", "#C9D7D6")
			.append("g")
			.selectAll("rect").data(data)
			.enter().append("rect")
				.style("fill", (d, i) -> colors(i))
				.attr("x", (d) -> xScale(xValue(d)))
				.attr("y", (d) -> (height - yScale(yValue(d))))
				.attr("width", xScale.rangeBand())
				.attr("height", (d) ->  yScale(yValue(d)))


	chart(data)

$ ->

	# ---
	# This function is called when
	# the data has been successfully loaded
	# and we can start visualizing!!
	# ---
	display = (error, rawData) ->    
		if error
			console.log(error)

		#data = transformData(rawData)
		plotData(rawData)

	# I've started using Bostock's queue to load data.
	# The tool allows you to easily add more input files
	# if you need to (for this example it might be overkill or
	# inefficient, but its good to know about).
	# https://github.com/mbostock/queue
	queue()
		.defer(d3.csv, "data/30048038_handles_ratings.csv")
		.await(display)