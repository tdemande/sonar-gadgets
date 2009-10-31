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

AJS.sonar.accessor.COVERAGE_METRICS = 'coverage_line_hits_data,tests,test_execution_time,test_errors,skipped_tests,test_failures,test_success_density,coverage,line_coverage,branch_coverage';
AJS.sonar.accessor.JSON_FORMAT = "json";

/**
 * Generate the Resource API url for a server
 * 
 * @param serverUrl the baseUrl of the Sonar Server
 * @return the generated Resource API url
 */
AJS.sonar.accessor.generateServerResourceApiUrl = function(serverUrl) {
	return serverUrl + "/api/resources?format=" + AJS.sonar.accessor.JSON_FORMAT;
}

/**
 * Generate the Metrics API url for a server
 * 
 * @param serverUrl the baseUrl of the Sonar Server
 * @return the generated Metrics API url
 */
AJS.sonar.accessor.generateServerMetricsApiUrl = function(serverUrl) {
	return serverUrl + "/api/metrics?format=" + AJS.sonar.accessor.JSON_FORMAT;
}

/**
 * Generate the Coverage API url for project
 * 
 * @param serverUrl the base url of the Sonar server
 * @param projectKey the project key of the project to get the coverage data for
 * @return the generated API url
 */
AJS.sonar.accessor.generateCoverageApiUrl = function(serverUrl, projectKey) {
	return AJS.sonar.accessor.generateServerResourceApiUrl(serverUrl) + "&metrics=" + AJS.sonar.accessor.COVERAGE_METRICS + "&resource=" + projectKey + "&includetrends=true&includealerts=true";
}
