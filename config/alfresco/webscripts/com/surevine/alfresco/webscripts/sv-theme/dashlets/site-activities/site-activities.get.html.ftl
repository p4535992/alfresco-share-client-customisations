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
function loadActivityData()
{

  Alfresco.util.Ajax.request(
    {
      url: Alfresco.constants.PROXY_URI + "/sv-theme/${page.url.templateArgs.site}/activities?format=html",
      method: "GET",
      responseContentType : "text/html",
      successCallback:
    {
      fn: onActivityLoadSuccess,
      scope: this
    },
    failureCallback:
    {
      fn: onActivityLoadFail,
      scope: this
    }
  });

}

function onActivityLoadSuccess(response) {
    setActivityContent(response.serverResponse.responseText);
}

function onActivityLoadFail(response) {
    setActivityContent("<h3>Could not load recent activities</h3>");
}

function setActivityContent(content) {
    var body = YAHOO.util.Selector.query('div[id=site-activities-dashlet-body]')[0];
    body.innerHTML=content;
}

loadActivityData();
//]]></script>

<script type="text/javascript">//<![CDATA[
   new Alfresco.widget.DashletResizer("${args.htmlid}", "${instance.object.id}");
//]]></script>
<div class="dashlet">
   <div class="title">${msg("header.docSummary")}</div>
   <div id="site-activities-dashlet-body" class="body scrollableList" <#if args.height??>style="height: ${args.height}px;"</#if>>
      Loading data...
   </div>
</div>
