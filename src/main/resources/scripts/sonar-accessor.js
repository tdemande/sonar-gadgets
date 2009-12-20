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

AJS.sonar.accessor.FORCE_SERVLET_QUERY = false;

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
		dataTpe: AJS.sonar.accessor.JSON_FORMAT
	};
	if (successHandler !== undefined) {
		options.success = successHandler;
	}
	if (errorHandler !== undefined) {
		options.error = errorHandler;
	}
	if (server.secured || AJS.sonar.accessor.FORCE_SERVLET_QUERY) {
		options.url = server.baseUrl + '/plugins/servlet/sonar/querySonar';
		options.data = {
			username: server.username,
			password: server.password,
			host: server.host,
			apiUrl: apiUrl
		};
	} else {
		options.url = server.host + apiUrl;
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
			username: matches[2],
			password: matches[3],
			host: matches[1] + "://" + matches[4],
			secured: true
		};
	} else {
		return {
			baseUrl: baseUrl,
			host: serverString,
			secured: false
		};
	}
}
