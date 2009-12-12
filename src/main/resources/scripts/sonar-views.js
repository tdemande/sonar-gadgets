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

AJS.$.namespace("AJS.sonar.views");

AJS.sonar.views.COVERAGE_VIEW = "coverage";

AJS.sonar.views.LOC_VIEW = "loc";

AJS.sonar.views.COMMENTS_VIEW = "comments";

AJS.sonar.views.VIOLATIONS_VIEW = "violations";

AJS.sonar.views.COMPLEXITY_VIEW = "complexity";

AJS.sonar.views.TREEMAP_VIEW = "treemap";

AJS.sonar.views.ALTERNATE_METRIC_LINK_PARAMS = {
		line_coverage: "highlight=line_coverage&amp;metric=uncovered_lines",
		branch_coverage: "highlight=branch_coverage&amp;metric=uncovered_conditions",
		public_documented_api_density: "highlight=public_documented_api_density&amp;metric=public_undocumented_api",
		public_undocumented_api: "highlight=public_undocumented_api&amp;metric=public_undocumented_api",
		commented_out_code_lines: "highlight=commented_out_code_lines&amp;metric=commented_out_code_lines",
		duplicated_lines_density: "highlight=duplicated_lines_density&amp;metric=duplicated_lines",
		violations_density: "highlight=weighted_violations&amp;metric=weighted_violations"
};

AJS.sonar.views.VIOLATIONS_PRIORITIES = {
	blocker: {
		name: 'blocker_violations',
		priority: 'BLOCKER',
		image: '/images/priority/BLOCKER.gif'
	},
	critical: {
		name: 'critical_violations',
		priority: 'CRITICAL',
		image: '/images/priority/CRITICAL.gif'
	},
	major: {
		name: 'major_violations',
		priority: 'MAJOR',
		image: '/images/priority/MAJOR.gif'
	},
	minor: {
		name: 'minor_violations',
		priority: 'MINOR',
		image: '/images/priority/MINOR.gif'
	},
	info: {
		name: 'info_violations',
		priority: 'INFO',
		image: '/images/priority/INFO.gif'
	}
};

AJS.sonar.views.DEFAULT_TREEMAP_DIMENSIONS = {width: 300, height: 300};

