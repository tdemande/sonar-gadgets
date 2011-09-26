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

AJS.$.namespace("AJS.sonar.views.qi");

AJS.sonar.views.qi.VIEW_NAME = "qi";

AJS.sonar.views.qi.METRICS = 'qi-quality-index,qi-coding-violations,qi-complexity,qi-test-coverage,qi-style-violations,qi-complexity-factor,qi-complexity-factor-methods';

/**
 * Generate the Sonar qi view
 * 
 * @param baseUrl the base url of the system displaying the view
 * @param server the Sonar server object
 * @param measureData the measure data of a project on Sonar
 * @param metricsDetails the details of the coverage measures
 * @return the jQuery wrapped view object
 */
AJS.sonar.views.qi.generateView = function(baseUrl, server, measureData, metricsDetails) {
	AJS.sonar.text.load(baseUrl);
	var view = AJS.sonar.views.createViewContainer();
	var leftView = AJS.sonar.views.createColumn(true);
	leftView.append(AJS.sonar.views.createHeader("sonar.views.qi"));
	AJS.sonar.views.createMeasureRow(server.host, AJS.sonar.views.qi.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "qi-quality-index"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "qi-quality-index"), true).appendTo(leftView);
	var qidataTable = AJS.$("<table/>").addClass("qidata");
	AJS.sonar.views.qi.generateQualityIndexDataRow(server, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "qi-coding-violations"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "qi-coding-violations")).appendTo(qidataTable);
	AJS.sonar.views.qi.generateQualityIndexDataRow(server, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "qi-complexity"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "qi-complexity")).appendTo(qidataTable);
	AJS.sonar.views.qi.generateQualityIndexDataRow(server, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "qi-test-coverage"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "qi-test-coverage")).appendTo(qidataTable);
	AJS.sonar.views.qi.generateQualityIndexDataRow(server, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "qi-style-violations"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "qi-style-violations")).appendTo(qidataTable);
	leftView.append(qidataTable);
	leftView.appendTo(view);
	var rightView = AJS.sonar.views.createColumn(false);
	rightView.append(AJS.sonar.views.createHeader("sonar.views.qi.complexity-factor"));
	AJS.sonar.views.createMeasureRow(server.host, AJS.sonar.views.qi.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "qi-complexity-factor"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "qi-complexity-factor"), true
	).appendTo(rightView);
	AJS.sonar.views.createMeasureRow(server.host, AJS.sonar.views.qi.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "qi-complexity-factor-methods"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "qi-complexity-factor-methods"), false
	).appendTo(rightView);
	rightView.appendTo(view);
	AJS.sonar.views.addViewFooter(view, server.host);
	return view;
}

/**
 * Generate the Quality Index Data Row
 * 
 * @param server the Sonar server Object, this object must have a host element
 * @param resourceKey the resource Key or Id of the Sonar resource
 * @param measure the measure to generate the row for
 * @param metric the metric of the measure
 * @return the jQuery wrapped row
 */
AJS.sonar.views.qi.generateQualityIndexDataRow = function(server, resourceKey, measure, metric) {
	var row = AJS.$("<tr/>");
	AJS.$("<td/>").text(AJS.sonar.text.getMsg("sonar.views.qi." + metric.key)).appendTo(row);
	var msrUrl = server.host + "/drilldown/measures/" + resourceKey + "?metric=" + metric.key;
	AJS.$("<td/>").append(
		AJS.$("<b/>").append(AJS.$("<a>").attr("href", msrUrl).append(AJS.$("<span/>").text(measure.frmt_val)))
	).append("/" + measure.data).appendTo(row);
	var bgWidth = 100 * parseFloat(measure.data) / 4.5;
	var width = parseFloat(measure.val) / parseFloat(measure.data) * 100;
	AJS.$("<a/>").addClass("qidata-bg-row").attr("href", msrUrl).css("width", bgWidth).append(
		AJS.$("<div/>").addClass("qidata-row").css("width", width)
	).appendTo(row);
	return row;
}
