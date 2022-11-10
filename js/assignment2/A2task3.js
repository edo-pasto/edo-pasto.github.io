// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 320},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg3 = d3.select("#A2task3")
  .append("svg")
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", `0 0 1000 500`)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv", function(data) {

  // Add X axis
  var x = d3.scaleLinear()
    .domain([4, 8])
    .range([ 0, width ]);
  svg3.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 9])
    .range([ height, 0]);
  svg3.append("g")
    .call(d3.axisLeft(y));

  var domain = ["setosa", "versicolor", "virginica" ]
  // Color scale: give me a specie name, I return a color
  var color = d3.scaleOrdinal()
    .domain(["setosa", "versicolor", "virginica" ])
    .range([ "#440154ff", "#21908dff", "#fde725ff"])


  // Highlight the specie that is hovered
  var highlight = function(d){

    selected_specie = d.Species

    d3.selectAll(".dot")
      .transition()
      .duration(200)
      .style("fill", "lightgrey")
      .attr("r", 3)

    d3.selectAll("." + selected_specie)
      .transition()
      .duration(200)
      .style("fill", color(selected_specie))
      .attr("r", 7)
  }

  // Highlight the specie that is hovered
  var doNotHighlight = function(){
    d3.selectAll(".dot")
      .transition()
      .duration(200)
      .style("fill", "lightgrey")
      .attr("r", 5 )
  }

  // Add dots
  svg3.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("class", function (d) { return "dot " + d.Species } )
      .attr("cx", function (d) { return x(d.Sepal_Length); } )
      .attr("cy", function (d) { return y(d.Petal_Length); } )
      .attr("r", 5)
      .style("fill", function (d) { return color(d.Species) } )
    .on("mouseover", highlight)
    .on("mouseleave", doNotHighlight )

  var legend = d3.select("#A2task3_legend")
    .append("svg")
    // .attr("viewBox", `0 0 50 50`)
    .attr('width', 300)
    .attr('height', 200)
    .append('g')
    .attr("transform", `translate(50,0)`)
    .selectAll("div")
    .data(domain)
    .enter()
    .append("g")
    .attr('transform', function (d, i) { return "translate(0," + i * 30 + ")"; });

legend.append("rect")
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", function (d, i) { return color(domain[i]) });

legend.append("text")
    .attr("x", 25)
    .attr("y", 15)
    .text(function (d, i) { return d });

})
