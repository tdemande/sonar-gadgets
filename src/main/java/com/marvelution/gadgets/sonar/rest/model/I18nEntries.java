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

import java.util.Collection;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

/**
 * REST Model object for {@link I18nEntries}
 * 
 * @author <a href="mailto:markrekveld@marvelution.com">Mark Rekveld</a>
 */
@XmlRootElement
public class I18nEntries {

	private static final ToStringStyle TO_STRING_STYLE = ToStringStyle.SHORT_PREFIX_STYLE;

	@XmlElement
	private Collection<I18nEntry> entries;

	/**
	 * Default Constructor
	 */
	public I18nEntries() {
		// Default constructor used my the REST API
	}

	/**
	 * Constructor
	 * 
	 * @param entries the {@link Collection} of {@link I18nEntry} objects
	 */
	public I18nEntries(Collection<I18nEntry> entries) {
		this.entries = entries;
	}

	/**
	 * Get the entries
	 * 
	 * @return the {@link Collection} of {@link I18nEntry} objects
	 */
	public Collection<I18nEntry> getEntries() {
		return entries;
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public int hashCode() {
		return HashCodeBuilder.reflectionHashCode(this);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public boolean equals(Object object) {
		return EqualsBuilder.reflectionEquals(this, object);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this, I18nEntries.TO_STRING_STYLE);
	}

	/**
	 * REST model for {@link I18nEntry} objects
	 * 
	 * @author <a href="mailto:markrekveld@marvelution.com">Mark Rekveld</a>
	 */
	@XmlRootElement
	public static class I18nEntry  {

		@XmlElement
		private String key;

		@XmlElement
		private String value;

		/**
		 * Default Constructor
		 */
		public I18nEntry() {
			// Default constructor used my the REST API
		}

		/**
		 * Constructor
		 * 
		 * @param key the key of the entry
		 * @param value the value of the entry
		 */
		public I18nEntry(String key, String value) {
			this.key = key;
			this.value = value;
		}

		/**
		 * Get the key of the entry
		 * 
		 * @return the key
		 */
		public String getKey() {
			return key;
		}

		/**
		 * Get the value of the entry
		 * 
		 * @return the value
		 */
		public String getValue() {
			return value;
		}

		/**
		 * {@inheritDoc}
		 */
		@Override
		public int hashCode() {
			return HashCodeBuilder.reflectionHashCode(this);
		}

		/**
		 * {@inheritDoc}
		 */
		@Override
		public boolean equals(Object object) {
			return EqualsBuilder.reflectionEquals(this, object);
		}

		/**
		 * {@inheritDoc}
		 */
		@Override
		public String toString() {
			return ToStringBuilder.reflectionToString(this, I18nEntries.TO_STRING_STYLE);
		}

	}

}
