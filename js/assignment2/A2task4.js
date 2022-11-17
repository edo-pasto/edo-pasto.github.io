// // set the dimensions and margins of the graph
// var margin = {top: 10, right: 30, bottom: 30, left: 300},
//     width = 460 - margin.left - margin.right,
//     height = 450 - margin.top - margin.bottom;

// // append the svg object to the body of the page
// var svg4 = d3.select("#A2task4")
//   .append("svg")
//     // .attr("width", width + margin.left + margin.right)
//     // .attr("height", height + margin.top + margin.bottom)
//     .attr("viewBox", `0 0 1000 500`)
//   .append("g")
//     .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")");

// //Read the data
// d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/2_TwoNum.csv", function(data) {

//   // Add X axis
//   var x = d3.scaleLinear()
//     .domain([0, 3000])
//     .range([ 0, width ]);
//   svg4.append("g")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom(x));

//   // Add Y axis
//   var y = d3.scaleLinear()
//     .domain([0, 400000])
//     .range([ height, 0]);
//   svg4.append("g")
//     .call(d3.axisLeft(y));

//   // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
//   // Its opacity is set to 0: we don't see it by default.
//   var tooltip = d3.select("#my_dataviz")
//     .append("div")
//     .style("opacity", 0)
//     .attr("class", "tooltip")
//     .style("background-color", "white")
//     .style("border", "solid")
//     .style("border-width", "1px")
//     .style("border-radius", "5px")
//     .style("padding", "10px")



//   // A function that change this tooltip when the user hover a point.
//   // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
//   var mouseover = function(d) {
//     tooltip
//       .style("opacity", 1)
//   }

//   var mousemove = function(d) {
//     tooltip
//       .html("The exact value of<br>the Ground Living area is: " + d.GrLivArea)
//       .style("left", (d3.mouse(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
//       .style("top", (d3.mouse(this)[1]) + "px")
//   }

//   // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
//   var mouseleave = function(d) {
//     tooltip
//       .transition()
//       .duration(200)
//       .style("opacity", 0)
//   }

//   // Add dots
//   svg4.append('g')
//     .selectAll("dot")
//     .data(data.filter(function(d,i){return i<50})) // the .filter part is just to keep a few dots on the chart, not all of them
//     .enter()
//     .append("circle")
//       .attr("cx", function (d) { return x(d.GrLivArea); } )
//       .attr("cy", function (d) { return y(d.SalePrice); } )
//       .attr("r", 7)
//       .style("fill", "#69b3a2")
//       .style("opacity", 0.3)
//       .style("stroke", "white")
//     .on("mouseover", mouseover )
//     .on("mousemove", mousemove )
//     .on("mouseleave", mouseleave )

// })






var margin3 = { top: 30, right: 0, bottom: 150, left: 110 },
  width3 = 400 - margin3.left - margin3.right,
  height3 = 400 - margin3.top - margin3.bottom;
//Read the data
d3.csv("../../data/top_6_treesMeasuresSmallMulti.csv", function (data) {

  data.forEach(function (d) {
    d['Height (m)'] = parseFloat(d['Height (m)']);
    d['Gross Carbon Sequestration (eur/yr)'] = parseFloat(d['Gross Carbon Sequestration (eur/yr)']);
    d['Gross Carbon Sequestration (kg/yr)'] = parseFloat(d['Gross Carbon Sequestration (kg/yr)']);
    d['Canopy Cover (m2)'] = parseFloat(d['Canopy Cover (m2)']);
  });
  // group the data: I want to draw one line per group
  var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(function (d) { return d.Name; })
    .entries(data);
  allKeys = sumstat.map(function (d) { return d.key })

  // Add an svg element for each group. The will be one beside each other and will go on the next row when no more room available
  var svg4 = d3.select("#A2task4")
    .selectAll("dot")
    .data(sumstat)
    .enter()
    .append("svg")
    // .attr("viewBox", `0 0 1000 500`)
    .attr("width", width3 + margin3.left + margin3.right)
    .attr("height", height3 + margin3.top + margin3.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin3.left + "," + margin3.top + ")");

  // Add X axis 
  var x = d3.scaleLinear()
    .range([0, width3])
    .domain([0, d3.max(data, function (d) { return +d['Height (m)']; })]
    );

  svg4
    .append("g")
    .attr("transform", "translate(0," + height3 + ")")
    .call(d3.axisBottom(x))
    // .attr("transform", "translate(-10,0)rotate(-45)")
    // .style("text-anchor", "end");

  // Add Y axis 
  var y = d3.scaleLinear()
  .domain([0, d3.max(data, function (d){ return +d['Gross Carbon Sequestration (kg/yr)'];})])
  // .domain(data.map(function (d) {
  //   return d['Gross Carbon Sequestration (kg/yr)'];
  // }))
    .range([height3, 0]);

  svg4.append("g")
    .call(d3.axisLeft(y));
    // .selectAll("text")
    // .attr("transform", "translate(-10,0)rotate(-45)")
    // .style("text-anchor", "end");



  // color palette
  var colorTitles = d3.scaleOrdinal()
    .domain(allKeys)
    .range(['#ffd43b', '#4daf4a', '#3c51ae', '#adb5bd', '#FFBCD9', '#e41a1c'])
  // Tooltip for all the bars

  var tooltipA2T4 = d3.select("#A2task4")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "10px")

  // Three function that change the tooltip when user hover / move / leave a cell
  const mouseoverA2T4 = function (d) {
    let treeHeight = d['Height (m)'];
    let Co2Sequestration = d['Gross Carbon Sequestration (kg/yr)']
    let treeType3 = d.Name;
    tooltipA2T4
      .html("Tree Type: " + treeType3 + "<br>" + "Height: " + treeHeight + "<br>" + "C02 Sequestration: " + Co2Sequestration)
      .style("opacity", 1);

  }
  const mousemoveA2T4 = function (d) {
    tooltipA2T4
      .style('left', (event.pageX + 20) + 'px')
      .style('top', (event.pageY + 10) + 'px')

  }
  const mouseleaveA2T4 = function (d) {
    tooltipA2T4
      .style("opacity", 0);
  }

  // create the Bar

  svg4.selectAll("dot")
    .data(function (d) { return d.values })
    .enter()
    .append("circle")
    .style("fill", function (d, i) { return colorTitles(d.Name) })
    // .attr("x", function (d, i) { return x(0); })
    // .attr("y", function (d, i) { return y(d.Neighborhood); })
    // .attr("height", y.bandwidth())
    // .attr("width", function (d, i) { return width3 - (width3 - x(d.Count)); })
    .attr("cx", function (d) { return x(d['Height (m)']); })
    .attr("cy", function (d) { return y(d['Gross Carbon Sequestration (kg/yr)']); })
    .attr("r", 1.5)
    .on("mouseover", mouseoverA2T4)
    .on("mousemove", mousemoveA2T4)
    .on("mouseleave", mouseleaveA2T4);


  // Add titles
  svg4
      .append("text")
      .attr("text-anchor", "start")
      .attr("y", -5)
      .attr("x", 0)
      .text(function (d) { return (d.key) })
      .style("fill", function (d) { return colorTitles(d.key) })

});