AJS.sonar.views.JSON_TYPE = "json";

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
AJS.sonar.views.generateTreemapView = function(baseUrl, serverUrl, resourceKey, metricsDetails, sizeMetricKey, colorMetricKey, dimensions, onChangeCallback) {
	AJS.sonar.text.load(baseUrl);
	var view = AJS.sonar.views.createViewContainer();
	var sizeMetric = AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, sizeMetricKey);
	var colorMetric = AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, colorMetricKey);
	if (dimensions == null || dimensions.width == undefined || dimensions.height == undefined) {
		dimensions = AJS.sonar.views.DEFAULT_TREEMAP_DIMENSIONS;
	}
	var header = AJS.$("<div/>").addClass("treemap-header");
	view.append(header);
	var treemapContainer = AJS.$("<div/>").attr({id: "sonarTreemap"});
	view.append(treemapContainer);
	var onChange = function() {
		AJS.$("#treemap-loading").show();
		var sizeMetric = AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, AJS.$("#sizeSelect").val());
		var colorMetric = AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, AJS.$("#colorSelect").val());
		AJS.sonar.views.populateTreemap(treemapContainer, serverUrl, resourceKey, metricsDetails, sizeMetric, colorMetric, dimensions);
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
	AJS.sonar.views.populateTreemap(treemapContainer, serverUrl, resourceKey, metricsDetails, sizeMetric, colorMetric, dimensions);
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
AJS.sonar.views.populateTreemap = function(treemapContainer, serverUrl, resourceKey, metricsDetails, sizeMetric, colorMetric, dimensions) {
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
										AJS.sonar.views.getTreemapResourceColor(colorMeasure, colorMetric),
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
								AJS.sonar.views.getTreemapResourceColor(null, colorMetric)
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
AJS.sonar.views.getTreemapResourceColor = function(colorMeasure, colorMetric) {
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

/**
 * Generate the Sonar Complexity view
 * 
 * @param baseUrl the base url of the system displaying the view
 * @param serverUrl the base url of the Sonar server
 * @param measureData the measure data of a project on Sonar
 * @param metricsDetails the details of the complexity measures
 * @return the jQuery wrapped view object
 */
AJS.sonar.views.generateComplexityView = function(baseUrl, serverUrl, measureData, metricsDetails) {
	AJS.sonar.text.load(baseUrl);
	var view = AJS.sonar.views.createViewContainer();
	var leftView = AJS.$("<div/>").attr({id: "leftColumn"}).addClass("left-column-onethird");
	leftView.append(AJS.sonar.views.createHeader("sonar.views.complexity"));
	AJS.sonar.views.createComplexityRow(serverUrl, AJS.sonar.views.COMPLEXITY_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "function_complexity"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "function_complexity"), false).appendTo(leftView);
	AJS.sonar.views.createComplexityRow(serverUrl, AJS.sonar.views.COMPLEXITY_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "class_complexity"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "class_complexity"), false).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COMPLEXITY_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "complexity"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "complexity"), false).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COMPLEXITY_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "statements"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "statements"), false).appendTo(leftView);
	leftView.appendTo(view);
	var rightView = AJS.$("<div/>").attr({id: "rightColumn"}).addClass("right-column-twothird");
	var tabsContainer = AJS.$("<div/>").attr({id: "tabs"});
	var chartsContainer = AJS.$("<div/>").attr({id: "charts"});
	AJS.sonar.views.addComplexityChart(serverUrl, tabsContainer, chartsContainer,
			AJS.sonar.utils.getMeasureFromResource(measureData, "function_complexity_distribution"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "function_complexity_distribution"), true
	);
	AJS.sonar.views.addComplexityChart(serverUrl, tabsContainer, chartsContainer,
			AJS.sonar.utils.getMeasureFromResource(measureData, "class_complexity_distribution"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "class_complexity_distribution"), false
	);
	tabsContainer.appendTo(rightView);
	chartsContainer.appendTo(rightView);
	rightView.appendTo(view);
	AJS.sonar.views.addViewFooter(view, serverUrl);
	return view;
}

/**
 * Add a Complexity Chart to the view
 * 
 * @param serverUrl the base url of the Sonar server
 * @param tabsContainer the jQuery object that will contain all the tabs
 * @param chartsContainer the jQuery object that will contain all the charts
 * @param measure the measure to display in a chart
 * @param metric the metric of the measure
 * @param showInitially flag to show of hide the chart
 */
AJS.sonar.views.addComplexityChart = function(serverUrl, tabsContainer, chartsContainer, measure, metric, showInitially) {
	var tab = AJS.$("<span/>").attr({
		id: "tab_" + metric.key
	}).addClass("tab").text(AJS.sonar.text.getMsg("sonar.views.complexity.tabs." + metric.key));
	if (showInitially) {
		tab.addClass("selected");
	}
	tab.click(function() {
		AJS.$("#tabs .tab").each(function(index, item) {
			AJS.$("#" + item.id).removeClass("selected");
		});
		AJS.$("#charts .chart").each(function(index, item) {
			AJS.$("#" + item.id).css("display", "none");
		});
		AJS.$("#tab_" + metric.key).addClass("selected");
		AJS.$("#chart_" + metric.key).css("display", "block");
	});
	tabsContainer.append(tab);
	var chart = AJS.$("<div/>").attr({
		id: "chart_" + metric.key
	}).addClass("chart").append(AJS.$("<img/>").attr({
		src: serverUrl + "/chart?ck=distbar&c=777777&v=" + escape(measure.data) + "&w=300&h=150&fs=8&bgc=ffffff"
	}));
	if (showInitially) {
		chart.css("display", "block");
	} else {
		chart.css("display", "none");
	}
	chartsContainer.append(chart);
}

/**
 * Create the Complexity row for a view
 * 
 * @param serverUrl the Sonar base url
 * @param view the name of the current view (e.g.: coverage, complexity, loc)
 * @param measure the measure data
 * @param metric the metric of the measure
 * @param isBig display the measure in big text (true) of small text (false)
 * @return the measure row element
 */
