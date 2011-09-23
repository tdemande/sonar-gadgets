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

AJS.$.namespace("AJS.sonar.views.pti");

AJS.sonar.views.pti.VIEW_NAME = "pti";

AJS.sonar.views.pti.METRICS = 'package_tangle_index,package_cycles,package_feedback_edges,package_tangles';

/**
 * Generate the Sonar pti view
 * 
 * @param baseUrl the base url of the system displaying the view
 * @param server the Sonar server object
 * @param measureData the measure data of a project on Sonar
 * @param metricsDetails the details of the coverage measures
 * @return the jQuery wrapped view object
 */
AJS.sonar.views.pti.generateView = function(baseUrl, server, measureData, metricsDetails) {
	AJS.sonar.text.load(baseUrl);
	var view = AJS.sonar.views.createViewContainer();
	var leftView = AJS.sonar.views.createColumn(true);
	leftView.append(AJS.sonar.views.createHeader("sonar.views.pti"));
	AJS.sonar.views.createMeasureRow(server.host, AJS.sonar.views.pti.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "package_tangle_index"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "package_tangle_index"), true
	).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(server.host, AJS.sonar.views.pti.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "package_cycles"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "package_cycles"), false).appendTo(leftView);
	leftView.appendTo(view);
	var rightView = AJS.sonar.views.createColumn(false);
	rightView.append(AJS.sonar.views.createHeader("sonar.views.pti.deps.to.cut"));
	AJS.sonar.views.createMeasureRow(server.host, AJS.sonar.views.pti.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "package_feedback_edges"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "package_feedback_edges"), false
	).appendTo(rightView);
	AJS.sonar.views.createMeasureRow(server.host, AJS.sonar.views.pti.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "package_tangles"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "package_tangles"), false).appendTo(rightView);
	rightView.appendTo(view);
	AJS.sonar.views.addViewFooter(view, server.host);
	return view;
}
