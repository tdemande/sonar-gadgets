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

AJS.sonar.views.VIOLATIONS_VIEW = "violations";

AJS.sonar.views.COMPLEXITY_VIEW = "complexity";

AJS.sonar.views.ALTERNATE_METRIC_LINK_PARAMS = {
		line_coverage: "highlight=line_coverage&amp;metric=uncovered_lines",
		branch_coverage: "highlight=branch_coverage&amp;metric=uncovered_conditions",
		public_documented_api_density: "highlight=public_documented_api_density&amp;metric=public_undocumented_api",
		public_undocumented_api: "highlight=public_undocumented_api&amp;metric=public_undocumented_api",
		commented_out_code_lines: "highlight=commented_out_code_lines&amp;metric=commented_out_code_lines",
		duplicated_lines_density: "highlight=duplicated_lines_density&amp;metric=duplicated_lines",
		violations_density: "highlight=weighted_violations&amp;metric=weighted_violations"
};

AJS.sonar.views.VIOLATIONS_PRIORITIES = {
	blocker: {
		name: 'blocker_violations',
		priority: 'BLOCKER',
		image: '/images/priority/BLOCKER.gif'
	},
	critical: {
		name: 'critical_violations',
		priority: 'CRITICAL',
		image: '/images/priority/CRITICAL.gif'
	},
	major: {
		name: 'major_violations',
		priority: 'MAJOR',
		image: '/images/priority/MAJOR.gif'
	},
	minor: {
		name: 'minor_violations',
		priority: 'MINOR',
		image: '/images/priority/MINOR.gif'
	},
	info: {
		name: 'info_violations',
		priority: 'INFO',
		image: '/images/priority/INFO.gif'
	}
};

/**
 * Generate the Sonar Complexity view
 * 
 * @param baseUrl the base url of the system displaying the view
 * @param serverUrl the base url of the Sonar server
 * @param measureData the measure data of a project on Sonar
 * @param metricsDetails the details of the complexity measures
 * @return the jQuery wrapped view object
 */
AJS.sonar.views.generateComplexityView = function(baseUrl, serverUrl, measureData, metricsDetails) {
	AJS.sonar.text.load(baseUrl);
	var view = AJS.sonar.views.createViewContainer();
	var leftView = AJS.$("<div/>").addClass("left-column-onethird");
	leftView.append(AJS.sonar.views.createHeader("sonar.views.complexity"));
	AJS.sonar.views.createComplexityRow(serverUrl, AJS.sonar.views.COMPLEXITY_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "function_complexity"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "function_complexity"), false).appendTo(leftView);
	AJS.sonar.views.createComplexityRow(serverUrl, AJS.sonar.views.COMPLEXITY_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "class_complexity"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "class_complexity"), false).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COMPLEXITY_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "complexity"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "complexity"), false).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COMPLEXITY_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "statements"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "statements"), false).appendTo(leftView);
	leftView.appendTo(view);
	var rightView = AJS.$("<div/>").addClass("right-column-twothird");
	var tabsContainer = AJS.$("<div/>").attr({id: "tabs"});
	var chartsContainer = AJS.$("<div/>").attr({id: "charts"});
	AJS.sonar.views.addComplexityChart(serverUrl, tabsContainer, chartsContainer,
			AJS.sonar.utils.getMeasureFromResource(measureData, "function_complexity_distribution"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "function_complexity_distribution"), true
	);
	AJS.sonar.views.addComplexityChart(serverUrl, tabsContainer, chartsContainer,
			AJS.sonar.utils.getMeasureFromResource(measureData, "class_complexity_distribution"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "class_complexity_distribution"), false
	);
	tabsContainer.appendTo(rightView);
	chartsContainer.appendTo(rightView);
	rightView.appendTo(view);
	AJS.sonar.views.addViewFooter(view, serverUrl);
	return view;
}

/**
 * Add a Complexity Chart to the view
 * 
 * @param serverUrl the base url of the Sonar server
 * @param tabsContainer the jQuery object that will contain all the tabs
 * @param chartsContainer the jQuery object that will contain all the charts
 * @param measure the measure to display in a chart
 * @param metric the metric of the measure
 * @param showInitially flag to show of hide the chart
 */
