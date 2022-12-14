//----------- Fourth Chart --------------
height4 = 500 - margin.top - margin.bottom;

var svg4 = d3.select("#task4")
    .append("svg")
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", `0 0 1000 500`)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("../../data/top_trees_neighborhood_stacked.csv", function (data) {

    // List of subgroups = header of the csv files = soil condition here
    var subgroups = data.columns.slice(1)

    // List of groups = species here = value of the first column called group -> I show them on the X axis
    var groups = d3.map(data, function (d) { return (d.Neighborhood) }).keys()

    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, 100])
        .range([0, width])
    svg4.append("g")
        .attr("transform", "translate(0," + height4 + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0))


    // Add Y axis
    var y = d3.scaleBand()
        .domain(groups)
        .range([0, height4])
        .padding([0.2]);
    svg4.append("g")
        .call(d3.axisLeft(y));

    // color palette = one color per subgroup
    var color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#3c51ae', '#ffd43b', '#4daf4a', '#e41a1c', '#FFBCD9', '#adb5bd'])

    // Normalize the data -> sum of each group must be 100!
    // console.log(data)
    dataNormalized = []
    data.forEach(function (d) {
        // Compute the total
        tot = 0
        for (i in subgroups) { name = subgroups[i]; tot += +d[name] }
        // Now normalize
        for (i in subgroups) { name = subgroups[i]; d[name] = d[name] / tot * 100 }
    })

    //stack the data? --> stack per subgroup
    var stackedData = d3.stack()
        .keys(subgroups)
        (data)


    var tooltip4 = d3.select("#task4")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "10px")

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover4 = function (d) {
        var subgroupName = d3.select(this.parentNode).datum().key;
        var subgroupValue = d.data[subgroupName];
        tooltip4
            .html("Tree Type: " + subgroupName + "<br>" + "Amount: " + subgroupValue.toFixed(2) + "%")
            .style("opacity", 1);
        d3.select(this).attr("fill", "#0e6efc");
        
    }
    var mousemove4 = function (d) {

        tooltip4
            .style('left', (event.pageX+30) + 'px')
            .style('top', (event.pageY+10) + 'px')

    }



    // Show the bars
    svg4.append("g")
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .enter().append("g")
        .attr("fill", function (d) { return color(d.key); })
        .selectAll("rect")
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(function (d) { return d; })
        .enter().append("rect")
        .attr("x", function (d) { return x(d[0]); })
        .attr("y", function (d) { return y(d.data.Neighborhood); })
        .attr("width", function (d) { return x(d[1]) - x(d[0]); })
        .attr("height", y.bandwidth())
        .on("mouseover", mouseover4)
        .on("mousemove", mousemove4)
        .on("mouseleave", function(){
            tooltip4
                .style("opacity", 0);
            d3.select(this).attr("fill", function (d) {
                return color;
                })
        })

    var legend = d3.select("#task_4_legend")
        .append("svg")
        // .attr("viewBox", `0 0 50 50`)
        .attr('width', 300)
        .attr('height', 200)
        .append('g')
        .attr("transform", `translate(50,0)`)
        .selectAll("div")
        .data(subgroups)
        .enter()
        .append("g")
        .attr('transform', function (d, i) { return "translate(0," + i * 30 + ")"; });

    legend.append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", function (d, i) { return color(color_map[d]) });

    legend.append("text")
        .attr("x", 25)
        .attr("y", 15)
        .text(function (d, i) { return d });

})