AJS.sonar.views.createComplexityRow = function(serverUrl, view, resourceId, measure, metric) {
	var textBase = "sonar.views." + view + ".";
	var row = AJS.$("<p/>");
	var backLink = AJS.$("<a/>").attr({
		href: serverUrl + "/drilldown/measures/" + resourceId + "?metric=" + metric.key,
		target: "_parent"
	}).addClass("big-measure");
	backLink.append(AJS.$("<span/>").addClass("alert_" + measure.alert).text(measure.frmt_val));
	backLink.appendTo(row);
	var imageName = AJS.sonar.utils.getTrendImage(measure, false);
	if (imageName !== "") {
		row.append(AJS.$("<img/>").attr({src: serverUrl + "/images" + imageName}));
	}
	if (AJS.sonar.text.getMsg(textBase + metric.key) !== "" && AJS.sonar.text.getMsg(textBase + metric.key) !== (textBase + metric.key)) {
		row.append(AJS.$("<span/>").text(" " + AJS.sonar.text.getMsg(textBase + metric.key)));
	}
	return row;
}

/**
 * Generate the Sonar Violaions view
 * 
 * @param baseUrl the base url of the system displaying the view
 * @param serverUrl the base url of the Sonar server
 * @param measureData the measure data of a project on Sonar
 * @param metricsDetails the details of the violations measures
 * @return the jQuery wrapped view object
 */
AJS.sonar.views.generateViolationsView = function(baseUrl, serverUrl, measureData, metricsDetails) {
	AJS.sonar.text.load(baseUrl);
	var view = AJS.sonar.views.createViewContainer();
	var leftView = AJS.sonar.views.createColumn(true);
	leftView.append(AJS.sonar.views.createHeader("sonar.views.violations.rules.compliance"));
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.VIOLATIONS_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "violations_density"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "violations_density"), true).appendTo(leftView);
	var efficiencyMeasure = AJS.sonar.utils.getMeasureFromResource(measureData, "efficiency");
	var maintainabilityMeasure = AJS.sonar.utils.getMeasureFromResource(measureData, "maintainability");
	var portabilityMeasure = AJS.sonar.utils.getMeasureFromResource(measureData, "portability");
	var reliabilityMeasure = AJS.sonar.utils.getMeasureFromResource(measureData, "reliability");
	var usabilityMeasure = AJS.sonar.utils.getMeasureFromResource(measureData, "usability");
	AJS.$("<a/>").attr({
		href: serverUrl + "/drilldown/violations/" + measureData.id + "?filter=category",
		target: "_parent"
	}).append(AJS.$("<img/>").attr({
		src: serverUrl + "/chart?ck=xradar&w=140&h=110&c=777777|F8A036&m=100&g=0.25&l=Eff.,Mai.,Por.,Rel.,Usa.&v=" + efficiencyMeasure.val + "," + maintainabilityMeasure.val + "," + portabilityMeasure.val + "," + reliabilityMeasure.val + "," + usabilityMeasure.val,
		width: 140,
		height: 110
	})).appendTo(leftView);
	leftView.appendTo(view);
	var rightView = AJS.sonar.views.createColumn(false);
	rightView.append(AJS.sonar.views.createHeader("sonar.views.violations"));
	AJS.sonar.views.createViolationMeasureRow(serverUrl, AJS.sonar.views.VIOLATIONS_VIEW, measureData.key,
			AJS.sonar.utils.getMeasureFromResource(measureData, "violations"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "violations"), true).appendTo(rightView);
	AJS.sonar.views.createViolationPriorityRow(serverUrl, measureData,
			AJS.sonar.utils.getMeasureFromResource(measureData, "violations"),
			AJS.sonar.views.VIOLATIONS_PRIORITIES.blocker).appendTo(rightView);
	AJS.sonar.views.createViolationPriorityRow(serverUrl, measureData,
			AJS.sonar.utils.getMeasureFromResource(measureData, "violations"),
			AJS.sonar.views.VIOLATIONS_PRIORITIES.critical).appendTo(rightView);
	AJS.sonar.views.createViolationPriorityRow(serverUrl, measureData,
			AJS.sonar.utils.getMeasureFromResource(measureData, "violations"),
			AJS.sonar.views.VIOLATIONS_PRIORITIES.major).appendTo(rightView);
	AJS.sonar.views.createViolationPriorityRow(serverUrl, measureData,
			AJS.sonar.utils.getMeasureFromResource(measureData, "violations"),
			AJS.sonar.views.VIOLATIONS_PRIORITIES.minor).appendTo(rightView);
	AJS.sonar.views.createViolationPriorityRow(serverUrl, measureData,
			AJS.sonar.utils.getMeasureFromResource(measureData, "violations"),
			AJS.sonar.views.VIOLATIONS_PRIORITIES.info).appendTo(rightView);
	rightView.appendTo(view);
	AJS.sonar.views.addViewFooter(view, serverUrl);
	return view;
}

