//----------- Third Chart --------------
// var margin3 = { top: 30, right: 200, bottom: 30, left: 35 },
//     width3 = 500 - margin3.left - margin3.right,
//     height3 = 300 - margin3.top - margin3.bottom
var margin3 = {top: 30, right: 0, bottom: 150, left: 75},
    width3 = 310 - margin3.left - margin3.right,
    height3 = 400 - margin3.top - margin3.bottom;
//Read the data
d3.csv("/data/top_trees_neighborhood_unpivot.csv", function (data) {


    // group the data: I want to draw one line per group
    var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function (d) { return d.Name; })
        .entries(data);
    allKeys = sumstat.map(function (d) { return d.key })

    // Add an svg element for each group. The will be one beside each other and will go on the next row when no more room available
    var svg3 = d3.select("#task3")
        .selectAll("mybar")
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
    var x = d3.scaleBand()
        .range([0, width3])
        .padding(.1)
        .domain(data.map(function (d) {
            return d.Neighborhood;
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
        .domain([0, d3.max(data, function (d) { return +d.Count; })])
        // .domain([0, 600])
        .range([height3, 0]);

    svg3.append("g")
        .call(d3.axisLeft(y).ticks(5));

// Tooltip for all the bars

    var tooltip3 = d3.select("#task3")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "10px")

    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover3 = function (d) {
        let totalAmount3 = d.Count;
        let treeType3 = d.Name;
        tooltip3
            .html("Tree Type: " + treeType3 + "<br>" + "Total Amount: " + totalAmount3 )
            .style("opacity", 1)
    }
    const mousemove3 = function (d) {
        var offsetX = (32 * (screen.width / 100))
        var offsetY = (230 * (screen.height / 100))
        tooltip3
        .style('left', (event.pageX+20) + 'px')
        .style('top', (event.pageY+10) + 'px')
            // .style("left", (d3.mouse(this)[0] + offsetX) + "px") 
            // .style("top", (d3.mouse(this)[1] + offsetY) + "px")
    }
    const mouseleave3 = function (d) {
        tooltip3
            .style("opacity", 0)
    }

    // color palette
    var colorTitles = d3.scaleOrdinal()
        .domain(allKeys)
        // .range(['#3c51ae', '#ffd43b', '#4daf4a', '#e41a1c', '#377eb8', '#adb5bd', '#f781bf', '#999999'])
        .range(['#ffd43b','#4daf4a', '#3c51ae', '#adb5bd', '#377eb8', '#e41a1c'])

    var colorBars = d3.scaleOrdinal(d3.schemeCategory10);
    
    // var colorBars = d3.scaleOrdinal()
    // .domain(subgroups)
    // .range(['#3c51ae', '#ffd43b', '#4daf4a', '#e41a1c', '#377eb8', '#adb5bd'])

    // console.log(colorBars)
    // console.log(colorTitles)

    // create the Bar

    svg3.selectAll("mybar")
        .data(function (d) { return d.values })
        .enter()
        .append("rect")
        // .attr("stroke", function(d){ return color(d.key) })
        // .attr("fill", "#4daf49")
        .style("fill", function (d, i) { return colorTitles(d.Name) })
        .attr("x", function (d, i) { return x(d.Neighborhood); })
        .attr("y", function (d, i) { return y(d.Count); })
        .attr("width", x.bandwidth())
        .attr("height", function (d, i) { return height3 - y(d.Count); })
        .on("mouseover", mouseover3)
        .on("mousemove", mousemove3)
        .on("mouseleave", mouseleave3)


    // Add titles
    svg3
        .append("text")
        .attr("text-anchor", "start")
        .attr("y", -5)
        .attr("x", 0)
        .text(function (d) { return (d.key) })
        .style("fill", function (d) { return colorTitles(d.key) })

});
