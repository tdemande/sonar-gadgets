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

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.marvelution.sonar.rest.client.DefaultSonarServer;
import com.marvelution.sonar.rest.client.DefaultSonarServerAccessor;
import com.marvelution.sonar.rest.client.service.SonarServer;
import com.marvelution.sonar.rest.client.service.SonarServerAccessorException;

/**
 * Customized {@link DefaultSonarServerAccessor} implementation for Sonar Gadgets
 * 
 * @author <a href="mailto:markrekveld@marvelution.com">Mark Rekveld</a>
 * @since 1.1.0
 */
public class GadgetSonarServerAccessor extends DefaultSonarServerAccessor {

	/**
	 * Invoke the {@link SonarServer} and return the response
	 * 
	 * @param req the {@link HttpServletRequest} containing the {@link SonarServer} properties and the API url
	 * @param resp the {@link HttpServletResponse} where the response of the {@link SonarServer} is written to
	 * @throws SonarServerAccessorException in case of an invalid {@link HttpServletRequest} or communication errors
	 * @throws IOException in case of errors
	 */
	public void invokeSonarServer(HttpServletRequest req, HttpServletResponse resp)
			throws SonarServerAccessorException, IOException {
		final String[] url = StringUtils.split(getUrlFromRequest(req), "?", 2);
		String queryString = "";
		if (url.length > 1) {
			queryString = url[1];
		}
		final String output = getSonarServerActionResponse(getSonarServerFromRequest(req), url[0],
			createQueryStringMap(queryString));
		resp.setHeader("Pragma", "no-cache");
		resp.setHeader("Cache-Control", "no-cache");
		resp.setStatus(HttpServletResponse.SC_OK);
		resp.setContentType("application/json");
		resp.setCharacterEncoding("UTF-8");
		resp.getWriter().write(output);
	}

	/**
	 * GEt the {@link SonarServer} from the given {@link HttpServletRequest}
	 * 
	 * @param req the {@link HttpServletRequest} to get the {@link SonarServer} from
	 * @return the {@link SonarServer}
	 * @throws SonarServerAccessorException in case the {@link SonarServer} is not found in the
	 *             {@link HttpServletRequest}
	 */
	private SonarServer getSonarServerFromRequest(HttpServletRequest req) throws SonarServerAccessorException {
		final SonarServer server = new DefaultSonarServer();
		final String host = req.getParameter("host");
		if (StringUtils.isBlank(host)) {
			throw new SonarServerAccessorException("No SonarServer host url found in Request");
		}
		server.setHost(host);
		if (StringUtils.isNotBlank(req.getParameter("username"))
			&& StringUtils.isNotBlank(req.getParameter("password"))) {
			server.setUsername(req.getParameter("username"));
			server.setPassword(req.getParameter("password"));
		}
		return server;
	}

	/**
	 * Get the Sonar Server API url from the {@link HttpServletRequest}
	 * 
	 * @param req the {@link HttpServletRequest}
	 * @return the Sonar Server API url
	 * @throws SonarServerAccessorException in case the API url is not found in the {@link HttpServletRequest}
	 */
	private String getUrlFromRequest(HttpServletRequest req) throws SonarServerAccessorException {
		final String url = req.getParameter("apiUrl");
		if (StringUtils.isBlank(url)) {
			throw new SonarServerAccessorException("No API url found in Request");
		}
		return url;
	}

	/**
	 * Convert a given queryString into a {@link Map} of key value pairs
	 * 
	 * @param queryString the queryString to convert
	 * @return the {@link Map} with key,value pairs
	 */
	private Map<String, String> createQueryStringMap(String queryString) {
		final Map<String, String> queryMap = new HashMap<String, String>();
		if (StringUtils.isNotBlank(queryString)) {
			final String[] params = StringUtils.split(queryString, '&');
			for (String param : params) {
				final String[] paramParts = StringUtils.split(param, '=');
				queryMap.put(paramParts[0], paramParts[1]);
			}
		}
		return queryMap;
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	protected Map<String, String> validateParamsForFormat(Map<String, String> params) {
		boolean formatExists = false;
		for (Entry<String, String> param : params.entrySet()) {
			if ("format".equals(param.getKey())) {
				formatExists = true;
			}
		}
		if (!formatExists) {
			params.put("format", "xml");
		}
		return params;
	}

}
