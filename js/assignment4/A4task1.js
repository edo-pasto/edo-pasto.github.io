// set the dimensions and margins of the graph
var margin = { top: 30, right: 80, bottom: 30, left: 50 },
    width = 200 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg1 = d3.select("#A4task1")
    .append("svg")
    .attr('id', 'SVG_ID_A4T1')
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", `0 0 600 400`)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
const categories = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

// const formatMonth = d3.timeFormat('%b');
//Read the data
d3.csv("../../data/temp_data/grouped_cleaned_daily_temp_data.csv",


    // When reading the csv, I must format variables:
    function (d) {
        return {
            year: d.year,
            month: d.month,
            mean: d.mean,
            max: d.max,
            min: d.min
        }
    },

    // Now I can use this dataset:
    function (data) {
        // console.log(data[0])
        // let  categories = ["January","February","March","April","May","June","July","August","September","October","November","December"]

        const selectedYear = 2021;
        data = data.filter(function (row) {
            return row.year == selectedYear;
        });

        data.forEach(function (d) {
            d.mean = parseFloat(d.mean);
            d.max = parseFloat(d.max);
            d.min = parseFloat(d.min);


        });

        // console.log(data)
        //group data based on each month and find max of each month:
        // let byMont = d3.nest()
        //     .key(function(d) { return d.date.getMonth(); })
        //     .entries(data);

        // console.log("ciao", byMont)

        // Keep only the 90 first rows
        // data = data.filter(function (d, i) {
        //     return i < 90
        // })


        // Add X axis --> it is a date format
        var x = d3.scaleBand()
            .domain(categories)
            .range([0, width]);
        svg1.append("g")
            .attr("transform", "translate(0," + (height) + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "translate(-10,0)rotate(45)")
            .style("text-anchor", "start");

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([d3.min(data, d => d.min), d3.max(data, d => d.max)])
            .range([height, 0]);
        svg1.append("g")
            .attr("transform", "translate(-5,0)")
            .call(d3.axisLeft(y).tickSizeOuter(0))

        svg1.append("text")
            .attr("text-anchor", "end")
            .attr("x", 50)
            .attr("y", -10)
            .text("Temperature (°C)")
            .style('font-size', '10px');


        //Tooltip
        var tooltipA4T1 = d3.select("#A4task1")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("font-size", "16px");

        // Three function that change the tooltip when user hover / move / leave a cell
        const mouseoverA4T1_max = function (d) {

            

            tooltipA4T1
                .transition()
                .duration(200)
                .style("opacity", 1)
            tooltipA4T1
                .html("<span style='color:grey'>Year: </span> " + d.year + "<br><span style='color:grey'>Month: </span> " + d.month + "<br><span style='color:grey'>Max Temp (°C): </span>" + d.max)
        }
        let mouseoverA4T1_min = function (d) {

            tooltipA4T1
                .transition()
                .duration(200)
                .style("opacity", 1)
            tooltipA4T1
                .html("<span style='color:grey'>Year: </span> " + d.year + "<br><span style='color:grey'>Month: </span> " + d.month + "<br><span style='color:grey'>Min Temp (°C): </span>" + d.min)
        }
        let mouseoverA4T1_mean = function (d) {

            tooltipA4T1
                .transition()
                .duration(200)
                .style("opacity", 1)
            tooltipA4T1
                .html("<span style='color:grey'>Year: </span> " + d.year + "<br><span style='color:grey'>Month: </span> " + d.month + "<br><span style='color:grey'>Mean Temp (°C): </span>" + d.mean)
        }
        let mousemoveA4T1 = function (d) {
            tooltipA4T1
                .style('left', (event.pageX + 20) + 'px')
                .style('top', (event.pageY + 10) + 'px')

        }
        let mouseleaveA4T1 = function (d) {
            tooltipA4T1
                .transition()
                .duration(200)
                .style("opacity", 0);
        }

        // Add the line- Drawing the maximum
        svg1.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#fd7e14")
            .attr("stroke-width", 4)
            .attr("d", d3.line()
                .x(function (d) {
                    return x(
                        d.month)
                })
                .y(function (d) {
                    return y(d.max)
                })
            )
        // //Drawing minimum
        svg1.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#74c0fc")
            .attr("stroke-width", 4)
            .attr("d", d3.line()
                .x(function (d) {
                    return x(d.month)
                })
                .y(function (d) {
                    return y(d.min)
                })
            )

        // Add dots
        svg1.selectAll("myCircles")
            .data(data)
            .enter()
            .append("circle")
            .attr("fill", "#fd7e14")
            .attr("stroke", "white")
            .attr("cx", function (d) {
                return x(d.month)
            })
            .attr("cy", function (d) {
                return y(d.max)
            })
            .attr("r", 3)
            .on("mouseover", mouseoverA4T1_max)
            .on("mousemove", mousemoveA4T1)
            .on("mouseleave", mouseleaveA4T1);

        svg1.selectAll("myCircles")
            .data(data)
            .enter()
            .append("circle")
            .attr("fill", "#74c0fc")
            .attr("stroke", "white")
            .attr("cx", function (d) {
                return x(d.month)
            })
            .attr("cy", function (d) {
                return y(d.min)
            })
            .attr("r", 3)
            .on("mouseover", mouseoverA4T1_min)
            .on("mousemove", mousemoveA4T1)
            .on("mouseleave", mouseleaveA4T1);


        svg1.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", function (d) {
                return "dot " + d.year
            })
            .attr("cx", function (d) {

                return x(d.month);
            })
            .attr("cy", function (d) {
                return y(d.mean);
            })
            .attr("r", 3)
            .style("fill", 'green')
            .attr('stroke', "white")
            .on("mouseover", mouseoverA4T1_mean)
            .on("mousemove", mousemoveA4T1)
            .on("mouseleave", mouseleaveA4T1);

            let groups = ['Max', 'Mean', 'Min']

        var legend = d3.select("#task1Ass4_legend")
            .append("svg")
            // .attr("viewBox", `0 0 50 50`)
            .attr('width', 300)
            .attr('height', 100)
            .append('g')
            .attr("transform", `translate(50,0)`)
            .selectAll("div")
            .data(groups)
            .enter()
            .append("g")
            .attr('transform', function (d, i) { return "translate(0," + i * 30 + ")"; });

            let color = d3.scaleOrdinal()
            .domain(groups)
            .range(['#fd7e14', 'green', '#74c0fc'])

        legend.append("rect")
            .attr("width", 20)
            .attr("height", 20)
            .style("fill", function (d, i) { return color(i) });
    
        legend.append("text")
            .attr("x", 25)
            .attr("y", 15)
            .text(function (d, i) { return d });
    });


