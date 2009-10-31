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

AJS.$.namespace("AJS.gadget.sonar.fields");

/**
 * Get the Gadgets' isConfigured field
 *
 * @return the Gadgets' isConfigured field
 */
AJS.gadget.sonar.fields.isConfigured = function() {
	return {
		userpref: "isConfigured",
		type: "hidden",
		value: "true"
	};
}

/**
 * Generate the Server and the Project picker fields for a gadget
 * 
 * @param gadget the Gadget to generate the configuration fields for
 * @param serverPrefField the name of the server preference field
 * @param projectPrefField the name of the project preference field
 * @return the complete array of configuration fields for the Gadget
 */
AJS.gadget.sonar.fields.generateServerAndProjectPickerFields = function(gadget, serverPrefField, projectPrefField) {
	var gadgetId = AJS.sonar.utils.randomNumber();
	return [{
		userpref: serverPrefField,
		label: gadget.getMsg("sonar.gadget.common.server.label"),
		description: gadget.getMsg("sonar.gadget.common.server.description"),
		id: "sonar_server_picker_" + gadgetId,
		type: "callbackBuilder",
		callback: function(parentDiv) {
			var serverPref = AJS.$("<input/>").attr({
				name: serverPrefField,
				type: "text"
			}).val(gadget.getPref(serverPrefField)).addClass("text");
			serverPref.blur(function() {
				var selectList = AJS.$("#sonar_project_picker_" + gadgetId + " select");
				AJS.gadget.sonar.accessor.populateProjectSelectorWithProjects(gadget, serverPref.val(), selectList, "");
			});
			parentDiv.append(serverPref).append(
				AJS.$("<span/>").addClass("description").text(gadget.getMsg("sonar.gadget.common.server.description"))
			);
		}
	}, {
		userpref: projectPrefField,
		label: gadget.getMsg("sonar.gadget.common.project.label"),
		description: gadget.getMsg("sonar.gadget.common.project.description"),
		id: "sonar_project_picker_" + gadgetId,
		type: "callbackBuilder",
		callback: function(parentDiv) {
			var projectList = AJS.$("<select/>").attr({
				name: projectPrefField
			}).addClass("select-one");
			projectList.empty();
			if (gadget.getPref(serverPrefField) === "") {
				projectList.css("display", "none");
			} else {
				AJS.gadget.sonar.accessor.populateProjectSelectorWithProjects(gadget, gadget.getPref(serverPrefField), projectList, gadget.getPref(projectPrefField));
			}
			parentDiv.append(projectList).append(
				AJS.$("<span/>").addClass("description").text(gadget.getMsg("sonar.gadget.common.project.description"))
			);
		}
	}, AJS.gadget.sonar.fields.isConfigured()];
}