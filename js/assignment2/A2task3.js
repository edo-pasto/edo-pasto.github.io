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
d3.csv("/data/my_data_for_task_3_dont_manipulate_please.csv", function(data) {

  //get names as keys
   var keys = d3.map(data, function (d) { return (d.Name) }).keys()

  // Add X axis
  var x = d3.scaleLinear()
    .domain([d3.min(data, d=> d['Height (m)']), 30])
    .range([ 0, width ]);
  svg3.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([d3.min(data, d=> d['Oxygen Production (kg/yr)']),d3.max(data, d=> d['Oxygen Production (kg/yr)']) ])
    .range([ height, 0]);
  svg3.append("g")
    .call(d3.axisLeft(y));

  var domain = keys
  // Color scale: give me a specie name, I return a color
  var color = d3.scaleOrdinal()
    .domain(keys)
    .range([ "#440154ff", "#21908dff", "#fde725ff","#f00034"])


  // Highlight the specie that is hovered
  var highlight = function(d){



    d3.selectAll(".dot")
      .transition()
      .duration(200)
      .style("fill", "lightgrey")
      .attr("r", 3)

    d3.selectAll("." + d.Name)
      .transition()
      .duration(200)
      .style("fill", color(d.Name))
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
      .attr("class", function (d) { return "dot " + d.Name } )
      .attr("cx", function (d) { return x(d['Height (m)']); } )
      .attr("cy", function (d) { return y(d['Oxygen Production (kg/yr)']); } )
      .attr("r", 5)
      .style("fill", function (d) { return color(d.Name) } )
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
    .text(function (d, i) { return d});

})
