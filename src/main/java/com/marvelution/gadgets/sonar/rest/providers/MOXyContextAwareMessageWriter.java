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
import java.io.OutputStream;
import java.lang.annotation.Annotation;
import java.lang.reflect.Type;

import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.ext.ContextResolver;
import javax.ws.rs.ext.MessageBodyWriter;
import javax.ws.rs.ext.Provider;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;

import org.apache.log4j.Logger;
import org.sonar.wsclient.services.Model;

/**
 * @author <a href="mailto:markrekveld@marvelution.com">Mark Rekveld</a>
 */
@Provider
@Produces({ MediaType.APPLICATION_XML, MediaType.TEXT_XML })
public class MOXyContextAwareMessageWriter implements MessageBodyWriter<Model> {

	private final Logger logger = Logger.getLogger(MOXyContextAwareMessageWriter.class);

	@Context
	ContextResolver<JAXBContext> contextResolver;

	/**
	 * {@inheritDoc}
	 */
	@Override
	public boolean isWriteable(Class<?> type, Type genericType, Annotation[] annotations, MediaType mediaType) {
		logger.debug("Can [" + type.getName() + "] be written by MOXyContextAwareMessageWriter: "
			+ Model.class.isAssignableFrom(type));
		return Model.class.isAssignableFrom(type);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public long getSize(Model model, Class<?> type, Type genericType, Annotation[] annotations, MediaType mediaType) {
		return -1;
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void writeTo(Model model, Class<?> type, Type genericType, Annotation[] annotations, MediaType mediaType,
					MultivaluedMap<String, Object> httpHeaders, OutputStream entityStream) throws IOException,
					WebApplicationException {
		logger.debug("Getting JAXBContext for " + type.getName());
		JAXBContext context = contextResolver.getContext(type);
		try {
			logger.debug("Marshalling " + type.getName());
			context.createMarshaller().marshal(model, entityStream);
		} catch (JAXBException e) {
			logger.error("Failed to marshal " + type.getName(), e);
		}
	}

}
