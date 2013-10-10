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
<#macro documentlistTemplate>
<!--[if IE]>
   <iframe id="yui-history-iframe" src="${url.context}/res/yui/history/assets/blank.html"></iframe> 
<![endif]-->
<input id="yui-history-field" type="hidden" />
<#nested>
<div id="${args.htmlid}-body" class="doclist">
   <div id="${args.htmlid}-doclistBar" class="yui-gc doclist-bar flat-button">
      <div class="yui-u first">
         <div class="file-select">
            <button id="${args.htmlid}-fileSelect-button" name="doclist-fileSelect-button">${msg("menu.select")}</button>
            <div id="${args.htmlid}-fileSelect-menu" class="yuimenu">
               <div class="bd">
                  <ul>
                     <li><a href="#"><span class="selectDocuments">${msg("menu.select.documents")}</span></a></li>
                     <li><a href="#"><span class="selectFolders">${msg("menu.select.folders")}</span></a></li>
                     <li><a href="#"><span class="selectAll">${msg("menu.select.all")}</span></a></li>
                     <li><a href="#"><span class="selectInvert">${msg("menu.select.invert")}</span></a></li>
                     <li><a href="#"><span class="selectNone">${msg("menu.select.none")}</span></a></li>
                  </ul>
               </div>
            </div>
         </div>
         <div id="${args.htmlid}-paginator" class="paginator"></div>
      </div>
      <div class="yui-u align-right">
         <div id="${args.htmlid}-simpleDetailed" class="simple-detailed yui-buttongroup inline">
            <#-- Don't insert linefeeds between these <input> tags -->
            <input id="${args.htmlid}-simpleView" type="radio" name="simpleDetailed" title="${msg("button.view.simple")}" value="" /><input id="${args.htmlid}-detailedView" type="radio" name="simpleDetailed" title="${msg("button.view.detailed")}" value="" />
         </div>
         <div class="show-folders">
            <button id="${args.htmlid}-showFolders-button" name="doclist-showFolders-button">${msg("button.folders.show")}</button>
            <span class="separator">&nbsp;</span>
         </div>
         <!-- SORT FIELDS START -->
     	 <div class="sort-field">
            <span id="${args.htmlid}-sortField-button" class="yui-button yui-push-button">
               <span class="first-child">
                  <button name="doclist-sortField-button"></button>
               </span>
            </span>
            <span class="separator">&nbsp;</span>
            <select id="${args.htmlid}-sortField-menu">
            <#list sortOptions as sort>
               <option value="${(sort.value!"")?html}" <#if sort.direction??>title="${sort.direction?string}"</#if>>${msg(sort.label)}</option>
            </#list>
            </select>
         </div>
         <div class="sort-direction">
            <span id="${args.htmlid}-sortDirection-button" class="yui-button yui-push-button">
               <span class="first-child">
                  <button name="doclist-sortDirection-button"></button>
               </span>
            </span>
         </div>
         <!-- SORT FIELDS END -->
      </div>
   </div>

   <div id="${args.htmlid}-documents" class="documents"></div>

   <div id="${args.htmlid}-doclistBarBottom" class="yui-gc doclist-bar doclist-bar-bottom flat-button">
      <div class="yui-u first">
         <div class="file-select">&nbsp;</div>
         <div id="${args.htmlid}-paginatorBottom" class="paginator"></div>
      </div>
   </div>

   <!-- Action Sets -->
   <div style="display:none">
      <!-- Action Set "More..." container -->
      <div id="${args.htmlid}-moreActions">
         <div class="onActionShowMore"><a href="#" class="show-more" title="${msg("actions.more")}"><span>${msg("actions.more")}</span></a></div>
         <div class="more-actions hidden"></div>
      </div>

      <!-- Action Set Templates -->
<#list actionSets?keys as key>
   <#assign actionSet = actionSets[key]>
      <div id="${args.htmlid}-actionSet-${key}" class="action-set">
   <#list actionSet as action>
         <div class="${action.id}"><a rel="${action.permission!""}" href="${action.href}" class="${action.type}" title="${msg(action.label)}"><span>${msg(action.label)}</span></a></div>
   </#list>
      </div>
</#list>
   </div>

   <div id="${args.htmlid}-customize" class="customize">
      <div class="hd">${msg("customize.title")}</div>
      <div class="bd">
         <form id="${args.htmlid}-customize-form" action="#" method="post">
            <div class="yui-g">
               <h2>${msg("customize.header.actions")}</h2>
            </div>
            <div class="bdft">
               <input type="button" id="${args.htmlid}-customize-ok" value="${msg("button.ok")}" tabindex="0" />
               <input type="button" id="${args.htmlid}-customize-cancel" value="${msg("button.cancel")}" tabindex="0" />
            </div>
         </form>
      </div>
   </div>
   
	<#include "/org/alfresco/components/perishability/perishable-dialog.lib.ftl" />
</div>

</#macro>
