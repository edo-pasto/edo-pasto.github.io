// set the dimensions and margins of the graph
var margin = {top: 40, right: 150, bottom: 60, left: 30},
    width = 500 - margin.left - margin.right,
    height = 420 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg5 = d3.select("#A2task5")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
// d3.csv("/data/top_trees_neighborhood_unpivot_task_5_A_2.csv", function(data) {
d3.csv("../../data/top_6_treesMeasuresBubble.csv", function(data) {

  // ---------------------------//
  //       AXIS  AND SCALE      //
  // ---------------------------//
  data.forEach(function (d) {
    d['Height (m)'] = parseFloat(d['Height (m)']);
    d['Oxygen Production (kg/yr)'] = parseFloat(d['Oxygen Production (kg/yr)']);
    d['Canopy Cover (m2)'] = parseFloat(d['Canopy Cover (m2)']);
  });
  var keys = d3.map(data, function (d) {
    return (d.Neighborhood)
  }).keys()
  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d['Height (m)'])])
    .range([ 0, width ]);
  svg5.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(3));

  // Add X axis label:
  svg5.append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height+50 )
      .text("tree size (m)");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d['Oxygen Production (kg/yr)'])])
    .range([ height, 0]);
  svg5.append("g")
    .call(d3.axisLeft(y));

  // Add Y axis label:
  svg5.append("text")
      .attr("text-anchor", "end")
      .attr("x", 0)
      .attr("y", -20 )
      .text("CO2")
      .attr("text-anchor", "start")

  // Add a scale for bubble size
  var z = d3.scaleSqrt()
    .domain([0,d3.max(data, d => d['Canopy Cover (m2)']) ])
    .range([ 2, 30]);

  // Add a scale for bubble color
  var myColor = d3.scaleOrdinal()

    // .domain(keys)
    .domain(['Aesculus hippocastanum', 'Carpinus betulus', 'Celtis australis', 'Platanus x hispanica', 'Tilia cordata', 'Tilia x europaea'])
    .range(d3.schemeSet1);


  // ---------------------------//
  //      TOOLTIP               //
  // ---------------------------//

  // -1- Create a tooltip div that is hidden by default:
  // var tooltip = d3.select("#my_dataviz")
  //   .append("div")
  //     .style("opacity", 0)
  //     .attr("class", "tooltip")
  //     .style("background-color", "black")
  //     .style("border-radius", "5px")
  //     .style("padding", "10px")
  //     .style("color", "white")
  //
  // // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
  // var showTooltip = function(d) {
  //   tooltip
  //     .transition()
  //     .duration(200)
  //   tooltip
  //     .style("opacity", 1)
  //     .html("Country: " + d.Name)
  //     .style("left", (d3.mouse(this)[0]+30) + "px")
  //     .style("top", (d3.mouse(this)[1]+30) + "px")
  // }
  // var moveTooltip = function(d) {
  //   tooltip
  //     .style("left", (d3.mouse(this)[0]+30) + "px")
  //     .style("top", (d3.mouse(this)[1]+30) + "px")
  // }
  // var hideTooltip = function(d) {
  //   tooltip
  //     .transition()
  //     .duration(200)
  //     .style("opacity", 0)
  // }

  var tooltipA2T5 = d3.select("#A2task2")
        .append("div")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        // .style("min-width", "2px")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("font-size", "16px")
    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseoverA2T5 = function (d) {
        tooltipA2T5
            .transition()
            .duration(200)
            .style("opacity", 1)
        tooltipA2T5
            .html("<span style='color:grey'>Height (m): </span>" + d['Height (m)']) // + d.Prior_disorder + "<br>" + "HR: " +  d.HR)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY) + "px")
    }
    var mousemoveA2T5 = function (d) {
        tooltipA2T5
            .style("left", (event.pageX + 30) + "px")
            .style("top", (event.pageY) + "px")
    }
    var mouseleaveA2T5 = function (d) {
        tooltipA2T5
            .transition()
            .duration(200)
            .style("opacity", 0)
    }

  // ---------------------------//
  //       HIGHLIGHT GROUP      //
  // ---------------------------//

  // What to do when one group is hovered
  var highlight = function(d){
    // reduce opacity of all groups
    d3.selectAll(".bubbles").style("opacity", .05)
    // expect the one that is hovered
    d3.selectAll("."+d).style("opacity", 1)
  }

  // And when it is not hovered anymore
  var noHighlight = function(d){
    d3.selectAll(".bubbles").style("opacity", 1)
  }


  // ---------------------------//
  //       CIRCLES              //
  // ---------------------------//

  // Add dots
  svg5.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("class", function(d) { return "bubbles " + d.Name })

      // .attr("cx", function (d) { return x(d['Height (m)']); } )
      // .attr("cy", function (d) { return y(d['Oxygen Production (kg/yr)']); } )
      // .attr("r", function (d) { return z(d['Canopy Cover (m2)']); } )
      // .style("fill", function (d) { return myColor(d.Neighborhood); } )

      .attr("cx", function (d) { return x(d['Height (m2)']); } )
      .attr("cy", function (d) { return y(d['Oxygen Production (kg/yr)']); } )
      .attr("r", function (d) { return z(d['Canopy Cover (m2)']); } )
      .style("fill", function (d) { return myColor(d.Name); } )

    // -3- Trigger the functions for hover
    .on("mouseover", mouseoverA2T5 )
    .on("mousemove", mousemoveA2T5)
    .on("mouseleave", mouseleaveA2T5 )



    // ---------------------------//
    //       LEGEND              //
    // ---------------------------//

    // Add legend: circles
    var valuesToShow = [10000000, 100000000, 1000000000]
    var xCircle = 390
    var xLabel = 440
    svg5
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("circle")
        .attr("cx", xCircle)
        .attr("cy", function(d){ return height - 100 - z(d) } )
        .attr("r", function(d){ return z(d) })
        .style("fill", "none")
        .attr("stroke", "black")

    // Add legend: segments
    svg5
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("line")
        .attr('x1', function(d){ return xCircle + z(d) } )
        .attr('x2', xLabel)
        .attr('y1', function(d){ return height - 100 - z(d) } )
        .attr('y2', function(d){ return height - 100 - z(d) } )
        .attr('stroke', 'black')
        .style('stroke-dasharray', ('2,2'))

    // Add legend: labels
    svg5
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("text")
        .attr('x', xLabel)
        .attr('y', function(d){ return height - 100 - z(d) } )
        .text( function(d){ return d/1000000 } )
        .style("font-size", 10)
        .attr('alignment-baseline', 'middle')

    // Legend title
    svg5.append("text")
      .attr('x', xCircle)
      .attr("y", height - 100 +30)
      .text("Canopy Size (m2)")
      .attr("text-anchor", "middle")

    // Add one dot in the legend for each name.
    var size = 20

    // var allgroups = keys
    var allgroups = ['Aesculus hippocastanum', 'Carpinus betulus', 'Celtis australis', 'Platanus x hispanica', 'Tilia cordata', 'Tilia x europaea']

    svg5.selectAll("myrect")
      .data(allgroups)
      .enter()
      .append("circle")
        .attr("cx", 390)
        .attr("cy", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", function(d){ return myColor(d)})
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

    // Add labels beside legend dots
    svg5.selectAll("mylabels")
      .data(allgroups)
      .enter()
      .append("text")
        .attr("x", 390 + size*.8)
        .attr("y", function(d,i){ return i * (size + 5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return myColor(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)
  })