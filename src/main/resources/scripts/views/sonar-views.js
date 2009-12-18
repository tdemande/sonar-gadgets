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

AJS.$.namespace("AJS.sonar.views");

AJS.sonar.views.ALTERNATE_METRIC_LINK_PARAMS = {
		line_coverage: "highlight=line_coverage&amp;metric=uncovered_lines",
		branch_coverage: "highlight=branch_coverage&amp;metric=uncovered_conditions",
		public_documented_api_density: "highlight=public_documented_api_density&amp;metric=public_undocumented_api",
		public_undocumented_api: "highlight=public_undocumented_api&amp;metric=public_undocumented_api",
		commented_out_code_lines: "highlight=commented_out_code_lines&amp;metric=commented_out_code_lines",
		duplicated_lines_density: "highlight=duplicated_lines_density&amp;metric=duplicated_lines",
		violations_density: "highlight=weighted_violations&amp;metric=weighted_violations"
};

/**
 * Create the common View container div element
 * 
 * @return the container div element
 */
AJS.sonar.views.createViewContainer = function() {
	return AJS.$("<div/>").addClass("view-container");
}

/**
 * Create a column div element
 * 
 * @param isLeft flag whether the column is for left (true) or right (false)
 * @return the column div element
 */
AJS.sonar.views.createColumn = function(isLeft) {
	var column = AJS.$("<div/>");
	if (isLeft) {
		column.attr({id: "leftColumn"});
		column.addClass("left-column");
	} else {
		column.attr({id: "rightColumn"});
		column.addClass("right-column");
	}
	return column;
}

/**
 * Create a header element for Sonar Views
 * 
 * @param labelKey the label i18n key used to get the text of the header
 * @return the header element
 */
AJS.sonar.views.createHeader = function(labelKey) {
	return AJS.$("<h4/>").text(AJS.sonar.text.getMsg(labelKey));
}

/**
 * Create the Measure row for a view
 * 
 * @param serverUrl the Sonar base url
 * @param view the name of the current view (e.g.: coverage, complexity, loc)
 * @param measure the measure data
 * @param metric the metric of the measure
 * @param isBig display the measure in big text (true) of small text (false)
 * @return the measure row element
 */
AJS.sonar.views.createMeasureRow = function(serverUrl, view, resourceId, measure, metric, isBig) {
	var textBase = "sonar.views." + view + ".";
	var row = AJS.$("<p/>");
	if (isBig) {
		row.addClass("big-measure");
	}
	var linkParams = "metric=" + metric.key;
	if (AJS.sonar.views.ALTERNATE_METRIC_LINK_PARAMS[metric.key]) {
		linkParams = AJS.sonar.views.ALTERNATE_METRIC_LINK_PARAMS[metric.key];
	}
	var backLink = AJS.$("<a/>").attr({
		href: serverUrl + "/drilldown/measures/" + resourceId + "?" + linkParams,
		target: "_parent"
	});
	backLink.append(AJS.$("<span/>").addClass("alert_" + measure.alert).text(measure.frmt_val));
	if (AJS.sonar.text.getMsg(textBase + metric.key) !== "" && AJS.sonar.text.getMsg(textBase + metric.key) !== (textBase + metric.key)) {
		backLink.append(AJS.$("<span/>").text(" " + AJS.sonar.text.getMsg(textBase + metric.key)));
	}
	var imageName = AJS.sonar.utils.getTrendImage(measure, !isBig);
	if (imageName !== "") {
		backLink.append(AJS.$("<img/>").attr({src: serverUrl + "/images" + imageName}));
	}
	backLink.appendTo(row);
	return row;
}

/**
 * Add the footer to the view container
 * 
 * @param viewContainer the div containing the sonar view
 * @param serverUrl the url of the Sonar server
 */
AJS.sonar.views.addViewFooter = function(viewContainer, serverUrl) {
	var footer = AJS.$("<div/>").addClass("sonar-footer")
		.text(AJS.sonar.text.getMsg("sonar.views.connected.to"))
		.append(AJS.$("<a/>").attr({
			href: serverUrl,
			target: "_parent"
		}).text(serverUrl))
		.appendTo(footer);
	viewContainer.append(footer);
}
