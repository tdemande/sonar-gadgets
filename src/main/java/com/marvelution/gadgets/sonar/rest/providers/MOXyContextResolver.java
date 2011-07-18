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

package com.marvelution.gadgets.sonar.rest.providers;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import javax.ws.rs.ext.ContextResolver;
import javax.ws.rs.ext.Provider;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;

import org.eclipse.persistence.jaxb.JAXBContextFactory;
import org.sonar.wsclient.services.Model;

import com.marvelution.gadgets.sonar.rest.exceptions.MOXyContextResolverException;


/**
 * JAX-RS {@link Provider} to provide the {@link JAXBContext} for the Sonar WS Client domain classes.
 * 
 * @author <a href="mailto:markrekveld@marvelution.com">Mark Rekveld</a>
 */
@Provider
public class MOXyContextResolver implements ContextResolver<JAXBContext> {

	/**
	 * {@inheritDoc}
	 */
	@Override
	public JAXBContext getContext(Class<?> type) {
		if (Model.class.isInstance(type)) {
			InputStream binding = MOXyContextResolver.class.getClassLoader().getResourceAsStream("moxy/sonar-bindings.xml");
			Map<String, Object> properties = new HashMap<String, Object>(1);
			properties.put(JAXBContextFactory.ECLIPSELINK_OXM_XML_KEY, binding);
			try {
				return JAXBContext.newInstance(new Class[] {type}, properties);
			} catch (JAXBException e) {
				throw new MOXyContextResolverException("Failed to create a new JAXBContext for the Sonar domain class: " + type.getName(), e);
			} finally {
				try {
					binding.close();
				} catch (IOException e) {
					throw new MOXyContextResolverException("Failed to close the sonar-bindings.xml InputStream", e);
				}
			}
		}
		return null;
	}

}
