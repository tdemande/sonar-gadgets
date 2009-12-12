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

package com.marvelution.gadgets.sonar.rest.model;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

import java.util.Collections;

import org.junit.Test;

import com.marvelution.gadgets.sonar.rest.model.I18nEntries.I18nEntry;

/**
 * Testcase for the {@link I18nEntries} class
 * 
 * @author <a href="mailto:markrekveld@marvelution.com">Mark Rekveld</a>
 */
public class I18nEntriesTest {

	/**
	 * Test {@link I18nEntries#equals(Object)}
	 */
	@Test
	public void testI18nEntriesEquals() {
		final I18nEntries entries = new I18nEntries(Collections.singletonList(new I18nEntry("key", "value")));
		assertThat(entries.equals(new I18nEntries()), is(false));
		assertThat(entries.equals(entries), is(true));
	}

	/**
	 * Test {@link I18nEntries#toString()}
	 */
	@Test
	public void testI18nEntriesToString() {
		final I18nEntries entries = new I18nEntries(Collections.singletonList(new I18nEntry("key", "value")));
		assertThat(entries.toString(), is("I18nEntries[entries=[I18nEntries.I18nEntry[key=key,value=value]]]"));
		assertThat(new I18nEntries().toString(), is("I18nEntries[entries=<null>]"));
	}

	/**
	 * Test {@link I18nEntry#equals(Object)}
	 */
	@Test
	public void testI18nEntryEquals() {
		final I18nEntry entry = new I18nEntry("key", "value");
		assertThat(entry.equals(new I18nEntry()), is(false));
		assertThat(entry.equals(entry), is(true));
	}

	/**
	 * Test {@link I18nEntry#toString()}
	 */
	@Test
	public void testI18nEntryToString() {
		final I18nEntry entry = new I18nEntry("key", "value");
		assertThat(entry.toString(), is("I18nEntries.I18nEntry[key=key,value=value]"));
		assertThat(new I18nEntry().toString(), is("I18nEntries.I18nEntry[key=<null>,value=<null>]"));
	}

}
