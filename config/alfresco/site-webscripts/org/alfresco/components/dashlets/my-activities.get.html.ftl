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
   new Alfresco.dashlet.Activities("${args.htmlid}").setOptions(
   {
      siteId: "${page.url.templateArgs.site!""}",
      mode: "user"
   }).setMessages(
      ${messages}
   );
   new Alfresco.widget.DashletResizer("${args.htmlid}", "${instance.object.id}");
//]]></script>

<div class="dashlet activities">
   <div class="title">${msg("header")}</div>
   <div class="toolbar flat-button">
      <input id="${args.htmlid}-range" type="button" name="range" value="${msg("filter.today")}" />
      <select id="${args.htmlid}-range-menu">
         <option value="today">${msg("filter.today")}</option>
         <option value="7">${msg("filter.7days")}</option>
         <option value="14">${msg("filter.14days")}</option>                
         <option value="28">${msg("filter.28days")}</option>
      </select>
      <input id="${args.htmlid}-user" type="button" name="user" value="${msg("filter.others")}" />
      <select id="${args.htmlid}-user-menu">
         <option value="mine">${msg("filter.mine")}</option>
         <option value="others">${msg("filter.others")}</option>                
         <option value="all">${msg("filter.all")}</option>
      </select>
   </div>
   <div id="${args.htmlid}-activityList" class="body scrollableList" <#if args.height??>style="height: ${args.height}px;"</#if>>
   </div>
</div>
