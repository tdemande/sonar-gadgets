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

AJS.$.namespace("AJS.sonar.views.events");

AJS.sonar.views.events.VIEW_NAME = "events";

AJS.sonar.views.events.CATEGORIES = [{
			name: "all",
			key: ""
		}, {
			name: "alert",
			key: "Alert"
		}, {
			name: "profile",
			key: "Profile"
		}, {
			name: "version",
			key: "Version"
}];

/**
 * Generate the Sonar Events view
 * 
 * @param baseUrl the base url of the system displaying the view
 * @param server the Sonar server object
 * @param measureData the measure data of a project on Sonar
 * @param metricsDetails the details of the coverage measures
 * @return the jQuery wrapped view object
 */
AJS.sonar.views.events.generateView = function(baseUrl, server, projectKey, resizeMthod) {
	AJS.sonar.text.load(baseUrl);
	var view = AJS.sonar.views.createViewContainer();
	var header = AJS.$("<div/>").addClass("treemap-header");
	view.append(header);
	var eventsTable = AJS.$("<table/>").attr({id: "eventsTable"});
	view.append(eventsTable);
	var onChange = function() {
		AJS.$("#treemap-loading").show();
		var eventCategories =  AJS.$("#eventCategories").val();
		AJS.sonar.views.events.populateEventsTable(server, AJS.$("#eventsTable"), projectKey, eventCategories, resizeMthod);
	};
	AJS.$("<label/>").attr({"for" : "eventCategories"}).text(AJS.sonar.text.getMsg("sonar.views.events") + ": ").appendTo(header);
	AJS.sonar.views.events.createSelectElement("eventCategories", "eventCategories", "", onChange).appendTo(header);
	AJS.$("<img/>").attr({id: "treemap-loading", src: WAIT_IMAGE_SRC}).appendTo(header);
	AJS.sonar.views.events.populateEventsTable(server, eventsTable, projectKey, "", resizeMthod);
	AJS.sonar.views.addViewFooter(view, server.host);
	return view;
}

/**
 * Internal method to populate the given events table
 * 
 * @param server the Sonar server
 * @param eventsTable the jQuery wrapped events table html element
 * @param projectKey the project key to get the events from
 * @param categories the event categories to get
 * @param resizeMthod the method to call to resize the parent element holding the events table
 */
AJS.sonar.views.events.populateEventsTable = function(server, eventsTable, projectKey, categories, resizeMthod) {
	var url = AJS.sonar.accessor.generateServerEventApiUrl(projectKey, categories);
	var ajaxOptions = AJS.sonar.accessor.getAjaxOptions(server, url, function(resourceData) {
		eventsTable.empty();
		if (resourceData.length == 0) {
			AJS.$("<div/>").addClass("center-div").text(AJS.sonar.text.getMsg("sonar.views.events.no.data")).appendTo(treemapContainer);
		} else {
			AJS.$(resourceData).each(function(index, event) {
				var row = AJS.$("<tr/>");
				var date = AJS.sonar.utils.dateFromISO8601(event.dt);
				row.append(AJS.$("<td/>").text(date.format("d M Y")));
				row.append(AJS.$("<td/>").text(event.c));
				row.append(AJS.$("<td/>").text(event.n));
				if (event.ds !== undefined && event.ds !== "") {
					row.append(AJS.$("<td/>").text(event.ds));
				} else {
					row.append(AJS.$("<td/>"));
				}
				eventsTable.append(row);
			});
			AJS.$("#eventsTable tr:odd").addClass("odd-row");
			AJS.$("#eventsTable tr:even").addClass("even-row");
			try {
				resizeMthod();
			} catch(x) {}
		}
		AJS.$("#treemap-loading").hide();
		}, function(request, textStatus) {
			treemapContainer.empty();
			AJS.$("<div/>").addClass("center-div").text(
				AJS.sonar.text.getMsg("sonar.views.events.failed.to.get.data")
			).appendTo(treemapContainer);
			try {
				resizeMthod();
			} catch(x) {}
		}
	);
	AJS.$.ajax(ajaxOptions);
}

/**
 * Create a Select element for Metrics
 * 
 * @param name the name of the select element
 * @param id the id of the select element
 * @param options the Metric options
 * @param selected the selected metric key
 * @param onChange function to bind to the onChange event of the select element
 * @return the select element
 */
AJS.sonar.views.events.createSelectElement = function(name, id, selected, onChange) {
	var select = AJS.$("<select/>").attr({
		name: name,
		id: id
	});
	AJS.$(AJS.sonar.views.events.CATEGORIES).each(function(index, option) {
		AJS.$("<option/>").attr({
			value: option.key,
			selected: (option.key == selected)
		}).text(option.name).appendTo(select);
	});
	if (onChange != undefined && onChange != null) {
		select.change(onChange);
	}
	return select;
}
