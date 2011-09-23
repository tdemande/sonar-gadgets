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

AJS.$.namespace("AJS.sonar.views.lcom4");

AJS.sonar.views.lcom4.VIEW_NAME = "lcom4";

AJS.sonar.views.lcom4.METRICS = 'lcom4,rfc,suspect_lcom4_density,lcom4_distribution,rfc_distribution';

/**
 * Generate the Sonar lcom4 view
 * 
 * @param baseUrl the base url of the system displaying the view
 * @param server the Sonar server object
 * @param measureData the measure data of a project on Sonar
 * @param metricsDetails the details of the coverage measures
 * @return the jQuery wrapped view object
 */
AJS.sonar.views.lcom4.generateView = function(baseUrl, server, measureData, metricsDetails) {
	AJS.sonar.text.load(baseUrl);
	var view = AJS.sonar.views.createViewContainer();
	var leftView = AJS.sonar.views.createColumn(true);
	leftView.append(AJS.sonar.views.createHeader("sonar.views.lcom4"));
	AJS.sonar.views.createMeasureRow(server.host, AJS.sonar.views.lcom4.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "lcom4"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "lcom4"), true).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(server.host, AJS.sonar.views.lcom4.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "suspect_lcom4_density"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "suspect_lcom4_density"), false
	).appendTo(leftView);
	AJS.sonar.views.lcom4.createMetricChart(server.host, 
			AJS.sonar.utils.getMeasureFromResource(measureData, "lcom4_distribution")
	).appendTo(leftView);
	leftView.appendTo(view);
	var rightView = AJS.sonar.views.createColumn(false);
	rightView.append(AJS.sonar.views.createHeader("sonar.views.lcom4.rfc.header"));
	AJS.sonar.views.createMeasureRow(server.host, AJS.sonar.views.lcom4.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "rfc"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "rfc"), true).appendTo(rightView);
	rightView.append("<p>&nbsp;</p>");
	AJS.sonar.views.lcom4.createMetricChart(server.host, 
			AJS.sonar.utils.getMeasureFromResource(measureData, "rfc_distribution")
	).appendTo(rightView);
	rightView.appendTo(view);
	AJS.sonar.views.addViewFooter(view, server.host);
	return view;
}

/**
 * Create a Chart from the measure given
 * 
 * @param serverUrl the base url of the Sonar server
 * @param measure the measure
 * @return the chart image
 */
AJS.sonar.views.lcom4.createMetricChart = function(serverUrl, measure) {
	return AJS.$("<img/>").attr({
		width: 180,
		height: 100,
		src: serverUrl + "/chart?ck=distbar&c=777777&w=180&h=100&fs=8&bgc=ffffff&v=" + measure.data
	});
}
