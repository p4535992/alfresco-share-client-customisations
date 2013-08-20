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
<script type="text/javascript">//<![CDATA[
function loadPerishableData()
{

  Alfresco.util.Ajax.request(
    {
      url: Alfresco.constants.PROXY_URI + "/sv-theme/perishable?format=html",
      method: "GET",
      responseContentType : "text/html",
      successCallback:
    {
      fn: onPerishableLoadSuccess,
      scope: this
    },
    failureCallback:
    {
      fn: onPerishableLoadFail,
      scope: this
    }
  });

}

function onPerishableLoadSuccess(response) {
    setPerishableContent(response.serverResponse.responseText);
}

function onPerishableLoadFail(response) {
    setPerishableContent("<h3>Could not load perishable items</h3>");
}

function setPerishableContent(content) {
    var body = YAHOO.util.Selector.query('div[id=perishable-dashlet-body]')[0];
    
    body.innerHTML=content;
    // if content isn't just that there's no items then display the dashlet.
    
    var wrapper = YAHOO.util.Selector.query('div[id=perishable-dashlet-wrapper]')[0];
    if (content.indexOf("Nothing to display") == -1) {
        YAHOO.util.Dom.setStyle(wrapper, 'display', 'block');
	
		// Now the dashlet is displayed we can apply the dashlet resizer functionality
		new Alfresco.widget.DashletResizer("${args.htmlid}", "${instance.object.id}");
    } else {
        YAHOO.util.Dom.setStyle(wrapper, 'display', 'none');
    }
}

loadPerishableData();
//]]></script>

<div id="perishable-dashlet-wrapper" class="dashlet" style="display: none">
   <div class="title">${msg("header.docSummary")} <span style="background: url('/share/components/enhanced-security/images/info.gif') no-repeat; width: 16px; height: 16px; display: inline-block"
   		title="${msg("header.perishableInfo")}">&nbsp;</span></div>
   <div id="perishable-dashlet-body" class="body scrollableList" <#if args.height??>style="height: ${args.height}px;"</#if>>
      Loading data...
   </div>
</div>
