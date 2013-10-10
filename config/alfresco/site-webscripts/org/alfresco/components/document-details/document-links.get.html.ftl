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
<#assign el=args.htmlid?html>
<script type="text/javascript">//<![CDATA[
   new Alfresco.DocumentLinks("${el}").setOptions(
   {
      <#if repositoryUrl??>repositoryUrl: "${repositoryUrl}"</#if>
   }).setMessages(${messages});
//]]></script>

<div id="${el}-body" class="document-links hidden">
   
   <div class="heading">${msg("document-links.heading")}</div>
   
   <!-- download link -->
   <div id="${el}-download" class="hidden">
      <div class="url-title"><label for="${el}-download-url">${msg("document-links.download")}</label></div>
      <input id="${el}-download-url" class="link-value" />
      <input id="${el}-download-button" type="button" class="copy-button" value="${msg("document-links.copy")}" />
   </div>
   
   <!-- document/view link -->
   <div id="${el}-view" class="hidden">
      <div class="url-title"><label for="${el}-view-url">${msg("document-links.view")}</label></div>
      <input id="${el}-view-url" class="link-value" />
      <input id="${el}-view-button" type="button" class="copy-button" value="${msg("document-links.copy")}" />
   </div>

</div>
