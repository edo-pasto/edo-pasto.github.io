
var total = 0;
var widthWaffle,
    heightWaffle,
    widthSquares = 20,
    heightSquares = 5,
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
            var perc = (d.Count / squareValue).toFixed(2);
            theData = theData.concat(
                Array(d.units + 1).join(1).split('').map(function () {
                    return {
                        squareValue: squareValue,
                        units: d.units,
                        population: d.Count,
                        groupIndex: color_map[d.Name]
                    };
                })
            );
        });
    
        widthWaffle = (squareSize * widthSquares) + widthSquares * gap + 25;
        heightWaffle = (squareSize * heightSquares) + heightSquares * gap + 25;
    
      let waffle = d3.select(`#task5-${neighborhoods[data[0]['Neighborhood']]}`)
           let svg5 = waffle.append("svg")
            .attr("width", widthWaffle)
            .attr("height", heightWaffle)
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
                console.log(theData)
                return "Tree type: " + theData[d.groupIndex].Name + "; \nAbundance: " + d.population + "; \nPercentage: " + d.units + "%" + "\nNeighborhood: " + theData[d.groupIndex].Neighborhood
            });

            // svg5
            // .append("text")
            // .attr("text-anchor", "start")
            // .attr("y", -5)
            // .attr("x", 0)
            // .text(function(d){ return(nbh)})
            // .style("fill", function(d, i){ return color(i)});

  
    
    });

}


    // // ---- Argentario -----

// d3.csv("./data/ArgentarioWaffle.csv", function (error, data) {
//     //total
//     total = d3.sum(data, function (d) { return d.Count; });

//     //value of a square
//     squareValue = total / (widthSquares * heightSquares);

//     //remap data
//     data.forEach(function (d, i) {
//         d.Count = +d.Count;
//         d.units = Math.floor(d.Count / squareValue);
//         perc = (d.Count / squareValue).toFixed(2);
//         theData = theData.concat(
//             Array(d.units + 1).join(1).split('').map(function () {
//                 return {
//                     squareValue: squareValue,
//                     units: d.units,
//                     perc: perc,
//                     population: d.Count,
//                     groupIndex: i
//                 };
//             })
//         );
//     });

//     widthWaffle = (squareSize * widthSquares) + widthSquares * gap + 25;
//     heightWaffle = (squareSize * heightSquares) + heightSquares * gap + 25;

//     var waffle = d3.select("#task5")
//         .append("svg")
//         .attr("width", widthWaffle)
//         .attr("height", heightWaffle)
//         .append("g")
//         .selectAll("div")
//         .data(theData)
//         .enter()
//         .append("rect")
//         .attr("width", squareSize)
//         .attr("height", squareSize)
//         //   .attr('title', d.Neighborhood)
//         .attr("fill", function (d) {
//             return color(d.groupIndex);
//         })
//         .attr("x", function (d, i) {
//             //group n squares for column
//             col = Math.floor(i / heightSquares);
//             return (col * squareSize) + (col * gap);
//         })
//         .attr("y", function (d, i) {
//             row = i % heightSquares;
//             return (heightSquares * squareSize) - ((row * squareSize) + (row * gap))
//         })
//         .append("title")
//         .text(function (d, i) {
//             return "Tree type: " + data[d.groupIndex].Name + "; \nAbundance: " + data[d.groupIndex].Count + "; \nPercentage: " + d.units + "%"
//         });

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

// // ---- Bondone -----

// d3.csv("./data/BondoneWaffle.csv", function (error, data) {
//     //total
//     total = d3.sum(data, function (d) { return d.Count; });

//     //value of a square
//     squareValue = total / (widthSquares * heightSquares);

//     //remap data
//     data.forEach(function (d, i) {
//         d.Count = +d.Count;
//         d.units = Math.floor(d.Count / squareValue);
//         var perc = (d.Count / squareValue).toFixed(2);
//         theData = theData.concat(
//             Array(d.units + 1).join(1).split('').map(function () {
//                 return {
//                     squareValue: squareValue,
//                     units: d.units,
//                     population: d.Count,
//                     groupIndex: i
//                 };
//             })
//         );
//     });

//     widthWaffle = (squareSize * widthSquares) + widthSquares * gap + 25;
//     heightWaffle = (squareSize * heightSquares) + heightSquares * gap + 25;

