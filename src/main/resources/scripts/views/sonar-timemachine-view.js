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

AJS.$.namespace("AJS.sonar.views.timemachine");

AJS.sonar.views.timemachine.VIEW_NAME = "timemachine";

/**
 * Generate the Sonar Time Machine view
 * 
 * @param gadget the gadget
 * @param server the Sonar server object
 * @param measureData the measure data of a project on Sonar
 * @param metricsDetails the details of the coverage measures
 * @return the jQuery wrapped view object
 */
AJS.sonar.views.timemachine.generateView = function(gadget, server, measureData, metricsDetails) {
	AJS.sonar.text.load(gadget.getBaseUrl());
	var view = AJS.sonar.views.createViewContainer();
	var chart = AJS.$("<img/>").attr({
		src: AJS.sonar.views.timemachine.getChartUrl(gadget, server, measureData)
	});
	view.append(chart);
	AJS.sonar.views.addViewFooter(view, server.host);
	return view;
}

/**
 * Getter for the Chart base url
 * 
 * @param server the Sonar Server
 * @param projectData the Sonar Project resource
 * @return the Chart base url
 */
AJS.sonar.views.timemachine.getChartUrl = function(gadget, server, projectData) {
	var baseUrl = server.host + "/charts/trends/" + projectData.k + "?locale=en-US&sids=";
	var versions = new Array();
	for ( var version in projectData.v) {
		versions.push(projectData.v[version].sid);
	}
	var width = gadget.getView().width() - 50;
	var height = Math.round(width / 2.8);
	return baseUrl + versions.join() + "&metrics=" + gadget.getPref("metrics") + "&ts=" + new Date().getTime() + "&w="
		+ width + "&h=" + height;
}