/**
 * Create a violation priority row
 * 
 * @param serverUrl the Sonar server base url
 * @param measureData the measure data of the project
 * @param violationsData the violatons metric data
 * @param priority a AJS.sonar.views.VIOLATIONS_PRIORITIES priority
 */
AJS.sonar.views.createViolationPriorityRow = function(serverUrl, measureData, violationsData, priority) {
	var row = AJS.$("<div/>").addClass("violation-row");
	AJS.$("<img/>").attr({src: serverUrl + priority.image}).appendTo(row);
	AJS.$("<div/>").addClass("violation-name").append(AJS.$("<a/>").attr({
		href: serverUrl + "/drilldown/violations/" + measureData.key + "?priority=" + priority.priority,
		target: "_parent"
	}).text(AJS.sonar.text.getMsg("sonar.views.violations." + priority.name))).appendTo(row);
	var measure = AJS.sonar.utils.getMeasureFromResource(measureData, priority.name);
	AJS.$("<div/>").addClass("violations alert_" + measure.alert).text(measure.frmt_val).appendTo(row);
	if (measure.val > 0) {
		var percentage = AJS.sonar.utils.getPercentage(measure.val, violationsData.val);
		AJS.$("<div/>").addClass("barchart").css({
			width: percentage + "px"
		}).append(AJS.$("<div/>").css({
			width: "100%",
			"background-color": "#777"
		})).appendTo(row);
	}
	return row;
}

/**
 * Generate the Sonar Coverage view
 * 
 * @param baseUrl the base url of the system displaying the view
 * @param serverUrl the base url of the Sonar server
 * @param measureData the measure data of a project on Sonar
 * @param metricsDetails the details of the coverage measures
 * @return the jQuery wrapped view object
 */
AJS.sonar.views.generateCoverageView = function(baseUrl, serverUrl, measureData, metricsDetails) {
	AJS.sonar.text.load(baseUrl);
	var view = AJS.sonar.views.createViewContainer();
	var leftView = AJS.sonar.views.createColumn(true);
	leftView.append(AJS.sonar.views.createHeader("sonar.views.coverage.code.coverage"));
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COVERAGE_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "coverage"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "coverage"), true).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COVERAGE_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "line_coverage"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "line_coverage"), false).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COVERAGE_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "branch_coverage"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "branch_coverage"), false).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COVERAGE_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "tests"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "tests"), false).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COVERAGE_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "test_execution_time"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "test_execution_time"), false).appendTo(leftView);
	leftView.appendTo(view);
	var rightView = AJS.sonar.views.createColumn(false);
	rightView.append(AJS.sonar.views.createHeader("sonar.views.coverage.test.success"));
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COVERAGE_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "test_success_density"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "test_success_density"), true).appendTo(rightView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COVERAGE_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "test_failures"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "test_failures"), false).appendTo(rightView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COVERAGE_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "test_errors"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "test_errors"), false).appendTo(rightView);
	rightView.appendTo(view);
	AJS.sonar.views.addViewFooter(view, serverUrl);
	return view;
}

/**
 * Generate the Sonar LOC view
 * 
 * @param baseUrl the base url of the system displaying the view
 * @param serverUrl the base url of the Sonar server
 * @param measureData the measure data of a project on Sonar
 * @param metricsDetails the details of the coverage measures
 * @return the jQuery wrapped view object
 */
