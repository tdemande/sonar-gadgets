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

AJS.$.namespace("AJS.sonar.views.treemap");

AJS.sonar.views.treemap.VIEW_NAME = "treemap";

AJS.sonar.views.treemap.DEFAULT_TREEMAP_DIMENSIONS = {width: 300, height: 300};

/**
 * Generate the Treemap view
 * 
 * @param baseUrl the base url of the server hosting the treemap
 * @param serverUrl te base url of the Sonar server
 * @param resourceKey the base resource key, may be null
 * @param metricsDetails array with details of all the available metrics on the Sonar server
 * @param sizeMetric the metric used for treemap cell sizing
 * @param colorMetric the metric used for treemap cell background coloring
 * @param dimensions the dimensions object with the width and height for the treemap
 * @param onChangeCallback function to be called when size or color metrics change
 * @return the treemap view
 */
AJS.sonar.views.treemap.generateView = function(baseUrl, serverUrl, resourceKey, metricsDetails, sizeMetricKey, colorMetricKey, dimensions, onChangeCallback) {
	AJS.sonar.text.load(baseUrl);
	var view = AJS.sonar.views.createViewContainer();
	var sizeMetric = AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, sizeMetricKey);
	var colorMetric = AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, colorMetricKey);
	if (dimensions == null || dimensions.width == undefined || dimensions.height == undefined) {
		dimensions = AJS.sonar.views.treemap.DEFAULT_TREEMAP_DIMENSIONS;
	}
	var header = AJS.$("<div/>").addClass("treemap-header");
	view.append(header);
	var treemapContainer = AJS.$("<div/>").attr({id: "sonarTreemap"});
	view.append(treemapContainer);
	var onChange = function() {
		AJS.$("#treemap-loading").show();
		var sizeMetric = AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, AJS.$("#sizeSelect").val());
		var colorMetric = AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, AJS.$("#colorSelect").val());
		AJS.sonar.views.treemap.populateTreemap(treemapContainer, serverUrl, resourceKey, metricsDetails, sizeMetric, colorMetric, dimensions);
		if (onChangeCallback != null) {
			try {
				onChangeCallback(sizeMetric, colorMetric);
			} catch(x) {}
		}
	};
	AJS.$("<label/>").attr({"for" : "sizeSelect"}).text(AJS.sonar.text.getMsg("sonar.views.treemap.size") + ": ").appendTo(header);
	AJS.sonar.utils.createMetricSelectElement("sizeMetric", "sizeSelect", AJS.sonar.utils.getSizeMetrics(metricsDetails), sizeMetric.key,
			onChange).appendTo(header);
	AJS.$("<label/>").attr({"for" : "colorSelect"}).text(AJS.sonar.text.getMsg("sonar.views.treemap.color") + ": ").appendTo(header);
	AJS.sonar.utils.createMetricSelectElement("colorMetric", "colorSelect", AJS.sonar.utils.getColorMetrics(metricsDetails), colorMetric.key,
			onChange).appendTo(header);
	AJS.$("<img/>").attr({id: "treemap-loading", src: WAIT_IMAGE_SRC}).appendTo(header);
	AJS.sonar.views.treemap.populateTreemap(treemapContainer, serverUrl, resourceKey, metricsDetails, sizeMetric, colorMetric, dimensions);
	AJS.sonar.views.addViewFooter(view, serverUrl);
	return view;
}

/**
 * Populate the treemap container object with the actual treemap
 * 
 * @param treemapContainer the jQuery wrapped object that will contain the treemap
 * @param serverUrl the base url of the Sonar Server
 * @param resourceKey the base resource key, may be null
 * @param metricsDetails array with details of all the available metrics on the Sonar server
 * @param sizeMetric the metric used for treemap cell sizing
 * @param colorMetric the metric used for treemap cell background coloring
 * @param dimensions the dimensions object with the width and height for the treemap
 */
