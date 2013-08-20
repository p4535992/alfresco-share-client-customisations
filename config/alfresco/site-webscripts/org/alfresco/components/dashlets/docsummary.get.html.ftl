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
<#include "../presence/presenceIndicator.ftl"/>

<#macro doclibUrl doc>
   <a href="${url.context}/page/site/${doc.location.site}/document-details?nodeRef=${doc.nodeRef}" class="theme-color-1">${doc.displayName?html}</a>
</#macro>
<script type="text/javascript">//<![CDATA[
   new Alfresco.widget.DashletResizer("${args.htmlid}", "${instance.object.id}");
//]]></script>
<div class="dashlet">
   <div class="title">${msg("header.docSummary")}</div>
   <div class="body scrollableList" <#if args.height??>style="height: ${args.height}px;"</#if>>
   <#if docs.message?exists>
      <div class="detail-list-item first-item last-item">
         <div class="error">${docs.message}</div>
      </div>
   <#else>
      <#if docs.items?size == 0>
      <div class="detail-list-item first-item last-item">
         <span>${msg("label.noItems")}</span>
      </div>
      <#else>
         <#list docs.items as doc>
            <#assign modifiedBy><@presenceIndicator doc.modifiedByUser doc.modifiedBy doc.modifiedByUserPresence/></#assign>
      <div class="detail-list-item <#if doc_index = 0>first-item<#elseif !doc_has_next>last-item</#if>">
         <div>
            <div class="icon">
               <img src="${url.context}/res/components/images/generic-file-32.png" alt="${doc.displayName?html}" />
            </div>
            <div class="details">
               <h4><@doclibUrl doc /></h4>
               <div>
                  ${msg("text.modified-by", modifiedBy)} ${msg("text.modified-on", xmldate(doc.modifiedOn)?string(msg("date-format.defaultFTL")))}
               </div>
            </div>
         </div>
      </div>
         </#list>
      </#if>
   </#if>
   </div>
</div>
