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
<#assign activeSite = page.url.templateArgs.site!"">
<#assign pageFamily = template.properties.pageFamily!"dashboard">
<div class="site-navigation">
<#if siteExists??>
   <#if url.context + "/page/site/" + activeSite + "/dashboard" == page.url.uri>
      <#assign linkClass>class="active-page theme-color-4"</#assign>
   <#else>
      <#assign linkClass>class="theme-color-4"</#assign>
   </#if>
   <span class="navigation-item"><a href="${url.context}/page/site/${activeSite}/dashboard" ${linkClass}>${msg("link.siteDashboard")}</a></span>
   <#list pages as p>
      <#assign linkPage><#if p.pageUrl??>${p.pageUrl}<#else>${p.pageId}</#if></#assign>
      <#if linkPage?index_of(pageFamily) != -1>
         <#assign linkClass>class="active-page theme-color-4"</#assign>      
      <#else>
         <#assign linkClass>class="theme-color-4"</#assign>
      </#if>
   <span class="navigation-separator">&nbsp;</span>
   <span class="navigation-item"><a href="${url.context}/page/site/${activeSite}/${linkPage}" ${linkClass}>
   <#if p.titleId??>${(msg(p.titleId))!p.title}<#else>${p.title}</#if>
   </a></span>
   </#list>
</#if>
</div>
