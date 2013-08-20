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
<#include "../../../include/alfresco-macros.lib.ftl" />
<#macro toolbarTemplate>
<#nested>
<#assign el=args.htmlid?html>
<div id="${el}-body" class="toolbar">

   <div id="${el}-headerBar" class="header-bar flat-button theme-bg-2">
      <div class="left">
         <div class="hideable toolbar-hidden DocListTree">
            <div class="create-content">
               <button id="${el}-createContent-button" name="createContent">${msg("button.create-content")}</button>
               <div id="${el}-createContent-menu" class="yuimenu">
                  <div class="bd">
                     <ul>
                     <#list createContent as content>
                        <#assign href>create-content?mimeType=${content.mimetype?html}&amp;destination={nodeRef}&amp;itemId=${content.itemid}<#if (content.formid!"") != "">&amp;formId=${content.formid?html}</#if></#assign>
                        <li><a href="${siteURL(href)}" rel="${content.permission!""}"><span class="${content.icon}-file">${msg(content.label)}</span></a></li>
                     </#list>
                     </ul>
                  </div>
               </div>
            </div>
            <div class="separator">&nbsp;</div>
         </div>
         <div class="hideable toolbar-hidden DocListTree">
            <div class="new-folder"><button id="${el}-newFolder-button" name="newFolder">${msg("button.new-folder")}</button></div>
            <div class="separator">&nbsp;</div>
         </div>
         <div class="hideable toolbar-hidden DocListTree">
            <div class="file-upload"><button id="${el}-fileUpload-button" name="fileUpload">${msg("button.upload")}</button></div>
            <div class="separator">&nbsp;</div>
         </div>
         <div class="selected-items hideable toolbar-hidden DocListTree DocListFilter TagFilter DocListCategories">
            <button class="no-access-check" id="${el}-selectedItems-button" name="doclist-selectedItems-button">${msg("menu.selected-items")}</button>
            <div id="${el}-selectedItems-menu" class="yuimenu">
               <div class="bd">
                  <ul>
                  <#list actionSet as action>
                     <li><a type="${action.asset!""}" rel="${action.permission!""}" href="${action.href}"><span class="${action.id}">${msg(action.label)}</span></a></li>
                  </#list>
                     <li><a href="#"><hr /></a></li>
                     <li><a href="#"><span class="onActionDeselectAll">${msg("menu.selected-items.deselect-all")}</span></a></li>
                  </ul>
               </div>
            </div>
         </div>
      </div>
      <div class="right">
         <div class="customize" style="display: none;"><button id="${el}-customize-button" name="customize">${msg("button.customize")}</button></div>
         <div class="hide-navbar"><button id="${el}-hideNavBar-button" name="hideNavBar">${msg("button.navbar.hide")}</button></div>
         <div class="rss-feed"><button id="${el}-rssFeed-button" name="rssFeed">${msg("link.rss-feed")}</button></div>
      </div>
   </div>

   <div id="${el}-navBar" class="nav-bar flat-button theme-bg-4">
      <div class="hideable toolbar-hidden DocListTree DocListCategories">
         <div class="folder-up"><button class="no-access-check" id="${el}-folderUp-button" name="folderUp">${msg("button.up")}</button></div>
         <div class="separator">&nbsp;</div>
      </div>
      <div id="${el}-breadcrumb" class="breadcrumb hideable toolbar-hidden DocListTree DocListCategories"></div>
      <div id="${el}-description" class="description hideable toolbar-hidden DocListFilter TagFilter"></div>
   </div>

</div>

<script type="text/javascript">
    $(document).ready(function() {
        var top = $("#${el}-body");
        var bottom = $("#" + Alfresco.util.ComponentManager.findFirst("Alfresco.DocumentList").id + "-doclistBar");
        top.resizingStickyScroller(bottom);

        YAHOO.Bubbling.on("onHideNavBar", function(layer, args) {
            if (bottom.isSticky()) {
                var dy = $("#${el}-navBar").outerHeight() * (args[1].visible ? 1 : -1);
                bottom.css('top', (parseInt(bottom.css('top')) + dy) + 'px');
                top.stickyPlaceHolder().height(top.stickyPlaceHolder().height() + dy);
             }
        });
        
        // Unsticky the headers when filter (doclib location) changes
        YAHOO.Bubbling.on("filter-change", function(layer, args) {
            if(top.isSticky() || bottom.isSticky()) {
            	top.unSticky();
            	bottom.unSticky();
            }
        });
        
    });
</script>

</#macro>
