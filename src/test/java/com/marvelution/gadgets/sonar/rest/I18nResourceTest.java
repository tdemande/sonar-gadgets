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

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

import java.util.Collections;
import java.util.List;
import java.util.Locale;

import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.internal.verification.VerificationModeFactory;

import com.atlassian.sal.api.message.I18nResolver;
import com.marvelution.gadgets.sonar.rest.model.I18nEntries;
import com.marvelution.gadgets.sonar.rest.model.I18nEntries.I18nEntry;

/**
 * Testcase for {@link I18nResource}
 * 
 * @author <a href="mailto:markrekveld@marvelution.com">Mark Rekveld</a>
 */
public class I18nResourceTest {

	@Mock
	private HttpHeaders headers;

	@Mock
	private I18nResolver i18nResolver;

	private I18nResource resource;

	/**
	 * Setup the test variables
	 * 
	 * @throws Exception in case of errors
	 */
	@Before
	public void before() throws Exception {
		MockitoAnnotations.initMocks(this);
		resource = new I18nResource(i18nResolver);
	}

	/**
	 * Test {@link I18nResource#generate(HttpHeaders)}
	 * 
	 * @throws Exception in case of errors
	 */
	@Test
	public void testGenerate() throws Exception {
		when(i18nResolver.getAllTranslationsForPrefix("sonar", Locale.ENGLISH)).thenReturn(
			Collections.singletonMap("sonar", "Sonar"));
		when(headers.getAcceptableLanguages()).thenReturn(Collections.singletonList(Locale.ENGLISH));
		final Response response = resource.generate(headers);
		assertThat(response.getStatus(), is(200));
		assertThat(response.getEntity(), is(I18nEntries.class));
		final I18nEntries entries = (I18nEntries) response.getEntity();
		assertThat(entries.getEntries().isEmpty(), is(false));
		assertThat(entries.getEntries().size(), is(1));
		final I18nEntry entry = ((List<I18nEntry>) entries.getEntries()).get(0);
		assertThat(entry.getKey(), is("sonar"));
		assertThat(entry.getValue(), is("Sonar"));
		verify(headers, VerificationModeFactory.times(3)).getAcceptableLanguages();
	}

}
