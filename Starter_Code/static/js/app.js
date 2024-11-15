// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Filter the metadata for the object with the desired sample number
    let metadata = data.metadata.filter(meta => meta.id === +sample)[0];

    // Select the panel with id `#sample-metadata`
    let metadataPanel = d3.select("#sample-metadata");

    // Clear any existing metadata
    metadataPanel.html("");

    // Loop through the metadata and append new tags for each key-value pair
    Object.entries(metadata).forEach(([key, value]) => {
      metadataPanel.append("p").text(`${key}: ${value}`);
    });
  });
}

// Function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the samples field and filter for the desired sample
    let sampleData = data.samples.filter(s => s.id === sample)[0];

    // Extract the otu_ids, otu_labels, and sample_values
    let otu_ids = sampleData.otu_ids;
    let otu_labels = sampleData.otu_labels;
    let sample_values = sampleData.sample_values;

    // Build a Bubble Chart
    let bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    };

    let bubbleLayout = {
      title: "OTU Abundance",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" }
    };

    Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);

    // For the Bar Chart, get the top 10 OTUs, then reverse for plotting
    let yticks = otu_ids.slice(0, 10).map(otu => `OTU ${otu}`).reverse();
    let barValues = sample_values.slice(0, 10).reverse();
    let barLabels = otu_labels.slice(0, 10).reverse();

    let barTrace = {
      x: barValues,
      y: yticks,
      text: barLabels,
      type: "bar",
      orientation: "h"
    };

    let barLayout = {
      title: "Top 10 OTUs"
    };

    Plotly.newPlot("bar", [barTrace], barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the names field from the data for dropdown options
    let sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Populate the dropdown options
    sampleNames.forEach((name) => {
      dropdown.append("option").text(name).property("value", name);
    });

    // Get the first sample from the list
    let firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
