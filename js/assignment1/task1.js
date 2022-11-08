// -------------- First Chart -------------

const margin = { top: 20, right: 30, bottom: 40, left: 250 },
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#task1")
    .append("svg")
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", `0 0 1000 500`)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// const geo_url = "https://raw.githubusercontent.com/edo-pasto/edo-pasto.github.io/main/data/top_10_trees.csv";

const geo_url = "../../data/top_20_trees.csv";
//test_url="https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv"
// Parse the Data
d3.csv(geo_url, function (data) {



    // Add X axis
    const x = d3.scaleLinear()
        .domain([0, 1300])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Y axis
    const y = d3.scaleBand()
        .range([0, height])
        .domain(data.map(function (d) {
            return d.Name;
        }))
        .padding(.1);
    svg.append("g")
        .call(d3.axisLeft(y))


    const tooltip = d3.select("#task1")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "10px")

    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function (d) {
        const totalAmount = d.Count;
        const treeType = d.Name;
        const canopyMean = d["Mean Canopy Cover (m2)"];
        tooltip
            .html("Tree Type: " + treeType + "<br>" + "Total Amount: " + totalAmount + "<br>" + "Canopy mean: " + canopyMean)
            .style("opacity", 1);
            d3.select(this).attr("fill", "#0e6efc");
    }
    const mousemove = function (d) {
        tooltip
        .style('left', (event.pageX+40) + 'px')
        .style('top', (event.pageY+5) + 'px')
    }
    const mouseleave = function (d) {
        tooltip
            .style("opacity", 0);
        d3.select(this).attr("fill", function(d){
            return scolor(d.Count);
        });

    }
    let scolor = d3.scaleSequential()
        .domain([0, d3.max(data, d => d.Count)])
        .interpolator(d3.interpolateGreens);

    // const expScale = d3.scalePow()
    //     .exponent(Math.E)
    //     .domain([ d3.min(data, d => d.Count),d3.max(data, d => d.Count)])
    // const logScale = d3.scaleLog()
    //     .domain([ d3.max(data, d => d.Count),d3.min(data, d => d.Count)])
    // let scolor2 = d3.scaleSequential(
    //     (d) => d3.interpolateReds(logScale(d))
    //   )
    
    let scolor2 = d3.scaleSequential()
        // .domain([d3.min(data, d => d.Count),d3.max(data, d => d.Count)])
        .domain([300, 270])
        .interpolator(d3.interpolateGreys);
    
    //Bars
    console.log(x(70))
    let bar = svg.selectAll("myRect")
        .data(data)
        .enter()

    bar.append("rect")
        .attr("x", x(0))
        .attr("y", function (d) {
            return y(d.Name);
        })
        .attr("width", function (d) {
            // return x(d.Count);
            return x(0);

        })
        .attr("height", y.bandwidth())
        .attr("fill", function (d) {
            // return x(d.Count);
            return scolor(d.Count);

        })
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
    bar.append('text').text((d)=>d.Count)
        .attr("x", function(d) { return x(d.Count) - 30 ; })
        .attr("y", function(d) { return y(d.Name)+14; })
        .attr("text-anchor", "right")
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", function (d) {
            // return x(d.Count);
            return scolor2(d.Count);

        })


    //Animation
        svg.selectAll("rect")
            .transition()
            .duration(800)
            .attr("x", function (d) { return x(0); })
            .attr("width", function (d) { return width - (width - x(d.Count)) })
            .delay(function (d, i) {  return (i * 100) })

})