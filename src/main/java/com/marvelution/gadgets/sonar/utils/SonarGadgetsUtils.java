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

package com.marvelution.gadgets.sonar.utils;

import java.util.Collection;
import java.util.HashSet;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.Map.Entry;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.atlassian.sal.api.message.I18nResolver;

/**
 * Utility class for the Sonar Gadgets
 * 
 * @author <a href="mailto:markrekveld@marvelution.com">Mark rekveld</a>
 * 
 * @since 1.2.0
 */
public class SonarGadgetsUtils {

	private static final Pattern GADGET_ID_PATTERN = Pattern.compile("^sonar\\.gadget\\.([a-z]*)\\.title$");

	private final I18nResolver i18nResolver;

	/**
	 * Constructor
	 * 
	 * @param i18nResolver the {@link I18nResolver} implementation
	 */
	public SonarGadgetsUtils(I18nResolver i18nResolver) {
		this.i18nResolver = i18nResolver;
	}

	/**
	 * Get all the Sonar gadget Ids
	 * 
	 * @return {@link Collection} with all the Sonar Gadget Ids
	 */
	public Collection<String> getGadgetIds() {
		final Set<String> gadgetIds = new HashSet<String>();
		final Map<String, String> bundle = i18nResolver.getAllTranslationsForPrefix("sonar.gadget", Locale.ENGLISH);
		for (final Entry<String, String> entry : bundle.entrySet()) {
			final Matcher matcher = GADGET_ID_PATTERN.matcher(entry.getKey());
			if (matcher.find()) {
				gadgetIds.add(matcher.group(1));
			}
		}
		return gadgetIds;
	}

}
