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

import java.io.IOException;
import java.net.MalformedURLException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import com.marvelution.gadgets.sonar.GadgetSonarServerAccessor;
import com.marvelution.sonar.rest.client.service.SonarServerAccessorException;

/**
 * {@link HttpServlet} for invoking secured requests to a Sonar Server.
 * This is required because the makeRequest servlet of Atlassian doens't support authentication in the request.
 * 
 * @author <a href="mailto:markrekveld@marvelution.com">Mark Rekveld</a>
 * @since 1.1.0
 */
public class SonarAccessorServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	private final Logger logger = Logger.getLogger(SonarAccessorServlet.class);

	private GadgetSonarServerAccessor serverAccessor;

	/**
	 * Setter for the {@link GadgetSonarServerAccessor}
	 * 
	 * @param serverAccessor the {@link GadgetSonarServerAccessor} implementation
	 */
	public void setServerAccessor(GadgetSonarServerAccessor serverAccessor) {
		this.serverAccessor = serverAccessor;
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		try {
			serverAccessor.invokeSonarServer(req, resp);
		} catch (SonarServerAccessorException e) {
			logger.error("Failed to invoke Sonar Server", e);
			resp.sendError(HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
		} catch (MalformedURLException e) {
			logger.error("Failed to invoke Sonar Server invalid url provided", e);
			resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
		}
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		doGet(req, resp);
	}

}
