var margin3 = {top: 30, right: 0, bottom: 150, left: 110},
    width3 = 500 - margin3.left - margin3.right,
    height3 = 500 - margin3.top - margin3.bottom;
//Read the data
d3.csv("../../data/top_6_treesMeasuresSmallMulti.csv", function (data) {

    data.forEach(function (d) {
        d['Height (m)'] = parseFloat(d['Height (m)']);
        d['Gross Carbon Sequestration (eur/yr)'] = parseFloat(d['Gross Carbon Sequestration (eur/yr)']);
        d['Gross Carbon Sequestration (kg/yr)'] = parseFloat(d['Gross Carbon Sequestration (kg/yr)']);
        d['Canopy Cover (m2)'] = parseFloat(d['Canopy Cover (m2)']);
    });
    // group the data: I want to draw one line per group
    var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function (d) {
            return d.Name;
        })
        .entries(data);
    allKeys = sumstat.map(function (d) {
        return d.key
    })
// let numbers = {numb: ['0','1','2','3','4','5']};
let numbers = ['0','1','2','3','4','5']

function returnID(i) {
  return i;
}
    // Add an svg element for each group. The will be one beside each other and will go on the next row when no more room available
    var svg4 = d3.select("#A2task4")
        
        .selectAll("dot")
        .data(sumstat)
        .enter()
        .append("svg")
        .attr('id', `SVG4${numbers.map(returnID)}`)
        // .attr("viewBox", `0 0 1000 500`)
        .attr("width", width3 + margin3.left + margin3.right)
        .attr("height", height3 + margin3.top + margin3.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin3.left + "," + margin3.top + ")");
    // Add X axis
    var x = d3.scaleLinear()
        .range([0, width3])
        .domain(d3.extent(data, function(d) { return d['Height (m)']; })
        );

    svg4
        .append("g")
        .attr("transform", "translate(0," + height3 + ")")
        .call(d3.axisBottom(x))
    // .attr("transform", "translate(-10,0)rotate(-45)")
    // .style("text-anchor", "end");

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return +d['Gross Carbon Sequestration (kg/yr)'];
        })])
        // .domain(data.map(function (d) {
        //   return d['Gross Carbon Sequestration (kg/yr)'];
        // }))
        .range([height3, 0]);

    svg4.append("g")
        .call(d3.axisLeft(y));
    // .selectAll("text")
    // .attr("transform", "translate(-10,0)rotate(-45)")
    // .style("text-anchor", "end");


    // color palette
    // var colorTitles = d3.scaleOrdinal()
    //     .domain(allKeys)
    //     .range(['#ffd43b', '#4daf4a', '#3c51ae', '#adb5bd', '#FFBCD9', '#e41a1c'])

    var colorTitles = d3.scaleOrdinal()
    .domain(['Aesculus hippocastanum', 'Carpinus betulus', 'Celtis australis', 'Platanus x hispanica', 'Tilia cordata', 'Tilia x europaea'])
    .range(["#440154ff", "#21908dff", "#fde725ff", "#f00034", "#52a163", '#acb4bd'])
    // Tooltip for all the bars

    var tooltipA2T4 = d3.select("#A2task4")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "10px")

    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseoverA2T4 = function (d) {
        let treeHeight = d['Height (m)'];
        let Co2Sequestration = d['Gross Carbon Sequestration (kg/yr)']
        let treeType3 = d.Name;
        tooltipA2T4
            .html("Tree Type: " + treeType3 + "<br>" + "Height: " + treeHeight + "<br>" + "C02 Sequestration: " + Co2Sequestration)
            .style("opacity", 1);

    }
    const mousemoveA2T4 = function (d) {
        tooltipA2T4
            .style('left', (event.pageX + 20) + 'px')
            .style('top', (event.pageY + 10) + 'px')

    }
    const mouseleaveA2T4 = function (d) {
        tooltipA2T4
            .style("opacity", 0);
    }

    // create the Bar

    svg4.selectAll("dot")
        .data(function (d) {
            return d.values
        })
        .enter()
        .append("circle")
        .style("fill", function (d, i) {
            return colorTitles(d.Name)
        })
        // .attr("x", function (d, i) { return x(0); })
        // .attr("y", function (d, i) { return y(d.Neighborhood); })
        // .attr("height", y.bandwidth())
        // .attr("width", function (d, i) { return width3 - (width3 - x(d.Count)); })
        .attr("cx", function (d) {
            return x(d['Height (m)']);
        })
        .attr("cy", function (d) {
            return y(d['Gross Carbon Sequestration (kg/yr)']);
        })
        .attr("r", 2.5)
        .on("mouseover", mouseoverA2T4)
        .on("mousemove", mousemoveA2T4)
        .on("mouseleave", mouseleaveA2T4);


    // Add titles
    svg4
        .append("text")
        .attr("text-anchor", "start")
        .attr("y", -5)
        .attr("x", 0)
        .text(function (d) {
            return (d.key)
        })
        .style("fill", function (d) {
            return colorTitles(d.key)
        })

});