//     var waffle2 = d3.select("#task5-2")
//         .append("svg")
//         .attr("width", widthWaffle)
//         .attr("height", heightWaffle)
//         .append("g")
//         .selectAll("div")
//         .data(theData)
//         .enter()
//         .append("rect")
//         .attr("width", squareSize)
//         .attr("height", squareSize)
//         //   .attr('title', d.Neighborhood)
//         .attr("fill", function (d) {
//             return color(d.groupIndex);
//         })
//         .attr("x", function (d, i) {
//             //group n squares for column
//             col = Math.floor(i / heightSquares);
//             return (col * squareSize) + (col * gap);
//         })
//         .attr("y", function (d, i) {
//             row = i % heightSquares;
//             return (heightSquares * squareSize) - ((row * squareSize) + (row * gap))
//         })
//         .append("title")
//         .text(function (d, i) {
//             return "Tree type: " + data[d.groupIndex].Name + "; \nAbundance: " + data[d.groupIndex].Count + "; \nPercentage: " + d.units + "%"
//         });

// });


// // ------ Centro -------

// d3.csv("./data/CentroWaffle.csv", function (error, data) {
//     //total
//     total = d3.sum(data, function (d) { return d.Count; });

//     //value of a square
//     squareValue = total / (widthSquares * heightSquares);

//     //remap data
//     data.forEach(function (d, i) {
//         d.Count = +d.Count;
//         d.units = Math.floor(d.Count / squareValue);
//         var perc = (d.Count / squareValue).toFixed(2);
//         theData = theData.concat(
//             Array(d.units + 1).join(1).split('').map(function () {
//                 return {
//                     squareValue: squareValue,
//                     units: d.units,
//                     population: d.Count,
//                     groupIndex: i
//                 };
//             })
//         );
//     });

//     widthWaffle = (squareSize * widthSquares) + widthSquares * gap + 25;
//     heightWaffle = (squareSize * heightSquares) + heightSquares * gap + 25;

//     var waffle3 = d3.select("#task5-3")
//         .append("svg")
//         .attr("width", widthWaffle)
//         .attr("height", heightWaffle)
//         .append("g")
//         .selectAll("div")
//         .data(theData)
//         .enter()
//         .append("rect")
//         .attr("width", squareSize)
//         .attr("height", squareSize)
//         //   .attr('title', d.Neighborhood)
//         .attr("fill", function (d) {
//             return color(d.groupIndex);
//         })
//         .attr("x", function (d, i) {
//             //group n squares for column
//             col = Math.floor(i / heightSquares);
//             return (col * squareSize) + (col * gap);
//         })
//         .attr("y", function (d, i) {
//             row = i % heightSquares;
//             return (heightSquares * squareSize) - ((row * squareSize) + (row * gap))
//         })
//         .append("title")
//         .text(function (d, i) {
//             return "Tree type: " + data[d.groupIndex].Name + "; \nAbundance: " + data[d.groupIndex].Count + "; \nPercentage: " + d.units + "%"
//         });

// });


//                     // ------ Gardolo -------

// d3.csv("./data/GardoloWaffle.csv", function (error, data) {
//     //total
//     total = d3.sum(data, function (d) { return d.Count; });

//     //value of a square
//     squareValue = total / (widthSquares * heightSquares);

//     //remap data
//     data.forEach(function (d, i) {
//         d.Count = +d.Count;
//         d.units = Math.floor(d.Count / squareValue);
//         var perc = (d.Count / squareValue).toFixed(2);
//         theData = theData.concat(
//             Array(d.units + 1).join(1).split('').map(function () {
//                 return {
//                     squareValue: squareValue,
//                     units: d.units,
//                     population: d.Count,
//                     groupIndex: i
//                 };
//             })
//         );
//     });

//     widthWaffle = (squareSize * widthSquares) + widthSquares * gap + 25;
//     heightWaffle = (squareSize * heightSquares) + heightSquares * gap + 25;

//     var waffle3 = d3.select("#task5-4")
//         .append("svg")
//         .attr("width", widthWaffle)
//         .attr("height", heightWaffle)
//         .append("g")
//         .selectAll("div")
//         .data(theData)
//         .enter()
//         .append("rect")
//         .attr("width", squareSize)
//         .attr("height", squareSize)
//         //   .attr('title', d.Neighborhood)
//         .attr("fill", function (d) {
//             return color(d.groupIndex);
//         })
//         .attr("x", function (d, i) {
//             //group n squares for column
//             col = Math.floor(i / heightSquares);
//             return (col * squareSize) + (col * gap);
//         })
//         .attr("y", function (d, i) {
//             row = i % heightSquares;
//             return (heightSquares * squareSize) - ((row * squareSize) + (row * gap))
//         })
//         .append("title")
//         .text(function (d, i) {
//             return "Tree type: " + data[d.groupIndex].Name + "; \nAbundance: " + data[d.groupIndex].Count + "; \nPercentage: " + d.units + "%"
//         });

// });