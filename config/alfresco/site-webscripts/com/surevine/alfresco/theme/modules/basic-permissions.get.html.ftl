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
   Alfresco.util.ComponentManager.get("${args.htmlid}").setOptions(
   {
      roles:
      {
         <#list siteRoles as siteRole>"${siteRole}": true<#if siteRole_has_next>,</#if></#list>
      },
      
      groups:
      {
         <#list groupNames as group>"${group}": "${permissionGroups[group_index]}"<#if group_has_next>,</#if></#list>
      }
   }).setMessages(
      ${messages}
   );
//]]></script>
<div id="${args.htmlid}-dialog" class="permissions">
   <div id="${args.htmlid}-title" class="hd"></div>
   <div class="bd">
      <p/>
      <div class="yui-g">
         <h2>${msg("header.manage")}</h2>
      </div>
      <div class="groups">
         <div class="yui-gd">
            <div class="yui-u first right"><label>${msg("label.usershave")}</label></div>
            <div class="yui-u flat-button">
               <button id="${args.htmlid}-permission" value="all" class="site-group"></button>
               <select id="${args.htmlid}-permission-select">
   <#list siteRoles as siteRole>
                  <option value="${siteRole}">${msg("role." + siteRole)}</option>
   </#list>
               </select>
            </div>
         </div>
      </div>
      <div class="actions">
         <div class="yui-gd">
            <div class="yui-u first reset-btn">
               <button id="${args.htmlid}-reset-all">${msg("label.reset-all")}</button>
            </div>
            <div class="yui-u">
               <label>${msg("label.mangerdefaults")}</label>
            </div>
         </div>
      </div>
      <p/>
      <div class="bdft">
         <input type="button" id="${args.htmlid}-ok" value="${msg("button.save")}" tabindex="0" />
         <input type="button" id="${args.htmlid}-cancel" value="${msg("button.cancel")}" tabindex="0" />
      </div>
   </div>
</div>
