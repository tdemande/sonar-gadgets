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

package com.marvelution.gadgets.sonar;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

import java.io.PrintWriter;
import java.net.MalformedURLException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.internal.verification.VerificationModeFactory;

import com.marvelution.sonar.rest.client.service.SonarServer;
import com.marvelution.sonar.rest.client.service.SonarServerAccessorException;

/**
 * Testcase for {@link GadgetSonarServerAccessor}
 * 
 * @author <a href="mailto:markrekveld@marvelution.com">Mark Rekveld</a>
 * @since 1.1.0
 */
public class GadgetSonarServerAccessorTest {

	private GadgetSonarServerAccessor accessor;

	@Mock
	private HttpServletRequest request;

	@Mock
	private HttpServletResponse response;

	@Mock
	private PrintWriter writer;

	/**
	 * Setup the test variables
	 * 
	 * @throws Exception in case of errors
	 */
	@Before
	public void before() throws Exception {
		MockitoAnnotations.initMocks(this);
		when(response.getWriter()).thenReturn(writer);
		accessor = new TestGadgetSonarServerAccess();
	}

	/**
	 * Test {@link GadgetSonarServerAccessor#invokeSonarServer(HttpServletRequest, HttpServletResponse)}
	 * 
	 * @throws Exception in case of errors
	 */
	@Test
	public void testInvokeSonarServer() throws Exception {
		when(request.getParameter("host")).thenReturn("http://sonar.marvelution.com");
		when(request.getParameter("apiUrl")).thenReturn(
			"/api/resource?resource=com.marvelution.jira.plugins:jira-sonar-plugin");
		accessor.invokeSonarServer(request, response);
		verify(request, VerificationModeFactory.times(1)).getParameter("host");
		verify(request, VerificationModeFactory.times(1)).getParameter("apiUrl");
		verify(response, VerificationModeFactory.times(1)).setHeader("Pragma", "no-cache");
		verify(response, VerificationModeFactory.times(1)).setHeader("Cache-Control", "no-cache");
		verify(response, VerificationModeFactory.times(1)).setStatus(HttpServletResponse.SC_OK);
		verify(response, VerificationModeFactory.times(1)).setContentType("application/json");
		verify(response, VerificationModeFactory.times(1)).setCharacterEncoding("UTF-8");
		verify(response, VerificationModeFactory.times(1)).getWriter();
		verify(writer, VerificationModeFactory.times(1)).write("Fake Response");
	}

	/**
	 * Test {@link GadgetSonarServerAccessor#invokeSonarServer(HttpServletRequest, HttpServletResponse)}
	 * 
	 * @throws Exception in case of errors
	 */
	@Test
	public void testInvokeSonarServerNoQueryString() throws Exception {
		when(request.getParameter("host")).thenReturn("http://sonar.marvelution.com");
		when(request.getParameter("apiUrl")).thenReturn("/api/resource");
		accessor.invokeSonarServer(request, response);
		verify(request, VerificationModeFactory.times(1)).getParameter("host");
		verify(request, VerificationModeFactory.times(1)).getParameter("apiUrl");
		verify(response, VerificationModeFactory.times(1)).setHeader("Pragma", "no-cache");
		verify(response, VerificationModeFactory.times(1)).setHeader("Cache-Control", "no-cache");
		verify(response, VerificationModeFactory.times(1)).setStatus(HttpServletResponse.SC_OK);
		verify(response, VerificationModeFactory.times(1)).setContentType("application/json");
		verify(response, VerificationModeFactory.times(1)).setCharacterEncoding("UTF-8");
		verify(response, VerificationModeFactory.times(1)).getWriter();
		verify(writer, VerificationModeFactory.times(1)).write("Fake Response");
	}

	/**
	 * Test {@link GadgetSonarServerAccessor#invokeSonarServer(HttpServletRequest, HttpServletResponse)}
	 * 
	 * @throws Exception in case of errors
	 */
	@Test
	public void testInvokeSonarServerInvalidRequestNoSonarHost() throws Exception {
		when(request.getParameter("apiUrl")).thenReturn(
			"/api/resource?resource=com.marvelution.jira.plugins:jira-sonar-plugin");
		try {
			accessor.invokeSonarServer(request, response);
			fail("This test should since the host parameter is not set in the request");
		} catch (SonarServerAccessorException e) {
			assertThat(e.getMessage(), is("No SonarServer host url found in Request"));
		}
		verify(request, VerificationModeFactory.times(1)).getParameter("host");
		verify(request, VerificationModeFactory.times(1)).getParameter("apiUrl");
		verify(response, VerificationModeFactory.times(0)).setHeader("Pragma", "no-cache");
		verify(response, VerificationModeFactory.times(0)).setHeader("Cache-Control", "no-cache");
		verify(response, VerificationModeFactory.times(0)).setStatus(HttpServletResponse.SC_OK);
		verify(response, VerificationModeFactory.times(0)).setContentType("application/json");
		verify(response, VerificationModeFactory.times(0)).setCharacterEncoding("UTF-8");
		verify(response, VerificationModeFactory.times(0)).getWriter();
		verify(writer, VerificationModeFactory.times(0)).write("Fake Response");
	}

