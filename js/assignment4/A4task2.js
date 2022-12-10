//RadarChart


function angleToCoordinate(angle, value) {
    let x = Math.cos(angle) * radialScale(value);
    let y = Math.sin(angle) * radialScale(value);
    return { "x": 300 + x, "y": 300 - y };
}


// let  = ["A", "B", "C", "D", "E", "F"];
let years = ["1993", "1997", "2001", "2005", "2009", "2013", "2017", "2021"];
const features = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

//generate the data
// for (var i = 0; i < years.length; i++) {
//     var point = {}
//     //each feature will be a random number from 1-9
//     features.forEach(f => point[f] = 1 + Math.random() * 8);
//     data.push(point);
// }
// var margin = { top: 120, right: 30, bottom: 50, left: 110 },
//   width = 600 - margin.left - margin.right,
//   height = 420 - margin.top - margin.bottom;

let svgA4T2 = d3.select("#A4task2").append("svg")
    .attr("viewBox", `0 0 950 950`)
    .style("margin-bottom", -450+"px")
// .attr("width", 600)
// .attr("height", 600);

let radialScale = d3.scaleLinear()
    .domain([-10, 30])
    .range([0, 250]);
let ticks = [-10, 0, 10, 20, 30];
// let ticks = d3.range(-10, 30, 10)
ticks.forEach(t =>
    svgA4T2.append("circle")
        .attr("cx", 300)
        .attr("cy", 300)
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("r", radialScale(t))
);
ticks.forEach(t =>
    svgA4T2.append("text")
        .attr("x", 305)
        .attr("y", 300 - radialScale(t))
        .text(t.toString())
);


for (var i = 0; i < features.length; i++) {
    let ft_name = features[i];
    let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
    let line_coordinate = angleToCoordinate(angle, 30);
    let label_coordinate = angleToCoordinate(angle, 32);

    //draw axis line
    svgA4T2.append("line")
        .attr("x1", 300)
        .attr("y1", 300)
        .attr("x2", line_coordinate.x)
        .attr("y2", line_coordinate.y)
        .attr("stroke", "black");

    //draw axis label
    svgA4T2.append("text")
        .attr("x", label_coordinate.x)
        .attr("y", label_coordinate.y)
        .text(ft_name);
}
let line = d3.line()
    .x(d => d.x)
    .y(d => d.y);

let colors = ["darkorange", "gray", "navy", "blue", "red", "green", "black", "yellow"];

function getPathCoordinates(data_point) {
    let coordinates = [];
    for (var i = 0; i < features.length + 1; i++) {
        let ft_name = features[i % features.length];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
        coordinates.push(angleToCoordinate(angle, parseFloat(data_point[ft_name])));
    }
    return coordinates;
}

// ---------------------------//
//       HIGHLIGHT GROUP      //
// ---------------------------//

// What to do when one group is hovered
var highlight = function (d) {
    // reduce opacity of all groups
    d3.selectAll("path").style("opacity", .01)
    // expect the one that is hovered
    console.log(d)
    d3.select(`#Year${d}`).style("opacity", 1)
}

// And when it is not hovered anymore
var noHighlight = function (d) {
    d3.selectAll("path").style("opacity", 1)
}
// Add one dot in the legend for each name.
var size = 20
var moveX = 300
var moveY = 50
var xCircle = 390 + moveX
var xLabel = 440 + moveX

// var allgroups = keys
var allgroups = ["1993", "1997", "2001", "2005", "2009", "2013", "2017", "2021"]

svgA4T2.selectAll("myrect")
    .data(allgroups)
    .enter()
    .append("circle")
    .attr("cx", xCircle)
    .attr("cy", function (d, i) { return 10 + i * (size + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7)
    .style("fill", function (d, i) { return colors[i] })
    .on("mouseover", highlight)
    .on("mouseleave", noHighlight)

// Add labels beside legend dots
svgA4T2.selectAll("mylabels")
    .data(allgroups)
    .enter()
    .append("text")
    .attr("x", xCircle + size * .8)
    .attr("y", function (d, i) { return i * (size + 5) + (size / 2) +1  }) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function (d, i) { return colors[i] })
    .text(function (d) { return d })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .on("mouseover", highlight)
    .on("mouseleave", noHighlight)

d3.csv("../../data/temp_data/grouped_cleaned_daily_temp_data.csv",

    function (d) {
        return {
            year: d.year,
            month: d.month,
            mean: d.mean,

        }
    },

    function (data) {

        for (i = 0; i < years.length; i++) {
            let temp_year = data.filter(function (row) {
                return row.year == years[i];
            });
            // for (var i = 0; i < data.length; i++) {
            // temp_year.forEach(function (d) {
            //     console.log(d.mean, d.year);
            // let d = data[i];
            // temp_year = d3.nest()
            //     .key(function (d) {
            //         return d.month;
            //     })
            //     .entries(temp_year);
            let dict = {}
            temp_year.forEach(function (d) {
                dict[d.month] = d.mean;
            });
            console.log(dict);
            let color = colors[i];
            let coordinates = getPathCoordinates(dict);

            //draw the path element
            svgA4T2.append("path")
                .datum(coordinates)
                .attr("d", line)
                .attr("id", "Year"+years[i])
                .attr("stroke-width", 3)
                .attr("stroke", color)
                .attr("fill", "none")
                .attr("stroke-opacity", 1)
                .attr("opacity", 1);
            // });
        }
    });