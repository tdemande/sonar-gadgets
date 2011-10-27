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

AJS.$.namespace("AJS.sonar.views.totalquality");

AJS.sonar.views.totalquality.VIEW_NAME = "totalquality";

AJS.sonar.views.totalquality.METRICS = 'coverage,violations_density,total-quality,total-quality-dry,total-quality-code,total-quality-test,total-quality-design-nom,total-quality-design-lcom4,total-quality-design-rfc,total-quality-design-cbo,total-quality-design-dit,total-quality-design,total-quality-architecture-pti,total-quality-architecture-adi,total-quality-architecture';
AJS.sonar.views.totalquality.CHART_METRICS = [{
	id: 'total-quality-architecture',
	text: 'total-quality-architecture'
},{
	id: 'total-quality-design',
	text: 'total-quality-design'
},{
	id: 'total-quality-test',
	text: 'total-quality-test'
},{
	id: 'total-quality-code',
	text: 'total-quality-code'
}];

/**
 * Generate the Sonar Total Quality view
 * 
 * @param baseUrl the base url of the system displaying the view
 * @param server the Sonar server object
 * @param measureData the measure data of a project on Sonar
 * @param metricsDetails the details of the coverage measures
 * @return the jQuery wrapped view object
 */
AJS.sonar.views.totalquality.generateView = function(baseUrl, server, measureData, metricsDetails) {
	AJS.sonar.text.load(baseUrl);
	var view = AJS.sonar.views.createViewContainer();
	var leftView = AJS.sonar.views.createColumn(true);
	leftView.css('width', '38%');
	leftView.append(AJS.sonar.views.createHeader("sonar.views.totalquality"));
	AJS.sonar.views.createMeasureRow(server.host, AJS.sonar.views.totalquality.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "total-quality"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "total-quality"), true).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(server.host, AJS.sonar.views.totalquality.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "total-quality-architecture"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "total-quality-architecture"), false).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(server.host, AJS.sonar.views.totalquality.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "total-quality-design"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "total-quality-design"), false).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(server.host, AJS.sonar.views.totalquality.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "total-quality-code"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "total-quality-code"), false).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(server.host, AJS.sonar.views.totalquality.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "total-quality-test"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "total-quality-test"), false).appendTo(leftView);
	leftView.appendTo(view);
	var rightView = AJS.sonar.views.createColumn(false);
	rightView.css('width', '58%');
	AJS.sonar.views.totalquality.generateTotalQualityChart(server.host, measureData, metricsDetails).appendTo(rightView);
	rightView.appendTo(view);
	AJS.sonar.views.addViewFooter(view, server.host);
	return view;
}

/**
 * Generate the Total Quality Chart
 * 
 * @param serverUrl the Sonar base server url
 * @param measureData the measure data of a project on Sonar
 * @param metricsDetails the details of the coverage measures
 * @return the jQuery wrapped Total Quality Chart object
 */
AJS.sonar.views.totalquality.generateTotalQualityChart = function(serverUrl, measureData, metricsDetails) {
	var keys = '';
	var values = '';
	AJS.$(AJS.sonar.views.totalquality.CHART_METRICS).each(function(index, chartMetric) {
		if (keys.length > 0) {
			keys += ',';
			values += ',';
		}
		var metric = AJS.sonar.utils.getMeasureFromResource(measureData, chartMetric.id);
		keys += AJS.sonar.text.getMsg('sonar.views.totalquality.chart.' + chartMetric.text);
		values += metric.val;
	});
	return AJS.$("<img/>").attr({
		width: 200,
		height: 200,
		src: serverUrl + '/chart?ck=xradar&w=200&h=200&c=777777|F8A036&m=100&g=0.25&l=' + keys + '&v=' + values
	});
}
