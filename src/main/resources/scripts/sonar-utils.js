/*
 * Licensed to Marvelution under one or more contributor license 
 * agreements.  See the NOTICE file distributed with this work 
 * for additional information regarding copyright ownership.
 * Marvelution licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

AJS.$.namespace("AJS.sonar.utils");

/**
 * Translate the measure trend data to a trend image
 * 
 * @param measure the measure containing the trend data
 * @param isSmall flag for small (true) or big (false) images
 * @return the trend image name
 */
AJS.sonar.utils.getTrendImage = function(measure, isSmall) {
	if (measure["trend"] === undefined || measure["var"] === undefined) {
		return "";
	} else if (measure["trend"] === 0 && measure["var"] === 0) {
		return "";
	} else {
		var imageName = "/tendency/" + measure["var"] + "-";
		if (measure["trend"] === 1) {
			imageName = imageName + "green";
		} else {
			imageName = imageName + "black";
		}
		if (isSmall) {
			imageName = imageName + "-small";
		}
		return imageName + ".png";
	}
}

/**
 * Get a Measure from the resource JSON object by the Measure key
 * 
 * @param resource the Resource JSON object
 * @param msrKey the key of the Measure to get
 * @return the Measure of the resource
 */
AJS.sonar.utils.getMeasureFromResource = function(resource, msrKey) {
	for (var index in resource.msr) {
		if (resource.msr[index].key === msrKey) {
			return resource.msr[index];
		}
	}
	return {};
}

/**
 * Get a metric by key from an array of metrics
 * 
 * @param metrics the array of metrics
 * @param metricKey the key of the metric to get
 * @return the metric
 */
AJS.sonar.utils.getMetricFromMetricsArray = function(metrics, metricKey) {
	for (var index in metrics) {
		if (metrics[index].key === metricKey) {
			return metrics[index];
		}
	}
	return {};
}

/**
 * Validate a Metric to see if its a valid one
 * 
 * @param metric the Metric to validate
 * @return <code>true</code> if valid, <code>false</code> otherwise
 */
AJS.sonar.utils.isValidMetric = function(metric) {
	return !(metric != null && metric !== undefined && metric.key !== undefined);
}

/**
 * Validate a Measure to see if its a valid one
 * 
 * @param measure the Measure to validate
 * @return <code>true</code> if valid, <code>false</code> otherwise
 */
AJS.sonar.utils.isValidMeasure = function(measure) {
	return !(measure != null && measure !== undefined && measure.key !== undefined);
}

/**
 * Get all the Metrics used for the Color select box with the treemap
 * 
 * @param metrics Array of all the metrics available
 * @return Array of all color metrics
 */
AJS.sonar.utils.getColorMetrics = function(metrics) {
	var colorMetrics = new Array();
	for(var index in metrics) {
		if (metrics[index].val_type.toUpperCase() === "LEVEL" || metrics[index].val_type.toUpperCase() === "PERCENT") {
			colorMetrics.push(metrics[index]);
		}
	}
	colorMetrics.sort(function(a, b) {
		return (a.name>b.name) - (b.name>a.name);
	});
	return colorMetrics;
}

/**
 * Get all the Metrics used for the Size select box with the treemap
 * 
 * @param metrics Array of all the metrics available
 * @return Array of all size metrics
 */
AJS.sonar.utils.getSizeMetrics = function(metrics) {
	var sizeMetrics = new Array();
	for(var index in metrics) {
		if ((metrics[index].val_type.toUpperCase() === "INT" || metrics[index].val_type.toUpperCase() === "FLOAT"
				|| metrics[index].val_type.toUpperCase() === "MILLISEC")
				&& metrics[index].val_type.toUpperCase() !== "PERCENT" && metrics[index].domain != undefined
				&& metrics[index].domain != null && metrics[index].domain !== "") {
			sizeMetrics.push(metrics[index]);
		}
	}
	sizeMetrics.sort(function(a, b) {
		return (a.name>b.name) - (b.name>a.name);
	});
	return sizeMetrics;
}

/**
 * Get all the Metrics used for the Time Machine
 * 
 * @param metrics Array of all the metrics available
 * @return Array of all time machine metrics
 */
