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

package com.marvelution.gadgets.sonar.rest;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Map.Entry;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.atlassian.plugins.rest.common.security.AnonymousAllowed;
import com.atlassian.sal.api.message.I18nResolver;
import com.marvelution.gadgets.sonar.rest.model.I18nEntries;
import com.marvelution.gadgets.sonar.rest.model.I18nEntries.I18nEntry;
import com.sun.jersey.spi.resource.Singleton;

/**
 * REST resource to get i18n keys and values for Sonar JavaScript objects
 * 
 * @author <a href="mailto:markrekveld@marvelution.com">Mark Rekveld</a>
 */
@Path("/i18n")
@AnonymousAllowed
@Consumes({ MediaType.APPLICATION_JSON })
@Produces({ MediaType.APPLICATION_JSON })
@Singleton
public class I18nResource {

	private I18nResolver i18nResolver;

	/**
	 * Constructor
	 * 
	 * @param i18nResolver the {@link I18nResolver} implementation
	 */
	public I18nResource(I18nResolver i18nResolver) {
		this.i18nResolver = i18nResolver;
	}

	/**
	 * Get the i18n keys and values that have a base key that is in the comma separator list of given basekeys
	 * 
	 * @param headers {@link HttpHeaders} of the request
	 * @return the {@link Response} object containing the requested i18n keys and values
	 */
	@GET
	public Response generate(@Context HttpHeaders headers) {
		final List<I18nEntry> entries = new ArrayList<I18nEntry>();
		Locale locale = Locale.ENGLISH;
		if (headers.getAcceptableLanguages() != null && !headers.getAcceptableLanguages().isEmpty()) {
			locale = headers.getAcceptableLanguages().get(0);
		}
		final Map<String, String> messages = i18nResolver.getAllTranslationsForPrefix("sonar", locale);
		for (Entry<String, String> message : messages.entrySet()) {
			entries.add(new I18nEntry(message.getKey(), message.getValue()));
		}
		return Response.ok(new I18nEntries(entries)).build();
	}

}