AJS.sonar.views.addComplexityChart = function(serverUrl, tabsContainer, chartsContainer, measure, metric, showInitially) {
	var tab = AJS.$("<span/>").attr({
		id: "tab_" + metric.key
	}).addClass("tab").text(AJS.sonar.text.getMsg("sonar.views.complexity.tabs." + metric.key));
	if (showInitially) {
		tab.addClass("selected");
	}
	tab.click(function() {
		AJS.$("#tabs .tab").each(function(index, item) {
			AJS.$("#" + item.id).removeClass("selected");
		});
		AJS.$("#charts .chart").each(function(index, item) {
			AJS.$("#" + item.id).css("display", "none");
		});
		AJS.$("#tab_" + metric.key).addClass("selected");
		AJS.$("#chart_" + metric.key).css("display", "block");
	});
	tabsContainer.append(tab);
	var chart = AJS.$("<div/>").attr({
		id: "chart_" + metric.key
	}).addClass("chart").append(AJS.$("<img/>").attr({
		src: serverUrl + "/chart?ck=distbar&c=777777&v=" + escape(measure.data) + "&w=300&h=150&fs=8&bgc=ffffff"
	}));
	if (showInitially) {
		chart.css("display", "block");
	} else {
		chart.css("display", "none");
	}
	chartsContainer.append(chart);
}

/**
 * Create the Complexity row for a view
 * 
 * @param serverUrl the Sonar base url
 * @param view the name of the current view (e.g.: coverage, complexity, loc)
 * @param measure the measure data
 * @param metric the metric of the measure
 * @param isBig display the measure in big text (true) of small text (false)
 * @return the measure row element
 */
AJS.sonar.views.createComplexityRow = function(serverUrl, view, resourceId, measure, metric) {
	var textBase = "sonar.views." + view + ".";
	var row = AJS.$("<p/>");
	var backLink = AJS.$("<a/>").attr({
		href: serverUrl + "/drilldown/measures/" + resourceId + "?metric=" + metric.key,
		target: "_parent"
	}).addClass("big-measure");
	backLink.append(AJS.$("<span/>").addClass("alert_" + measure.alert).text(measure.frmt_val));
	backLink.appendTo(row);
	var imageName = AJS.sonar.utils.getTrendImage(measure, false);
	if (imageName !== "") {
		row.append(AJS.$("<img/>").attr({src: serverUrl + "/images" + imageName}));
	}
	if (AJS.sonar.text.getMsg(textBase + metric.key) !== "" && AJS.sonar.text.getMsg(textBase + metric.key) !== (textBase + metric.key)) {
		row.append(AJS.$("<span/>").text(" " + AJS.sonar.text.getMsg(textBase + metric.key)));
	}
	return row;
}

/**
 * Generate the Sonar Violaions view
 * 
 * @param baseUrl the base url of the system displaying the view
 * @param serverUrl the base url of the Sonar server
 * @param measureData the measure data of a project on Sonar
 * @param metricsDetails the details of the violations measures
 * @return the jQuery wrapped view object
 */
