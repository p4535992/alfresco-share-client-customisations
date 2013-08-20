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
<div class="dashlet site-profile">
   <div class="title">${msg("header.siteProfile")}</div>
   <div class="body">
      <div class="msg">
         <h3><#if (profile.title != "")>${msg("text.welcome", profile.title)?html}<#else>${msg("text.welcome", profile.shortName)?html}</#if></h3>
<#if (profile.description != "")>
         <p>${profile.description?html}</p>
</#if>
<#if profile.customProperties??>
   <#list profile.customProperties?keys as prop>
      <#assign customValue=profile.customProperties[prop].value>	
      <#if customValue?starts_with('alfresco-php://') == true>
         <p><a href="${url.context}/proxy/alfresco-php/${customValue?substring(15)}" target="_blank" class="theme-color-1">${profile.customProperties[prop].title}</a></p>
      <#else>
         <p>
            <span class="label">${profile.customProperties[prop].title}</span>
            <span>${customValue}</span>
         </p>
       </#if>
   </#list>
</#if>
      </div>
      <div class="clear"></div>
   </div>
</div>
