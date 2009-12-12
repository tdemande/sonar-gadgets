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

AJS.$.namespace("AJS.sonar.gadget.utils");

/**
 * Utility method to set the title of a gadget given.
 * The title will only be set if the 'titleRequired' gadget preference is true
 * 
 * @param gadget the Gadget to set the title of
 * @param title the title value to set
 */
AJS.sonar.gadget.utils.setGadgetTitle = function(gadget, title) {
	if (gadget.getPref("titleRequired").toLowerCase() === "true") {
		gadgets.window.setTitle(title);
	}
}