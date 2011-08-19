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
 * Populate the project auto complete options
 * 
 * @param gadget the Gadget
 * @param serverUrl the Sonar server url
 * @param projectInput the Project input field
 */
AJS.gadget.sonar.accessor.populateProjectAutocomplete = function(gadget, serverUrl, projectInput) {
	var ajaxOptions = AJS.sonar.accessor.getAjaxOptions(AJS.sonar.accessor.parseSonarServer(gadget.getBaseUrl(), serverUrl),
		AJS.sonar.accessor.generateServerResourceApiUrl(), function(data) {
			// Get the current auto complete source
			var source = projectInput.autocomplete("option", "source");
			// Add the new keys
			AJS.$(data).each(function() {
				source.push(this.key);
			});
			// Set the new auto complete source
			projectInput.autocomplete("option", "source", source);
			var position = projectInput.position();
			AJS.$(".ui-autocomplete").css({
				top: (position.top + projectInput.height() + 5) + "px",
				left: position.left + "px"
			});
		}
	);
	AJS.$.ajax(ajaxOptions);
}
