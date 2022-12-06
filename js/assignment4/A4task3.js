

// set the dimensions and margins of the graph
var margin = { top: 120, right: 30, bottom: 50, left: 110 },
  width = 500 - margin.left - margin.right,
  height = 420 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svgA4T3 = d3.select("#A4task3")
  .append("svg")
  .attr('id', 'SVG_ID_A4T3')
  .attr("viewBox", `0 0 800 600`)
  // .attr("width", width + margin.left + margin.right)
  // .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

//read data
d3.csv("../../data/temp_data/pivot_data_year_2021.csv", function (data) {

  // Get the different categories and count them
  console.log(data)
  var categories = ["January","February","March","April","May","June","July","August","September","October","November","December"]
  var n = categories.length

  // Compute the mean of each group
  allMeans = []
  for (i in categories) {
    currentGroup = categories[i]
    mean = d3.mean(data, function (d) { return +d[currentGroup] })
    allMeans.push(mean)
  }

  // Create a color scale using these means.
  var myColor = d3.scaleSequential()
    .domain([-15, 40])
    .interpolator(d3.interpolateViridis);

  // Add X axis
  var x = d3.scaleLinear()
    .domain([-15, 40])
    .range([0, width]);
  svgA4T3.append("g")
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickValues([ 0, 10 , 20, 30]).tickSize(-height))
    .select(".domain").remove()

  // Add X axis label:
  svgA4T3.append("text")
    .attr("text-anchor", "end")
    .attr("x", width - (width / 2))
    .attr("y", height + 40)
    .text("Temperature Distribution");

  // Create a Y scale for densities
  var y = d3.scaleLinear()
    .domain([0, 0.25])
    .range([height, 0]);

  // Create the Y axis for names
  var yName = d3.scaleBand()
    .domain(categories)
    .range([0, height])
    .paddingInner(1)
  svgA4T3.append("g")
    .call(d3.axisLeft(yName).tickSize(0))
    .select(".domain").remove()

  // Compute kernel density estimation for each column:
  var kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40)) // increase this 40 for more accurate density.
  var allDensity = []
  for (i = 0; i < n; i++) {
    key = categories[i]
    density = kde(data.map(function (d) { return d[key]; }))
    allDensity.push({ key: key, density: density })
  }

  // Add areas
  svgA4T3.selectAll("areas")
    .data(allDensity)
    .enter()
    .append("path")
    .attr("transform", function (d) { return ("translate(0," + (yName(d.key) - height) + ")") })
    .attr("fill", function (d) {
      grp = d.key;
      index = categories.indexOf(grp)
      value = allMeans[index]
      return myColor(value)
    })
    .datum(function (d) { return (d.density) })
    .attr("opacity", 0.7)
    .attr("stroke", "#000")
    .attr("stroke-width", 0.1)
    .attr("d", d3.line()
      .curve(d3.curveBasis)
      .x(function (d) { return x(d[0]); })
      .y(function (d) { return y(d[1]); })
    )

});

d3.select("#yearsA4T3").on("change", function () {
  let selectedYear = this.value
  var margin = { top: 120, right: 30, bottom: 50, left: 110 },
  width = 500 - margin.left - margin.right,
  height = 420 - margin.top - margin.bottom;

  d3.select("#SVG_ID_A4T3").remove();

  var svgA4T3 = d3.select("#A4task3")
  .append("svg")
  .attr('id', 'SVG_ID_A4T3')
  .attr("viewBox", `0 0 800 600`)
  // .attr("width", width + margin.left + margin.right)
  // .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

    d3.csv(`../../data/temp_data/pivot_data_year_${selectedYear}.csv`, function (data) {

  // Get the different categories and count them
  var categories = ["January","February","March","April","May","June","July","August","September","October","November","December"]
  var n = categories.length

  // Compute the mean of each group
  allMeans = []
  for (i in categories) {
    currentGroup = categories[i]
    mean = d3.mean(data, function (d) { return +d[currentGroup] })
    allMeans.push(mean)
  }

  // Create a color scale using these means.
  var myColor = d3.scaleSequential()
    .domain([-15, 40])
    .interpolator(d3.interpolateViridis);

  // Add X axis
  var x = d3.scaleLinear()
    .domain([-15, 40])
    .range([0, width]);
  svgA4T3.append("g")
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickValues([0, 10, 20, 30]).tickSize(-height))
    .select(".domain").remove()

  // Add X axis label:
  svgA4T3.append("text")
    .attr("text-anchor", "end")
    .attr("x", width - (width / 2))
    .attr("y", height + 40)
    .text("Temperature Distribution");

  // Create a Y scale for densities
  var y = d3.scaleLinear()
    .domain([0, 0.25])
    .range([height, 0]);

  // Create the Y axis for names
  var yName = d3.scaleBand()
    .domain(categories)
    .range([0, height])
    .paddingInner(1)
  svgA4T3.append("g")
    .call(d3.axisLeft(yName).tickSize(0))
    .select(".domain").remove()

  // Compute kernel density estimation for each column:
  var kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40)) // increase this 40 for more accurate density.
  var allDensity = []
  for (i = 0; i < n; i++) {
    key = categories[i]
    density = kde(data.map(function (d) { return d[key]; }))
    allDensity.push({ key: key, density: density })
  }

  // Add areas
  svgA4T3.selectAll("areas")
    .data(allDensity)
    .enter()
    .append("path")
    .attr("transform", function (d) { return ("translate(0," + (yName(d.key) - height) + ")") })
    .attr("fill", function (d) {
      grp = d.key;
      index = categories.indexOf(grp)
      value = allMeans[index]
      return myColor(value)
    })
    .datum(function (d) { return (d.density) })
    .attr("opacity", 0.7)
    .attr("stroke", "#000")
    .attr("stroke-width", 0.1)
    .attr("d", d3.line()
      .curve(d3.curveBasis)
      .x(function (d) { return x(d[0]); })
      .y(function (d) { return y(d[1]); })
    )

  });

});

// This is what I need to compute kernel density estimation
function kernelDensityEstimator(kernel, X) {
  return function (V) {
    return X.map(function (x) {
      return [x, d3.mean(V, function (v) { return kernel(x - v); })];
    });
  };
}
function kernelEpanechnikov(k) {
  return function (v) {
    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
  };
}
