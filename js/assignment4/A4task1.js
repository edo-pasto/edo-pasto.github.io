// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 50},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg1 = d3.select("#A4task1")
    .append("svg")
    .attr('id', 'SVG_ID_A4T1')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
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
            .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0))
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(90)")
            .style("text-anchor", "start");

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([d3.min(data, d => d.min), d3.max(data, d => d.max)])
            .range([height, 0]);
        svg1.append("g")
            .attr("transform", "translate(-5,0)")
            .call(d3.axisLeft(y).tickSizeOuter(0));

        // // Add the area
        // svg.append("path")
        //   .datum(data)
        //   .attr("fill", "#69b3a2")
        //   .attr("fill-opacity", .3)
        //   .attr("stroke", "none")
        //   .attr("d", d3.area()
        //     .x(function(d) { return x(d.date) })
        //     .y0( height )
        //     .y1(function(d) { return y(d.value) })
        //     )

        // Add the line- Drawing the maximum
        svg1.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#69b3a2")
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
            .attr("stroke", "blue")
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
        // svg1.selectAll("myCircles")
        //     .data(data)
        //     .enter()
        //     .append("circle")
        //     .attr("fill", "red")
        //     .attr("stroke", "none")
        //     .attr("cx", function (d) {
        //         return x(d.month)
        //     })
        //     .attr("cy", function (d) {
        //         return y(d.mean)
        //     })
        //     .attr("r", 3)
        //
        svg1.selectAll("myCircles")
            .data(data)
            .enter()
            .append("circle")
            .attr("fill", "red")
            .attr("stroke", "none")
            .attr("cx", function (d) {
                return x(d.month)
            })
            .attr("cy", function (d) {
                return y(d.mean)
            })
            .attr("r", 3)


        // svg1.append('g')
        //     .selectAll("dot")
        //     .data(data)
        //     .enter()
        //     .append("circle")
        //     .attr("class", function (d) {
        //         return "dot " + d.year
        //     })
        //     .attr("cx", function (d) {
        //
        //         return x(d.month);
        //     })
        //     .attr("cy", function (d) {
        //         return y(d.mean);
        //     })
        //     .attr("r", 3)
        //     .style("fill", 'green');

    });


d3.select("#yearsA4T1").on("change", function () {

    let selectedYear = this.value
    var margin = {top: 10, right: 30, bottom: 30, left: 50},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    d3.select("#SVG_ID_A4T1").remove()
    // append the svg object to the body of the page
    var svg1 = d3.select("#A4task1")
        .append("svg")
        .attr('id', 'SVG_ID_A4T1')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
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

                .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0))   .selectAll("text")
                .attr("y", 0)
                .attr("x", 9)
                .attr("dy", ".35em")
                .attr("transform", "rotate(90)")
                .style("text-anchor", "start");;

            // Add Y axis
            var y = d3.scaleLinear()
                .domain([d3.min(data, d => d.min), d3.max(data, d => d.max)])
                .range([height, 0]);
            svg1.append("g")
                .attr("transform", "translate(-5,0)")
                .call(d3.axisLeft(y).tickSizeOuter(0));

            // // Add the area
            // svg.append("path")
            //   .datum(data)
            //   .attr("fill", "#69b3a2")
            //   .attr("fill-opacity", .3)
            //   .attr("stroke", "none")
            //   .attr("d", d3.area()
            //     .x(function(d) { return x(d.date) })
            //     .y0( height )
            //     .y1(function(d) { return y(d.value) })
            //     )

            // Add the line- Drawing the maximum
            svg1.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", "#69b3a2")
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
                .attr("stroke", "blue")
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
            // svg1.selectAll("myCircles")
            //     .data(data)
            //     .enter()
            //     .append("circle")
            //     .attr("fill", "red")
            //     .attr("stroke", "none")
            //     .attr("cx", function (d) {
            //         return x(d.month)
            //     })
            //     .attr("cy", function (d) {
            //         return y(d.mean)
            //     })
            //     .attr("r", 3)
            //
            svg1.selectAll("myCircles")
                .data(data)
                .enter()
                .append("circle")
                .attr("fill", "red")
                .attr("stroke", "none")
                .attr("cx", function (d) {
                    return x(d.month)
                })
                .attr("cy", function (d) {
                    return y(d.mean)
                })
                .attr("r", 3)

        });

});