AJS.sonar.views.generateLocView = function(baseUrl, serverUrl, measureData, metricsDetails) {
	AJS.sonar.text.load(baseUrl);
	var view = AJS.sonar.views.createViewContainer();
	var leftView = AJS.sonar.views.createColumn(true);
	leftView.append(AJS.sonar.views.createHeader("sonar.views.loc"));
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.LOC_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "ncloc"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "ncloc"), true).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.LOC_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "lines"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "lines"), false).appendTo(leftView);
	leftView.appendTo(view);
	var rightView = AJS.sonar.views.createColumn(false);
	rightView.append(AJS.sonar.views.createHeader("sonar.views.loc.classes.header"));
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.LOC_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "classes"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "classes"), true).appendTo(rightView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.LOC_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "packages"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "packages"), false).appendTo(rightView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.LOC_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "functions"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "functions"), false).appendTo(rightView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.LOC_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "accessors"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "accessors"), false).appendTo(rightView);
	rightView.appendTo(view);
	AJS.sonar.views.addViewFooter(view, serverUrl);
	return view;
}

/**
 * Generate the Sonar Comments view
 * 
 * @param baseUrl the base url of the system displaying the view
 * @param serverUrl the base url of the Sonar server
 * @param measureData the measure data of a project on Sonar
 * @param metricsDetails the details of the coverage measures
 * @return the jQuery wrapped view object
 */
AJS.sonar.views.generateCommentsView = function(baseUrl, serverUrl, measureData, metricsDetails) {
	AJS.sonar.text.load(baseUrl);
	var view = AJS.sonar.views.createViewContainer();
	var leftView = AJS.sonar.views.createColumn(true);
	leftView.append(AJS.sonar.views.createHeader("sonar.views.comments"));
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COMMENTS_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "comment_lines_density"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "comment_lines_density"), true).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COMMENTS_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "comment_lines"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "comment_lines"), false).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COMMENTS_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "public_documented_api_density"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "public_documented_api_density"), false).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COMMENTS_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "public_undocumented_api"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "public_undocumented_api"), false).appendTo(leftView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COMMENTS_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "commented_out_code_lines"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "commented_out_code_lines"), false).appendTo(leftView);
	leftView.appendTo(view);
	var rightView = AJS.sonar.views.createColumn(false);
	rightView.append(AJS.sonar.views.createHeader("sonar.views.comments.duplications"));
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COMMENTS_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "duplicated_lines_density"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "duplicated_lines_density"), true).appendTo(rightView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COMMENTS_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "duplicated_lines"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "duplicated_lines"), false).appendTo(rightView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COMMENTS_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "duplicated_blocks"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "duplicated_blocks"), false).appendTo(rightView);
	AJS.sonar.views.createMeasureRow(serverUrl, AJS.sonar.views.COMMENTS_VIEW, measureData.id,
			AJS.sonar.utils.getMeasureFromResource(measureData, "duplicated_files"),
			AJS.sonar.utils.getMetricFromMetricsArray(metricsDetails, "duplicated_files"), false).appendTo(rightView);
	rightView.appendTo(view);
	AJS.sonar.views.addViewFooter(view, serverUrl);
	return view;
}

/**
 * Create the common View container div element
 * 
 * @return the container div element
 */
AJS.sonar.views.createViewContainer = function() {
	return AJS.$("<div/>").addClass("view-container");
}

/**
 * Create a column div element
 * 
 * @param isLeft flag whether the column is for left (true) or right (false)
 * @return the column div element
 */
AJS.sonar.views.createColumn = function(isLeft) {
	var column = AJS.$("<div/>");
	if (isLeft) {
		column.attr({id: "leftColumn"});
		column.addClass("left-column");
	} else {
		column.attr({id: "rightColumn"});
		column.addClass("right-column");
	}
	return column;
}

/**
 * Create a header element for Sonar Views
 * 
 * @param labelKey the label i18n key used to get the text of the header
 * @return the header element
 */
