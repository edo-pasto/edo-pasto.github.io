var margin = {top: 20, right: 30, bottom: 40, left: 90},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#task1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

const geo_url = "https://raw.githubusercontent.com/edo-pasto/edo-pasto.github.io/main/data/geo_data_trees.csv";


// d3.csv(geo_url,function (data){
// data.map(function (d){
//     console.log(d);
// })
// });


//test_url="https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv"
// Parse the Data
d3.csv(geo_url, function (data) {

// Add X axis
    var x = d3.scaleLinear()
        .domain([0, 13000])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

// Y axis
    var y = d3.scaleBand()
        .range([0, height])
        .domain(data.map(function (d) {
            return d.Name;
        }))
        .padding(.1);
    svg.append("g")
        .call(d3.axisLeft(y))

//Bars
    svg.selectAll("myRect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", x(0))
        .attr("y", function (d) {
            return y(d.Name);
        })
        .attr("width", function (d) {
            return x(d["Pollution Removal (eur/yr)"]);
        })
        .attr("height", y.bandwidth())
        .attr("fill", "#69b3a2")


// .attr("x", function(d) { return x(d.Country); })
// .attr("y", function(d) { return y(d.Value); })
// .attr("width", x.bandwidth())
// .attr("height", function(d) { return height - y(d.Value); })
// .attr("fill", "#69b3a2")

})