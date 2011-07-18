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

import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

import com.atlassian.plugins.rest.common.Status;
import com.marvelution.gadgets.sonar.rest.exceptions.MOXyContextResolverException;

/**
 * {@link ExceptionMapper} implementation  for the {@link MOXyContextResolverException}
 * 
 * @author <a href="mailto:markrekveld@marvelution.com">Mark Rekveld</a>
 */
@Provider
public class MOXyContextResolverExceptionMapper implements ExceptionMapper<MOXyContextResolverException> {

	/**
	 * {@inheritDoc}
	 */
	@Override
	public Response toResponse(MOXyContextResolverException exception) {
		return Status.error().message(exception.getMessage()).response();
	}

}
