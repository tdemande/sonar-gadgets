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

AJS.$.namespace("AJS.sonar.views.complexity");

AJS.sonar.views.complexity.VIEW_NAME = "complexity";

/**
 * Generate the Sonar Complexity view
 * 
 * @param baseUrl the base url of the system displaying the view
 * @param serverUrl the base url of the Sonar server
 * @param measureData the measure data of a project on Sonar
 * @param metricsDetails the details of the complexity measures
 * @return the jQuery wrapped view object
 */
AJS.sonar.views.complexity.generateView = function(baseUrl, serverUrl, measureData, metricsDetails) {
	AJS.sonar.text.load(baseUrl);
	var view = AJS.sonar.views.createViewContainer();
	var leftView = AJS.$("<div/>").attr({id: "leftColumn"}).addClass("left-column-onethird");
	leftView.append(AJS.sonar.views.createHeader("sonar.views.complexity"));
	AJS.sonar.views.complexity.createComplexityRow(serverUrl, AJS.sonar.views.complexity.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "function_complexity"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "function_complexity"), false).appendTo(leftView);
	AJS.sonar.views.complexity.createComplexityRow(serverUrl, AJS.sonar.views.complexity.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "class_complexity"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "class_complexity"), false).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.complexity.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "complexity"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "complexity"), false).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.complexity.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "statements"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "statements"), false).appendTo(leftView);
	leftView.appendTo(view);
	var rightView = AJS.$("<div/>").attr({id: "rightColumn"}).addClass("right-column-twothird");
	var tabsContainer = AJS.$("<div/>").attr({id: "tabs"});
	var chartsContainer = AJS.$("<div/>").attr({id: "charts"});
	AJS.sonar.views.complexity.addComplexityChart(serverUrl, tabsContainer, chartsContainer,
			AJS.sonar.utils.getMeasureFromResource(measureData, "function_complexity_distribution"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "function_complexity_distribution"), true
	);
	AJS.sonar.views.complexity.addComplexityChart(serverUrl, tabsContainer, chartsContainer,
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
AJS.sonar.views.complexity.addComplexityChart = function(serverUrl, tabsContainer, chartsContainer, measure, metric, showInitially) {
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
AJS.sonar.views.complexity.createComplexityRow = function(serverUrl, view, resourceId, measure, metric) {
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
