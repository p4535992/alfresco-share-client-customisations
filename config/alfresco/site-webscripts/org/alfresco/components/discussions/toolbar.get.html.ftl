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
<script type="text/javascript">//<![CDATA[
   new Alfresco.DiscussionsToolbar("${args.htmlid}").setOptions(
   {
      siteId: "${page.url.templateArgs["site"]!""}",
      containerId: "${template.properties.container!'discussions'}",
      allowCreate: ${forum.forumPermissions.create?string}
   }).setMessages(
      ${messages}
   );
   
   $(document).ready(function() {
      $("#${args.htmlid}").resizingStickyScroller($(".topiclist-infobar").first());
   });
   
//]]></script>
<div id="${args.htmlid}-body" class="share-toolbar discussions-toolbar flat-button theme-bg-2">

   <div class="navigation-bar <#if (args.showNavigationBar == "false")>hide</#if>">
      <div>
         <span class="<#if (page.url.args.listViewLinkBack! == "true")>backLink<#else>forwardLink</#if>">
            <a href="${url.context}/page/site/${page.url.templateArgs.site}/discussions-topiclist">${msg("link.listView")}</a>
         </span>
      </div>
   </div>

   <div class="action-bar theme-bg-1">
      <div class="new-topic"><button id="${args.htmlid}-create-button">${msg("button.create")}</button></div>
   </div>

</div>
<div class="clear"></div>
        
