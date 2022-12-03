// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 30, left: 50 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg1 = d3.select("#A4task1")
  .append("svg")
  .attr('id', 'SVG_ID_A4T1')
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv",

  // When reading the csv, I must format variables:
  function (d) {
    return { date: d3.timeParse("%Y-%m-%d")(d.date), value: d.value }
  },

  // Now I can use this dataset:
  function (data) {

    // Keep only the 90 first rows
    data = data.filter(function (d, i) { return i < 90 })

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function (d) { return d.date; }))
      .range([0, width]);
    svg1.append("g")
      .attr("transform", "translate(0," + (height + 5) + ")")
      .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain(d3.extent(data, function (d) { return +d.value; }))
      .range([height, 0]);
    svg1.append("g")
      .attr("transform", "translate(-5,0)")
      .call(d3.axisLeft(y).tickSizeOuter(0));

    // // Add the area
    // svg.append("path")
    //   .datum(data)
    //   .attr("fill", "#69b3a2")
    //   .attr("fill-opacity", .3)
    //   .attr("stroke", "none")
    //   .attr("d", d3.area()
    //     .x(function(d) { return x(d.date) })
    //     .y0( height )
    //     .y1(function(d) { return y(d.value) })
    //     )

    // Add the line
    svg1.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#69b3a2")
      .attr("stroke-width", 4)
      .attr("d", d3.line()
        .x(function (d) { return x(d.date) })
        .y(function (d) { return y(d.value) })
      )

    svg1.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 4)
      .attr("d", d3.line()
        .x(function (d) { return x(d.date) })
        .y(function (d) { return y(d.value - 10) })
      )

    // Add dots
    svg1.selectAll("myCircles")
      .data(data)
      .enter()
      .append("circle")
      .attr("fill", "red")
      .attr("stroke", "none")
      .attr("cx", function (d) { return x(d.date) })
      .attr("cy", function (d) { return y(d.value) })
      .attr("r", 3)

    svg1.selectAll("myCircles")
      .data(data)
      .enter()
      .append("circle")
      .attr("fill", "red")
      .attr("stroke", "none")
      .attr("cx", function (d) { return x(d.date) })
      .attr("cy", function (d) { return y(d.value - 10) })
      .attr("r", 3)


    svg1.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", function (d) {
        return "dot " + d.Name
      })
      .attr("cx", function (d) {
        return x(d.date);
      })
      .attr("cy", function (d) {
        return y(d.value - 5);
      })
      .attr("r", 3)
      .style("fill", 'green');

  });


d3.select("#yearsA4T1").on("change", function () {

  let selectedYear = this.value

  var margin = { top: 10, right: 30, bottom: 30, left: 50 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    d3.select("#SVG_ID_A4T1").remove()
  // append the svg object to the body of the page
  var svg1 = d3.select("#A4task1")
    .append("svg")
    .attr('id', 'SVG_ID_A4T1')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");


  d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv",

    // When reading the csv, I must format variables:
    function (d) {
      return { date: d3.timeParse("%Y-%m-%d")(d.date), value: d.value }
    },

    // Now I can use this dataset:
    function (data) {

      data = data.filter(function (d, i) { return i < 90 })

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function (d) { return d.date; }))
      .range([0, width]);
    svg1.append("g")
      .attr("transform", "translate(0," + (height + 5) + ")")
      .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain(d3.extent(data, function (d) { return +d.value; }))
      .range([height, 0]);
    svg1.append("g")
      .attr("transform", "translate(-5,0)")
      .call(d3.axisLeft(y).tickSizeOuter(0));

    // // Add the area
    // svg.append("path")
    //   .datum(data)
    //   .attr("fill", "#69b3a2")
    //   .attr("fill-opacity", .3)
    //   .attr("stroke", "none")
    //   .attr("d", d3.area()
    //     .x(function(d) { return x(d.date) })
    //     .y0( height )
    //     .y1(function(d) { return y(d.value) })
    //     )

    // Add the line
    svg1.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "pink")
      .attr("stroke-width", 4)
      .attr("d", d3.line()
        .x(function (d) { return x(d.date) })
        .y(function (d) { return y(d.value) })
      )

    svg1.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 4)
      .attr("d", d3.line()
        .x(function (d) { return x(d.date) })
        .y(function (d) { return y(d.value - 10) })
      )

    // Add dots
    svg1.selectAll("myCircles")
      .data(data)
      .enter()
      .append("circle")
      .attr("fill", "red")
      .attr("stroke", "none")
      .attr("cx", function (d) { return x(d.date) })
      .attr("cy", function (d) { return y(d.value) })
      .attr("r", 3)

    svg1.selectAll("myCircles")
      .data(data)
      .enter()
      .append("circle")
      .attr("fill", "red")
      .attr("stroke", "none")
      .attr("cx", function (d) { return x(d.date) })
      .attr("cy", function (d) { return y(d.value - 10) })
      .attr("r", 3)


    svg1.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", function (d) {
        return "dot " + d.Name
      })
      .attr("cx", function (d) {
        return x(d.date);
      })
      .attr("cy", function (d) {
        return y(d.value - 5);
      })
      .attr("r", 3)
      .style("fill", 'green');
    });



});

