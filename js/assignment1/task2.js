//----------- Second Chart --------------
height2 = 400 - margin.top - margin.bottom;
var svg2 = d3.select("#task2")
  .append("svg")
  // .attr("width", width + margin.left + margin.right)
  // .attr("height", height + margin.top + margin.bottom)
  .attr("viewBox", `0 0 1000 500`)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("/data/top_trees_neighborhood.csv", function (data) {
  // List of subgroups = header of the csv files = soil condition here
  var subgroups = data.columns.slice(1)
  // List of groups = species here = value of the first column called group -> I show them on the X axis
  var groups = d3.map(data, function (d) {
    return (d.Neighborhood)
  }).keys()
  // Add X axis
  var x = d3.scaleBand()
    .domain(groups)
    .range([0, width])
    .padding([0.2])
  svg2.append("g")
    .attr("transform", "translate(0," + height2 + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 3000])
    .range([height2, 0]);
  svg2.append("g")
    .call(d3.axisLeft(y));
  // color palette = one color per subgroup
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#e41a1c', '#377eb8', '#4daf4a', '#3c51ae', '#fff1a9', '#bb3366'])
  //stack the data? --> stack per subgroup
  var stackedData = d3.stack()
    .keys(subgroups)
    (data)


  // ----------------
  // Create a tooltip
  // ----------------
  var tooltip2 = d3.select("#task2")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover2 = function (d) {
    var subgroupName = d3.select(this.parentNode).datum().key;
    var subgroupValue = d.data[subgroupName];
    tooltip2
      .html("Tree Type: " + subgroupName + "<br>" + "Amount: " + subgroupValue)
      .style("opacity", 1)
  }
  var mousemove2 = function (d) {
    var offsetX =  (42  * (screen.width / 100))
    var offsetY =  (130 * (screen.height / 100))

    console.log(screen.height)
    tooltip2
      .style("left", (d3.mouse(this)[0] + offsetX) + "px" ) // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.mouse(this)[1] + offsetY) + "px")
  }
  var mouseleave2 = function (d) {
    tooltip2
      .style("opacity", 0)
  }




  // Show the bars
  svg2.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
    .attr("fill", function (d) {
      return color(d.key);
    })
    .selectAll("rect")
    // enter a second time = loop subgroup per subgroup to add all rectangles
    .data(function (d) {
      return d;
    })
    .enter().append("rect")
    .attr("x", function (d) {
      return x(d.data.Neighborhood);
    })
    .attr("y", function (d) {
      return y(d[1]);
    })
    .attr("height", function (d) {
      return y(d[0]) - y(d[1]);
    })
    .attr("width", x.bandwidth())
    .on("mouseover", mouseover2)
    .on("mousemove", mousemove2)
    .on("mouseleave", mouseleave2)
})
