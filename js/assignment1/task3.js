//----------- Third Chart --------------
var margin3 = {top: 30, right: 0, bottom: 30, left: 50},
    width3 = 210 - margin3.left - margin3.right,
    height3 = 210 - margin3.top - margin3.bottom

//Read the data
d3.csv("/data/top_trees_neighborhood_reordered.csv", function (data) {


    console.log("Daataaaaaaaaaa ",data)

    // group the data: I want to draw one line per group
    var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function (d) { return d.Neighborhood; })
        .entries(data);

    // What is the list of groups?
    allKeys = sumstat.map(function (d) { return d.key })

    // Add an svg element for each group. The will be one beside each other and will go on the next row when no more room available
    var svg3 = d3.select("#task3")
        .selectAll("mybar")
        .data(sumstat)
        .enter()
        .append("svg")
        .attr("width", width3 + margin3.left + margin3.right)
        .attr("height", height3 + margin3.top + margin3.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin3.left + "," + margin3.top + ")");

    // Add X axis 
    var x = d3.scaleBand()
            .range([0, width3])
    .domain(data.map(function (d) {
        return d.Name;
    }));

    svg3
        .append("g")
        .attr("transform", "translate(0," + height3 + ")")
        .call(d3.axisBottom(x).ticks(3)).selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    //Add Y axis
    // var y = d3.scaleLinear()
    //     .domain([0,1300])
    //     .range([height3, 0]);

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.Count; })])
        .range([ height3, 0 ]);


    svg3.append("g")
        .call(d3.axisLeft(y).ticks(5));

    // color palette
    var color = d3.scaleOrdinal()
        .domain(allKeys)
        .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'])

    // Draw the Bar
   svg3.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) {console.log(x(d.Name)); return x(d.Name); })
        .attr("y", function(d) {console.log(y(d.Count)); return y(d.Count); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height3 - y(d.Count); })



    // Add titles
    svg3
        .append("text")
        .attr("text-anchor", "start")
        .attr("y", -5)
        .attr("x", 0)
        .text(function (d) { return (d.key) })
        .style("fill", function (d) { return color(d.key) })

});