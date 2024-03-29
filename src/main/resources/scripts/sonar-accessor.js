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

AJS.$.namespace("AJS.sonar.accessor");

AJS.sonar.accessor.JSON_FORMAT = "json";

AJS.sonar.accessor.FORCE_SERVLET_QUERY = true;

AJS.sonar.accessor.ERROR_CONTAINER_SELECTOR = ".gadget";

/**
 * Generate the Events API url for a server
 * 
 * @param projectKey the projectKey to get the events for
 * @return the generated Evetns API url
 */
AJS.sonar.accessor.generateServerEventApiUrl = function(projectKey, categories) {
	var categoriesParam = "";
	if (categories !== "") {
		categoriesParam = "&categories=" + categories;
	}
	return "/api/events?format=" + AJS.sonar.accessor.JSON_FORMAT + "&resource=" + projectKey + categoriesParam;
}

/**
 * Generate the Project API url for a server
 * 
 * @param projectKey the projectKey to get the project data for
 * @return the generated Project API url
 */
AJS.sonar.accessor.generateServerProjectApiUrl = function(projectKey, subprojects, versions) {
	var url = "/api/projects?format=" + AJS.sonar.accessor.JSON_FORMAT + "&key=" + projectKey;
	if (subprojects !== undefined && subprojects == true) {
		url += "&subprojects=true";
	}
	if (versions !== undefined && versions == true) {
		url += "&versions=true";
	}
	return url;
}

/**
 * Generate the Resource API url for a server
 * 
 * @return the generated Resource API url
 */
AJS.sonar.accessor.generateServerResourceApiUrl = function() {
	return "/api/resources?format=" + AJS.sonar.accessor.JSON_FORMAT;
}

/**
 * Generate the Metrics API url for a server
 * 
 * @return the generated Metrics API url
 */
AJS.sonar.accessor.generateServerMetricsApiUrl = function() {
	return "/api/metrics?format=" + AJS.sonar.accessor.JSON_FORMAT;
}

/**
 * Generate the Coverage API url for project
 * 
 * @param projectKey the project key of the project to get the coverage data for
 * @return the generated API url
 */
AJS.sonar.accessor.generateApiUrl = function(projectKey, metrics) {
	var metricsParam = "";
	if (metrics !== "") {
		metricsParam = "&metrics=" + metrics
	}
	var resourceParam = "";
	if (projectKey !== "") {
		resourceParam = "&resource=" + projectKey;
	}
	return AJS.sonar.accessor.generateServerResourceApiUrl() + metricsParam + resourceParam + "&includetrends=true&includealerts=true";
}

/**
 * Create the Ajax Options for invoking the Sonar Server
 * 
 * @param server the Sonar Server object with host, username and password properties
 * @param apiUrl the API url that needs to be invoked
 * @param successHandler the function executed on a successful invocation
 * @param errorHandler the function executed on a failure invocation
 */
AJS.sonar.accessor.getAjaxOptions = function(server, apiUrl, successHandler, errorHandler) {
	var options = {
		type: "GET",
		dataType: AJS.sonar.accessor.JSON_FORMAT
	};
	if (server.secured || AJS.sonar.accessor.FORCE_SERVLET_QUERY) {
		// The makeRequest servlet of Atlassian doesn't handle the authenticate correctly for Sonar instances
		// So redirect the call to the Sonar Make Request servlet that does it
		options.url = server.baseUrl + "/plugins/servlet/sonar/makeRequest";
		options.data = {
			url: server.queryHost + apiUrl,
			type: "json"
		};
	} else {
		options.url = server.host + apiUrl;
	}
	// We need a global error handler in case of whitelist access denied errors
	options.error = function(data, textStatus, xhr) {
		if (console !== undefined && console.log !== undefined) {
			console.log(data.text);
		}
		if (errorHandler !== undefined) {
			// Execute the custom error handler
			errorHandler(data, textStatus, xhr);
		} else if (AJS.$(AJS.sonar.accessor.ERROR_CONTAINER_SELECTOR).length > 0) {
			// Add the error to the error list
			if (data.text === undefined) {
				data.text = "An unknown error occured, please consult your administrator for assistance.";
			}
			var errorHash = AJS.$.md5(data.text);
			if (AJS.$("#err_" + errorHash).length === 0) {
				AJS.sonar.utils.generateErrorMessageBox(data.text).attr("id", "err_" + errorHash)
					.appendTo(AJS.$(AJS.sonar.accessor.ERROR_CONTAINER_SELECTOR));
			}
			if (AJS.sonar.accessor.ERROR_CONTAINER_SELECTOR === ".gadget") {
				// If we are in a gadget that the view is all f*cked.
				// So fix this by hiding the config and showing the view
				AJS.$(".gadget .view").css("display", "block");
				AJS.$("#config").css("display", "none");
			}
		} else if (data.text !== undefined) {
			// default, just alert the user
			alert(data.text);
		} else {
			alert("An unknown error occured, please consult your administrator for assistance.");
		}
	}
	if (successHandler !== undefined) {
		options.success = successHandler;
	}
	return options;
}

/**
 * Parse a given string into a Sonar Server object
 * 
 * @param baseUrl the Base url of the system servicing the gadget
 * @param serverString the server string to parse
 * @return the Server object
 */
AJS.sonar.accessor.parseSonarServer = function(baseUrl, serverString) {
	var matches = serverString.match(/(http|https):\/\/(.*):(.*)@(.*)/);
	if (matches !== null) {
		return {
			baseUrl: baseUrl,
            host: matches[1] + "://" + matches[4],
			queryHost: serverString,
			secured: true
		};
	} else {
		return {
			baseUrl: baseUrl,
			host: serverString,
			queryHost: serverString,
			secured: false
		};
	}
}

/**
 * Populate the project auto complete options
 * 
 * @param baseUrl the Atlassian server base URL
 * @param serverUrl the Sonar server url
 * @param projectInput the Project input field
 */
AJS.sonar.accessor.populateProjectAutocomplete = function(baseUrl, serverUrl, projectInput) {
	if (serverUrl !== undefined && serverUrl !== "") {
		// For the auto complete we require the Sonar make request servlet, so force its use
		var oldForceServlet = AJS.sonar.accessor.FORCE_SERVLET_QUERY;
		AJS.sonar.accessor.FORCE_SERVLET_QUERY = true;
		var ajaxOptions = AJS.sonar.accessor.getAjaxOptions(AJS.sonar.accessor.parseSonarServer(baseUrl, serverUrl),
			AJS.sonar.accessor.generateServerResourceApiUrl(), function(data) {
				var source = new Array();
				// Add the new keys
				AJS.$(data).each(function() {
					source.push(this.key);
				});
				// Set the new auto complete source
				projectInput.autocomplete("option", "source", source);
				// Use offset instead of position to get the absolute position and not the relative one
				var position = projectInput.offset();
				AJS.$(".ui-autocomplete").css({
					top: (position.top + projectInput.height() + 5) + "px",
					left: position.left + "px"
				});
			}
		);
		AJS.sonar.accessor.FORCE_SERVLET_QUERY = oldForceServlet;
		AJS.$.ajax(ajaxOptions);
	}
}