AJS.sonar.views.treemap.populateTreemap = function(treemapContainer, serverUrl, resourceKey, metricsDetails, sizeMetric, colorMetric, dimensions) {
	var resources = [];
	var url = AJS.sonar.accessor.generateApiUrl(serverUrl, resourceKey, sizeMetric.key + "," + colorMetric.key);
	if (resourceKey != "") {
		url += "&depth=-1&scopes=PRJ,DIR";
	}
	AJS.$.ajax({
		type: "GET",
		dataType: AJS.sonar.views.JSON_TYPE,
		cache: false,
		url: url,
		success: function(resourceData) {
			treemapContainer.empty();
			if (resourceData.length == 0) {
				AJS.$("<div/>").addClass("center-div").text(AJS.sonar.text.getMsg("sonar.views.treemap.no.data")).appendTo(treemapContainer);
			} else {
				var scope = "PRJ";
				if (resourceKey != "") {
					var projectCount = 0;
					AJS.$(resourceData).each(function(index, resource) {
						if (resource.scope == "PRJ") {
							projectCount++;
						}
					});
					if (projectCount == 1) {
						scope = "DIR";
					}
				}
				treemapContainer.treemap(dimensions.width, dimensions.height, {
					getData: function() {
						var validValues = false;
						var data = [];
						AJS.$(resourceData).each(function(index, resource) {
							if (!(resourceKey != "" && resourceKey == resource.key) && resource.scope == scope) {
								var sizeMeasure = AJS.sonar.utils.getMeasureFromResource(resource, sizeMetric.key);
								var colorMeasure = AJS.sonar.utils.getMeasureFromResource(resource, colorMetric.key);
								if (!isNaN(parseFloat(sizeMeasure.val)) && parseFloat(sizeMeasure.val) > 0) {
									resources.push({
										id: resource.id,
										name: resource.name,
										size: {
											metric: sizeMetric,
											measure: sizeMeasure
										},
										color: {
											metric: colorMetric,
											measure: colorMeasure
										}
									});
									var entry = [
										AJS.$("<div/>").addClass("sonar-treemap-cell").text(resource.name),
										parseFloat(sizeMeasure.val),
										AJS.sonar.views.treemap.getTreemapResourceColor(colorMeasure, colorMetric),
										resource.id
									];
									data.push(entry);
								}
							}
						});
						if (data.length == 0) {
							data = [];
							data.push([
								AJS.$("<div/>").addClass("sonar-treemap-cell").text(AJS.sonar.text.getMsg("sonar.views.treemap.no.data")),
								100,
								AJS.sonar.views.treemap.getTreemapResourceColor(null, colorMetric)
							]);
						}
						return data;
					},
					borderWidth: 2,
					borderColor: "#FFF",
					getColor: function(val, options) {
						return val;
					}
				});
				AJS.$(resources).each(function(index, resource) {
					var cell = AJS.$("#" + resource.id);
					cell.click(function(event) {
						parent.location.href = serverUrl + "/project/index/" + resource.id;
					});
					cell.tooltip({
						delay: 0,
						showUrl: false,
						track: true,
						bodyHandler: function() {
							var tip = AJS.$("<div/>").addClass("treemap-tooltip");
							AJS.$("<div/>").addClass("treemap-tooltip-header").append(resource.name).appendTo(tip);
							AJS.$("<div/>").addClass("tremap-tooltip-measure").append(
								AJS.$("<span/>").text(resource.size.metric.name)
							).append(": ").append(
								AJS.$("<span/>").text(resource.size.measure.frmt_val)
							).appendTo(tip);
							AJS.$("<div/>").addClass("tremap-tooltip-measure").append(
								AJS.$("<span/>").text(resource.color.metric.name)
							).append(": ").append(
								AJS.$("<span/>").text(resource.color.measure.frmt_val)
							).appendTo(tip);
							return tip;
						}
					});
				});
			}
			AJS.$("#treemap-loading").hide();
		},
		error: function(request, textStatus) {
			treemapContainer.empty();
			AJS.$("<div/>").addClass("center-div").text(
				AJS.sonar.text.getMsg("sonar.views.treemap.failed.to.get.data")
			).appendTo(treemapContainer);
		}
	});
}

/**
 * Get the Treemap cell background color for the given measure
 * 
 * @param colorMeasure the measure of the resource that is used to calculate the background color
 * @param colorMetric the metric details
 * @return the background color
 */
AJS.sonar.views.treemap.getTreemapResourceColor = function(colorMeasure, colorMetric) {
	var MIN = 0, MAX = 100;
	var MIN_COLOR = {r: 255, g: 0, b: 0}; //'#FF0000';
	var MEAN_COLOR = {r: 255, g: 176, b: 0}; //'#FFB000';
	var MAX_COLOR = {r: 0, g: 255, b: 0}; //'#00FF00';
	if (colorMeasure != null && colorMeasure.alert != null) {
		if (colorMeasure.alert === "OK") {
			return "#00FF00";
		} else if (colorMeasure.alert === "WARN") {
			return "#FF8500";
		} else if (colorMeasure.alert === "ERROR") {
			return "#F93F40";
		}
	}
	var value;
	if (colorMeasure == null) {
		value = -1;
	} else if (colorMetric.val_type === "LEVEL") {
		if (colorMeasure.val === "OK") {
			value = 100;
		} else if (colorMeasure.val === "WARN") {
			value = 50;
		} else if (colorMeasure.val === "ERROR") {
			value = 0;
		}
	} else {
		value = colorMeasure.val;
	}
	if (value < 0) {
		return "#DDDDDD";
	} else {
		var interval = (MAX - MIN) / 2;
		var mean = (MIN + MAX) / 2.0;
		var color;
		if (value > mean) {
			var value_percent = ((value - mean) / interval) * 100.0;
			if (colorMetric.direction >= 0) {
				color = AJS.sonar.utils.mixColors(MAX_COLOR, MEAN_COLOR, value_percent);
			} else {
				color = AJS.sonar.utils.mixColors(MIN_COLOR, MEAN_COLOR, value_percent);
			}
		} else {
			var value_percent = ((mean - value) / interval) * 100.0;
			if (colorMetric.direction >= 0) {
				color = AJS.sonar.utils.mixColors(MIN_COLOR, MEAN_COLOR, value_percent);
			} else {
				color = AJS.sonar.utils.mixColors(MAX_COLOR, MEAN_COLOR, value_percent);
			}
		}
		return "#" + AJS.sonar.utils.rgbToHex(color.r, color.g, color.b);
	}
}
