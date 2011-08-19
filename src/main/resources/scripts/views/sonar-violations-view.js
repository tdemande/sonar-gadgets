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

AJS.$.namespace("AJS.sonar.views.violations");

AJS.sonar.views.violations.VIEW_NAME = "violations";

AJS.sonar.views.violations.METRICS = 'violations_density,violations,blocker_violations,critical_violations,major_violations,minor_violations,info_violations';

AJS.sonar.views.violations.VIOLATIONS_PRIORITIES = {
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
 * Generate the Sonar Violaions view
 * 
 * @param baseUrl the base url of the system displaying the view
 * @param server the Sonar server object
 * @param measureData the measure data of a project on Sonar
 * @param metricsDetails the details of the violations measures
 * @return the jQuery wrapped view object
 */
AJS.sonar.views.violations.generateView = function(baseUrl, server, measureData, metricsDetails) {
	AJS.sonar.text.load(baseUrl);
	var view = AJS.sonar.views.createViewContainer();
	var leftView = AJS.sonar.views.createColumn(true);
	leftView.append(AJS.sonar.views.createHeader("sonar.views.violations.rules.compliance"));
	AJS.sonar.views.createMeasureRow(server.host, AJS.sonar.views.VIOLATIONS_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "violations_density"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "violations_density"), true).appendTo(leftView);
	leftView.append(AJS.sonar.views.createHeader("sonar.views.violations"));
	AJS.sonar.views.violations.createViolationMeasureRow(server.host, AJS.sonar.views.VIOLATIONS_VIEW, measureData.key,
			AJS.sonar.utils.getMeasureFromResource(measureData, "violations"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "violations"), true).appendTo(leftView);
	leftView.appendTo(view);
	var rightView = AJS.sonar.views.createColumn(false);
	rightView.append(AJS.sonar.views.createHeader("sonar.views.violations"));
	AJS.sonar.views.violations.createViolationPriorityRow(server.host, measureData,
			AJS.sonar.utils.getMeasureFromResource(measureData, "violations"),
			AJS.sonar.views.violations.VIOLATIONS_PRIORITIES.blocker).appendTo(rightView);
	AJS.sonar.views.violations.createViolationPriorityRow(server.host, measureData,
			AJS.sonar.utils.getMeasureFromResource(measureData, "violations"),
			AJS.sonar.views.violations.VIOLATIONS_PRIORITIES.critical).appendTo(rightView);
	AJS.sonar.views.violations.createViolationPriorityRow(server.host, measureData,
			AJS.sonar.utils.getMeasureFromResource(measureData, "violations"),
			AJS.sonar.views.violations.VIOLATIONS_PRIORITIES.major).appendTo(rightView);
	AJS.sonar.views.violations.createViolationPriorityRow(server.host, measureData,
			AJS.sonar.utils.getMeasureFromResource(measureData, "violations"),
			AJS.sonar.views.violations.VIOLATIONS_PRIORITIES.minor).appendTo(rightView);
	AJS.sonar.views.violations.createViolationPriorityRow(server.host, measureData,
			AJS.sonar.utils.getMeasureFromResource(measureData, "violations"),
			AJS.sonar.views.violations.VIOLATIONS_PRIORITIES.info).appendTo(rightView);
	rightView.appendTo(view);
	AJS.sonar.views.addViewFooter(view, server.host);
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
AJS.sonar.views.violations.createViolationPriorityRow = function(serverUrl, measureData, violationsData, priority) {
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
 * Create the Measure row for a view
 * 
 * @param serverUrl the Sonar base url
 * @param view the name of the current view (e.g.: coverage, complexity, loc)
 * @param measure the measure data
 * @param metric the metric of the measure
 * @param isBig display the measure in big text (true) of small text (false)
 * @return the measure row element
 */
AJS.sonar.views.violations.createViolationMeasureRow = function(serverUrl, view, resourceKey, measure, metric, isBig) {
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