	/**
	 * Test {@link GadgetSonarServerAccessor#invokeSonarServer(HttpServletRequest, HttpServletResponse)}
	 * 
	 * @throws Exception in case of errors
	 */
	@Test
	public void testInvokeSonarServerSecuredHost() throws Exception {
		when(request.getParameter("host")).thenReturn("http://sonar.marvelution.com");
		when(request.getParameter("username")).thenReturn("sonar");
		when(request.getParameter("password")).thenReturn("sonar");
		when(request.getParameter("apiUrl")).thenReturn(
			"/api/resource?resource=com.marvelution.jira.plugins:jira-sonar-plugin");
		accessor.invokeSonarServer(request, response);
		verify(request, VerificationModeFactory.times(1)).getParameter("host");
		verify(request, VerificationModeFactory.times(1)).getParameter("apiUrl");
		verify(request, VerificationModeFactory.times(3)).getParameter("username");
		verify(request, VerificationModeFactory.times(3)).getParameter("password");
		verify(response, VerificationModeFactory.times(1)).setHeader("Pragma", "no-cache");
		verify(response, VerificationModeFactory.times(1)).setHeader("Cache-Control", "no-cache");
		verify(response, VerificationModeFactory.times(1)).setStatus(HttpServletResponse.SC_OK);
		verify(response, VerificationModeFactory.times(1)).setContentType("application/json");
		verify(response, VerificationModeFactory.times(1)).setCharacterEncoding("UTF-8");
		verify(response, VerificationModeFactory.times(1)).getWriter();
		verify(writer, VerificationModeFactory.times(1)).write("Fake Response");
	}

	/**
	 * Test {@link GadgetSonarServerAccessor#invokeSonarServer(HttpServletRequest, HttpServletResponse)}
	 * 
	 * @throws Exception in case of errors
	 */
	@Test
	public void testInvokeSonarServerInvliadRequestNoApiUrl() throws Exception {
		when(request.getParameter("host")).thenReturn("http://sonar.marvelution.com");
		try {
			accessor.invokeSonarServer(request, response);
			fail("This test should since the apiUrl parameter is not set in the request");
		} catch (SonarServerAccessorException e) {
			assertThat(e.getMessage(), is("No API url found in Request"));
		}
		verify(request, VerificationModeFactory.times(0)).getParameter("host");
		verify(request, VerificationModeFactory.times(1)).getParameter("apiUrl");
		verify(response, VerificationModeFactory.times(0)).setHeader("Pragma", "no-cache");
		verify(response, VerificationModeFactory.times(0)).setHeader("Cache-Control", "no-cache");
		verify(response, VerificationModeFactory.times(0)).setStatus(HttpServletResponse.SC_OK);
		verify(response, VerificationModeFactory.times(0)).setContentType("application/json");
		verify(response, VerificationModeFactory.times(0)).setCharacterEncoding("UTF-8");
		verify(response, VerificationModeFactory.times(0)).getWriter();
		verify(writer, VerificationModeFactory.times(0)).write("Fake Response");
	}

	/**
	 * Test {@link GadgetSonarServerAccessor#validateParamsForFormat(Map)}
	 * 
	 * @throws Exception in case of errors
	 */
	@Test
	public void testValidateParamsForFormat() throws Exception {
		final Map<String, String> queryMap = new HashMap<String, String>();
		queryMap.put("resource", "com.marvelution.jira.plugins:jira-sonar-plugin");
		queryMap.put("format", "json");
		final Map<String, String> params = accessor.validateParamsForFormat(queryMap);
		assertThat(params.containsKey("format"), is(true));
		assertThat(params.get("format"), is("json"));
	}

	/**
	 * Test {@link GadgetSonarServerAccessor#validateParamsForFormat(Map)}
	 * 
	 * @throws Exception in case of errors
	 */
	@Test
	public void testValidateParamsForFormatAddXmlFormat() throws Exception {
		final Map<String, String> queryMap = new HashMap<String, String>();
		queryMap.put("resource", "com.marvelution.jira.plugins:jira-sonar-plugin");
		final Map<String, String> params = accessor.validateParamsForFormat(queryMap);
		assertThat(params.containsKey("format"), is(true));
		assertThat(params.get("format"), is("xml"));
	}

	/**
	 * Customized {@link GadgetSonarServerAccessor} for testing
	 * 
	 * @author <a href="mailto:markrekveld@marvelution.com">Mark Rekveld</a>
	 * @since 1.1.0
	 */
	public class TestGadgetSonarServerAccess extends GadgetSonarServerAccessor {

		/**
		 * {@inheritDoc}
		 */
		@Override
		protected String getSonarServerActionResponse(SonarServer server, String action, Map<String, String> params)
						throws MalformedURLException, SonarServerAccessorException {
			return "Fake Response";
		}
		
	}

}
