<#--
    Copyright (C) 2008-2010 Surevine Limited.
      
    Although intended for deployment and use alongside Alfresco this module should
    be considered 'Not a Contribution' as defined in Alfresco'sstandard contribution agreement, see
    http://www.alfresco.org/resource/AlfrescoContributionAgreementv2.pdf
    
    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
-->
<#include "../../../../component.head.inc">
<#macro renderHeadVisibilityUserProfileSummary>
	<@link rel="stylesheet" type="text/css" href="${page.url.context}/components/enhanced-security/selector/widgets/visibility/visibility-user-profile-summary.css" />
	<@script type="text/javascript" src="${page.url.context}/components/enhanced-security/selector/widgets/visibility/visibility-user-profile-summary.js"></@script>
</#macro>

<#macro renderBodyVisibilityUserProfileSummary htmlId>
	<#assign thisHtmlId = "${htmlId}-visibilityUserProfileSummary" />
	
	<div id="${thisHtmlId?html}" class="visibility-user-profile-summary hidden">
	
		<h3>${msg("visibility.user-profile.title")?html}</h3>
		<ul class="profile">
			<li id="${thisHtmlId?html}-profileUserNameRow">
				<span class="title">${msg("profile.username")?html}</span>
				<a id="${thisHtmlId?html}-profileUserNameLink" target="_blank">
					<span id="${thisHtmlId?html}-profileUserName"></span>
				</a>
			</li>
			<li id="${thisHtmlId?html}-profileNameRow">
				<span class="title">${msg("profile.name")?html}</span>
				<a id="${thisHtmlId?html}-profileNameLink" target="_blank">
					<span id="${thisHtmlId?html}-profileName"></span>
				</a>
			</li>
			<li id="${thisHtmlId?html}-profileJobTitleRow">
				<span class="title">${msg("profile.job-title")?html}</span>
				<span id="${thisHtmlId?html}-profileJobTitle"></span>
			</li>
			<li id="${thisHtmlId?html}-profileOrganisationRow">
				<span class="title">${msg("profile.organisation")?html}</span>
				<span id="${thisHtmlId?html}-profileOrganisation"></span>
			</li>
			<li id="${thisHtmlId?html}-profileLocationRow">
				<span class="title">${msg("profile.location")?html}</span>
				<span id="${thisHtmlId?html}-profileLocation"></span>
			</li>
			<li id="${thisHtmlId?html}-profileEmailRow">
				<span class="title">${msg("profile.email")?html}</span>
				<span id="${thisHtmlId?html}-profileEmail"></span>
			</li>
		</ul>
	</div>
	
	<script type="text/javascript">//<![CDATA[
	
	new Alfresco.EnhancedSecurityVisibilityUserProfileSummary("${thisHtmlId?js_string}");
	//]]></script>
</#macro>
