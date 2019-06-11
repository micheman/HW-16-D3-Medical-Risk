// @TODO: YOUR CODE HERE!

do { // create SVG wrapper
    var svgWidth = 950;
    var svgHeight = 500;

    var margin = {
        top: 20,
        right: 40,
        bottom: 60,
        left: 100
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    var svg = d3.select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
} while (false);

d3.csv("data.csv").then(function(csvdata) {
    console.log(csvdata);
    csvdata.forEach(row => {
        row.age = +row.age;
        row.smokes = +row.smokes;
    });
    var xLinearScale = d3.scaleLinear() // create X & Y axis scales
        .domain([d3.min(csvdata,d=>d.age)*.95,d3.max(csvdata,d=>d.age)*1.05])
        .range([0,width]);
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(csvdata,d=>d.smokes)*.95,d3.max(csvdata,d=>d.smokes)*1.05])
        .range([height,0]);

    // next create the axes themselves
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // appply the aexs tothe chart as per Hair step 4
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    chartGroup.append("g") // why no attr(transform etc) here?
        .call(leftAxis);

    // make the circles array
    var circlesGroup = chartGroup.selectAll("circles")
        .data(csvdata)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.age))
        .attr("cy", d => yLinearScale(d.smokes))
        .attr("r", "15")
        // .text(function(d) {return d.abbr})
        .attr("fill", "blue")
        .attr("opacity", ".3")
        .append("text")
        .text(d => {return d.abbr});

    // set up the axis labels...
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height/2))
        .attr("dy", "1em")
        .attr("class", "axistext")
        .text("Percent Smokers");

    chartGroup.append("text")
        .attr("transform", `translate(${width/2}, ${height+margin.top+30})`)
        .attr("class", "axisText")
        .text("Age (Years)");

        // Do the tooltips next: why dont they work?
        // And it does nto matter where I put the circle text abbrev code,
        // but it always shuts oftf the tooltips.
    

        var circlesTextGroup = chartGroup.selectAll("circletext")
        .data(csvdata)
        .enter()
        .append("text")
        .attr("x", (d => xLinearScale(d.age)    - 11 )) // x & y adjustments to
        .attr("y", (d => yLinearScale(d.smokes) + 7 ))  // properly place abbr text
        .attr("color", "white")
        // .text(function(d) {return d.abbr})
        .text(d => {return d.abbr});
        


    var toolTip = d3.tip() // by iteslf, does nothing
        .attr("class", "tooltip") // w/o the other TT steps
        // .offset([80,-60]) // a bad placement
        .offset([0,40]) // so try this
        .html(function(d) {
            return (`${d.state}<br>Age: ${d.age}<br>Smokers(%): ${d.smokes}`);
        });
    // next put the TT into the chart
    // circlesGroup.call(toolTip);
    circlesTextGroup.call(toolTip);
    // event listners will on/off TT on mouse position...
    // circlesGroup.on("click", function(data) {
    circlesTextGroup.on("click", function(data) {
        toolTip.show(data, this);
    })
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

    // This places the state abbreviation


});
