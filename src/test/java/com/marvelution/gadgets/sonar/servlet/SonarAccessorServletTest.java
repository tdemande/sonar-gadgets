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

package com.marvelution.gadgets.sonar.servlet;

import static org.mockito.Mockito.*;

import java.net.MalformedURLException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.internal.verification.VerificationModeFactory;

import com.marvelution.gadgets.sonar.GadgetSonarServerAccessor;
import com.marvelution.sonar.rest.client.service.SonarServerAccessorException;

/**
 * Test case for {@link SonarAccessorServlet}
 * 
 * @author <a href="mailto:markrekveld@marvelution.com">Mark Rekveld</a>
 * @since 1.1.0
 */
public class SonarAccessorServletTest {

	private SonarAccessorServlet servlet;

	@Mock
	private GadgetSonarServerAccessor serverAccessor;

	@Mock
	private HttpServletRequest request;

	@Mock
	private HttpServletResponse response;

	/**
	 * Setup the test variables
	 * 
	 * @throws Exception in case of errors
	 */
	@Before
	public void before() throws Exception {
		MockitoAnnotations.initMocks(this);
		servlet = new SonarAccessorServlet();
		servlet.setServerAccessor(serverAccessor);
	}

	/**
	 * Test {@link SonarAccessorServlet#doGet(HttpServletRequest, HttpServletResponse)}
	 * 
	 * @throws Exception in case of errors
	 */
	@Test
	public void testDoGet() throws Exception {
		doNothing().when(serverAccessor).invokeSonarServer(request, response);
		servlet.doGet(request, response);
		verify(serverAccessor, VerificationModeFactory.times(1)).invokeSonarServer(request, response);
	}

	/**
	 * Test {@link SonarAccessorServlet#doGet(HttpServletRequest, HttpServletResponse)}
	 * 
	 * @throws Exception in case of errors
	 */
	@Test
	public void testDoGetThrowingSonarServerAccessorException() throws Exception {
		doThrow(new SonarServerAccessorException("Failure")).when(serverAccessor).invokeSonarServer(request, response);
		servlet.doGet(request, response);
		verify(serverAccessor, VerificationModeFactory.times(1)).invokeSonarServer(request, response);
		verify(response, VerificationModeFactory.times(1)).sendError(HttpServletResponse.SC_BAD_REQUEST, "Failure");
	}

	/**
	 * Test {@link SonarAccessorServlet#doGet(HttpServletRequest, HttpServletResponse)}
	 * 
	 * @throws Exception in case of errors
	 */
	@Test
	public void testDoGetThrowingMalformedURLException() throws Exception {
		doThrow(new MalformedURLException("Failure")).when(serverAccessor).invokeSonarServer(request, response);
		servlet.doGet(request, response);
		verify(serverAccessor, VerificationModeFactory.times(1)).invokeSonarServer(request, response);
		verify(response, VerificationModeFactory.times(1)).sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
			"Failure");
	}

	/**
	 * Test {@link SonarAccessorServlet#doPost(HttpServletRequest, HttpServletResponse)}
	 * 
	 * @throws Exception in case of errors
	 */
	@Test
	public void testDoPost() throws Exception {
		doNothing().when(serverAccessor).invokeSonarServer(request, response);
		servlet.doPost(request, response);
		verify(serverAccessor, VerificationModeFactory.times(1)).invokeSonarServer(request, response);
	}

}
