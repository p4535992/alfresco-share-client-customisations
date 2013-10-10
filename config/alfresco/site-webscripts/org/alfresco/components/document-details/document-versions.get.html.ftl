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
<#include "../presence/presenceIndicator.ftl"/>

<script type="text/javascript">//<![CDATA[
new Alfresco.DocumentVersions("${args.htmlid}").setOptions(
{
   versions: [
<#list versions as version>
      {
         label: "${version.label}",
         createdDate: "${version.createdDate}"
      }<#if (version_has_next)>,</#if>
</#list>
   ],
   filename: "${filename!}",
   nodeRef: "${nodeRef!}"
}).setMessages(
   ${messages}
);
//]]></script>

<div id="${args.htmlid}-body" class="document-versions hidden">

   <div class="info-section">

      <div class="heading">${msg("header.versionHistory")}</div>

      <#list versions as version>
         <#if version_index == 1>
            <div class="info-sub-section">
               <span class="meta-heading">${msg("section.olderVersion")}</span>
            </div>
         </#if>
         <a id="${args.htmlid}-expand-a-${version_index}" class="info more <#if version_index != 0>collapsed<#else>expanded</#if>" href="#">
            <span class="meta-section-label theme-color-1">${msg("label.label")} ${version.label}</span>
            <span id="${args.htmlid}-createdDate-span-${version_index}" class="meta-value">&nbsp;</span>
         </a>
         <div id="${args.htmlid}-moreVersionInfo-div-${version_index}" class="moreInfo" <#if version_index != 0>style="display: none;"</#if>>
            <div class="info">
               <span class="meta-label">${msg("label.creator")}</span>
               <span class="meta-value"><@presenceIndicator version.creator.userName version.creator.firstName + " " + version.creator.lastName version.creatorPresence/></span>
            </div>
            <div class="info">
               <span class="meta-label">${msg("label.description")}</span>
               <span class="meta-value">${version.description?html}</span>
            </div>
            <div class="actions">
               <span><a href="${url.context}/proxy/alfresco${version.downloadURL}" class="download">${msg("link.download")}</a></span>
               <#if version_index != 0>
                  <span class="hidden"><a id="${args.htmlid}-revert-a-${version_index}" class="revert" href="#">${msg("link.revert")}</a></span>
               </#if>
            </div>
         </div>
      </#list>

   </div>

</div>
