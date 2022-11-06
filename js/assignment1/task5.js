
var total = 0;
var widthWaffle,
    heightWaffle,
    widthSquares = 10,
    heightSquares = 10,
    squareSize = 25,
    squareValue = 0,
    gap = 1;

// var color = d3.scaleOrdinal(d3.schemeCategory10);



neighborhoods = {
    'ARGENTARIO': 1,
    'BONDONE': 2,
    'CENTRO STORICO PIEDICASTELLO': 3,
    'GARDOLO': 4,
    'MATTARELLO': 5,
    'MEANO': 6,
    'OLTREFERSINA': 7,
    'POVO': 8,
    'RAVINA-ROMAGNANO': 9,
    'S.GIUSEPPE-S.CHIARA': 10,
    'SARDAGNA': 11,
    'VILLAZZANO': 12,
}

color_map = {
    'Celtis australis': 0,
    'Aesculus hippocastanum': 1,
    'Carpinus betulus': 2,
    'Tilia cordata': 3,
    'Platanus x hispanica': 4,
    'Other': 5
}
let subgroups = ["Celtis australis","Aesculus hippocastanum","Carpinus betulus","Tilia cordata","Platanus x hispanica","Other"]
var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#adb5bd', '#3c51ae','#4daf4a', '#ffbcd9', '#ffd43b', '#e41a1c' ])

tree_map = {
    0: 'Celtis australis',
    1: 'Aesculus hippocastanum',
    2: 'Carpinus betulus',
    3: 'Tilia cordata',
    4: 'Platanus x hispanica',
    5: 'Other',
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
            d.units = Math.round(d.Count / squareValue);
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

        if (theData.length < 100) {
            for (let i=0; i<100-theData.length; i++) {
                theData = theData.slice(0, 1).concat(theData)
            }
        }

        theData = theData.slice(0,100)
    
        widthWaffle = (squareSize * widthSquares) + widthSquares * gap + 25;
        heightWaffle = (squareSize * heightSquares) + heightSquares * gap + 25;

        let waffle = d3.select(`#task5-${neighborhoods[data[0]['Neighborhood']]}`)
        let svg5 = waffle.append("svg")
            .attr("viewBox", `0 0 ${widthWaffle} ${heightWaffle}`)
            .attr("width", widthWaffle * 2)
            .attr("height", heightWaffle * 2)
            .append("g")
            .attr("transform", `translate(${squareSize / 2},0)`)
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
            })
    });

}


d3.csv(`../../data/single_neighborhood/top_trees_ARGENTARIO.csv`, function (err, data) {

    //add legend with categorical data
    var legend = d3.select("#waffle_legend")
        .append("svg")
        // .attr("viewBox", `0 0 50 50`)
        .attr('width', 300)
        .attr('height', 200)
        .append('g')
        .attr("transform", `translate(50,0)`)
        .selectAll("div")
        .data(data)
        .enter()
        .append("g")
        .attr('transform', function (d, i) { return "translate(0," + i * 30 + ")"; });

    legend.append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", function (d, i) { return color(color_map[d.Name]) });

    legend.append("text")
        .attr("x", 25)
        .attr("y", 15)
    .text(function (d, i) { return d.Name });

    //add value of a unit square
    var legend2 = d3.select("#waffle_legend")
        .select('svg')
        .append('g')
        .attr('transform', "translate(100,0)");

    legend2.append("text")
        .attr('y', '15')
        .attr('font-size', '20px')
        // .text("Total: " + total)
        .attr("fill", "#444444");

});


