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

AJS.$.namespace("AJS.sonar.text");

AJS.sonar.text.loaded = false;

AJS.sonar.text.msgStore = [];

/**
 * Get a i18n String for a key given
 * 
 * @param msgKey the key to get the i18n string for
 * @return the message string, may be the key if the key is not found
 */
AJS.sonar.text.getMsg = function(msgKey) {
	for (var index in AJS.sonar.text.msgStore) {
		if (AJS.sonar.text.msgStore[index].key === msgKey) {
			return AJS.sonar.text.msgStore[index].value;
		}
	}
	return msgKey;
}

/**
 * Load all i18n keys for the Sonar views
 * 
 * @param baseUrl the base url of the system hosting the i18n keys
 */
AJS.sonar.text.load = function(baseUrl) {
	 if (!AJS.sonar.text.loaded) {
		AJS.$.ajax({
			url: baseUrl + "/rest/sonar/1.0/i18n",
			async: false,
			type: "GET",
			dataType: "json",
			success: function(data) {
				AJS.sonar.text.msgStore = data.entries;
				AJS.sonar.text.loaded = true;
			}
		});
	 }
}