AJS.sonar.utils.getTimeMachineMetrics = function(metrics) {
	var timeMachineMetrics = new Array();
	for(var index in metrics) {
		if ((metrics[index].val_type.toUpperCase() === "INT" || metrics[index].val_type.toUpperCase() === "FLOAT"
				|| metrics[index].val_type.toUpperCase() === "PERCENT"
				|| metrics[index].val_type.toUpperCase() === "MILLISEC"
				|| metrics[index].val_type.toUpperCase() === "RATING")) {
			timeMachineMetrics.push(metrics[index]);
		}
	}
	return timeMachineMetrics;
}

/**
 * Create a Select element for Metrics
 * 
 * @param name the name of the select element
 * @param id the id of the select element
 * @param options the Metric options
 * @param selected the selected metric key
 * @param onChange function to bind to the onChange event of the select element
 * @return the select element
 */
AJS.sonar.utils.createMetricSelectElement = function(name, id, options, selected, onChange) {
	var select = AJS.$("<select/>").attr({
		name: name,
		id: id
	});
	AJS.$(options).each(function(index, option) {
		AJS.$("<option/>").attr({
			value: option.key,
			selected: (option.key == selected)
		}).text(option.name).appendTo(select);
	});
	if (onChange != undefined && onChange != null) {
		select.change(onChange);
	}
	return select;
}

/**
 * Generate a random number between 0 and 1000
 * 
 * @return the generated random number
 */
AJS.sonar.utils.randomNumber = function() {
	return Math.ceil((Math.random() * 1000));
}

/**
 * Get percentage
 * 
 * @param number the ammount to get the percentage for
 * @param totalNumber the total ammount
 * @param the percentage
 */
AJS.sonar.utils.getPercentage = function(number, totalNumber) {
	return Math.ceil((number / totalNumber) * 100);
}

/**
 * Generate the Error messages box
 * 
 * @param errors the array of i18n error keys
 * @return the error messages div
 */
AJS.sonar.utils.generateErrorMessageBox = function(errors) {
	var errorDiv = AJS.$("<div/>").addClass("empty-results");
	var errorList = AJS.$("<ul/>").addClass("styleless-list");
	AJS.$.each(errors, function (i, error) {
		errorList.append(AJS.$("<li/>").text(error));
	});
	errorList.appendTo(errorDiv);
	return errorDiv;
}

/**
 * Convert a RGB color code to Hex color Code
 * 
 * @param red
 * @param green
 * @param blue
 * @return hex color code
 */
AJS.sonar.utils.rgbToHex = function(red, green, blue) {
	return AJS.sonar.utils.toHex(red) + AJS.sonar.utils.toHex(green) + AJS.sonar.utils.toHex(blue);
}

/**
 * Convert a number to hex number
 * 
 * @param number the number to convert
 * @return the hex number
 */
AJS.sonar.utils.toHex = function(number) {
	if (number == null) {
		return "00";
	}
	number = parseInt(number);
	if (number == 0 || isNaN(number)) {
		return "00";
	}
	number = Math.max(0, number);
	number = Math.min(number, 255);
	number = Math.round(number);
	return "0123456789ABCDEF".charAt((number - number % 16) / 16) + "0123456789ABCDEF".charAt(number % 16);
}

/**
 * Mix two colors
 * 
 * @param color the main color
 * @param mask the masking color
 * @param opacity the opacity of the masking color
 * @return the masked color
 */
AJS.sonar.utils.mixColors = function(color, mask, opacity) {
	var newColor = {r: 0, g: 0, b: 0};
	opacity /= 100.0;
	newColor.r = Math.round((color.r * opacity) + (mask.r * (1 - opacity)));
	newColor.g = Math.round((color.g * opacity) + (mask.g * (1 - opacity)));
	newColor.b = Math.round((color.b * opacity) + (mask.b * (1 - opacity)));
	return newColor;
}

/**
 * Convert a ISO 8601 Date to a Date
 * 
 * @param isostr the ISO String to convert
 * @return the new Date
 */
AJS.sonar.utils.dateFromISO8601 = function(isostr) {
	var parts = isostr.match(/\d+/g);
	var months = parts[1] - 1;
	return new Date(parts[0], months, parts[2], parts[3], parts[4], parts[5]);
}