d3.select("#treeSizeMeasures_taskA2_4").on("change", function () {
  let selectedText_task4 = this.value
  console.log(selectedText_task4)
  var margin= {top: 30, right: 0, bottom: 150, left: 110},
    width3 = 500 - margin.left - margin.right,
    height3 = 500 - margin.top - margin.bottom;




  d3.csv("../../data/top_6_treesMeasuresSmallMulti.csv", function (data) {
    

  // data.forEach(function (d) {
  //     d3.select(`#SVG4${d.Name}`).remove()
  // });
//   let numbers = ['0','1','2','3','4','5'];

// numbers.forEach(function (i) {
//       d3.select(`#SVG4${i}`).remove()
//   });
d3.select("#SVG4_ID").remove()
    data.forEach(function (d) {
      d[selectedText_task4] = parseFloat(d[selectedText_task4]);
      d['Gross Carbon Sequestration (eur/yr)'] = parseFloat(d['Gross Carbon Sequestration (eur/yr)']);
      d['Gross Carbon Sequestration (kg/yr)'] = parseFloat(d['Gross Carbon Sequestration (kg/yr)']);
      d['Canopy Cover (m2)'] = parseFloat(d['Canopy Cover (m2)']);
  });
  // group the data: I want to draw one line per group
  var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
      .key(function (d) {
          return d.Name;
      })
      .entries(data);
  allKeys = sumstat.map(function (d) {
      return d.key
  })

  // Add an svg element for each group. The will be one beside each other and will go on the next row when no more room available
  var svg4_new = d3.select("#A2task4")
      .selectAll("dot")
      .data(sumstat)
      .enter()
      .append("svg")
      .attr('id', `SVG4_ID`)
      // .attr("viewBox", `0 0 1000 500`)
      .attr("width", width3 + margin3.left + margin3.right)
      .attr("height", height3 + margin3.top + margin3.bottom)
      .append("g")
      .attr("transform",
          "translate(" + margin3.left + "," + margin3.top + ")");

  // Add X axis
  var x = d3.scaleLinear()
      .range([0, width3])
      .domain(d3.extent(data, function(d) { return d[selectedText_task4]; })
      );

  svg4_new
      .append("g")
      .attr("transform", "translate(0," + height3 + ")")
      .call(d3.axisBottom(x))
  // .attr("transform", "translate(-10,0)rotate(-45)")
  // .style("text-anchor", "end");

  // Add Y axis
  var y = d3.scaleLinear()
      .domain([0, d3.max(data, function (d) {
          return +d['Gross Carbon Sequestration (kg/yr)'];
      })])
      // .domain(data.map(function (d) {
      //   return d['Gross Carbon Sequestration (kg/yr)'];
      // }))
      .range([height3, 0]);

  svg4_new.append("g")
      .call(d3.axisLeft(y));
  // .selectAll("text")
  // .attr("transform", "translate(-10,0)rotate(-45)")
  // .style("text-anchor", "end");


  // color palette
  // var colorTitles = d3.scaleOrdinal()
  //     .domain(allKeys)
  //     .range(['#ffd43b', '#4daf4a', '#3c51ae', '#adb5bd', '#FFBCD9', '#e41a1c'])

  var colorTitles = d3.scaleOrdinal()
  .domain(['Aesculus hippocastanum', 'Carpinus betulus', 'Celtis australis', 'Platanus x hispanica', 'Tilia cordata', 'Tilia x europaea'])
  .range(["#440154ff", "#21908dff", "#fde725ff", "#f00034", "#52a163", '#acb4bd'])
  // Tooltip for all the bars

  var tooltipA2T4 = d3.select("#A2task4")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "10px")

  // Three function that change the tooltip when user hover / move / leave a cell
  const mouseoverA2T4 = function (d) {
      let treeMeasure = d[selectedText_task4];
      let Co2Sequestration = d['Gross Carbon Sequestration (kg/yr)']
      let treeType3 = d.Name;
      tooltipA2T4
          .html("Tree Type: " + treeType3 + "<br>" + `${selectedText_task4}` + treeMeasure + "<br>" + "C02 Sequestration: " + Co2Sequestration)
          .style("opacity", 1);

  }
  const mousemoveA2T4 = function (d) {
      tooltipA2T4
          .style('left', (event.pageX + 20) + 'px')
          .style('top', (event.pageY + 10) + 'px')

  }
  const mouseleaveA2T4 = function (d) {
      tooltipA2T4
          .style("opacity", 0);
  }

  // create the Bar

  svg4_new.selectAll("dot")
      .data(function (d) {
          return d.values
      })
      .enter()
      .append("circle")
      .style("fill", function (d, i) {
          return colorTitles(d.Name)
      })
      // .attr("x", function (d, i) { return x(0); })
      // .attr("y", function (d, i) { return y(d.Neighborhood); })
      // .attr("height", y.bandwidth())
      // .attr("width", function (d, i) { return width3 - (width3 - x(d.Count)); })
      .attr("cx", function (d) {
          return x(d[selectedText_task4]);
      })
      .attr("cy", function (d) {
          return y(d['Gross Carbon Sequestration (kg/yr)']);
      })
      .attr("r", 2.5)
      .on("mouseover", mouseoverA2T4)
      .on("mousemove", mousemoveA2T4)
      .on("mouseleave", mouseleaveA2T4);


  // Add titles
  svg4_new
      .append("text")
      .attr("text-anchor", "start")
      .attr("y", -5)
      .attr("x", 0)
      .text(function (d) {
          return (d.key)
      })
      .style("fill", function (d) {
          return colorTitles(d.key)
      })

  });


});