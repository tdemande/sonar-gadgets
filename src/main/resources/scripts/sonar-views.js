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

AJS.sonar.views.COVERAGE_VIEW = "coverage";

AJS.sonar.views.LOC_VIEW = "loc";

AJS.sonar.views.COMMENTS_VIEW = "comments";

AJS.sonar.views.ALTERNATE_METRIC_LINK_PARAMS = {
		line_coverage: "highlight=line_coverage&amp;metric=uncovered_lines",
		branch_coverage: "highlight=branch_coverage&amp;metric=uncovered_conditions",
		public_documented_api_density: "highlight=public_documented_api_density&amp;metric=public_undocumented_api",
		public_undocumented_api: "highlight=public_undocumented_api&amp;metric=public_undocumented_api",
		commented_out_code_lines: "highlight=commented_out_code_lines&amp;metric=commented_out_code_lines",
		duplicated_lines_density: "highlight=duplicated_lines_density&amp;metric=duplicated_lines"
};

/**
 * Generate the Sonar Coverage view
 * 
 * @param baseUrl the base url of the system displaying the view
 * @param serverUrl the base url of the Sonar server
 * @param measureData the measure data of a project on Sonar
 * @param metricsDetails the details of the coverage measures
 * @return the jQuery wrapped view object
 */
AJS.sonar.views.generateCoverageView = function(baseUrl, serverUrl, measureData, metricsDetails) {
	AJS.sonar.text.load(baseUrl);
	var view = AJS.sonar.views.createViewContainer();
	var leftView = AJS.sonar.views.createColumn(true);
	leftView.append(AJS.sonar.views.createHeader("sonar.views.coverage.code.coverage"));
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COVERAGE_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "coverage"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "coverage"), true).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COVERAGE_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "line_coverage"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "line_coverage"), false).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COVERAGE_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "branch_coverage"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "branch_coverage"), false).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COVERAGE_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "tests"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "tests"), false).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COVERAGE_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "test_execution_time"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "test_execution_time"), false).appendTo(leftView);
	leftView.appendTo(view);
	var rightView = AJS.sonar.views.createColumn(false);
	rightView.append(AJS.sonar.views.createHeader("sonar.views.coverage.test.success"));
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COVERAGE_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "test_success_density"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "test_success_density"), true).appendTo(rightView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COVERAGE_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "test_failures"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "test_failures"), false).appendTo(rightView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COVERAGE_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "test_errors"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "test_errors"), false).appendTo(rightView);
	rightView.appendTo(view);
	AJS.sonar.views.addViewFooter(view, serverUrl);
	return view;
}

/**
 * Generate the Sonar LOC view
 * 
 * @param baseUrl the base url of the system displaying the view
 * @param serverUrl the base url of the Sonar server
 * @param measureData the measure data of a project on Sonar
 * @param metricsDetails the details of the coverage measures
 * @return the jQuery wrapped view object
 */
AJS.sonar.views.generateLocView = function(baseUrl, serverUrl, measureData, metricsDetails) {
	AJS.sonar.text.load(baseUrl);
	var view = AJS.sonar.views.createViewContainer();
	var leftView = AJS.sonar.views.createColumn(true);
	leftView.append(AJS.sonar.views.createHeader("sonar.views.loc.lines.of.code"));
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.LOC_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "ncloc"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "ncloc"), true).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.LOC_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "lines"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "lines"), false).appendTo(leftView);
	leftView.appendTo(view);
	var rightView = AJS.sonar.views.createColumn(false);
	rightView.append(AJS.sonar.views.createHeader("sonar.views.loc.classes.header"));
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.LOC_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "classes"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "classes"), true).appendTo(rightView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.LOC_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "packages"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "packages"), false).appendTo(rightView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.LOC_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "functions"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "functions"), false).appendTo(rightView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.LOC_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "accessors"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "accessors"), false).appendTo(rightView);
	rightView.appendTo(view);
	AJS.sonar.views.addViewFooter(view, serverUrl);
	return view;
}

/**
 * Generate the Sonar Comments view
 * 
 * @param baseUrl the base url of the system displaying the view
 * @param serverUrl the base url of the Sonar server
 * @param measureData the measure data of a project on Sonar
 * @param metricsDetails the details of the coverage measures
 * @return the jQuery wrapped view object
 */
AJS.sonar.views.generateCommentsView = function(baseUrl, serverUrl, measureData, metricsDetails) {
	AJS.sonar.text.load(baseUrl);
	var view = AJS.sonar.views.createViewContainer();
	var leftView = AJS.sonar.views.createColumn(true);
	leftView.append(AJS.sonar.views.createHeader("sonar.views.comments.comments"));
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COMMENTS_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "comment_lines_density"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "comment_lines_density"), true).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COMMENTS_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "comment_lines"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "comment_lines"), false).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COMMENTS_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "public_documented_api_density"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "public_documented_api_density"), false).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COMMENTS_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "public_undocumented_api"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "public_undocumented_api"), false).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COMMENTS_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "commented_out_code_lines"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "commented_out_code_lines"), false).appendTo(leftView);
	leftView.appendTo(view);
	var rightView = AJS.sonar.views.createColumn(false);
	rightView.append(AJS.sonar.views.createHeader("sonar.views.comments.duplications"));
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COMMENTS_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "duplicated_lines_density"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "duplicated_lines_density"), true).appendTo(rightView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COMMENTS_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "duplicated_lines"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "duplicated_lines"), false).appendTo(rightView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COMMENTS_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "duplicated_blocks"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "duplicated_blocks"), false).appendTo(rightView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COMMENTS_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "duplicated_files"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "duplicated_files"), false).appendTo(rightView);
	rightView.appendTo(view);
	AJS.sonar.views.addViewFooter(view, serverUrl);
	return view;
}

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
		column.addClass("left-column");
	} else {
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
	return AJS.$("<h3/>").text(AJS.sonar.text.getMsg(labelKey));
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
		backLink.append(AJS.$("<img/>").attr({src: serverUrl + "/images" + imageName, border: 0}));
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
	var footer = AJS.$("<div/>").addClass("footer")
		.text(AJS.sonar.text.getMsg("sonar.views.connected.to"))
		.append(AJS.$("<a/>").attr({
			href: serverUrl,
			target: "_parent"
		}).text(serverUrl))
		.appendTo(footer);
	viewContainer.append(footer);
}
