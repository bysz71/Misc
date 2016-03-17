function getChartingOptions(view) {
	var chartingOptions = {};
	chartingOptions.chart = {};
	chartingOptions.chart.renderTo = view.chart.renderTo || "highchartContainer";
	chartingOptions.title = { text: view.title || "" };
	chartingOptions.subtitle = { text: view.subtitle || "" };
	chartingOptions.xAxis = { categories: [] };
	chartingOptions.yAxis = {};
	chartingOptions.tooltip = {};
	chartingOptions.plotOptions = {};
	chartingOptions.legend = { title: {} };
	chartingOptions.series = [];
	chartingOptions.exporting = { enabled: false };

    var rawChartTypes = view.object_data.cdata.cvd.Galleries;
	var rawValues = view.object_data.cdata.cvd.ValueList;
	var rawLegendHeaders = view.object_data.cdata.cvd.XAxisDimensions;
	var rawLegends = view.object_data.cdata.cvd.XAxisList;
	var rawCateHeaders = view.object_data.cdata.cvd.YAxisDimensions;
	var rawCates = view.object_data.cdata.cvd.YAxisList;

	for (var i = 0; i < rawValues.length; i++) {
		for (var j = 0; j < rawValues[i].length; j++) {
			if (!(j in chartingOptions.series))
				chartingOptions.series[j] = { data: [] };
			chartingOptions.series[j].data.push(rawValues[i][j]);
		}
	}

	chartingOptions.legend.title.text = rawLegendHeaders.join(" ");

	setChartTypes(rawChartTypes);

	for (var i = 0; i < rawLegends.length; i++) {
		chartingOptions.series[i].name = rawLegends[i].join("-");
	}

	var temp;
	for (var i = 0; i < rawCates.length; i++) {
		temp = chartingOptions.xAxis.categories;
		for (var j = 0; j < rawCates[i].length; j++) {
			if (!cateContains(temp, rawCates[i][j])) {
				if (j < rawCates[i].length - 1) {
					temp.push({
						name: rawCates[i][j],
						categories: []
					});
				} else {
					temp.push(rawCates[i][j]);
				}
			}
			if (j < rawCates[i].length - 1)
				temp = temp[temp.length - 1].categories;
		}
	}

	return chartingOptions;

	////helper functions///////////////////////////////////////////////////////////////////
	function cateContains(arr, str) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] === str || arr[i].name === str)
				return true;
		}
		return false;
	}

	function setChartTypes(types) {
		for (var i = 0; i < types.length; i++) {
			chartingOptions.series[i].type = convertChartType(types[i]).type;
		}
	}

	function convertChartType(type) {
		var result = {type:"", misc:""}
		switch(type) {
			case "Line":
				result.type = "line";
				break;
			case "Bar":
				result.type = "column";
				break;
			case "Area":
				result.type = "area";
				break;
			case "Scatter":
				result.type = "scatter";
				break;
			case "Pie":
				result.type = "pie";
				break;
			case "Curve":
				result.type = "spline";
				break;
			case "Pareto":
				result.type = "column";
				result.misc = "pareto";
				break;
			case "Step":
				console.log("error: 'step' type not supported");
				result.type = "column";
				break;
			case "Radar":
				result.type = "line";
				result.misc = "radar";
				break;
			case "Cube":
				result.type = "scatter";
				result.misc = "cube";
				break;
			case "Doughnut":
				result.type = "pie";
				result.misc = "donut";
				break;
			case "Pyramid":
				result.type = "pyramid";
				break;
			case "Area Curve":
				result.type = "areaspline";
				break;
			case "Gantt":
				result.type = "bar";
				break;
			default:
				result.type = "column";
				break;
		}
		return result;
    }
}
