// data list variable
var allData = [];

$(document).ready(function() {
    getData();

    // event listener
    $('#selDataset').change(function() {
        parseData();
    });
});

function getData() {
    d3.json("samples.json").then((data) => {
        // save data to data list variable
        allData = data;

        filters(data);
        parseData();
    });
}

//make filter
function filters(data) {

    data.names.forEach(function(val) {
        var newOption = `<option>${val}</option>`;
        $('#selDataset').append(newOption);
    });
}

// separate data
function parseData() {

    var sample = parseInt($("#selDataset").val());

    var metaData = allData.metadata.filter(x => x.id === sample)[0];

    var sampleData = allData.samples.filter(y => y.id == sample)[0];

    chart(metaData);
    makePlots(sampleData, metaData);
}

// metadata chart
function chart(metaData) {
    // clear and replace
    $("#sample_metadata").empty();

    Object.entries(metaData).forEach(function(value, index) {
        var entry = `<span><b>${value[0]}:</b> ${value[1]}</span><br>`;
        $("#sample_metadata").append(entry);
    });
}

// get the specific plots the data they need
function makePlots(sampleData, metaData) {
    $('#plots').show();

    bar(sampleData);
    bubble(sampleData);
    gauge(metaData);
}

//bar chart
function bar(sampleData) {

    var y_labels = sampleData.otu_ids.slice(0, 10).reverse().map(x => `OTU ID: ${x}`);
    var trace = {
        x: sampleData.sample_values.slice(0, 10).reverse(),
        y: y_labels,
        text: sampleData.otu_labels.slice(0, 10).reverse(),
        marker: {
            color: 'green'
        },
        type: 'bar',
        orientation: "h"
    };

    var layout = {
        title: "Top 10 OTUs Found in Individual's Belly Button",
        xaxis: { title: "Amount of Bacteria" },
        yaxis: { title: "Bacteria ID" }
    }

    var traces = [trace];

    Plotly.newPlot('bar', traces, layout);
}

// bubble plot
function bubble(sampleData) {

    var trace = {
        x: sampleData.otu_ids,
        y: sampleData.sample_values,
        mode: 'markers',
        marker: {
            size: sampleData.sample_values,
            color: sampleData.otu_ids
        },
        text: sampleData.otu_labels
    };

    var traces = [trace];

    var layout = {
        title: "Amount of Bacteria Present in Subject Belly Button",
        xaxis: { title: "Bacteria ID" },
        yaxis: { title: "Amount of Bacteria" }
    }

    Plotly.newPlot('bubble', traces, layout);
}

// gauge chart
function gauge(metaData) {

    var max_wfreq = 10;

    var trace = {
        domain: { x: [0, 1], y: [0, 1] },
        value: metaData.wfreq,
        title: { text: "Belly Button Washing Frequency" },
        type: "indicator",
        gauge: {
            axis: { range: [null, max_wfreq] },
            steps: [
                { range: [0, 7], color: "lightgray" },
                { range: [7, 10], color: "gray" }
            ],
            threshold: {
                line: { color: "red", width: 4 },
                thickness: 0.75,
                value: metaData.wfreq
            }
        },
        mode: "gauge+number"
    };
    var traces = [trace];

    var layout = {}
    Plotly.newPlot('gauge', traces, layout);
}