d3.select("#yearsA4T1").on("change", function () {

    let selectedYear = this.value
    var margin = { top: 30, right: 80, bottom: 30, left: 50 },
        width = 580 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    d3.select("#SVG_ID_A4T1").remove()
    // append the svg object to the body of the page
    var svg1 = d3.select("#A4task1")
        .append("svg")
        .attr('id', 'SVG_ID_A4T1')
        .attr("viewBox", `0 0 600 400`)
        // .attr("width", width + margin.left + margin.right)
        // .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    d3.csv("../../data/temp_data/grouped_cleaned_daily_temp_data.csv",

        // When reading the csv, I must format variables:
        function (d) {
            return {
                year: d.year,
                month: d.month,
                mean: d.mean,
                max: d.max,
                min: d.min
            }
        },

        // Now I can use this dataset:
        function (data) {
            // console.log(data[0])
            // let  categories = ["January","February","March","April","May","June","July","August","September","October","November","December"]


            data = data.filter(function (row) {
                return row.year == selectedYear;
            });

            data.forEach(function (d) {
                d.mean = parseFloat(d.mean);
                d.max = parseFloat(d.max);
                d.min = parseFloat(d.min);


            });

            // console.log(data)
            //group data based on each month and find max of each month:
            // let byMont = d3.nest()
            //     .key(function(d) { return d.date.getMonth(); })
            //     .entries(data);

            // console.log("ciao", byMont)

            // Keep only the 90 first rows
            // data = data.filter(function (d, i) {
            //     return i < 90
            // })


            // Add X axis --> it is a date format
            var x = d3.scaleBand()
                .domain(categories)
                .range([0, width]);
            svg1.append("g")
                .attr("transform", "translate(0," + (height) + ")")

                .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0)).selectAll("text")
                .attr("y", 0)
                .attr("x", 9)
                .attr("dy", ".35em")
                .attr("transform", "translate(-10,0)rotate(45)")
                .style("text-anchor", "start");;

            // Add Y axis
            var y = d3.scaleLinear()
                .domain([d3.min(data, d => d.min), d3.max(data, d => d.max)])
                .range([height, 0]);
            svg1.append("g")
                .attr("transform", "translate(-5,0)")
                .call(d3.axisLeft(y).tickSizeOuter(0));

            svg1.append("text")
                .attr("text-anchor", "end")
                .attr("x", 50)
                .attr("y", -10)
                .text("Temperature (°C)")
                .style('font-size', '10px');

            //Tooltip
            var tooltipA4T1 = d3.select("#A4task1")
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "10px")
                .style("font-size", "16px");

            // Three function that change the tooltip when user hover / move / leave a cell
            const mouseoverA4T1_max = function (d) {

                tooltipA4T1
                    .transition()
                    .duration(200)
                    .style("opacity", 1)
                tooltipA4T1
                    .html("<span style='color:grey'>Year: </span> " + d.year + "<br><span style='color:grey'>Month: </span> " + d.month + "<br><span style='color:grey'>Max Temp (°C): </span>" + d.max)
            }
            let mouseoverA4T1_min = function (d) {
                
                tooltipA4T1
                    .transition()
                    .duration(200)
                    .style("opacity", 1)
                tooltipA4T1
                    .html("<span style='color:grey'>Year: </span> " + d.year + "<br><span style='color:grey'>Month: </span> " + d.month + "<br><span style='color:grey'>Min Temp (°C): </span>" + d.min)
            }
            let mouseoverA4T1_mean = function (d) {

                tooltipA4T1
                    .transition()
                    .duration(200)
                    .style("opacity", 1)
                tooltipA4T1
                    .html("<span style='color:grey'>Year: </span> " + d.year + "<br><span style='color:grey'>Month: </span> " + d.month + "<br><span style='color:grey'>Mean Temp (°C): </span>" + d.mean)
            }
            let mousemoveA4T1 = function (d) {
                tooltipA4T1
                    .style('left', (event.pageX + 20) + 'px')
                    .style('top', (event.pageY + 10) + 'px')

            }
            let mouseleaveA4T1 = function (d) {
                tooltipA4T1
                    .transition()
                    .duration(200)
                    .style("opacity", 0);
            }

            // Add the line- Drawing the maximum
            svg1.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", "#fd7e14")
                .attr("stroke-width", 4)
                .attr("d", d3.line()
                    .x(function (d) {
                        return x(
                            d.month)
                    })
                    .y(function (d) {
                        return y(d.max)
                    })
                )
            // //Drawing minimum
            svg1.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", "#74c0fc")
                .attr("stroke-width", 4)
                .attr("d", d3.line()
                    .x(function (d) {
                        return x(d.month)
                    })
                    .y(function (d) {
                        return y(d.min)
                    })
                )

            // Add dots
            svg1.selectAll("myCircles")
                .data(data)
                .enter()
                .append("circle")
                .attr("fill", "#fd7e14")
                .attr('stroke', "white")
                .attr("cx", function (d) {
                    return x(d.month)
                })
                .attr("cy", function (d) {
                    return y(d.max)
                })
                .attr("r", 3)
                .on("mouseover", mouseoverA4T1_max)
                .on("mousemove", mousemoveA4T1)
                .on("mouseleave", mouseleaveA4T1);



            svg1.selectAll("myCircles")
                .data(data)
                .enter()
                .append("circle")
                .attr("fill", "#74c0fc")
                .attr('stroke', "white")
                .attr("cx", function (d) {
                    return x(d.month)
                })
                .attr("cy", function (d) {
                    return y(d.min)
                })
                .attr("r", 3)
                .on("mouseover", mouseoverA4T1_min)
                .on("mousemove", mousemoveA4T1)
                .on("mouseleave", mouseleaveA4T1);


            svg1.append('g')
                .selectAll("dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", function (d) {
                    return "dot " + d.year
                })
                .attr("cx", function (d) {

                    return x(d.month);
                })
                .attr("cy", function (d) {
                    return y(d.mean);
                })
                .attr("r", 3)
                .style("fill", 'green')
                .attr('stroke', "white")
                .on("mouseover", mouseoverA4T1_mean)
                .on("mousemove", mousemoveA4T1)
                .on("mouseleave", mouseleaveA4T1);

        });

});

