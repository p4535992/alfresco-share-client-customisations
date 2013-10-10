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
  new Alfresco.DiscussionsTopicList("${args.htmlid}").setOptions(
   {
      siteId: "${page.url.templateArgs.site!''}",
      containerId: "${template.properties.container!'blog'}",
      simpleView: "false",
      initialFilter:
      {
         filterId: "${(page.url.args.filterId!'new')?js_string}",
         filterOwner: "${(page.url.args.filterOwner!'Alfresco.TopicListFilter')?js_string}",
         filterData: <#if page.url.args.filterData??>"${page.url.args.filterData?js_string}"<#else>null</#if>
      }
   }).setMessages(
      ${messages}
   );
//]]></script>
<div class="topiclist-infobar yui-gd theme-bg-color-4">
   <div class="yui-u first">
      <div id="${args.htmlid}-listtitle" class="listTitle">
         ${msg("title.generic")}
      </div>
   </div>
   <div class="yui-u flat-button">
      <div id="${args.htmlid}-paginator" class="paginator">&nbsp;</div>
      <div class="simple-view">
         <button id="${args.htmlid}-simpleView-button" name="topiclist-simpleView-button">${msg("header.detailList")}</button>
      </div>
   </div>
</div>
<#include "/org/alfresco/components/perishability/perishable-dialog.lib.ftl" />
<div id="${args.htmlid}-topiclist" class="topiclist">
</div>