AJS.sonar.views.generateViolationsView = function(baseUrl, serverUrl, measureData, metricsDetails) {
	AJS.sonar.text.load(baseUrl);
	var view = AJS.sonar.views.createViewContainer();
	var leftView = AJS.sonar.views.createColumn(true);
	leftView.append(AJS.sonar.views.createHeader("sonar.views.violations.rules.compliance"));
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.VIOLATIONS_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "violations_density"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "violations_density"), true).appendTo(leftView);
	var efficiencyMeasure = AJS.sonar.utils.getMeasureFromResource(measureData, "efficiency");
	var maintainabilityMeasure = AJS.sonar.utils.getMeasureFromResource(measureData, "maintainability");
	var portabilityMeasure = AJS.sonar.utils.getMeasureFromResource(measureData, "portability");
	var reliabilityMeasure = AJS.sonar.utils.getMeasureFromResource(measureData, "reliability");
	var usabilityMeasure = AJS.sonar.utils.getMeasureFromResource(measureData, "usability");
	AJS.$("<a/>").attr({
		href: serverUrl + "/drilldown/violations/" + measureData.id + "?filter=category",
		target: "_parent"
	}).append(AJS.$("<img/>").attr({
		src: serverUrl + "/chart?ck=xradar&w=140&h=110&c=777777|F8A036&m=100&g=0.25&l=Eff.,Mai.,Por.,Rel.,Usa.&v=" + efficiencyMeasure.val + "," + maintainabilityMeasure.val + "," + portabilityMeasure.val + "," + reliabilityMeasure.val + "," + usabilityMeasure.val,
		width: 140,
		height: 110
	})).appendTo(leftView);
	leftView.appendTo(view);
	var rightView = AJS.sonar.views.createColumn(false);
	rightView.append(AJS.sonar.views.createHeader("sonar.views.violations"));
	AJS.sonar.views.createViolationMeasureRow(serverUrl, AJS.sonar.views.VIOLATIONS_VIEW, measureData.key,
			AJS.sonar.utils.getMeasureFromResource(measureData, "violations"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "violations"), true).appendTo(rightView);
	AJS.sonar.views.createViolationPriorityRow(serverUrl, measureData,
			AJS.sonar.utils.getMeasureFromResource(measureData, "violations"),
			AJS.sonar.views.VIOLATIONS_PRIORITIES.blocker).appendTo(rightView);
	AJS.sonar.views.createViolationPriorityRow(serverUrl, measureData,
			AJS.sonar.utils.getMeasureFromResource(measureData, "violations"),
			AJS.sonar.views.VIOLATIONS_PRIORITIES.critical).appendTo(rightView);
	AJS.sonar.views.createViolationPriorityRow(serverUrl, measureData,
			AJS.sonar.utils.getMeasureFromResource(measureData, "violations"),
			AJS.sonar.views.VIOLATIONS_PRIORITIES.major).appendTo(rightView);
	AJS.sonar.views.createViolationPriorityRow(serverUrl, measureData,
			AJS.sonar.utils.getMeasureFromResource(measureData, "violations"),
			AJS.sonar.views.VIOLATIONS_PRIORITIES.minor).appendTo(rightView);
	AJS.sonar.views.createViolationPriorityRow(serverUrl, measureData,
			AJS.sonar.utils.getMeasureFromResource(measureData, "violations"),
			AJS.sonar.views.VIOLATIONS_PRIORITIES.info).appendTo(rightView);
	rightView.appendTo(view);
	AJS.sonar.views.addViewFooter(view, serverUrl);
	return view;
}

/**
 * Create a violation priority row
 * 
 * @param serverUrl the Sonar server base url
 * @param measureData the measure data of the project
 * @param violationsData the violatons metric data
 * @param priority a AJS.sonar.views.VIOLATIONS_PRIORITIES priority
 */
AJS.sonar.views.createViolationPriorityRow = function(serverUrl, measureData, violationsData, priority) {
	var row = AJS.$("<div/>").addClass("violation-row");
	AJS.$("<img/>").attr({src: serverUrl + priority.image}).appendTo(row);
	AJS.$("<div/>").addClass("violation-name").append(AJS.$("<a/>").attr({
		href: serverUrl + "/drilldown/violations/" + measureData.key + "?priority=" + priority.priority,
		target: "_parent"
	}).text(AJS.sonar.text.getMsg("sonar.views.violations." + priority.name))).appendTo(row);
	var measure = AJS.sonar.utils.getMeasureFromResource(measureData, priority.name);
	AJS.$("<div/>").addClass("violations alert_" + measure.alert).text(measure.frmt_val).appendTo(row);
	if (measure.val > 0) {
		var percentage = AJS.sonar.utils.getPercentage(measure.val, violationsData.val);
		AJS.$("<div/>").addClass("barchart").css({
			width: percentage + "px"
		}).append(AJS.$("<div/>").css({
			width: "100%",
			"background-color": "#777"
		})).appendTo(row);
	}
	return row;
}

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
	leftView.append(AJS.sonar.views.createHeader("sonar.views.loc"));
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
	leftView.append(AJS.sonar.views.createHeader("sonar.views.comments"));
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
AJS.sonar.views.createViolationMeasureRow = function(serverUrl, view, resourceKey, measure, metric, isBig) {
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
		href: serverUrl + "/drilldown/violations/" + resourceKey,
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
	var footer = AJS.$("<div/>").addClass("footer")
		.text(AJS.sonar.text.getMsg("sonar.views.connected.to"))
		.append(AJS.$("<a/>").attr({
			href: serverUrl,
			target: "_parent"
		}).text(serverUrl))
		.appendTo(footer);
	viewContainer.append(footer);
}
