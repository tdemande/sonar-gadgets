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

AJS.$.namespace("AJS.sonar.views.taglist");

AJS.sonar.views.taglist.VIEW_NAME = "taglist";

AJS.sonar.views.taglist.METRICS = 'tags,mandatory_tags,optional_tags,tags_distribution,nosonar_tags';

/**
 * Generate the Sonar taglist view
 * 
 * @param baseUrl the base url of the system displaying the view
 * @param server the Sonar server object
 * @param measureData the measure data of a project on Sonar
 * @param metricsDetails the details of the coverage measures
 * @return the jQuery wrapped view object
 */
AJS.sonar.views.taglist.generateView = function(baseUrl, server, measureData, metricsDetails) {
	AJS.sonar.text.load(baseUrl);
	var view = AJS.sonar.views.createViewContainer();
	var leftView = AJS.sonar.views.createColumn(true);
	leftView.append(AJS.sonar.views.createHeader("sonar.views.taglist"));
	AJS.sonar.views.createMeasureRow(server.host, AJS.sonar.views.taglist.VIEW_NAME, measureData.id,
			AJS.sonar.views.taglist.getMeasureFromResource(measureData, "tags"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "tags"), true).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(server.host, AJS.sonar.views.taglist.VIEW_NAME, measureData.id,
			AJS.sonar.views.taglist.getMeasureFromResource(measureData, "mandatory_tags"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "mandatory_tags"), false).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(server.host, AJS.sonar.views.taglist.VIEW_NAME, measureData.id,
			AJS.sonar.views.taglist.getMeasureFromResource(measureData, "optional_tags"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "optional_tags"), false).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(server.host, AJS.sonar.views.taglist.VIEW_NAME, measureData.id,
			AJS.sonar.views.taglist.getMeasureFromResource(measureData, "nosonar_tags"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "nosonar_tags"), false).appendTo(leftView);
	leftView.appendTo(view);
	var rightView = AJS.sonar.views.createColumn(false);
	AJS.sonar.views.createMetricChart(server.host, 
			AJS.sonar.utils.getMeasureFromResource(measureData, "tags_distribution")
	).appendTo(rightView);
	rightView.appendTo(view);
	AJS.sonar.views.addViewFooter(view, server.host);
	return view;
}

/**
 * Get a Measure from the resource JSON object by the Measure key
 * 
 * @param resource the Resource JSON object
 * @param msrKey the key of the Measure to get
 * @return the Measure of the resource
 */
AJS.sonar.views.taglist.getMeasureFromResource = function(resource, msrKey) {
	var msr = AJS.sonar.utils.getMeasureFromResource(resource, msrKey);
	if (msr.key === undefined) {
		// No measure was found, create a default one
		msr.key = msrKey;
		msr.val = 0.0;
		msr.frmt_val = 0;
	}
	return msr;
}
