var margin = { top: 200, right: 30, bottom: 50, left: 500 };
// The svg
var svg5 = d3.select("#A3task5"),
    width = +svg5.attr("width") - margin.left - margin.right,
    height = +svg5.attr("height") - margin.top - margin.bottom;

// Map and projection

let projection5 = d3.geoMercator()
    .scale(120000)
    .center([11, 46.1])
    .translate([width / 2, height / 2]);

/*
var projection = d3.geoIdentity()
.fitExtent([width,height],geojsonObject)
.reflectY(true);*/


// Data and color scale
var data5 = d3.map();
let colorScale5 = d3.scaleThreshold()
    .domain([100, 300, 500, 1000, 2000, 3200])
    .range(d3.schemeGreens[7]);

var tooltipA3T5 = d3.select("#A3task5Div")
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

// Load external data and boot
d3.queue()
    .defer(d3.json, "../../data/circoscrizioni.json")
    .defer(d3.csv, "../../data/neighborhoodAbundance.csv", function (d) {
        data5.set(d.Neighborhood, +d.Count);
    })
    .await(ready);

function ready(error, topo) {

    let mouseOver = function (d) {
        d3.selectAll(".Country")
            .transition()
            .duration(200)
            .style("opacity", .5)
            .style('stroke', 'transparent')
        d3.select(this)
            .transition()
            .duration(200)
            .style("opacity", 1)
            .style("stroke", "red")


            tooltipA3T5
            .transition()
            .duration(200)
            .style("opacity", 1)
            tooltipA3T5
            .html("<span style='color:grey'>Neighborhood: </span>" + d.properties.nome + "<br>" + "<span style='color:grey'>Tree Abundance: </span>" + d.total)
            .style("top", (event.pageY) + "px")


    }
    let mouseMove = function (d) {
        tooltipA3T5
            .style("left", (event.pageX + 30) + "px")
            .style("top", (event.pageY) + "px")
    }

    let mouseLeave = function (d) {
        d3.selectAll(".Country")
            .transition()
            .duration(200)
            .style("opacity", 1)
            .style("stroke", 'black')
        d3.select(this)
            .transition()
            .duration(200)
            .style("stroke", "black")

            tooltipA3T5
            .transition()
            .duration(200)
            .style("opacity", 0)
    }
    // console.log(topo.features)
    // console.log(data)
    // Draw the map
    svg5.append("g")
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        // draw each country
        .attr("d", d3.geoPath()
            .projection(projection5)
        )
        // set the color of each country
        .attr("fill", '#dbf8cf')
        .style("stroke", "black")
        .attr("class", function (d) {
            return "Country"
        })
        .style("opacity", 1)
        .on("mouseover", mouseOver)
        .on("mousemove", mouseMove)
        .on("mouseleave", mouseLeave)

        d3.csv("../../data/MapTop_10_trees.csv", function(data){
            let trees = ['Aesculus hippocastanum', 'Carpinus betulus', 'Celtis australis', 'Platanus x hispanica', 'Tilia cordata', 'Tilia x europaea', 'Acer campestre','Cupressus','Sophora japonica','Prunus cerasifera']
            let color_list = ["#440154ff", "#febbd9", "#fde725ff", "#f00034", "#52a163", '#0d6efc','#98f5ff', '#ff922b','#A9754F', '#8a2be2']
            var color = d3.scaleOrdinal()
            .domain(trees)
            .range(color_list)
            console.log(data[0].Name)
            svg5
              .selectAll("dot")
              .data(data)
              .enter()
              .append("circle")
                .attr("cx", function(d){ return projection5([d.Longitude, d.Latitude])[0] })
                .attr("cy", function(d){ return projection5([d.Longitude, d.Latitude])[1] })
                .attr("r", 2)
                .style("fill", function (d) {
                    console.log(d)
                    return color(d.Name)
                })
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("fill-opacity", .8)

        })


}

