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

package com.marvelution.gadgets.sonar.rest.exceptions;

import com.marvelution.gadgets.sonar.rest.providers.MOXyContextResolver;


/**
 * {@link Exception} thrown by the {@link MOXyContextResolver}
 * 
 * @author <a href="mailto:markrekveld@marvelution.com">Mark Rekveld</a>
 */
public class MOXyContextResolverException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	/**
	 * Default constructor
	 */
	public MOXyContextResolverException() {
	}

	/**
	 * Constructor
	 * 
	 * @param message the Exception message
	 * @param cause the Exception cause
	 */
	public MOXyContextResolverException(String message, Throwable cause) {
		super(message, cause);
	}

	/**
	 * Constructor
	 * 
	 * @param message the Exception message
	 */
	public MOXyContextResolverException(String message) {
		super(message);
	}

	/**
	 * Constructor
	 * 
	 * @param cause the Exception cause
	 */
	public MOXyContextResolverException(Throwable cause) {
		super(cause);
	}

}
