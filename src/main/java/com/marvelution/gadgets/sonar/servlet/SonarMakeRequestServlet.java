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
import java.net.URI;
import java.net.URISyntaxException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.sonar.wsclient.Host;
import org.sonar.wsclient.Sonar;
import org.sonar.wsclient.connectors.ConnectionException;
import org.sonar.wsclient.connectors.HttpClient4Connector;

import com.marvelution.gadgets.sonar.servlet.query.QueryWrapper;

/**
 * {@link HttpServlet} to handle secured requests to Sonar
 * 
 * @author <a href="mailto:markrekveld@marvelution.com">Mark Rekveld</a>
 * 
 * @since 1.4.0
 */
public class SonarMakeRequestServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	private final Logger logger = Logger.getLogger(SonarMakeRequestServlet.class);

	/**
	 * {@inheritDoc}
	 */
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		String requestUrl = req.getParameter("url");
		String requestType = req.getParameter("type");
		if (StringUtils.isNotBlank(requestUrl)) {
			logger.debug("Got a makeRequest request for " + requestUrl);
			try {
				URI uri = new URI(requestUrl);
				Sonar sonar = new Sonar(new HttpClient4Connector(getHost(uri)));
				String json = sonar.getConnector().execute(new QueryWrapper(uri));
				resp.setCharacterEncoding("UTF-8");
				if (StringUtils.isBlank(requestType) || "json".equalsIgnoreCase(requestType)) {
					resp.setContentType(MediaType.APPLICATION_JSON);
				} else {
					resp.setContentType(MediaType.APPLICATION_XML);
				}
				resp.getWriter().write(json);
				resp.getWriter().flush();
			} catch (ConnectionException e) {
				throw new ServletException("Failed to execute query. Please verify the correctness of the query and "
						+ "that the Sonar server is up.", e);
			} catch (URISyntaxException e) {
				throw new ServletException("Invalid query url specified", e);
			}
		}
	}

	/**
	 * Get the {@link Host} from a given {@link URI}
	 * 
	 * @param uri the {@link URI}
	 * @return the {@link Host}
	 */
	private Host getHost(URI uri) {
		StringBuilder hostUri = new StringBuilder();
		hostUri.append(uri.getScheme()).append("://");
		if (uri.getAuthority().indexOf("@") > -1) {
			hostUri.append(uri.getAuthority().substring(uri.getAuthority().lastIndexOf("@") + 1));
		} else {
			hostUri.append(uri.getAuthority());
		}
		Host host = new Host(hostUri.toString());
		if (uri.getAuthority().indexOf("@") > -1) {
			String userInfo = uri.getAuthority().substring(0, uri.getAuthority().lastIndexOf("@"));
			host.setUsername(userInfo.substring(0, userInfo.indexOf(":")));
			host.setPassword(userInfo.substring(userInfo.indexOf(":") + 1));
		}
		return host;
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		doGet(req, resp);
	}

}
