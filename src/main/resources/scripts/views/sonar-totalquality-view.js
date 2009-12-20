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

AJS.sonar.views.totalquality.METRICS = 'coverage,violations_density,isoqa_tc,isoqa_cc,isoqa_ac,isoqa_ca,isoqa_ce,isoqa_a,isoqa_i,isoqa_d,isoqa_dc,isoqa_dit,isoqa_cbo,isoqa_rfc,isoqa_lcom,isoqa_design_nom,isoqa_design_rfc,isoqa_design_cbo,isoqa_design_dit,isoqa_design,isoqa_architecture_coh,isoqa_architecture_adi,isoqa_architecture,isoqa_ts,isoqa_code,isoqa_doc,isoqa_dry,isoqa_tq';

AJS.sonar.views.totalquality.CHART_METRICS = [{
	id: 'isoqa_architecture_coh',
	text: 'isoqa_architecture_coh'
},{
	id: 'isoqa_architecture_adi',
	text: 'isoqa_architecture_adi'
},{
	id: 'isoqa_design_nom',
	text: 'isoqa_design_nom'
},{
	id: 'isoqa_design_rfc',
	text: 'isoqa_design_rfc'
},{
	id: 'isoqa_design_cbo',
	text: 'isoqa_design_cbo'
},{
	id: 'isoqa_design_dit',
	text: 'isoqa_design_dit'
},{
	id: 'isoqa_doc',
	text: 'isoqa_doc'
},{
	id: 'isoqa_dry',
	text: 'isoqa_dry'
},{
	id: 'violations_density',
	text: 'violations_density'
},{
	id: 'coverage',
	text: 'chart_coverage'
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
			AJS.sonar.utils.getMeasureFromResource(measureData, "isoqa_tq"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "isoqa_tq"), true).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(server.host, AJS.sonar.views.totalquality.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "coverage"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "coverage"), false).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(server.host, AJS.sonar.views.totalquality.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "isoqa_architecture"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "isoqa_architecture"), false).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(server.host, AJS.sonar.views.totalquality.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "isoqa_design"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "isoqa_design"), false).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(server.host, AJS.sonar.views.totalquality.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "isoqa_code"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "isoqa_code"), false).appendTo(leftView);
	leftView.append(AJS.$("<br />"));
	leftView.append(AJS.sonar.views.createHeader("sonar.views.totalquality.distance"));
	AJS.sonar.views.createMeasureRow(server.host, AJS.sonar.views.totalquality.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "isoqa_d"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "isoqa_d"), true).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(server.host, AJS.sonar.views.totalquality.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "isoqa_tc"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "isoqa_tc"), false).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(server.host, AJS.sonar.views.totalquality.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "isoqa_ac"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "isoqa_ac"), false).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(server.host, AJS.sonar.views.totalquality.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "isoqa_cc"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "isoqa_cc"), false).appendTo(leftView);
	leftView.append(AJS.$("<br />"));
	leftView.append(AJS.sonar.views.createHeader("sonar.views.totalquality.cycles"));
	AJS.sonar.views.createMeasureRow(server.host, AJS.sonar.views.totalquality.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "isoqa_dc"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "isoqa_dc"), true).appendTo(leftView);
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
		keys += AJS.sonar.text.getMsg('sonar.views.totalquality.' + chartMetric.text);
		values += metric.val;
	});
	return AJS.$("<img/>").attr({
		width: 250,
		height: 250,
		src: serverUrl + '/chart?ck=xradar&w=250&h=250&c=777777|F8A036&m=100&g=0.25&l=' + keys + '&v=' + values
	});
}
