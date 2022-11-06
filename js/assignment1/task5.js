
var total = 0;
var widthWaffle,
    heightWaffle,
    widthSquares = 10,
    heightSquares = 10,
    squareSize = 25,
    squareValue = 0,
    gap = 1;

var color = d3.scaleOrdinal(d3.schemeCategory10);

neighborhoods = {
    'ARGENTARIO' : 1,
    'BONDONE' : 2,
    'CENTRO STORICO PIEDICASTELLO' : 3,
    'GARDOLO' : 4,
    'MATTARELLO' : 5,
    'MEANO' : 6,
    'OLTREFERSINA' : 7,
    'POVO' : 8,
    'RAVINA-ROMAGNANO' : 9,
    'S.GIUSEPPE-S.CHIARA' : 10,
    'SARDAGNA' : 11,
    'VILLAZZANO' : 12,
}

color_map = {
    'Other': 0,
    'Celtis australis': 1,
    'Carpinus betulus': 2,
    'Platanus x hispanica': 3,
    'Aesculus hippocastanum': 4,
    'Tilia cordata': 5,
}
tree_map = {
    0: 'Other',
    1: 'Celtis australis',
    2: 'Carpinus betulus',
    3: 'Platanus x hispanica',
    4: 'Aesculus hippocastanum',
    5: 'Tilia cordata',
}

for (nbh in neighborhoods) {

    d3.csv(`../../data/single_neighborhood/top_trees_${nbh}.csv`, function (err, data) {

        theData = []

        //total
        total = d3.sum(data, function (d) { return d.Count; });
    
        //value of a square
        squareValue = total / (widthSquares * heightSquares);
    
        //remap data
        data.forEach(function (d, i) {
            d.Count = +d.Count;
            d.units = Math.floor(d.Count / squareValue);
            theData = theData.concat(
                Array(d.units + 1).join(1).split('').map(function () {
                    return {
                        squareValue: squareValue,
                        units: d.units,
                        abundance: d.Count,
                        groupIndex: color_map[d.Name],
                        name: d.Name,
                        neigh: d.Neighborhood
                    };
                })
            );
        });
    
        widthWaffle = (squareSize * widthSquares) + widthSquares * gap + 25;
        heightWaffle = (squareSize * heightSquares) + heightSquares * gap + 25;
    
      let waffle = d3.select(`#task5-${neighborhoods[data[0]['Neighborhood']]}`)
           let svg5 = waffle.append("svg")
            .attr("viewBox", `0 0 275 275`)
            // .attr("width", widthWaffle)
            // .attr("height", heightWaffle)
            .append("g")
            .selectAll("div")
            .data(theData)
            .enter()
            .append("rect")
            
            .attr("width", squareSize)
            .attr("height", squareSize)

            .attr("fill", function (d) {
                return color(d.groupIndex);
            })
            .attr("x", function (d, i) {
                //group n squares for column
                col = Math.floor(i / heightSquares);
                return (col * squareSize) + (col * gap);
            })
            .attr("y", function (d, i) {
                row = i % heightSquares;
                return (heightSquares * squareSize) - ((row * squareSize) + (row * gap))
            })
            .append("title")
            .text(function (d, i) {
                // console.log(theData)
                return "Tree type: " + d.name + "; \nAbundance: " + d.abundance + "; \nPercentage: " + d.units + "%" + "\nNeighborhood: " + d.neigh
            });    
    });

}


d3.csv(`../../data/single_neighborhood/top_trees_ARGENTARIO.csv`, function (err, data) {

    //add legend with categorical data
    var legend = d3.select("#legend")
        .append("svg")
        .attr('width', 300)
        .attr('height', 200)
        .append('g')
        .selectAll("div")
        .data(data)
        .enter()
        .append("g")
        .attr('transform', function (d, i) { return "translate(0," + i * 20 + ")"; });
    
    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function (d, i) { return color(color_map[d.Name]) });
    
    legend.append("text")
        .attr("x", 25)
        .attr("y", 13)
        .text(function (d) { return d.Name });

    //add value of a unit square
    var legend2 = d3.select("#legend")
        .select('svg')
        .append('g')
        .attr('transform', "translate(100,0)");

    legend2.append("text")
        .attr('y', '14')
        .attr('font-size', '18px')
        // .text("Total: " + total)
        .attr("fill", "#444444");

});


// var data = [
//     { "name": "type 1", "value": 102},
//     { "name": "type 2", "value": 65},
//     { "name": "type 3", "value": 43},
//     { "name": "type 4", "value": 12}
//   ];

// let data = [
//     {"name": "Other", "value": 349},
//     {"name": "Celtis australis", "value": 61},
//     {"name": "Carpinus betulus", "value": 18},
//     {"name": "Platanus x hispanica", "value": 12},
//     {"name": "Aesculus hippocastanum", "value": 9},
//     {"name": "Tilia cordata", "value": 5},
// ]





// let id_prova = "#task5-0"

// var chart3 = d3waffle()
// .rows(9)
// .scale(1/3)
// .icon("")
// .adjust(0.425)
// .colorscale(color)
// .appearancetimes(function(d, i){
//     mod = 13;
//     val = i % mod;
//     return val / mod * 1500;
// })
// .height(400);

// d3.select(id_prova)
// .datum(data)
// .call(chart3);