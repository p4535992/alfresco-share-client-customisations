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
   new Alfresco.WikiToolbar("${args.htmlid}").setOptions(
   {
      siteId: "${page.url.templateArgs["site"]!""}",
      title: "${(page.url.args["title"]!"")?js_string}",
      showBackLink: ${(args.showBackLink == "true")?string}
   }).setMessages(
      ${messages}
   );
   
   $(document).ready(function() {
      $("#${args.htmlid}-body").resizingStickyScroller();     
   });   
//]]></script>
<div id="${args.htmlid}-body" class="share-toolbar wiki-toolbar flat-button theme-bg-2">

   <div class="navigation-bar theme-bg-1">
      <div>
         <#if args.showBackLink == "true">
         <span class="<#if (page.url.args.listViewLinkBack! == "true")>backLink<#else>forwardLink</#if>">
            <a href="${url.context}/page/site/${page.url.templateArgs.site}/wiki">${msg("link.listView")}</a>
         </span>
         </#if>
         <#if page.url.args.title! != "Main_Page">
         <div class="seperator">&nbsp;</div> 
         <#if args.showBackLink == "true">
           <span class="mainPage">&nbsp;</span>
         </#if>       
         <span class="forwardLink">
            <a href="${url.context}/page/site/${page.url.templateArgs.site!""}/wiki-page?filter=main&amp;title=Main_Page<#if args.showBackLink != "true">&amp;listViewLinkBack=true</#if>">${msg("link.mainPage")}</a>
         </span>
         </#if>
      </div>
   </div>

   <div class="action-bar">
      <#assign hide><#if (page.url.args.title! == "")>style="display: none;"</#if></#assign>
      <div class="new-page"><button id="${args.htmlid}-create-button">${msg("button.create")}</button></div>
      <#if user.isAdmin>
         <div class="separator" ${hide}>&nbsp;</div>
         <div class="delete-page" ${hide}><button id="${args.htmlid}-delete-button">${msg("button.delete")}</button></div>
      </#if>
      <div class="separator" ${hide}>&nbsp;</div>
      <div class="rename-page" ${hide}><button id="${args.htmlid}-rename-button">${msg("button.rename")}</button></div>
      <div class="separator" ${hide}>&nbsp;</div>
      <div class="mark-page-for-delete" ${hide}><button id="${args.htmlid}-mark-for-delete-button">${msg("button.mark-for-delete")}</button></div>
      <div class="undelete" ${hide}><button id="${args.htmlid}-undelete-button">${msg("button.undelete")}</button></div>
      <div class="remove-delete-mark" ${hide}><button id="${args.htmlid}-remove-delete-mark-button">${msg("button.remove-delete-mark")}</button></div>
      <div class="separator" ${hide}>&nbsp;</div>
      <div class="delete-now" ${hide}><button id="${args.htmlid}-delete-now-button">${msg("button.delete.now")}</button></div>
   </div>

   <div id="${args.htmlid}-renamepanel" class="rename-panel">
      <div class="hd"><label for="${args.htmlid}-renameTo">${msg("panel.rename.title")}</label></div>
      <div class="bd">
         <form id="${args.htmlid}-renamePageForm" method="post" action="${url.context}/proxy/alfresco/slingshot/wiki/page/${page.url.templateArgs["site"]}/${(page.url.args.title!"")?url}">
            <div class="yui-ge">
               <input type="hidden" id="${args.htmlid}-page" name="page" value="wiki-page" />
               <div class="yui-u first">
                  <input type="text" id="${args.htmlid}-renameTo" name="name" value="" size="30" tabindex="0" />
               </div>
               <div class="yui-u">
                  <input type="submit" id="${args.htmlid}-rename-save-button" value="${msg("button.save")}" tabindex="0" />
               </div>
            </div>
         </form>
         <div class="bdft">${msg("panel.rename.footer")}</div>
      </div>
   </div>   
</div>
<div class="clear"></div>
        
