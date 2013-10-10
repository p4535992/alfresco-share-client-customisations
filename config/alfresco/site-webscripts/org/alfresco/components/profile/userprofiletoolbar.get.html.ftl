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
<#assign activePage = page.url.templateArgs.pageid?lower_case!"">
<div id="${args.htmlid}-body" class="toolbar userprofile">
   <div class="link"><a href="profile" <#if activePage=="profile">class="activePage theme-color-4"</#if>>${msg("link.info")}</a></div>
   <div class="separator">&nbsp;</div>
   <div class="link"><a href="user-sites" <#if activePage=="user-sites">class="activePage theme-color-4"</#if>>${msg("link.sites")}</a></div>
   <div class="separator">&nbsp;</div>
   <div class="link"><a href="user-content" <#if activePage=="user-content">class="activePage theme-color-4"</#if>>${msg("link.content")}</a></div>
   <#if (activeUserProfile)>
   <div class="separator">&nbsp;</div>
   <div class="link"><a href="${(themeConfig.changePasswordUrl)!?html}" <#if activePage=="change-password">class="activePage theme-color-4"</#if>>${msg("link.changepassword")}</a></div>
   </#if>
</div>
