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

AJS.$.namespace("AJS.sonar.views.loc");

AJS.sonar.views.loc.VIEW_NAME = "loc";

AJS.sonar.views.loc.METRICS = 'ncloc,lines,classes,packages,functions,accessors';

/**
 * Generate the Sonar LOC view
 * 
 * @param baseUrl the base url of the system displaying the view
 * @param serverUrl the base url of the Sonar server
 * @param measureData the measure data of a project on Sonar
 * @param metricsDetails the details of the coverage measures
 * @return the jQuery wrapped view object
 */
AJS.sonar.views.loc.generateView = function(baseUrl, serverUrl, measureData, metricsDetails) {
	AJS.sonar.text.load(baseUrl);
	var view = AJS.sonar.views.createViewContainer();
	var leftView = AJS.sonar.views.createColumn(true);
	leftView.append(AJS.sonar.views.createHeader("sonar.views.loc"));
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.loc.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "ncloc"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "ncloc"), true).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.loc.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "lines"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "lines"), false).appendTo(leftView);
	leftView.appendTo(view);
	var rightView = AJS.sonar.views.createColumn(false);
	rightView.append(AJS.sonar.views.createHeader("sonar.views.loc.classes.header"));
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.loc.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "classes"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "classes"), true).appendTo(rightView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.loc.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "packages"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "packages"), false).appendTo(rightView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.loc.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "functions"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "functions"), false).appendTo(rightView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.loc.VIEW_NAME, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "accessors"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "accessors"), false).appendTo(rightView);
	rightView.appendTo(view);
	AJS.sonar.views.addViewFooter(view, serverUrl);
	return view;
}
