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
<#assign activePage = page.url.templateArgs.pageid!"">
<#assign siteTitle><#if profile.title != "">${profile.title}<#else>${profile.shortName}</#if></#assign>
<script type="text/javascript">//<![CDATA[
   new Alfresco.CollaborationTitle("${args.htmlid}").setOptions(
   {
      site: "${page.url.templateArgs.site!""}",
      siteTitle: "${siteTitle?js_string}",
      user: "${user.name!""}"
   }).setMessages(
      ${messages}
   );
   Alfresco.constants.DASHLET_RESIZE = ${userIsSiteManager?string};
//]]></script>
<div class="site-dashboard-header <#if page.url.templateArgs.site?ends_with("deletedItems")>deleted-site-header</#if>">
	<div class="banner-image banner-image-site-${profile.shortName?html}">
		<h1>${siteTitle?html}</h1>
	</div>
	<div class="header-content">
		<h2>${msg("header.level1Header",siteTitle)?html}</h2>
		<#if page.url.templateArgs.site?ends_with("deletedItems")>
          <p class="deleted.items.explanation">${msg("deleted.items.explanation")}</p>
        </#if>
   <div class="links title-button">
   <#assign siteDashboardUrl = page.url.context + "/page/site/" + page.url.templateArgs.site + "/dashboard">
   <#if user.isAdmin && userIsSiteManager && (page.url.uri == siteDashboardUrl || "customise-site-dashboard" == activePage) >
      <#assign linkClass><#if "customise-site-dashboard" == activePage>class="active-page"</#if></#assign>
      <span class="yui-button yui-link-button">
         <span class="first-child">
            <a href="${url.context}/page/site/${page.url.templateArgs.site!}/customise-site-dashboard" ${linkClass}>${msg("link.customiseDashboard")}</a>
         </span>
      </span>
   </#if>
    <#if userIsSiteManager>
      <input type="button" id="${args.htmlid}-more" name="${args.htmlid}-more" value="${msg("link.more")}"/>
      <select id="${args.htmlid}-more-menu">
         <option value="editSite">${msg("link.editSite")}</option>
      </select> 
    </#if>   
 
   </div>
	</div>
</div>
