// set the dimensions and margins of the graph
const margin = {top: 10, right: 60, bottom: 30, left: 35},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",`translate(${margin.left},${margin.top})`);


//Read the data
d3.csv("https://raw.githubusercontent.com/jeh027/Project-3-Interactive-Visualization/main/cleaned-owid-energy-data.csv").then(function(data) {

    // List of groups (here I have one group per column)
    const dataFilter = data.map(function(d){return d.country})
    const menu = new Set(dataFilter)

    // add the options to the button
    d3.select("#selectButton")
      .selectAll('myOptions')
      .data(menu)
      .enter()
      .append('option')
      .text(d => d) // text showed in the menu
      .attr("value", d => d) // corresponding value returned by the button

    let countryFilter = data.filter(function(d) {return d.country == 'Africa'}).slice(0, 38)

    let max_value = Math.max(...countryFilter.map(function(d){return parseInt(d.fossil_fuel_consumption)}))
    // let max_x = Math.ceil(max_value / (10 ** (max_value.toString().length - 1))) * (10 ** (max_value.toString().length - 1))

    d3.select("#selectButton").on("change", function() {
        // recover the option that has been chosen
        let selectedOption = d3.select(this).property("value")
        update(selectedOption)
    })

    // Add X axis --> it is a date format
    const x = d3.scaleLinear()
      .domain([1965, 2022])
      .range([0, width]);

    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x)
        .tickFormat(d3.format("~f"))); // removes the comma delimiter for thousands

    // Add Y axis
    let y = d3.scaleLinear()
      .domain([0, max_value])
      .range([height, 0]);
      
    svg.append("g")
      .call(d3.axisLeft(y));

    // // Function to update the y-axis
    // function updateYAxis(newDomain) {
    //     y = d3.scaleLinear().domain(newDomain).range([height, 0]);

    //     const yAxisGroup = d3.select('svg g');

    //     const newYAxis = d3.axisLeft(y);

    //     yAxisGroup
    //     .transition()
    //     .duration(500)
    //     .call(newYAxis);
    // }

    // Initialize line with group a
    const line = svg
      .append('g')
      .append("path")
      .datum(countryFilter)
      .attr("d", d3.line()
        .x(d => x(+parseInt(d.year)))
        .y(d => y(+parseFloat(d.fossil_fuel_consumption))))
      .attr("stroke", "black")
      .style("stroke-width", 2)
      .style("fill", "none")

    // Initialize dots with group a
    const dot = svg
      .selectAll('circle')
      .data(countryFilter)
      .join('circle')
      .attr("cx", d => x(+parseInt(d.year)))
      .attr("cy", d => y(+parseFloat(d.fossil_fuel_consumption)))
      .attr("r", 3)
      .style("fill", "#104e8b")


    // A function that update the chart
    function update(selectedGroup) {

      // Create new data with the selection
      let dataFilter = data.filter(function(d) {return d.country == selectedGroup}).slice(0, 38)

    //   max_value = Math.max(...dataFilter.map(function(d){return parseInt(d.fossil_fuel_consumption)}))
    // //   max_x = Math.ceil(max_value / (10 ** (max_value.toString().length - 1))) * (10 ** (max_value.toString().length - 1)) // clean this up later
    //   console.log(max_value);

    //   updateYAxis([0, max_value])

      // Give these new data to update line
      line
          .datum(dataFilter)
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(d => x(+parseInt(d.year)))
            .y(d => y(+parseFloat(d.fossil_fuel_consumption)))
          )
      dot
        .data(dataFilter)
        .transition()
        .duration(1000)
          .attr("cx", d => x(+parseInt(d.year)))
          .attr("cy", d => y(+parseFloat(d.fossil_fuel_consumption)))
    }
})