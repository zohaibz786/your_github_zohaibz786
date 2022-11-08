function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}


function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
      // 2. Use d3.json to load and retrieve the samples.json file 
      d3.json("samples.json").then((data) => {
      // 3. Create a variable that holds the samples array. 
      var samples = data.samples;
      // Create a variable that holds the metadata array
      var metadata = data.metadata;
      // 4. Create a variable that filters the samples for the object with the desired sample number.
      var sampleArray = samples.filter(item => item.id == sample);
      // Create a variable that filters the metadata array for the object with the desired sample number.
      var metadata_filtered = metadata.filter(item => item.id == sample);
      //  5. Create a variable that holds the first sample in the array.
      var first_sample = sampleArray[0];
      // Create a variable that holds the first sample in the metadata array.
      var first_meta = metadata_filtered[0];
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      var ids = first_sample.otu_ids;
      var labels = first_sample.otu_labels;
      var values = first_sample.sample_values;
      // Create a variable that holds the washing frequency.
      var washingFreq = parseFloat(first_meta.wfreq);
      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 
  
      var yticks = ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse()
  
      // 8. Create the trace for the bar chart. 
      var barData = [
        {
          y:yticks,
          x:values.slice(0,10).reverse(),
          text:labels.slice(0,10).reverse(),
          type:"bar",
          marker: {color: 'rgb(245, 167, 66)'},
          orientation:"h",
        }
      ];
      // 9. Create the layout for the bar chart. 
      var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        margin: { t: 30, l: 150 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
      };
      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", barData, barLayout);
  
      // -----------------------------------
      // Bar and Bubble charts
      // -----------------------------------
  
      // 1. Create the trace for the bubble chart.
      var bubbleData = [
        {
          x: ids,
          y: values,
          text: labels,
          mode: 'markers',
          marker: {
            color: ids,
            size: values,
            }
        }
      ];
  
      // 2. Create the layout for the bubble chart.
      var bubbleLayout = {
        title: 'Bacteria Cultures per Sample',
        //margin: { t: 0 },
        xaxis: { title: "OTU ID" },
        showlegend: false,
        hovermode: "closest", 
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'  
      };

      Plotly.newPlot("bubble", bubbleData, bubbleLayout);

      //---------------------------------
      // GAUGE CHART
      //---------------------------------

      // 4. Create the trace for the gauge chart.
      var gaugeData = [{
        value: washingFreq,
        title: {text: "Belly Button Washing Frequency<br>Scrubs per Week"},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {range: [0,10]},
          bar: { color: "black" },
          steps: [
            {range: [0,2], color:"#ea2c2c"},
            {range: [2,4], color:"#ea822c"},
            {range: [4,6], color:"#ee9c00"},
            {range: [6,8], color:"#eecc00"},
            {range: [8,10], color:"#d4ee00"}
          ]
        }
      }
      ];
      
      // 5. Create the layout for the gauge chart.
      var gaugeLayout = { 
        width: 600, height: 450, margin: {t: 0, b: 0},
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
      };

      // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
};

// Initialize the dashboard
init();