AJS.sonar.views.createHeader = function(labelKey) {
	return AJS.$("<h4/>").text(AJS.sonar.text.getMsg(labelKey));
}

/**
 * Create the Measure row for a view
 * 
 * @param serverUrl the Sonar base url
 * @param view the name of the current view (e.g.: coverage, complexity, loc)
 * @param measure the measure data
 * @param metric the metric of the measure
 * @param isBig display the measure in big text (true) of small text (false)
 * @return the measure row element
 */
AJS.sonar.views.createViolationMeasureRow = function(serverUrl, view, resourceKey, measure, metric, isBig) {
	var textBase = "sonar.views." + view + ".";
	var row = AJS.$("<p/>");
	if (isBig) {
		row.addClass("big-measure");
	}
	var linkParams = "metric=" + metric.key;
	if (AJS.sonar.views.ALTERNATE_METRIC_LINK_PARAMS[metric.key]) {
		linkParams = AJS.sonar.views.ALTERNATE_METRIC_LINK_PARAMS[metric.key];
	}
	var backLink = AJS.$("<a/>").attr({
		href: serverUrl + "/drilldown/violations/" + resourceKey,
		target: "_parent"
	});
	backLink.append(AJS.$("<span/>").addClass("alert_" + measure.alert).text(measure.frmt_val));
	if (AJS.sonar.text.getMsg(textBase + metric.key) !== "" && AJS.sonar.text.getMsg(textBase + metric.key) !== (textBase + metric.key)) {
		backLink.append(AJS.$("<span/>").text(" " + AJS.sonar.text.getMsg(textBase + metric.key)));
	}
	var imageName = AJS.sonar.utils.getTrendImage(measure, !isBig);
	if (imageName !== "") {
		backLink.append(AJS.$("<img/>").attr({src: serverUrl + "/images" + imageName}));
	}
	backLink.appendTo(row);
	return row;
}

/**
 * Create the Measure row for a view
 * 
 * @param serverUrl the Sonar base url
 * @param view the name of the current view (e.g.: coverage, complexity, loc)
 * @param measure the measure data
 * @param metric the metric of the measure
 * @param isBig display the measure in big text (true) of small text (false)
 * @return the measure row element
 */
AJS.sonar.views.createMeasureRow = function(serverUrl, view, resourceId, measure, metric, isBig) {
	var textBase = "sonar.views." + view + ".";
	var row = AJS.$("<p/>");
	if (isBig) {
		row.addClass("big-measure");
	}
	var linkParams = "metric=" + metric.key;
	if (AJS.sonar.views.ALTERNATE_METRIC_LINK_PARAMS[metric.key]) {
		linkParams = AJS.sonar.views.ALTERNATE_METRIC_LINK_PARAMS[metric.key];
	}
	var backLink = AJS.$("<a/>").attr({
		href: serverUrl + "/drilldown/measures/" + resourceId + "?" + linkParams,
		target: "_parent"
	});
	backLink.append(AJS.$("<span/>").addClass("alert_" + measure.alert).text(measure.frmt_val));
	if (AJS.sonar.text.getMsg(textBase + metric.key) !== "" && AJS.sonar.text.getMsg(textBase + metric.key) !== (textBase + metric.key)) {
		backLink.append(AJS.$("<span/>").text(" " + AJS.sonar.text.getMsg(textBase + metric.key)));
	}
	var imageName = AJS.sonar.utils.getTrendImage(measure, !isBig);
	if (imageName !== "") {
		backLink.append(AJS.$("<img/>").attr({src: serverUrl + "/images" + imageName}));
	}
	backLink.appendTo(row);
	return row;
}

/**
 * Add the footer to the view container
 * 
 * @param viewContainer the div containing the sonar view
 * @param serverUrl the url of the Sonar server
 */
AJS.sonar.views.addViewFooter = function(viewContainer, serverUrl) {
	var footer = AJS.$("<div/>").addClass("sonar-footer")
		.text(AJS.sonar.text.getMsg("sonar.views.connected.to"))
		.append(AJS.$("<a/>").attr({
			href: serverUrl,
			target: "_parent"
		}).text(serverUrl))
		.appendTo(footer);
	viewContainer.append(footer);
}
