// // The svg
// var svg2 = d3.select("#A3task2"),
//     width = +svg2.attr("width"),
//     height = +svg2.attr("height");

// // Map and projection

// var projection = d3.geoMercator()
//     .scale(55000)
//     .center([11, 46.1])
//     .translate([width / 2, height / 2]);

// /*
// var projection = d3.geoIdentity()
// .fitExtent([width,height],geojsonObject)
// .reflectY(true);*/


// // Data and color scale
// var data = d3.map();
// var colorScale = d3.scaleThreshold()
//     .domain([100, 300, 500, 1000, 2000, 3200])
//     .range(d3.schemeBlues[7]);

// // Load external data and boot
// d3.queue()
//     .defer(d3.json, "../../data/circoscrizioni.json")
//     .defer(d3.csv, "../../data/neighborhoodDensity.csv", function (d) {
//         data.set(d.Neighborhood, +d.Count);
//     })
//     .await(ready);

// function ready(error, topo) {

//     let mouseOver = function (d) {
//         d3.selectAll(".Country")
//             .transition()
//             .duration(200)
//             .style("opacity", .5)
//         d3.select(this)
//             .transition()
//             .duration(200)
//             .style("opacity", 1)
//             .style("stroke", "black")
//     }

//     let mouseLeave = function (d) {
//         d3.selectAll(".Country")
//             .transition()
//             .duration(200)
//             .style("opacity", .8)
//         d3.select(this)
//             .transition()
//             .duration(200)
//             .style("stroke", "transparent")
//     }
//     // console.log(topo.features)
//     // console.log(data)
//     // Draw the map
//     svg2.append("g")
//         .selectAll("path")
//         .data(topo.features)
//         .enter()
//         .append("path")
//         // draw each country
//         .attr("d", d3.geoPath()
//             .projection(projection)
//         )
//         // set the color of each country
//         .attr("fill", function (d) {
//             // console.log(d.properties.nome, d.total, d.id)
//             d.total = data.get(d.properties.nome) || 0;
//             return colorScale(d.total);
//         })
//         .style("stroke", "transparent")
//         .attr("class", function (d) {
//             return "Country"
//         })
//         .style("opacity", .8)
//         .on("mouseover", mouseOver)
//         .on("mouseleave", mouseLeave)


// }

