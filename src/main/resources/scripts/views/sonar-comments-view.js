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

AJS.$.namespace("AJS.sonar.views.comments");

AJS.sonar.views.comments.VIEW_NAME = "comments";

/**
 * Generate the Sonar Comments view
 * 
 * @param baseUrl the base url of the system displaying the view
 * @param serverUrl the base url of the Sonar server
 * @param measureData the measure data of a project on Sonar
 * @param metricsDetails the details of the coverage measures
 * @return the jQuery wrapped view object
 */
AJS.sonar.views.comments.generateView = function(baseUrl, serverUrl, measureData, metricsDetails) {
	AJS.sonar.text.load(baseUrl);
	var view = AJS.sonar.views.createViewContainer();
	var leftView = AJS.sonar.views.createColumn(true);
	leftView.append(AJS.sonar.views.createHeader("sonar.views.comments"));
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.comments.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "comment_lines_density"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "comment_lines_density"), true).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.comments.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "comment_lines"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "comment_lines"), false).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.comments.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "public_documented_api_density"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "public_documented_api_density"), false).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.comments.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "public_undocumented_api"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "public_undocumented_api"), false).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.comments.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "commented_out_code_lines"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "commented_out_code_lines"), false).appendTo(leftView);
	leftView.appendTo(view);
	var rightView = AJS.sonar.views.createColumn(false);
	rightView.append(AJS.sonar.views.createHeader("sonar.views.comments.duplications"));
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.comments.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "duplicated_lines_density"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "duplicated_lines_density"), true).appendTo(rightView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.comments.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "duplicated_lines"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "duplicated_lines"), false).appendTo(rightView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.comments.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "duplicated_blocks"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "duplicated_blocks"), false).appendTo(rightView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.comments.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "duplicated_files"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "duplicated_files"), false).appendTo(rightView);
	rightView.appendTo(view);
	AJS.sonar.views.addViewFooter(view, serverUrl);
	return view;
}
