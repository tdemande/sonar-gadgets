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

AJS.gadget.sonar.fields.waitImage = function () {
	var imageSrc = "";
	if (WAIT_IMAGE_SRC !== undefined) {
		imageSrc = WAIT_IMAGE_SRC;
	}
	return AJS.$("<img/>").attr({
		id: "waitingImage",
		border: 0,
		src: imageSrc
	}).addClass("waiting-image");
}

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
  * Get the Gadgets' titleRequired field
  *
  * @return the Gadgets' titleRequired field
  */
 AJS.gadget.sonar.fields.titleRequired = function() {
 	return {
 		userpref: "titleRequired",
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
	return [{
		id: "sonarServer",
		userpref: serverPrefField,
		label: gadget.getMsg("sonar.gadget.common.server.label"),
		description: gadget.getMsg("sonar.gadget.common.server.description"),
		type: "text",
		value: gadget.getPref(serverPrefField)
	}, {
		id: "sonarProject",
		userpref: projectPrefField,
		label: gadget.getMsg("sonar.gadget.common.project.label"),
		description: gadget.getMsg("sonar.gadget.common.project.description"),
		type: "callbackBuilder",
		callback: function(parentDiv) {
			var projectInput = AJS.$("<input/>").attr({
				name: projectPrefField,
				type: "text"
			}).val(gadget.getPref(projectPrefField)).addClass("text");
			projectInput.autocomplete({
				minLength: 4,
				source: []
			});
			parentDiv.append(projectInput).append(
				AJS.$("<div/>").addClass("description").text(gadget.getMsg("sonar.gadget.common.project.description"))
			);
			if (gadget.getPref(serverPrefField) !== "") {
				// The server url is already given, populate the auto complete
				AJS.sonar.accessor.populateProjectAutocomplete(gadget.getBaseUrl(), gadget.getPref(serverPrefField), projectInput);
			}
			// Register the focusout event of the server pref field
			AJS.$("#sonarServer").focusout(function() {
				AJS.sonar.accessor.populateProjectAutocomplete(gadget.getBaseUrl(), this.value, projectInput);
			});
		}
	}, AJS.gadget.sonar.fields.isConfigured(), AJS.gadget.sonar.fields.titleRequired()];
}
