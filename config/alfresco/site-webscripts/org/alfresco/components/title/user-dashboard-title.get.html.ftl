<!--
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
<#assign activePage = page.url.templateArgs.pageid!"customise-user-dashboard">
<#assign userName>${user.properties["firstName"]?html} <#if user.properties["lastName"]??>${user.properties["lastName"]?html}</#if></#assign>
<script type="text/javascript">//<![CDATA[
   Alfresco.constants.DASHLET_RESIZE = ${((page.url.templateArgs.userid!"-") = (user.name!""))?string};
//]]></script>
<div class="user-dashboard-header">
  	<#if themeDashboardConfig.backgroundImage.nodeRef != "">
     <img class="banner-image" src="${url.context}/proxy/alfresco/api/node/${themeDashboardConfig.backgroundImage.nodeRef?replace('://','/')}/content" alt="${themeDashboardConfig.backgroundImage.title?html}" />
    <#else>
     <img class="banner-image" src="${url.context}/themes/${theme}/images/user-dashboard/banner-image.jpg" alt="My Homepage" />
	</#if>

	<div class="header-content">
		${(themeDashboardConfig.userDashboardTitleHTML)!}
		<div class="tools">
			<ul>
			    <li><a href="${msg("syops.link")}">${msg("syops.title")}</a></li>
			    <li><span class="tools-separator"></span><a href="${msg("brules.link")}">${msg("brules.title")}</a></li>
				<li><span class="tools-separator"></span><a href="${(themeConfig.changePasswordUrl)!?html}">Change Password</a></li>
			   	<#if user.isAdmin>
			      <#assign linkClass><#if "customise-user-dashboard" == activePage>class="active-page"</#if></#assign>
			   	<li><span class="tools-separator"></span><a href="${url.context}/page/customise-user-dashboard" ${linkClass}>${msg("link.customiseDashboard")}</a></li>
			   	</#if>
			</ul>
		</div>
	</div>
</div>
