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

AJS.$.namespace("AJS.sonar.views.coverage");

AJS.sonar.views.coverage.VIEW_NAME = "coverage";

/**
 * Generate the Sonar Coverage view
 * 
 * @param baseUrl the base url of the system displaying the view
 * @param serverUrl the base url of the Sonar server
 * @param measureData the measure data of a project on Sonar
 * @param metricsDetails the details of the coverage measures
 * @return the jQuery wrapped view object
 */
AJS.sonar.views.coverage.generateView = function(baseUrl, serverUrl, measureData, metricsDetails) {
	AJS.sonar.text.load(baseUrl);
	var view = AJS.sonar.views.createViewContainer();
	var leftView = AJS.sonar.views.createColumn(true);
	leftView.append(AJS.sonar.views.createHeader("sonar.views.coverage.code.coverage"));
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.coverage.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "coverage"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "coverage"), true).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.coverage.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "line_coverage"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "line_coverage"), false).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.coverage.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "branch_coverage"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "branch_coverage"), false).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.coverage.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "tests"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "tests"), false).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.coverage.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "test_execution_time"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "test_execution_time"), false).appendTo(leftView);
	leftView.appendTo(view);
	var rightView = AJS.sonar.views.createColumn(false);
	rightView.append(AJS.sonar.views.createHeader("sonar.views.coverage.test.success"));
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.coverage.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "test_success_density"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "test_success_density"), true).appendTo(rightView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.coverage.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "test_failures"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "test_failures"), false).appendTo(rightView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.coverage.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "test_errors"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "test_errors"), false).appendTo(rightView);
	rightView.appendTo(view);
	AJS.sonar.views.addViewFooter(view, serverUrl);
	return view;
}
