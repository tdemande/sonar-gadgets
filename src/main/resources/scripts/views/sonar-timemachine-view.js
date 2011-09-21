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
	var width = gadget.getView().width() - 50;
	var height = Math.round(width / 2.8);
	var chart = AJS.$("<img/>").attr({
		src: AJS.sonar.views.timemachine.getChartUrl(gadget, server, measureData, width, height),
		width: width,
		height: height
	}).css({
		padding: "10px"
	});
	view.append(chart);
	AJS.sonar.views.addViewFooter(view, server.host);
	return view;
}

/**
 * Generate the Sonar Time Machine canvas view
 * 
 * @param gadget the gadget
 * @param server the Sonar server object
 * @param measureData the measure data of a project on Sonar
 * @param metricsDetails the details of the coverage measures
 * @return the jQuery wrapped view object
 */
AJS.sonar.views.timemachine.generateCanvasView = function(gadget, server, measureData, metricsDetails) {
	AJS.sonar.text.load(gadget.getBaseUrl());
	var view = AJS.sonar.views.createViewContainer();
	var width = (Math.round((gadget.getView().width() - 100) / 4) * 3);
	var height = Math.round(width / 2.8);
	var chart = AJS.$("<img/>").attr({
		id: "timeMachineChart",
		src: AJS.sonar.views.timemachine.getChartUrl(gadget, server, measureData, width, height),
		width: width,
		height: height
	}).css({
		padding: "10px"
	});
	view.append(AJS.$("<center/>").append(chart));
	view.append(AJS.sonar.views.createHeader("sonar.views.timemachine.metrics"));
	var metrics = AJS.sonar.utils.getTimeMachineMetrics(metricsDetails);
	var selectedMetrics = gadget.getPref("metrics").split(",");
	var domainLists = {};
	AJS.$(metrics).each(function(index, metric) {
		if (domainLists[metric.domain] === undefined) {
			domainLists[metric.domain] = AJS.$("<ul/>").addClass("time-machine-metrics");
			domainLists[metric.domain].append(AJS.$("<li/>").addClass("time-machine-metric-domain-header").text(metric.domain));
			view.append(domainLists[metric.domain]);
		}
		var metricOption = AJS.$("<li/>");
		var checkbox = AJS.$("<input/>").attr({
			type: "checkbox",
			id: "metric-" + metric.key,
			name: "metric-" + metric.key,
			value: metric.key
		});
		if (AJS.$.inArray(metric.key, selectedMetrics) > -1) {
			checkbox.attr({
				checked: "checked"
			});
		}
		checkbox.change(function() {
			var metric = AJS.$(this).val();
			var metrics = gadget.getPref("metrics").split(",");
			if (AJS.$(this).attr("checked")) {
				metrics.push(metric);
			} else {
				var index = AJS.$.inArray(metric, metrics);
				if (index != -1) {
					metrics.splice(index, 1);
				}
			}
			gadget.savePref("metrics", metrics.join());
			var chart = AJS.$("#timeMachineChart");
			var newSrc = chart.attr("src");
			newSrc = newSrc.substring(0, newSrc.indexOf("&metrics="));
			chart.attr("src", newSrc + "&metrics=" + metrics.join());
		});
		metricOption.append(checkbox);
		metricOption.append(AJS.$("<label/>").attr({
			"for": "metric-" + metric.key
		}).text(metric.name));
		domainLists[metric.domain].append(metricOption);
	});
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
AJS.sonar.views.timemachine.getChartUrl = function(gadget, server, projectData, width, height) {
	var baseUrl = server.host + "/charts/trends/" + projectData.k + "?locale=en-US&sids=";
	var versions = new Array();
	for ( var version in projectData.v) {
		versions.push(projectData.v[version].sid);
	}
	return baseUrl + versions.join() + "&ts=" + new Date().getTime() + "&w=" + width + "&h=" + height
		+ "&metrics=" + gadget.getPref("metrics");
}
