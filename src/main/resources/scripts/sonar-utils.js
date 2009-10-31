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
	var msr = {};
	for (var index in resource.msr) {
		if (resource.msr[index].key === msrKey) {
			return resource.msr[index];
		}
	}
	return msr;
}

/**
 * Get a metric by key from an array of metrics
 * 
 * @param metrics the array of metrics
 * @param metricKey the key of the metric to get
 * @return the metric
 */
AJS.sonar.utils.getMetricFromMetricsArray = function(metrics, metricKey) {
	var metric = {};
	for (var index in metrics) {
		if (metrics[index].key === metricKey) {
			return metrics[index];
		}
	}
	return metirc;
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
