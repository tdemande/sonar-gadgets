<?xml version="1.0" encoding="UTF-8"?>
<!--
 ~ Licensed to Marvelution under one or more contributor license 
 ~ agreements.  See the NOTICE file distributed with this work 
 ~ for additional information regarding copyright ownership.
 ~ Marvelution licenses this file to you under the Apache License,
 ~ Version 2.0 (the "License"); you may not use this file except
 ~ in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~  http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing,
 ~ software distributed under the License is distributed on an
 ~ "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 ~ KIND, either express or implied. See the License for the
 ~ specific language governing permissions and limitations
 ~ under the License.
 -->
<xslt:transform version="1.0"
	xmlns:xslt="http://www.w3.org/1999/XSL/Transform" xmlns:m="http://informatik.hu-berlin.de/merge"
	exclude-result-prefixes="m">

	<xslt:param name="normalize" select="'yes'" />
	<xslt:param name="dontmerge" />
	<xslt:param name="replace" select="false()" />
	<xslt:param name="with" />

	<xslt:template match="*">
		<xslt:if test="string($with)=''">
			<xslt:message terminate="yes">
				<xslt:text>No input file specified (parameter 'with')</xslt:text>
			</xslt:message>
		</xslt:if>
		<xslt:call-template name="m:merge">
			<xslt:with-param name="nodes1" select="/node()" />
			<xslt:with-param name="nodes2" select="document($with,/*)/node()" />
		</xslt:call-template>
	</xslt:template>

	<xslt:template name="m:merge">
		<xslt:param name="nodes1" />
		<xslt:param name="nodes2" />
		<xslt:choose>
			<xslt:when test="count($nodes1)=0">
				<xslt:copy-of select="$nodes2" />
			</xslt:when>
			<xslt:when test="count($nodes2)=0">
				<xslt:copy-of select="$nodes1" />
			</xslt:when>
			<xslt:otherwise>
				<xslt:variable name="first1" select="$nodes1[1]" />
				<xslt:variable name="rest1" select="$nodes1[position()!=1]" />
				<xslt:variable name="first2" select="$nodes2[1]" />
				<xslt:variable name="rest2" select="$nodes2[position()!=1]" />
				<xslt:variable name="type1">
					<xslt:apply-templates mode="m:detect-type" select="$first1" />
				</xslt:variable>
				<xslt:variable name="diff-first">
					<xslt:call-template name="m:compare-nodes">
						<xslt:with-param name="node1" select="$first1" />
						<xslt:with-param name="node2" select="$first2" />
					</xslt:call-template>
				</xslt:variable>
				<xslt:choose>
					<xslt:when test="$diff-first='!'">
						<xslt:variable name="diff-rest">
							<xslt:for-each select="$rest2">
								<xslt:call-template name="m:compare-nodes">
									<xslt:with-param name="node1" select="$first1" />
									<xslt:with-param name="node2" select="." />
								</xslt:call-template>
							</xslt:for-each>
						</xslt:variable>
						<xslt:choose>
							<xslt:when test="contains($diff-rest,'=') and
                                       not($type1='text' and normalize-space($first1)='')">
								<xslt:variable name="pos"
									select="string-length(substring-before($diff-rest,'=')) + 2" />
								<xslt:copy-of select="$nodes2[position() &lt; $pos]" />
								<xslt:choose>
									<xslt:when test="$type1='element'">
										<xslt:element name="{name($first1)}" namespace="{namespace-uri($first1)}">
											<xslt:copy-of select="$first1/namespace::*" />
											<xslt:copy-of select="$first2/namespace::*" />
											<xslt:copy-of select="$first1/@*" />
											<xslt:call-template name="m:merge">
												<xslt:with-param name="nodes1" select="$first1/node()" />
												<xslt:with-param name="nodes2"
													select="$nodes2[position()=$pos]/node()" />
											</xslt:call-template>
										</xslt:element>
									</xslt:when>
									<xslt:otherwise>
										<xslt:copy-of select="$first1" />
									</xslt:otherwise>
								</xslt:choose>
								<xslt:call-template name="m:merge">
									<xslt:with-param name="nodes1" select="$rest1" />
									<xslt:with-param name="nodes2" select="$nodes2[position() &gt; $pos]" />
								</xslt:call-template>
							</xslt:when>
							<xslt:when test="$type1='text' and $replace">
								<xslt:call-template name="m:merge">
									<xslt:with-param name="nodes1" select="$rest1" />
									<xslt:with-param name="nodes2" select="$nodes2" />
								</xslt:call-template>
							</xslt:when>
							<xslt:otherwise>
								<xslt:copy-of select="$first1" />
								<xslt:call-template name="m:merge">
									<xslt:with-param name="nodes1" select="$rest1" />
									<xslt:with-param name="nodes2" select="$nodes2" />
								</xslt:call-template>
							</xslt:otherwise>
						</xslt:choose>
					</xslt:when>
					<xslt:otherwise>
						<xslt:choose>
							<xslt:when test="$type1='element'">
								<xslt:element name="{name($first1)}" namespace="{namespace-uri($first1)}">
									<xslt:copy-of select="$first1/namespace::*" />
									<xslt:copy-of select="$first2/namespace::*" />
									<xslt:copy-of select="$first1/@*" />
									<xslt:call-template name="m:merge">
										<xslt:with-param name="nodes1" select="$first1/node()" />
										<xslt:with-param name="nodes2" select="$first2/node()" />
									</xslt:call-template>
								</xslt:element>
							</xslt:when>
							<xslt:otherwise>
								<xslt:copy-of select="$first1" />
							</xslt:otherwise>
						</xslt:choose>
						<xslt:call-template name="m:merge">
							<xslt:with-param name="nodes1" select="$rest1" />
							<xslt:with-param name="nodes2" select="$rest2" />
						</xslt:call-template>
					</xslt:otherwise>
				</xslt:choose>
			</xslt:otherwise>
		</xslt:choose>
	</xslt:template>

	<xslt:template name="m:compare-nodes">
		<xslt:param name="node1" />
		<xslt:param name="node2" />
		<xslt:variable name="type1">
			<xslt:apply-templates mode="m:detect-type" select="$node1" />
		</xslt:variable>
		<xslt:variable name="type2">
			<xslt:apply-templates mode="m:detect-type" select="$node2" />
		</xslt:variable>
		<xslt:choose>
			<xslt:when test="$type1='element' and $type2='element' and
                       local-name($node1)=local-name($node2) and
                       namespace-uri($node1)=namespace-uri($node2) and
                       name($node1)!=$dontmerge and name($node2)!=$dontmerge">
				<xslt:variable name="diff-att">
					<xslt:if test="count($node1/@*)!=count($node2/@*)">.</xslt:if>
					<xslt:for-each select="$node1/@*">
						<xslt:if test="not($node2/@*
		                        [local-name()=local-name(current()) and 
		                         namespace-uri()=namespace-uri(current()) and 
		                         .=current()])">.</xslt:if>
					</xslt:for-each>
				</xslt:variable>
				<xslt:choose>
					<xslt:when test="string-length($diff-att)!=0">!</xslt:when>
					<xslt:otherwise>=</xslt:otherwise>
				</xslt:choose>
			</xslt:when>
			<xslt:when test="$type1!='element' and $type1=$type2 and name($node1)=name($node2) and 
						($node1=$node2 or ($normalize='yes' and 
						normalize-space($node1)=normalize-space($node2)))">=</xslt:when>
			<xslt:otherwise>!</xslt:otherwise>
		</xslt:choose>
	</xslt:template>

	<xslt:template match="*" mode="m:detect-type">element</xslt:template>
	<xslt:template match="text()" mode="m:detect-type">text</xslt:template>
	<xslt:template match="comment()" mode="m:detect-type">comment</xslt:template>
	<xslt:template match="processing-instruction()" mode="m:detect-type">pi</xslt:template>

</xslt:transform>
