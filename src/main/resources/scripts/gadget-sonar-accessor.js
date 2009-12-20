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

AJS.$.namespace("AJS.gadget.sonar.accessor");

/**
 * Populate the project select element with projects from a Sonar server
 * 
 * @param gadget the Gadget
 * @param serverUrl the Sonar server url
 * @param projectSelector the Select element to add the projects to
 * @param addAllProjectsOption flag to add an option for all projects
 * @param selectedKey the selected Project Key
 */
AJS.gadget.sonar.accessor.populateProjectSelectorWithProjects = function(gadget, serverUrl, projectSelector, selectedKey, addAllProjectsOption) {
	var waitImage = AJS.$("#waitingImage");
	projectSelector.empty();
	projectSelector.css("display", "none");
	waitImage.css("display", "block");
	gadget.resize();
	var ajaxOptions = AJS.sonar.accessor.getAjaxOptions(AJS.sonar.accessor.parseSonarServer(gadget.getBaseUrl(), serverUrl),
		AJS.sonar.accessor.generateServerResourceApiUrl(), function(data) {
			if (addAllProjectsOption !== null && addAllProjectsOption.value !== undefined && addAllProjectsOption.label !== undefined) {
				projectSelector.append(
					AJS.$("<option/>").attr({
						value: addAllProjectsOption.value,
						selected: (selectedKey === addAllProjectsOption.value)
					}).text(addAllProjectsOption.label)
				);
			}
			AJS.$(data).each(function() {
				projectSelector.append(
					AJS.$("<option/>").attr({
						value: this.key,
						selected: (selectedKey === this.key)
					}).text(this.name)
				);
			});
			waitImage.css("display", "none");
			projectSelector.css("display", "block");
			gadget.resize();
		}
	);
	AJS.$.ajax(ajaxOptions);
}
